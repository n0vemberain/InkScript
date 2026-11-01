import { useState, useRef, useMemo } from 'react';
import {
  FileText,
  Sliders,
  Type,
  CheckCircle2
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { UploadTextTab } from './components/UploadTextTab';
import { StylePaperTab } from './components/StylePaperTab';
import { CustomFontTab } from './components/CustomFontTab';
import { PaperPreview } from './components/PaperPreview';
import { DEFAULT_SETTINGS, SAMPLE_TEXTS } from './constants/presets';
import type { CustomFontInfo, HandwritingSettings, PresetTheme } from './types';
import { exportElementsToPdf } from './utils/pdfExporter';
import { paginateText } from './utils/pagination';

export function App() {
  // Core state
  const [text, setText] = useState<string>(SAMPLE_TEXTS.essay);
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

  // Calculated total pages
  const pages = useMemo(() => {
    return paginateText(text, {
      lineHeight: settings.lineHeight,
      pageHeight: 1123,
      paddingTop: settings.paddingTop,
      paddingBottom: settings.paddingBottom
    });
  }, [text, settings.lineHeight, settings.paddingTop, settings.paddingBottom]);

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

  // Preset theme handler
  const handleApplyPreset = (preset: PresetTheme) => {
    handleUpdateSettings(preset.settings);
    if (preset.sampleText) {
      setText(preset.sampleText);
    }
  };

  // Reset to default
  const handleReset = () => {
    if (window.confirm('Reset document text and paper styling to default?')) {
      setText(SAMPLE_TEXTS.essay);
      setSettings(DEFAULT_SETTINGS);
      setCurrentPage(1);
    }
  };

  // Direct print
  const handlePrint = () => {
    window.print();
  };

  // High-res PDF export
  const handleExportPdf = async () => {
    try {
      setIsExportingPdf(true);
      setExportProgress(10);
      setExportStatusText('Preparing pages for rendering...');

      // Temporarily ensure all pages are rendered if currently in single page mode
      const elementsToExport: HTMLElement[] = [];

      // Collect available page elements
      for (let i = 0; i < totalPages; i++) {
        const el = pageRefs.current.get(i);
        if (el) {
          elementsToExport.push(el);
        }
      }

      // If we are in single page view and user only has active page DOM element,
      // switch to 'all' briefly to capture all pages
      if (elementsToExport.length < totalPages && viewMode === 'single') {
        setViewMode('all');
        setExportStatusText('Rendering all pages...');
        // Allow React DOM to paint the pages
        await new Promise((resolve) => setTimeout(resolve, 350));
        
        elementsToExport.length = 0;
        for (let i = 0; i < totalPages; i++) {
          const el = pageRefs.current.get(i);
          if (el) elementsToExport.push(el);
        }
      }

      await exportElementsToPdf(elementsToExport, {
        filename: 'InkScript-Handwritten-Notes.pdf',
        onProgress: (progress, statusText) => {
          setExportProgress(progress);
          setExportStatusText(statusText);
        }
      });
    } catch (err) {
      console.error('Export PDF failed:', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsExportingPdf(false);
      setExportProgress(0);
      setExportStatusText('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navigation Bar */}
      <Navbar
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

      {/* Main Workspace Layout */}
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
                <UploadTextTab
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
                <StylePaperTab
                  settings={settings}
                  onUpdateSettings={handleUpdateSettings}
                  customFonts={customFonts}
                />
              )}

              {activeTab === 'custom-font' && (
                <CustomFontTab
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
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Auto-sync enabled
              </span>
              <span>
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
    </div>
  );
}

export default App;
