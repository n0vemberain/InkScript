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

interface PaperPreviewProps {
  text: string;
  settings: HandwritingSettings;
  customFonts: CustomFontInfo[];
  currentPage: number;
  onPageChange: (page: number) => void;
  viewMode: 'single' | 'all';
  onToggleViewMode: () => void;
  pageRefs: MutableRefObject<Map<number, HTMLDivElement>>;
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
  const [zoomLevel, setZoomLevel] = useState<number>(0.92);

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
      // Synchronize ruling lines with line-height and top margin padding
      bgStyles.backgroundImage = `linear-gradient(to bottom, transparent calc(${settings.lineHeight}px - 1px), ${paperConfig.lineColor} calc(${settings.lineHeight}px - 1px), ${paperConfig.lineColor} ${settings.lineHeight}px)`;
      bgStyles.backgroundSize = `100% ${settings.lineHeight}px`;
      bgStyles.backgroundPosition = `0 ${settings.paddingTop - 6}px`;
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
      bgStyles.backgroundImage = `
        radial-gradient(circle at 50% 50%, rgba(217, 119, 6, 0.05) 0%, rgba(180, 120, 60, 0.12) 100%),
        linear-gradient(to bottom, transparent calc(${settings.lineHeight}px - 1px), ${paperConfig.lineColor} calc(${settings.lineHeight}px - 1px), ${paperConfig.lineColor} ${settings.lineHeight}px)
      `;
      bgStyles.backgroundSize = `100% 100%, 100% ${settings.lineHeight}px`;
      bgStyles.backgroundPosition = `0 0, 0 ${settings.paddingTop - 6}px`;
    }

    return bgStyles;
  };

  // Render text lines with natural organic micro-jitter
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
      // Deterministic slight angle rotation for natural variance
      const pseudoRandomAngle = settings.naturalJitter
        ? ((lineIdx * 7 + line.length * 3) % 7 - 3) * 0.12
        : 0;

      const words = line.split(' ');

      return (
        <div
          key={lineIdx}
          className="relative whitespace-pre-wrap break-words transition-transform duration-150"
          style={{
            height: `${settings.lineHeight}px`,
            lineHeight: `${settings.lineHeight}px`,
            transform: settings.naturalJitter ? `rotate(${pseudoRandomAngle}deg)` : undefined
          }}
        >
          {words.map((word, wordIdx) => {
            const wordWiggleY = settings.naturalJitter
              ? ((lineIdx * 13 + wordIdx * 17) % 5 - 2) * 0.35
              : 0;

            return (
              <span
                key={wordIdx}
                style={{
                  display: 'inline-block',
                  transform: settings.naturalJitter ? `translateY(${wordWiggleY}px)` : undefined,
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
  const renderPaperSheet = (pageIndex: number, pageContent: string) => {
    const marginLineLeft = settings.marginOffset > 0 ? settings.marginOffset : Math.max(20, settings.paddingLeft - 16);

    return (
      <div
        key={pageIndex}
        ref={(el) => {
          if (el) pageRefs.current.set(pageIndex, el);
          else pageRefs.current.delete(pageIndex);
        }}
        data-page-index={pageIndex}
        className="relative mx-auto bg-white notebook-sheet-shadow overflow-hidden transition-all duration-300 print:shadow-none print:m-0"
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
            opacity: settings.inkOpacity,
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
                    // Scroll to that page in continuous view
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

      {/* Hidden Offscreen Export Stage (Ensures all pages are always available for html2canvas multi-page export) */}
      <div
        aria-hidden="true"
        className="absolute -left-[9999px] -top-[9999px] pointer-events-none opacity-0"
      >
        {pages.map((pageContent, idx) => (
          <div
            key={`export-${idx}`}
            ref={(el) => {
              if (el) pageRefs.current.set(idx, el);
            }}
            style={{
              width: '794px',
              minHeight: '1123px',
              ...getPaperBackgroundStyle()
            }}
            className="bg-white"
          >
            {/* Red Left Margin Line */}
            {settings.showMarginLine && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: `${settings.marginOffset > 0 ? settings.marginOffset : Math.max(20, settings.paddingLeft - 16)}px`,
                  width: '2px',
                  backgroundColor: settings.marginLineColor
                }}
              />
            )}
            {/* Page number */}
            <div
              style={{
                position: 'absolute',
                top: '16px',
                right: '32px',
                fontSize: '12px',
                fontFamily: 'monospace',
                color: '#94a3b8'
              }}
            >
              Page {idx + 1} of {totalPages}
            </div>
            {/* Text Content */}
            <div
              style={{
                fontFamily: activeFontFamily,
                fontSize: `${settings.fontSize}px`,
                letterSpacing: `${settings.letterSpacing}px`,
                color: settings.inkColor,
                opacity: settings.inkOpacity,
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
        ))}
      </div>

      {/* Bottom status bar */}
      <div className="flex items-center justify-between border-t border-slate-800 bg-slate-900/60 px-4 py-2 text-[11px] text-slate-400">
        <div>
          Paper: <strong className="text-slate-300">{paperConfig.name}</strong> • Font: <strong className="text-slate-300">{activeFontFamily.split(',')[0].replace(/['"]/g, '')}</strong>
        </div>
        <div className="font-mono">
          A4 Standard (210 × 297mm) • Scale 300DPI
        </div>
      </div>
    </div>
  );
}
