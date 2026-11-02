import { useRef, useMemo, useState, type CSSProperties, type MutableRefObject } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Layers,
  FileText,
  FileCheck2,
  ScrollText
} from 'lucide-react';
import type { HandwritingSettings, CustomFontInfo } from '../types';
import { HANDWRITING_FONTS, PAPER_STYLES } from '../constants/presets';
import { paginateText } from '../utils/pagination';

export interface PaperPreviewProps {
  text: string;
  settings: HandwritingSettings;
  customFonts: CustomFontInfo[];
  currentPage: number;
  onPageChange: (page: number) => void;
  viewMode: 'single' | 'all';
  onToggleViewMode: () => void;
  pageRefs: MutableRefObject<Map<number, HTMLDivElement>>;
}

/**
 * Calculates deterministic natural handwriting imperfections without causing layout shifts.
 * 1. Micro-rotation between -0.4deg and +0.4deg.
 * 2. Minor baseline shifting (+/- 1px).
 * 3. Subtle opacity fluctuation to mimic uneven fountain/ballpoint ink pooling.
 */
function getWordJitterStyle(
  word: string,
  lineIdx: number,
  wordIdx: number,
  baseOpacity: number,
  enabled: boolean
): CSSProperties {
  if (!enabled) {
    return {
      display: 'inline-block',
      opacity: baseOpacity
    };
  }

  // Deterministic 32-bit hash
  let hash = (lineIdx * 73 + wordIdx * 37) | 0;
  for (let i = 0; i < word.length; i++) {
    hash = ((hash << 5) - hash + word.charCodeAt(i)) | 0;
  }
  const absHash = Math.abs(hash);

  // 1. Rotation between -0.4deg and +0.4deg
  const rotFactor = (absHash % 1000) / 1000;
  const rotationDeg = (rotFactor * 0.8 - 0.4).toFixed(2);

  // 2. Minor baseline shifting (+/- 1px)
  const shiftFactor = ((absHash >> 3) % 1000) / 1000;
  const baselineShiftY = (shiftFactor * 2.0 - 1.0).toFixed(2);

  // 3. Subtle opacity variation to mimic uneven ink flow (+/- 0.05 around baseOpacity)
  const opacityFactor = ((absHash >> 6) % 1000) / 1000;
  const opacityDelta = opacityFactor * 0.10 - 0.05;
  const finalOpacity = Math.min(1.0, Math.max(0.72, baseOpacity + opacityDelta));

  return {
    display: 'inline-block',
    transform: `rotate(${rotationDeg}deg) translateY(${baselineShiftY}px)`,
    transformOrigin: 'bottom center',
    opacity: Number(finalOpacity.toFixed(3)),
    willChange: 'transform'
  };
}

