import { useState, useRef, useMemo } from 'react';
import {
  FileText,
  Sliders,
  Type,
  CheckCircle2,
  FileDown,
  Sparkles
} from 'lucide-react';
import { Toolbar } from './components/Toolbar';
import { PdfConverter } from './components/PdfConverter';
import { StylePanel } from './components/StylePanel';
import { FontUploader } from './components/FontUploader';
import { PaperPreview } from './components/PaperPreview';
import { DEFAULT_SETTINGS, SAMPLE_TEXTS } from './constants/presets';
import type { CustomFontInfo, HandwritingSettings, PresetTheme } from './types';
import { exportElementsToPdf } from './utils/pdfExporter';
import { paginateText } from './utils/pagination';

export function App() {
  // Core state
  const [text, setText] = useState<string>(SAMPLE_TEXTS.college);
  const [settings, setSettings] = useState<HandwritingSettings>(DEFAULT_SETTINGS);
  const [customFonts, setCustomFonts] = useState<CustomFontInfo[]>([]);
  const [activeTab, setActiveTab] = useState<'editor' | 'style' | 'custom-font'>('editor');
  
  // Navigation & preview state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'single' | 'all'>('single');

  // Async tasks state
  const [isExtractingPdf, setIsExtractingPdf] = useState<boolean>(false);
  const [extractionProgress, setExtractionProgress] = useState<number>(0);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<number>(0);
  const [exportStatusText, setExportStatusText] = useState<string>('');

  // Page DOM references for html2canvas export
  const pageRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  // Dynamic pagination based on line height and page geometry
  const pages = useMemo(() => {
    return paginateText(text, {
      lineHeight: settings.lineHeight,
      fontSize: settings.fontSize,
      fontFamily: settings.fontId,
      pageHeight: 1123,
      pageWidth: 794,
      paddingTop: settings.paddingTop,
      paddingBottom: settings.paddingBottom,
      paddingLeft: settings.paddingLeft,
      paddingRight: settings.paddingRight,
      letterSpacing: settings.letterSpacing
    });
  }, [
    text,
    settings.lineHeight,
    settings.fontSize,
    settings.fontId,
    settings.paddingTop,
    settings.paddingBottom,
    settings.paddingLeft,
    settings.paddingRight,
    settings.letterSpacing
  ]);

  const totalPages = Math.max(1, pages.length);

  // Settings update helper
  const handleUpdateSettings = (updates: Partial<HandwritingSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  // Custom font handlers
  const handleAddCustomFont = (newFont: CustomFontInfo) => {
    setCustomFonts((prev) => [...prev.filter((f) => f.name !== newFont.name), newFont]);
    handleUpdateSettings({ fontId: newFont.id });
  };

  const handleRemoveCustomFont = (id: string) => {
    setCustomFonts((prev) => prev.filter((f) => f.id !== id));
    if (settings.fontId === id) {
      handleUpdateSettings({ fontId: 'caveat' });
    }
  };

  // Preset theme handler (College Assignment, Personal Letter, Quick Notes)
  const handleApplyPreset = (preset: PresetTheme) => {
    handleUpdateSettings(preset.settings);
    if (preset.sampleText) {
      setText(preset.sampleText);
    }
  };

  // Reset to default
  const handleReset = () => {
    if (window.confirm('Reset document text and paper styling to default?')) {
      setText(SAMPLE_TEXTS.college);
      setSettings(DEFAULT_SETTINGS);
      setCurrentPage(1);
    }
  };

  // Direct print
  const handlePrint = () => {
    window.print();
  };

  // High-res PDF export (scale: 3 for crisp 300 DPI print quality)
  const handleExportPdf = async () => {
    try {
      setIsExportingPdf(true);
      setExportProgress(5);
      setExportStatusText('Initializing high-resolution PDF renderer...');

      // Collect all page elements (0 to totalPages - 1)
      const elementsToExport: HTMLElement[] = [];
      for (let i = 0; i < totalPages; i++) {
        const el = pageRefs.current.get(i);
        if (el) {
          elementsToExport.push(el);
        }
      }

      // If any page is not yet mounted, give DOM a brief tick
      if (elementsToExport.length < totalPages) {
        setExportStatusText(`Preparing ${totalPages} pages for capture...`);
        await new Promise((resolve) => setTimeout(resolve, 200));

        elementsToExport.length = 0;
        for (let i = 0; i < totalPages; i++) {
          const el = pageRefs.current.get(i);
          if (el) elementsToExport.push(el);
        }
      }

      await exportElementsToPdf(elementsToExport, {
        filename: `InkScript-Handwritten-Notes-${new Date().toISOString().slice(0, 10)}.pdf`,
        scale: 3, // High DPI: 300 DPI crisp print quality
        onProgress: (progress, statusText) => {
          setExportProgress(progress);
          setExportStatusText(statusText);
        }
      });
    } catch (err) {
      console.error('Export PDF failed:', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setTimeout(() => {
        setIsExportingPdf(false);
        setExportProgress(0);
        setExportStatusText('');
      }, 600);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative">
      {/* Top Navigation & Action Toolbar */}
      <Toolbar
        onReset={handleReset}
        onExportPdf={handleExportPdf}
        onPrint={handlePrint}
        isExporting={isExportingPdf}
        exportProgress={exportProgress}
        exportStatusText={exportStatusText}
        onApplyPreset={handleApplyPreset}
        viewMode={viewMode}
        onToggleViewMode={() => setViewMode((m) => (m === 'single' ? 'all' : 'single'))}
        totalPages={totalPages}
        settings={settings}
      />

      {/* Main Workspace Layout (Zero Layout Shifts) */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Left Panel: Control & Editor (5 cols) */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            {/* Tabs Header */}
            <div className="flex rounded-xl bg-slate-900 border border-slate-800 p-1">
              <button
                type="button"
                onClick={() => setActiveTab('editor')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition ${
                  activeTab === 'editor'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <FileText className="h-4 w-4" />
                <span>Upload & Text</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('style')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition ${
                  activeTab === 'style'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Sliders className="h-4 w-4" />
                <span>Style & Paper</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('custom-font')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition relative ${
                  activeTab === 'custom-font'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Type className="h-4 w-4" />
                <span>Custom Font</span>
                {customFonts.length > 0 && (
                  <span className="flex h-1.5 w-1.5 rounded-full bg-cyan-400" />
                )}
              </button>
            </div>

            {/* Tab Body Content */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl backdrop-blur-sm">
              {activeTab === 'editor' && (
                <PdfConverter
                  text={text}
                  onTextChange={setText}
                  isExtracting={isExtractingPdf}
                  onExtractingChange={setIsExtractingPdf}
                  extractionProgress={extractionProgress}
                  onProgressChange={setExtractionProgress}
                  estimatedPages={totalPages}
                />
              )}

              {activeTab === 'style' && (
                <StylePanel
                  settings={settings}
                  onUpdateSettings={handleUpdateSettings}
                  customFonts={customFonts}
                />
              )}

              {activeTab === 'custom-font' && (
                <FontUploader
                  customFonts={customFonts}
                  onAddCustomFont={handleAddCustomFont}
                  onRemoveCustomFont={handleRemoveCustomFont}
                  activeFontId={settings.fontId}
                  onSelectFont={(id) => handleUpdateSettings({ fontId: id })}
                />
              )}
            </div>

            {/* Quick status bar under editor */}
            <div className="flex items-center justify-between text-xs text-slate-500 px-2">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Real-time preview sync
              </span>
              <span className="font-medium text-slate-400">
                {totalPages} {totalPages === 1 ? 'handwritten page' : 'handwritten pages'} generated
              </span>
            </div>
          </div>

          {/* Right Panel: Sticky Live Paper Preview (7 cols) */}
          <div className="lg:col-span-7 lg:sticky lg:top-20">
            <PaperPreview
              text={text}
              settings={settings}
              customFonts={customFonts}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              viewMode={viewMode}
              onToggleViewMode={() => setViewMode((m) => (m === 'single' ? 'all' : 'single'))}
              pageRefs={pageRefs}
            />
          </div>

        </div>
      </main>

      {/* Floating Modal Progress Indicator during PDF Export */}
      {isExportingPdf && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <FileDown className="h-6 w-6 animate-bounce" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
                  Generating High-Res PDF
                  <span className="rounded bg-blue-500/20 px-1.5 py-0.2 text-[10px] text-blue-300">
                    300 DPI
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Compiling {totalPages} {totalPages === 1 ? 'page' : 'pages'} with scale factor 3.0
                </p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-blue-400 font-medium">{exportStatusText}</span>
                <span className="text-slate-300">{exportProgress}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800 ring-1 ring-slate-700">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 transition-all duration-300"
                  style={{ width: `${exportProgress}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-800">
              <span className="flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-amber-400" /> Print-ready vector rendering
              </span>
              <span>jsPDF + html2canvas</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
