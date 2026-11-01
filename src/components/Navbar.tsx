import { useState } from 'react';
import {
  PenTool,
  RotateCcw,
  Download,
  Printer,
  Sparkles,
  Layers,
  FileText
} from 'lucide-react';
import { PRESET_THEMES } from '../constants/presets';
import type { HandwritingSettings, PresetTheme } from '../types';

interface NavbarProps {
  onReset: () => void;
  onExportPdf: () => void;
  onPrint: () => void;
  isExporting: boolean;
  exportProgress: number;
  exportStatusText: string;
  onApplyPreset: (preset: PresetTheme) => void;
  viewMode: 'single' | 'all';
  onToggleViewMode: () => void;
  totalPages: number;
  settings: HandwritingSettings;
}

export function Navbar({
  onReset,
  onExportPdf,
  onPrint,
  isExporting,
  exportProgress,
  exportStatusText,
  onApplyPreset,
  viewMode,
  onToggleViewMode,
  totalPages,
}: NavbarProps) {
  const [showPresetsMenu, setShowPresetsMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-900/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 shadow-md shadow-blue-500/20">
            <PenTool className="h-5 w-5 text-white" />
            <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white">
                InkScript
              </h1>
              <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-semibold text-blue-400 ring-1 ring-inset ring-blue-500/20">
                Studio
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Convert typed text & PDFs into realistic handwritten notes
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Presets Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowPresetsMenu(!showPresetsMenu)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:bg-slate-700 hover:text-white"
              title="Apply pre-configured handwriting & notebook styles"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span className="hidden sm:inline">Presets</span>
            </button>

            {showPresetsMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowPresetsMenu(false)}
                />
                <div className="absolute right-0 mt-2 z-50 w-64 rounded-xl border border-slate-700 bg-slate-800 p-2 shadow-2xl">
                  <div className="px-2 py-1 text-xs font-semibold text-slate-400">
                    Handwriting Presets
                  </div>
                  {PRESET_THEMES.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => {
                        onApplyPreset(theme);
                        setShowPresetsMenu(false);
                      }}
                      className="group flex w-full flex-col rounded-lg px-2.5 py-2 text-left transition hover:bg-slate-700/70"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-100 group-hover:text-blue-400">
                          {theme.name}
                        </span>
                        <span className="rounded bg-slate-700 px-1.5 py-0.5 text-[10px] text-slate-300">
                          {theme.badge}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {theme.description}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* View Mode Toggle */}
          <button
            onClick={onToggleViewMode}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
              viewMode === 'all'
                ? 'border-indigo-500/50 bg-indigo-500/20 text-indigo-300'
                : 'border-slate-700 bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
            title="Toggle between single page view and all pages view"
          >
            {viewMode === 'all' ? (
              <>
                <FileText className="h-3.5 w-3.5" />
                <span className="hidden md:inline">Single Page</span>
              </>
            ) : (
              <>
                <Layers className="h-3.5 w-3.5" />
                <span className="hidden md:inline">All Pages ({totalPages})</span>
              </>
            )}
          </button>

          {/* Reset button */}
          <button
            onClick={onReset}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400"
            title="Reset to default text and settings"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {/* Print button */}
          <button
            onClick={onPrint}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-slate-700 hover:text-white"
            title="Print handwritten document"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print</span>
          </button>

          {/* Download PDF Button */}
          <button
            onClick={onExportPdf}
            disabled={isExporting}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md shadow-blue-600/30 transition hover:bg-blue-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isExporting ? (
              <>
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span className="hidden sm:inline">{exportProgress}%</span>
              </>
            ) : (
              <>
                <Download className="h-3.5 w-3.5" />
                <span>Download PDF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Progress banner during PDF export */}
      {isExporting && (
        <div className="relative w-full bg-slate-800 px-4 py-1.5 text-center text-xs text-blue-400 border-t border-slate-700">
          <div
            className="absolute left-0 top-0 bottom-0 bg-blue-600/30 transition-all duration-300"
            style={{ width: `${exportProgress}%` }}
          />
          <span className="relative z-10 font-medium">{exportStatusText || 'Preparing export...'}</span>
        </div>
      )}
    </header>
  );
}
