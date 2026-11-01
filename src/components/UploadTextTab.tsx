import { useRef, useState, type ChangeEvent, type DragEvent } from 'react';
import {
  UploadCloud,
  FileText,
  FileCheck,
  Trash2,
  BookOpen,
  AlertTriangle,
  Lock,
  FileQuestion,
  Scissors,
  CheckCircle,
  X,
  FileBox,
  Layers
} from 'lucide-react';
import {
  extractTextFromPdf,
  PdfEncryptedError,
  PdfEmptyError,
  type PdfExtractProgress
} from '../utils/pdfParser';
import { SAMPLE_TEXTS } from '../constants/presets';
import { formatFileSize } from '../utils/fontLoader';

interface UploadTextTabProps {
  text: string;
  onTextChange: (newText: string) => void;
  isExtracting: boolean;
  onExtractingChange: (extracting: boolean) => void;
  extractionProgress: number;
  onProgressChange: (progress: number) => void;
  estimatedPages: number;
}

export function UploadTextTab({
  text,
  onTextChange,
  isExtracting,
  onExtractingChange,
  extractionProgress,
  onProgressChange,
  estimatedPages
}: UploadTextTabProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<{
    title: string;
    description: string;
    type: 'encrypted' | 'empty' | 'validation' | 'general';
  } | null>(null);

  const [currentFileStats, setCurrentFileStats] = useState<{
    name: string;
    size: number;
    currentPage: number;
    totalPages: number;
  } | null>(null);

  const [uploadSuccessInfo, setUploadSuccessInfo] = useState<{
    fileName: string;
    pages: number;
    words: number;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleCancelExtraction = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    onExtractingChange(false);
    onProgressChange(0);
    setCurrentFileStats(null);
  };

  const validateAndProcessFile = async (file: File) => {
    setErrorMessage(null);
    setUploadSuccessInfo(null);

    // 1. Validation: Max 20MB
    const MAX_SIZE_BYTES = 20 * 1024 * 1024;
    if (file.size > MAX_SIZE_BYTES) {
      setErrorMessage({
        title: 'File Too Large',
        description: `"${file.name}" is ${formatFileSize(file.size)}. Maximum allowed size is 20MB.`,
        type: 'validation'
      });
      return;
    }

    // 2. Validation: File Format (.pdf only, or .txt/.md fallback)
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const isText = file.type.startsWith('text/') || file.name.endsWith('.txt') || file.name.endsWith('.md');

    if (!isPdf && !isText) {
      setErrorMessage({
        title: 'Invalid File Format',
        description: `Unsupported file format. Please upload a PDF document (.pdf).`,
        type: 'validation'
      });
      return;
    }

    // Handle Plain Text File (.txt, .md)
    if (isText) {
      try {
        const textContent = await file.text();
        onTextChange(textContent);
        const words = textContent.trim().split(/\s+/).filter(Boolean).length;
        setUploadSuccessInfo({
          fileName: file.name,
          pages: 1,
          words: words
        });
      } catch (err) {
        console.error('Text file read error:', err);
        setErrorMessage({
          title: 'Read Error',
          description: 'Failed to read text file. Please check file permissions and try again.',
          type: 'general'
        });
      }
      return;
    }

    // Handle PDF File (.pdf)
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      onExtractingChange(true);
      onProgressChange(5);
      setCurrentFileStats({
        name: file.name,
        size: file.size,
        currentPage: 0,
        totalPages: 0
      });

      const result = await extractTextFromPdf(
        file,
        (progress: PdfExtractProgress) => {
          onProgressChange(progress.percent);
          setCurrentFileStats({
            name: file.name,
            size: file.size,
            currentPage: progress.currentPage,
            totalPages: progress.totalPages
          });
        },
        abortController.signal
      );

      // Two-Way Sync: Immediately populate editor with extracted text
      onTextChange(result.text);

      setUploadSuccessInfo({
        fileName: file.name,
        pages: result.pageCount,
        words: result.wordCount
      });
    } catch (err: any) {
      if (err.message?.includes('cancelled')) {
        return;
      }
      console.error('PDF extraction failed:', err);

      if (err instanceof PdfEncryptedError) {
        setErrorMessage({
          title: 'Encrypted / Password-Protected PDF',
          description: 'This PDF document is locked with encryption or password protection. Please remove the password and re-upload.',
          type: 'encrypted'
        });
      } else if (err instanceof PdfEmptyError) {
        setErrorMessage({
          title: 'No Text Found (Scanned Image)',
          description: 'No digital text was found in this PDF. It appears to be a scanned image or photo without an embedded OCR text layer.',
          type: 'empty'
        });
      } else {
        setErrorMessage({
          title: 'Extraction Failed',
          description: err.message || 'Unable to parse this PDF document. The file might be corrupted or in an unsupported format.',
          type: 'general'
        });
      }
    } finally {
      onExtractingChange(false);
      abortControllerRef.current = null;
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
      // Reset input value so re-selecting same file triggers onChange
      e.target.value = '';
    }
  };

  // Live editor stats
  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 180));

  return (
    <div className="space-y-5">
      {/* 1. Visual Drag & Drop Upload Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !isExtracting && fileInputRef.current?.click()}
        className={`group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all ${
          isExtracting
            ? 'border-blue-500/60 bg-blue-500/5 cursor-wait'
            : isDragOver
            ? 'border-blue-500 bg-blue-500/15 scale-[1.01] cursor-copy'
            : 'border-slate-700 bg-slate-800/40 hover:border-slate-500 hover:bg-slate-800/70 cursor-pointer'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf,.txt,.md"
          onChange={handleFileSelect}
          disabled={isExtracting}
          className="hidden"
        />

        {isExtracting && currentFileStats ? (
          // Active Extraction State
          <div className="w-full max-w-sm space-y-3 py-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 truncate text-left">
                <FileBox className="h-5 w-5 shrink-0 text-blue-400 animate-bounce" />
                <div className="truncate">
                  <div className="truncate text-xs font-semibold text-slate-100">
                    {currentFileStats.name}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {formatFileSize(currentFileStats.size)} •{' '}
                    {currentFileStats.totalPages > 0
                      ? `Page ${currentFileStats.currentPage} of ${currentFileStats.totalPages}`
                      : 'Reading PDF stream...'}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancelExtraction();
                }}
                className="rounded-lg border border-slate-700 bg-slate-800 p-1 text-slate-400 hover:text-red-400 hover:border-red-500/40 transition"
                title="Cancel extraction"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono text-blue-400">
                <span>Extracting plain text...</span>
                <span>{extractionProgress}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800 ring-1 ring-slate-700/60">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 transition-all duration-200"
                  style={{ width: `${extractionProgress}%` }}
                />
              </div>
            </div>
          </div>
        ) : (
          // Ready / Idle State
          <>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition">
              <UploadCloud className="h-6 w-6" />
            </div>

            <h3 className="mt-3 text-sm font-semibold text-slate-100">
              {isDragOver ? 'Release PDF to extract text' : 'Drop your PDF document here'}
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Browser-native extraction with automatic multi-page splitting
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-medium text-blue-300 ring-1 ring-inset ring-blue-500/20">
                PDF only (max 20MB)
              </span>
              <span className="text-[10px] text-slate-500">
                Client-side & private
              </span>
            </div>
          </>
        )}
      </div>

      {/* 2. Error Notification Banner */}
      {errorMessage && (
        <div className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs text-red-200 shadow-lg">
          {errorMessage.type === 'encrypted' ? (
            <Lock className="h-5 w-5 shrink-0 text-amber-400 mt-0.5" />
          ) : errorMessage.type === 'empty' ? (
            <FileQuestion className="h-5 w-5 shrink-0 text-amber-400 mt-0.5" />
          ) : (
            <AlertTriangle className="h-5 w-5 shrink-0 text-red-400 mt-0.5" />
          )}

          <div className="flex-1 space-y-0.5">
            <div className="font-semibold text-slate-100">
              {errorMessage.title}
            </div>
            <div className="text-slate-300 leading-relaxed">
              {errorMessage.description}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-slate-400 hover:text-white p-0.5"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* 3. Extraction Success Banner */}
      {uploadSuccessInfo && !isExtracting && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300">
          <div className="flex items-center gap-2.5 min-w-0">
            <FileCheck className="h-4 w-4 shrink-0 text-emerald-400" />
            <div className="truncate">
              <span className="font-semibold text-emerald-200">{uploadSuccessInfo.fileName}</span>
              <span className="text-emerald-400/80 ml-1.5">
                ({uploadSuccessInfo.pages} {uploadSuccessInfo.pages === 1 ? 'page' : 'pages'} extracted • ~{uploadSuccessInfo.words} words)
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setUploadSuccessInfo(null)}
            className="text-emerald-400/60 hover:text-emerald-200 p-1"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* 4. Sample Text Quick Buttons */}
      <div>
        <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5 font-medium">
            <BookOpen className="h-3.5 w-3.5 text-blue-400" /> Or load ready sample text:
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <button
            type="button"
            onClick={() => onTextChange(SAMPLE_TEXTS.essay)}
            className="rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1.5 text-left text-xs text-slate-200 hover:border-slate-500 hover:bg-slate-700/80 transition"
          >
            <div className="font-medium text-slate-100">Philosophy</div>
            <div className="text-[10px] text-slate-400">Handwriting Essay</div>
          </button>
          <button
            type="button"
            onClick={() => onTextChange(SAMPLE_TEXTS.lecture)}
            className="rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1.5 text-left text-xs text-slate-200 hover:border-slate-500 hover:bg-slate-700/80 transition"
          >
            <div className="font-medium text-slate-100">Physics 204</div>
            <div className="text-[10px] text-slate-400">Quantum Notes</div>
          </button>
          <button
            type="button"
            onClick={() => onTextChange(SAMPLE_TEXTS.recipe)}
            className="rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1.5 text-left text-xs text-slate-200 hover:border-slate-500 hover:bg-slate-700/80 transition"
          >
            <div className="font-medium text-slate-100">Bread Recipe</div>
            <div className="text-[10px] text-slate-400">Sourdough Loaf</div>
          </button>
          <button
            type="button"
            onClick={() => onTextChange(SAMPLE_TEXTS.reflection)}
            className="rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1.5 text-left text-xs text-slate-200 hover:border-slate-500 hover:bg-slate-700/80 transition"
          >
            <div className="font-medium text-slate-100">Journal</div>
            <div className="text-[10px] text-slate-400">Daily Reflection</div>
          </button>
        </div>
      </div>

      {/* 5. Live Synchronized Editor Textarea / Skeleton Loader */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300">
              <FileText className="h-3.5 w-3.5 text-blue-400" />
              Live Editor
            </label>
            <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Synced with Paper
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isExtracting}
              onClick={() => onTextChange(text + '\n\n--- Page Break ---\n\n')}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-[11px] font-medium text-indigo-300 hover:bg-slate-700 hover:text-white transition disabled:opacity-40"
              title="Insert manual page break into text"
            >
              <Scissors className="h-3 w-3" /> Page Break
            </button>
            <button
              type="button"
              disabled={isExtracting || !text}
              onClick={() => onTextChange('')}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2 py-1 text-[11px] font-medium text-slate-400 hover:text-red-400 hover:bg-slate-700 transition disabled:opacity-40"
              title="Clear all editor text"
            >
              <Trash2 className="h-3 w-3" /> Clear
            </button>
          </div>
        </div>

        {/* Editor Body or Skeleton Loader */}
        <div className="relative rounded-2xl border border-slate-700 bg-slate-900/90 shadow-inner focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 overflow-hidden">
          {isExtracting ? (
            /* Skeleton Loader while extracting PDF */
            <div className="p-6 space-y-4 animate-pulse select-none min-h-[320px] flex flex-col justify-center">
              <div className="flex items-center gap-3 justify-center mb-4">
                <div className="h-5 w-5 rounded-full border-2 border-blue-400 border-t-transparent animate-spin" />
                <span className="text-xs font-semibold text-blue-300 tracking-wide">
                  Extracting text from PDF pages...
                </span>
              </div>

              {/* Shimmer skeleton lines representing text content */}
              <div className="space-y-2.5 max-w-lg mx-auto w-full opacity-70">
                <div className="h-4 bg-slate-700/60 rounded-md w-2/5" />
                <div className="h-3 bg-slate-700/40 rounded-md w-full" />
                <div className="h-3 bg-slate-700/40 rounded-md w-11/12" />
                <div className="h-3 bg-slate-700/40 rounded-md w-4/5" />
                <div className="h-3 bg-slate-700/20 rounded-md w-full" />
                <div className="h-4 bg-slate-700/60 rounded-md w-1/3 mt-4" />
                <div className="h-3 bg-slate-700/40 rounded-md w-5/6" />
                <div className="h-3 bg-slate-700/40 rounded-md w-full" />
                <div className="h-3 bg-slate-700/40 rounded-md w-3/4" />
              </div>
            </div>
          ) : (
            /* Real multi-line textarea with live two-way synchronization */
            <textarea
              value={text}
              onChange={(e) => onTextChange(e.target.value)}
              placeholder="Type, edit, delete, or paste your text here. Any changes immediately update the handwritten notebook preview on the right... (You can also insert --- Page Break --- to split pages)"
              rows={13}
              className="w-full resize-y rounded-2xl bg-transparent p-4 font-mono text-sm leading-relaxed text-slate-100 placeholder-slate-500 focus:outline-none"
            />
          )}

          {/* Textarea Bottom Bar with Live Statistics */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/80 bg-slate-800/40 px-4 py-2.5 text-xs text-slate-400">
            <div className="flex items-center gap-4">
              <span><strong>{charCount}</strong> chars</span>
              <span><strong>{wordCount}</strong> words</span>
              <span className="flex items-center gap-1 text-blue-400 font-semibold">
                <Layers className="h-3.5 w-3.5" />
                ~{estimatedPages} {estimatedPages === 1 ? 'handwritten page' : 'handwritten pages'}
              </span>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <span>~{readingTime} min read</span>
              <span>•</span>
              <span className="text-emerald-400/90 flex items-center gap-1">
                <CheckCircle className="h-3 w-3" /> Live Sync
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
