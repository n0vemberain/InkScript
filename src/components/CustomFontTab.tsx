import { useRef, useState, type ChangeEvent, type DragEvent } from 'react';
import {
  Upload,
  CheckCircle2,
  Trash2,
  AlertCircle,
  FileCode,
  Info,
  Type,
  ExternalLink
} from 'lucide-react';
import type { CustomFontInfo } from '../types';
import { loadCustomFontFile, formatFileSize } from '../utils/fontLoader';

interface CustomFontTabProps {
  customFonts: CustomFontInfo[];
  onAddCustomFont: (font: CustomFontInfo) => void;
  onRemoveCustomFont: (id: string) => void;
  activeFontId: string;
  onSelectFont: (id: string) => void;
}

export function CustomFontTab({
  customFonts,
  onAddCustomFont,
  onRemoveCustomFont,
  activeFontId,
  onSelectFont
}: CustomFontTabProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [testText, setTestText] = useState('My authentic handwritten font preview 1234567890 !?');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProcessFontFile = async (file: File) => {
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const fontInfo = await loadCustomFontFile(file);
      onAddCustomFont(fontInfo);
      onSelectFont(fontInfo.id);
    } catch (err: any) {
      console.error('Font load failed:', err);
      setErrorMessage(err.message || 'Failed to load font file. Please ensure it is a valid .ttf, .otf, or .woff file.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleProcessFontFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleProcessFontFile(e.target.files[0]);
    }
  };

  const activeCustomFont = customFonts.find((f) => f.id === activeFontId);

  return (
    <div className="space-y-6">
      {/* 1. Font Drag & Drop Uploader */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300">
            <Upload className="h-3.5 w-3.5 text-blue-400" />
            Upload Custom Font
          </label>
          <span className="text-xs text-slate-400">
            Supports .ttf, .otf, .woff, .woff2
          </span>
        </div>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all ${
            isDragOver
              ? 'border-indigo-500 bg-indigo-500/10'
              : 'border-slate-700 bg-slate-800/40 hover:border-slate-500 hover:bg-slate-800/70'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".ttf,.otf,.woff,.woff2"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition">
            <FileCode className="h-6 w-6" />
          </div>

          <h3 className="mt-3 text-sm font-semibold text-slate-100">
            {isLoading ? 'Processing font...' : 'Drop your handwriting font file here'}
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            Upload custom handwritten typography (.ttf, .otf, .woff, .woff2)
          </p>
          <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-slate-700/60 px-2.5 py-0.5 text-[10px] text-slate-300">
            Dynamically loaded into your browser session
          </span>
        </div>

        {errorMessage && (
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
            <div className="flex-1">{errorMessage}</div>
          </div>
        )}
      </div>

      {/* 2. Uploaded Fonts List */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Active Custom Fonts ({customFonts.length})
          </label>
        </div>

        {customFonts.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-800/30 p-4 text-center text-xs text-slate-400">
            No custom fonts uploaded yet. Upload your own handwriting font above to make your notes 100% uniquely yours!
          </div>
        ) : (
          <div className="space-y-2">
            {customFonts.map((font) => {
              const isActive = activeFontId === font.id;
              return (
                <div
                  key={font.id}
                  className={`flex items-center justify-between rounded-xl border p-3 transition ${
                    isActive
                      ? 'border-indigo-500 bg-indigo-500/10 ring-1 ring-indigo-500/40'
                      : 'border-slate-700 bg-slate-800/50 hover:bg-slate-800'
                  }`}
                >
                  <div
                    onClick={() => onSelectFont(font.id)}
                    className="flex-1 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-100">
                        {font.name}
                      </span>
                      <span className="rounded bg-slate-700 px-1.5 py-0.2 text-[10px] text-slate-300">
                        {font.format}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {formatFileSize(font.fileSize)}
                      </span>
                    </div>
                    {/* Visual sample in the uploaded font */}
                    <div
                      className="mt-1 text-base text-slate-300"
                      style={{ fontFamily: font.fontFamily }}
                    >
                      Sample text rendered with {font.name}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onSelectFont(font.id)}
                      className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                        isActive
                          ? 'bg-indigo-600 text-white'
                          : 'border border-slate-600 bg-slate-700 text-slate-300 hover:text-white'
                      }`}
                    >
                      {isActive ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Active</span>
                        </>
                      ) : (
                        'Use Font'
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemoveCustomFont(font.id)}
                      className="rounded-lg p-1 text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition"
                      title="Remove font"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. Live Font Testing Sandbox */}
      <div className="rounded-2xl border border-slate-700/80 bg-slate-800/40 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300">
            <Type className="h-3.5 w-3.5 text-blue-400" />
            Live Font Testing Sandbox
          </label>
          <span className="text-xs text-slate-400">
            {activeCustomFont ? activeCustomFont.name : 'Current selected font'}
          </span>
        </div>

        <input
          type="text"
          value={testText}
          onChange={(e) => setTestText(e.target.value)}
          placeholder="Type here to test glyphs, accents, and numbers..."
          className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
        />

        <div
          className="min-h-16 rounded-xl border border-slate-700/60 bg-slate-900/60 p-4 text-xl leading-relaxed text-blue-200 break-words"
          style={{
            fontFamily: activeCustomFont ? activeCustomFont.fontFamily : undefined
          }}
        >
          {testText || 'Type a sentence above to preview...'}
        </div>
      </div>

      {/* 4. Tips & Resources */}
      <div className="rounded-2xl border border-slate-700/60 bg-slate-800/30 p-4 text-xs text-slate-400 space-y-2">
        <div className="flex items-center gap-1.5 font-semibold text-slate-300">
          <Info className="h-4 w-4 text-blue-400" />
          How to turn your own handwriting into a font
        </div>
        <p className="leading-relaxed">
          Want notes that look exactly like your handwriting? You can print a free template from{' '}
          <a
            href="https://www.calligraphr.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-blue-400 underline hover:text-blue-300"
          >
            Calligraphr <ExternalLink className="h-3 w-3" />
          </a>
          , fill it in with a black pen, snap a photo with your phone, and download your personal <code className="text-slate-300 font-mono">.ttf</code> file to drop here!
        </p>
      </div>
    </div>
  );
}