export function PaperPreview({
  text,
  settings,
  customFonts,
  currentPage,
  onPageChange,
  viewMode,
  onToggleViewMode,
  pageRefs
}: PaperPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 0.45;
      if (window.innerWidth < 1024) return 0.68;
    }
    return 0.92;
  });

  // Dynamic Font Selection: Custom Uploaded Font -> or Fallback to Built-in Google Web Fonts
  const activeFontFamily = useMemo(() => {
    const custom = customFonts.find((f) => f.id === settings.fontId);
    if (custom) return custom.fontFamily;
    const preset = HANDWRITING_FONTS.find((f) => f.id === settings.fontId);
    return preset ? preset.fontFamily : "'Caveat', cursive";
  }, [settings.fontId, customFonts]);

  // Dynamically calculate text height and paginate across A4 sheets
  const pages = useMemo(() => {
    return paginateText(text, {
      lineHeight: settings.lineHeight,
      fontSize: settings.fontSize,
      fontFamily: activeFontFamily,
      pageWidth: 794,
      pageHeight: 1123,
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
    activeFontFamily,
    settings.paddingTop,
    settings.paddingBottom,
    settings.paddingLeft,
    settings.paddingRight,
    settings.letterSpacing
  ]);

  const totalPages = Math.max(1, pages.length);
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const paperConfig = PAPER_STYLES[settings.paperType] || PAPER_STYLES.ruled;

  // Realistic Notebook Background & Line Alignment
  const getPaperBackgroundStyle = (): CSSProperties => {
    const bgStyles: CSSProperties = {
      backgroundColor: paperConfig.bgColor
    };

    if (settings.paperType === 'ruled' || settings.paperType === 'college-ruled' || settings.paperType === 'legal-pad') {
      // Calculate dynamic baseline offset so ruling line sits exactly under handwritten glyphs
      const baselineOffset = Math.round((settings.lineHeight - settings.fontSize) / 2 + settings.fontSize * 0.78) - settings.lineHeight;
      bgStyles.backgroundImage = `linear-gradient(to bottom, transparent calc(${settings.lineHeight}px - 1px), ${paperConfig.lineColor} calc(${settings.lineHeight}px - 1px), ${paperConfig.lineColor} ${settings.lineHeight}px)`;
      bgStyles.backgroundSize = `100% ${settings.lineHeight}px`;
      bgStyles.backgroundPosition = `0 ${settings.paddingTop + baselineOffset}px`;
    } else if (settings.paperType === 'grid' || settings.paperType === 'dark-grid') {
      const gridInterval = Math.round(settings.lineHeight * 0.75);
      bgStyles.backgroundImage = `
        linear-gradient(to right, ${paperConfig.lineColor} 1px, transparent 1px),
        linear-gradient(to bottom, ${paperConfig.lineColor} 1px, transparent 1px)
      `;
      bgStyles.backgroundSize = `${gridInterval}px ${gridInterval}px`;
      bgStyles.backgroundPosition = `${settings.paddingLeft}px ${settings.paddingTop}px`;
    } else if (settings.paperType === 'dotted') {
      const dotInterval = Math.round(settings.lineHeight * 0.65);
      bgStyles.backgroundImage = `radial-gradient(${paperConfig.lineColor} 1.2px, transparent 1.2px)`;
      bgStyles.backgroundSize = `${dotInterval}px ${dotInterval}px`;
      bgStyles.backgroundPosition = `${settings.paddingLeft}px ${settings.paddingTop}px`;
    } else if (settings.paperType === 'vintage') {
      const baselineOffset = Math.round((settings.lineHeight - settings.fontSize) / 2 + settings.fontSize * 0.78) - settings.lineHeight;
      bgStyles.backgroundImage = `
        radial-gradient(circle at 50% 50%, rgba(217, 119, 6, 0.05) 0%, rgba(180, 120, 60, 0.12) 100%),
        linear-gradient(to bottom, transparent calc(${settings.lineHeight}px - 1px), ${paperConfig.lineColor} calc(${settings.lineHeight}px - 1px), ${paperConfig.lineColor} ${settings.lineHeight}px)
      `;
      bgStyles.backgroundSize = `100% 100%, 100% ${settings.lineHeight}px`;
      bgStyles.backgroundPosition = `0 0, 0 ${settings.paddingTop + baselineOffset}px`;
    }

    return bgStyles;
  };

  // Render text lines with natural human handwriting imperfections (zero layout shifts)
  const renderHandwrittenContent = (pageContent: string) => {
    if (!pageContent.trim()) {
      return (
        <div className="italic text-slate-400 select-none opacity-40">
          Start typing or paste text in the editor to see your handwritten notes appear here...
        </div>
      );
    }

    const lines = pageContent.split('\n');

    return lines.map((line, lineIdx) => {
      // Empty line / paragraph break - render clean line-height spacer
      if (!line.trim()) {
        return (
          <div
            key={lineIdx}
            className="relative select-none pointer-events-none"
            style={{
              height: `${settings.lineHeight}px`,
              lineHeight: `${settings.lineHeight}px`
            }}
          >
            &nbsp;
          </div>
        );
      }

      const words = line.split(/\s+/).filter(Boolean);

      return (
        <div
          key={lineIdx}
          className="relative whitespace-pre-wrap break-words"
          style={{
            height: `${settings.lineHeight}px`,
            lineHeight: `${settings.lineHeight}px`
          }}
        >
          {words.map((word, wordIdx) => {
            const jitterStyle = getWordJitterStyle(
              word,
              lineIdx,
              wordIdx,
              settings.inkOpacity,
              settings.naturalJitter
            );

            return (
              <span
                key={wordIdx}
                style={{
                  ...jitterStyle,
                  marginRight: `${settings.wordSpacing}px`
                }}
              >
                {word}
                {wordIdx < words.length - 1 ? ' ' : ''}
              </span>
            );
          })}
        </div>
      );
    });
  };

  // Render a single A4 paper sheet (standard 794px x 1123px)
  const renderPaperSheet = (pageIndex: number, pageContent: string, isExport = false) => {
    const marginLineLeft = settings.marginOffset > 0 ? settings.marginOffset : Math.max(20, settings.paddingLeft - 16);

    return (
      <div
        key={isExport ? `export-${pageIndex}` : pageIndex}
        ref={(el) => {
          if (isExport) {
            if (el) pageRefs.current.set(pageIndex, el);
          } else if (viewMode === 'all') {
            if (el) pageRefs.current.set(pageIndex, el);
          } else if (pageIndex === safeCurrentPage - 1) {
            // In single mode, ensure fallback if needed
            if (el && !pageRefs.current.has(pageIndex)) pageRefs.current.set(pageIndex, el);
          }
        }}
        data-page-index={pageIndex}
        className={`relative mx-auto bg-white notebook-sheet-shadow overflow-hidden transition-all duration-300 print:shadow-none print:m-0 ${
          isExport ? 'shadow-none' : ''
        }`}
        style={{
          // Standard A4 dimensions in px at 96 DPI: 794px width x 1123px height
          width: '794px',
          minHeight: '1123px',
          ...getPaperBackgroundStyle()
        }}
      >
        {/* Paper Grain Texture (SVG noise filter) */}
        <div
          className="pointer-events-none absolute inset-0 opacity-40 mix-blend-multiply"
          style={{
            backgroundImage: `url("data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='noiseFilter'><feTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23noiseFilter)' opacity='0.08'/></svg>")`
          }}
        />

        {/* Vintage / Parchment aged edge gradient */}
        {settings.paperType === 'vintage' && (
          <div className="pointer-events-none absolute inset-0 texture-vintage" />
        )}

        {/* Distinct Red Left-Margin Line */}
        {settings.showMarginLine && (
          <div
            className="absolute top-0 bottom-0 pointer-events-none"
            style={{
              left: `${marginLineLeft}px`,
              width: '2px',
              backgroundColor: settings.marginLineColor,
              boxShadow: '0 0 1px rgba(239, 68, 68, 0.4)'
            }}
          />
        )}

        {/* 3-Hole Punched Binder Holes */}
        {settings.showHoles && settings.holeType === '3-hole' && (
          <div className="absolute left-6 top-0 bottom-0 flex flex-col justify-around py-24 pointer-events-none">
            <div className="hole-punch" />
            <div className="hole-punch" />
            <div className="hole-punch" />
          </div>
        )}

        {/* Spiral Ring Binding */}
        {settings.showHoles && settings.holeType === 'spiral' && (
          <div className="absolute left-3 top-0 bottom-0 flex flex-col justify-between py-8 pointer-events-none">
            {Array.from({ length: 26 }).map((_, i) => (
              <div key={i} className="spiral-ring" />
            ))}
          </div>
        )}

        {/* Page Number Indicator */}
        <div
          className="absolute top-4 right-8 text-xs font-mono select-none"
          style={{
            color: settings.paperType === 'dark-grid' ? '#94a3b8' : '#94a3b8',
            opacity: 0.65
          }}
        >
          Page {pageIndex + 1} of {totalPages}
        </div>

        {/* Main Handwritten Text Body */}
        <div
          className="relative z-10 select-text"
          style={{
            fontFamily: activeFontFamily,
            fontSize: `${settings.fontSize}px`,
            letterSpacing: `${settings.letterSpacing}px`,
            color: settings.inkColor,
            fontWeight: settings.fontWeight,
            paddingTop: `${settings.paddingTop}px`,
            paddingBottom: `${settings.paddingBottom}px`,
            paddingLeft: `${settings.paddingLeft}px`,
            paddingRight: `${settings.paddingRight}px`
          }}
        >
          {renderHandwrittenContent(pageContent)}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-slate-950/40 rounded-2xl border border-slate-800 overflow-hidden">
      {/* Top Preview Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-slate-900/80 px-4 py-2.5 backdrop-blur-sm">
        {/* Page navigation controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={safeCurrentPage <= 1 || viewMode === 'all'}
            onClick={() => onPageChange(safeCurrentPage - 1)}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition"
            title="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <span className="text-xs font-medium text-slate-300">
            {viewMode === 'all' ? (
              <span>Continuous Scroll ({totalPages} pages)</span>
            ) : (
              <span>
                Page <strong className="text-white">{safeCurrentPage}</strong> of{' '}
                <strong className="text-white">{totalPages}</strong>
              </span>
            )}
          </span>

          <button
            type="button"
            disabled={safeCurrentPage >= totalPages || viewMode === 'all'}
            onClick={() => onPageChange(safeCurrentPage + 1)}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition"
            title="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* View Mode & Zoom Controls */}
        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <button
            type="button"
            onClick={onToggleViewMode}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition ${
              viewMode === 'all'
                ? 'border-blue-500/50 bg-blue-500/20 text-blue-300'
                : 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
            title="Switch between single page view and continuous vertical scroll"
          >
            {viewMode === 'all' ? (
              <>
                <FileText className="h-3.5 w-3.5" />
                <span>Single View</span>
              </>
            ) : (
              <>
                <ScrollText className="h-3.5 w-3.5" />
                <span>Continuous Scroll</span>
              </>
            )}
          </button>

          {/* Zoom Out */}
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.max(0.5, Math.round((z - 0.1) * 10) / 10))}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
            title="Zoom out"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </button>

          <span className="w-12 text-center text-xs font-mono text-slate-300">
            {Math.round(zoomLevel * 100)}%
          </span>

          {/* Zoom In */}
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.min(1.4, Math.round((z + 0.1) * 10) / 10))}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
            title="Zoom in"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </button>

          {/* Fit zoom */}
          <button
            type="button"
            onClick={() => setZoomLevel(0.92)}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
            title="Reset zoom to 92%"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Page Thumbnails Bar (When 2 or more pages exist) */}
      {totalPages > 1 && (
        <div className="flex items-center gap-2 border-b border-slate-800 bg-slate-900/40 px-4 py-2 overflow-x-auto scrollbar-thin">
          <span className="text-[11px] font-semibold text-slate-400 shrink-0 mr-1 flex items-center gap-1">
            <Layers className="h-3 w-3 text-blue-400" /> Pages:
          </span>
          {pages.map((pText, idx) => {
            const pageNum = idx + 1;
            const isSelected = viewMode === 'single' && safeCurrentPage === pageNum;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onPageChange(pageNum);
                  if (viewMode === 'all') {
                    // Scroll smoothly to that page in continuous view
                    const pageEl = pageRefs.current.get(idx);
                    pageEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className={`group flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs transition shrink-0 ${
                  isSelected
                    ? 'border-blue-500 bg-blue-500/20 text-blue-200 font-semibold shadow'
                    : 'border-slate-800 bg-slate-800/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
                title={`Jump to Page ${pageNum}`}
              >
                <FileCheck2 className="h-3.5 w-3.5 text-blue-400" />
                <span>Page {pageNum}</span>
                <span className="text-[10px] text-slate-500 font-mono">
                  ({pText.split('\n').filter(Boolean).length} lines)
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Scrollable Paper Canvas Container */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto p-4 sm:p-8 flex items-start justify-center bg-slate-950/70"
      >
        <div
          className="transition-transform duration-200 origin-top flex flex-col gap-10"
          style={{
            transform: `scale(${zoomLevel})`,
            marginBottom: `${(1 - zoomLevel) * -400}px`
          }}
        >
          {viewMode === 'all' ? (
            // Continuous Vertical Scroll: Render all pages stacked
            pages.map((pageContent, idx) => (
              <div key={idx} className="relative group">
                <div className="absolute -top-6 left-2 text-[11px] font-semibold text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800 select-none">
                  Page {idx + 1} of {totalPages}
                </div>
                {renderPaperSheet(idx, pageContent)}
              </div>
            ))
          ) : (
            // Single Page View
            renderPaperSheet(safeCurrentPage - 1, pages[safeCurrentPage - 1] || '')
          )}
        </div>
      </div>

      {/* Hidden Offscreen Export Stage (Ensures all pages are captured for multi-page PDF generation at true 300 DPI) */}
      <div
        id="inkscript-export-container"
        aria-hidden="true"
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: '794px',
          pointerEvents: 'none',
          zIndex: -9999,
          opacity: 0.001
        }}
      >
        {pages.map((pageContent, idx) => renderPaperSheet(idx, pageContent, true))}
      </div>

      {/* Bottom status bar */}
      <div className="flex items-center justify-between border-t border-slate-800 bg-slate-900/60 px-4 py-2 text-[11px] text-slate-400">
        <div className="flex items-center gap-3">
          <span>Paper: <strong className="text-slate-300">{paperConfig.name}</strong></span>
          <span>•</span>
          <span>Font: <strong className="text-slate-300">{activeFontFamily.split(',')[0].replace(/['"]/g, '')}</strong></span>
          <span>•</span>
          <span>
            Jitter Variance:{' '}
            <strong className={settings.naturalJitter ? 'text-indigo-400' : 'text-slate-500'}>
              {settings.naturalJitter ? 'Active (±0.4°)' : 'Off'}
            </strong>
          </span>
        </div>
        <div className="font-mono">
          A4 (210 × 297mm) • 300 DPI Export
        </div>
      </div>
    </div>
  );
}
