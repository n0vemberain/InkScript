import {
  FileCode,
  Type,
  Palette,
  Sliders,
  Check,
  Sparkles,
  AlignLeft,
  CircleDot,
  Wand2
} from 'lucide-react';
import { HANDWRITING_FONTS, INK_COLORS, PAPER_STYLES } from '../constants/presets';
import type { CustomFontInfo, HandwritingSettings, PaperType } from '../types';

export interface StylePanelProps {
  settings: HandwritingSettings;
  onUpdateSettings: (updates: Partial<HandwritingSettings>) => void;
  customFonts: CustomFontInfo[];
}

export function StylePanel({
  settings,
  onUpdateSettings,
  customFonts
}: StylePanelProps) {
  const currentPaperConfig = PAPER_STYLES[settings.paperType] || PAPER_STYLES.ruled;

  // Combine standard handwriting fonts and custom fonts
  const allFonts = [
    ...HANDWRITING_FONTS,
    ...customFonts.map((cf) => ({
      id: cf.id,
      name: `${cf.name} (Custom)`,
      fontFamily: cf.fontFamily,
      category: 'custom' as const,
      description: `Uploaded font (${cf.format})`,
      isCustom: true
    }))
  ];

  return (
    <div className="space-y-6">
      {/* 1. Realistic Paper Types */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300">
            <FileCode className="h-3.5 w-3.5 text-blue-400" />
            Realistic Paper Style
          </label>
          <span className="text-xs text-blue-400 font-medium">
            {currentPaperConfig.name}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {Object.values(PAPER_STYLES).map((paper) => {
            const isSelected = settings.paperType === paper.id;
            return (
              <button
                key={paper.id}
                type="button"
                onClick={() => {
                  onUpdateSettings({
                    paperType: paper.id as PaperType,
                    showMarginLine: paper.hasMarginLine,
                    marginLineColor: paper.marginLineColor,
                    lineHeight: paper.lineHeight,
                    paddingLeft: paper.hasMarginLine ? 84 : 48
                  });
                }}
                className={`group relative flex flex-col items-start rounded-xl border p-2.5 text-left transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-500/10 ring-1 ring-blue-500 shadow-md shadow-blue-500/10'
                    : 'border-slate-700 bg-slate-800/60 hover:border-slate-500 hover:bg-slate-800'
                }`}
              >
                {/* Visual miniature preview box */}
                <div
                  className="mb-2 h-11 w-full rounded-md border border-slate-400/20 overflow-hidden relative shadow-inner"
                  style={{
                    backgroundColor: paper.bgColor,
                  }}
                >
                  <div
                    className={`w-full h-full paper-${paper.id}`}
                    style={{
                      backgroundSize:
                        paper.id === 'grid' || paper.id === 'dark-grid'
                          ? '8px 8px'
                          : paper.id === 'dotted'
                          ? '8px 8px'
                          : '100% 10px'
                    }}
                  />
                  {paper.hasMarginLine && (
                    <div
                      className="absolute top-0 bottom-0 left-3 w-0.5"
                      style={{ backgroundColor: paper.marginLineColor }}
                    />
                  )}
                  {paper.id === 'blank' && (
                    <div className="absolute inset-0 texture-grain opacity-50" />
                  )}
                </div>

                <div className="flex w-full items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200 group-hover:text-white">
                    {paper.name}
                  </span>
                  {isSelected && <Check className="h-3.5 w-3.5 text-blue-400" />}
                </div>
                <span className="mt-0.5 text-[10px] text-slate-400 line-clamp-1">
                  {paper.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Handwriting Font Selector with 3 Fallback Google Fonts */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300">
            <Type className="h-3.5 w-3.5 text-blue-400" />
            Handwriting Font
          </label>
          <span className="text-xs text-slate-400">
            {allFonts.find((f) => f.id === settings.fontId)?.name || 'Select font'}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 max-h-56 overflow-y-auto pr-1">
          {allFonts.map((font, idx) => {
            const isSelected = settings.fontId === font.id;
            const isTopThree = idx < 3 && !font.isCustom;

            return (
              <button
                key={font.id}
                type="button"
                onClick={() => onUpdateSettings({ fontId: font.id })}
                className={`group flex items-center justify-between rounded-xl border p-2.5 text-left transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-500/10 ring-1 ring-blue-500 shadow-md shadow-blue-500/10'
                    : 'border-slate-700 bg-slate-800/60 hover:border-slate-500 hover:bg-slate-800'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-medium text-slate-200">
                      {font.name}
                    </span>
                    {isTopThree && (
                      <span className="rounded bg-blue-500/10 px-1 py-0.2 text-[9px] font-medium text-blue-300 ring-1 ring-inset ring-blue-500/20">
                        Primary
                      </span>
                    )}
                    {font.isCustom && (
                      <span className="rounded bg-indigo-500/20 px-1 text-[9px] font-semibold text-indigo-300">
                        Custom
                      </span>
                    )}
                  </div>
                  {/* Font visual live specimen */}
                  <div
                    className="mt-1 truncate text-lg leading-tight text-slate-300 group-hover:text-blue-300"
                    style={{ fontFamily: font.fontFamily }}
                  >
                    The quick brown fox jumps over the lazy dog
                  </div>
                </div>
                {isSelected && (
                  <Check className="ml-2 h-4 w-4 shrink-0 text-blue-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Realistic Pen Inks */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300">
            <Palette className="h-3.5 w-3.5 text-blue-400" />
            Pen Ink Selection
          </label>
          <div className="flex items-center gap-1.5">
            <div
              className="h-3 w-3 rounded-full border border-slate-600 shadow"
              style={{ backgroundColor: settings.inkColor }}
            />
            <span className="text-xs font-mono text-slate-300">
              {INK_COLORS.find(c => c.hex.toLowerCase() === settings.inkColor.toLowerCase())?.name || settings.inkColor}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 mb-3">
          {INK_COLORS.slice(0, 4).map((ink) => {
            const isSelected = settings.inkColor.toLowerCase() === ink.hex.toLowerCase();
            return (
              <button
                key={ink.id}
                type="button"
                onClick={() =>
                  onUpdateSettings({
                    inkColor: ink.hex,
                    inkOpacity: ink.defaultOpacity
                  })
                }
                className={`flex items-center gap-2 rounded-xl border p-2 text-left transition ${
                  isSelected
                    ? 'border-blue-500 bg-blue-500/15 ring-1 ring-blue-500'
                    : 'border-slate-700 bg-slate-800/70 hover:border-slate-500'
                }`}
              >
                <div
                  className="h-4 w-4 shrink-0 rounded-full border border-slate-500/50 shadow-inner"
                  style={{ backgroundColor: ink.hex }}
                />
                <div className="min-w-0 flex-1 truncate">
                  <div className="truncate text-xs font-medium text-slate-200">
                    {ink.name}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Additional swatches & custom color picker */}
        <div className="flex items-center gap-2 pt-1 border-t border-slate-800">
          <span className="text-[11px] text-slate-400 mr-1">Other shades:</span>
          {INK_COLORS.slice(4).map((ink) => {
            const isSelected = settings.inkColor.toLowerCase() === ink.hex.toLowerCase();
            return (
              <button
                key={ink.id}
                type="button"
                onClick={() =>
                  onUpdateSettings({
                    inkColor: ink.hex,
                    inkOpacity: ink.defaultOpacity
                  })
                }
                title={ink.name}
                className={`relative flex h-7 w-7 items-center justify-center rounded-lg border transition ${
                  isSelected
                    ? 'scale-110 border-white ring-2 ring-blue-500'
                    : 'border-slate-700 hover:scale-105'
                }`}
                style={{ backgroundColor: ink.hex }}
              >
                {isSelected && <Check className="h-3 w-3 text-white drop-shadow" />}
              </button>
            );
          })}

          {/* Custom Hex Color Picker */}
          <label
            title="Custom ink color picker"
            className="relative flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-500 hover:text-white transition ml-auto"
          >
            <CircleDot className="h-3.5 w-3.5 text-slate-300" />
            <input
              type="color"
              value={settings.inkColor}
              onChange={(e) => onUpdateSettings({ inkColor: e.target.value })}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* 4. Handwriting Humanization: Natural Handwriting Variance Toggle */}
      <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
              <Wand2 className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-100 flex items-center gap-2">
                Natural Handwriting Variance
                <span className={`rounded px-1.5 py-0.2 text-[9px] font-semibold ${
                  settings.naturalJitter ? 'bg-indigo-500/30 text-indigo-300' : 'bg-slate-700 text-slate-400'
                }`}>
                  {settings.naturalJitter ? 'Active' : 'Disabled'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Random micro-rotation (-0.4° to +0.4°), ±1px baseline shift, & uneven ink pool opacity
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.naturalJitter}
              onChange={(e) => onUpdateSettings({ naturalJitter: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>
      </div>

      {/* 5. Typography & Natural Controls (Sliders) */}
      <div className="rounded-2xl border border-slate-700/80 bg-slate-800/40 p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300">
            <Sliders className="h-3.5 w-3.5 text-blue-400" />
            Typography & Spacing Sliders
          </div>
          <span className="text-[10px] text-blue-400">
            Zero layout shifts
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Font Size (14px to 32px) */}
          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>Font Size</span>
              <span className="font-mono text-blue-400 font-semibold">{settings.fontSize}px</span>
            </div>
            <input
              type="range"
              min={14}
              max={32}
              step={1}
              value={settings.fontSize}
              onChange={(e) => onUpdateSettings({ fontSize: Number(e.target.value) })}
              className="w-full accent-blue-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
              <span>14px</span>
              <span>32px</span>
            </div>
          </div>

          {/* Line Spacing / Ruling Spacing */}
          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>Line Spacing (Ruling)</span>
              <span className="font-mono text-blue-400 font-semibold">{settings.lineHeight}px</span>
            </div>
            <input
              type="range"
              min={22}
              max={46}
              step={1}
              value={settings.lineHeight}
              onChange={(e) => onUpdateSettings({ lineHeight: Number(e.target.value) })}
              className="w-full accent-blue-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
              <span>22px</span>
              <span>46px</span>
            </div>
          </div>

          {/* Letter Spacing (-1px to 4px) */}
          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>Letter Spacing</span>
              <span className="font-mono text-blue-400 font-semibold">{settings.letterSpacing}px</span>
            </div>
            <input
              type="range"
              min={-1}
              max={4}
              step={0.5}
              value={settings.letterSpacing}
              onChange={(e) => onUpdateSettings({ letterSpacing: Number(e.target.value) })}
              className="w-full accent-blue-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
              <span>-1px</span>
              <span>+4px</span>
            </div>
          </div>

          {/* Left Margin Padding */}
          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>Left Margin Padding</span>
              <span className="font-mono text-blue-400 font-semibold">{settings.paddingLeft}px</span>
            </div>
            <input
              type="range"
              min={30}
              max={140}
              step={2}
              value={settings.paddingLeft}
              onChange={(e) => {
                const newLeft = Number(e.target.value);
                onUpdateSettings({
                  paddingLeft: newLeft,
                  marginOffset: Math.max(20, newLeft - 16)
                });
              }}
              className="w-full accent-blue-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
              <span>30px</span>
              <span>140px</span>
            </div>
          </div>

          {/* Top Margin Padding */}
          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>Top Margin Padding</span>
              <span className="font-mono text-blue-400 font-semibold">{settings.paddingTop}px</span>
            </div>
            <input
              type="range"
              min={24}
              max={120}
              step={2}
              value={settings.paddingTop}
              onChange={(e) => onUpdateSettings({ paddingTop: Number(e.target.value) })}
              className="w-full accent-blue-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
              <span>24px</span>
              <span>120px</span>
            </div>
          </div>

          {/* Ink Opacity / Natural Pressure */}
          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>Ink Pressure (Opacity)</span>
              <span className="font-mono text-blue-400 font-semibold">{Math.round(settings.inkOpacity * 100)}%</span>
            </div>
            <input
              type="range"
              min={0.7}
              max={1.0}
              step={0.02}
              value={settings.inkOpacity}
              onChange={(e) => onUpdateSettings({ inkOpacity: Number(e.target.value) })}
              className="w-full accent-blue-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
              <span>70%</span>
              <span>100%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Paper Realism Details */}
      <div className="rounded-2xl border border-slate-700/80 bg-slate-800/40 p-4 space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          Notebook Realism & Physics
        </div>

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {/* Vertical Red Margin Rule */}
          <label className="flex items-center justify-between rounded-xl border border-slate-700/70 bg-slate-800/80 p-2.5 text-xs text-slate-200 cursor-pointer hover:bg-slate-800">
            <div className="flex items-center gap-2">
              <span className="font-medium">Red Margin Line</span>
              <span className="text-[10px] text-slate-400">(Classic margin)</span>
            </div>
            <input
              type="checkbox"
              checked={settings.showMarginLine}
              onChange={(e) => onUpdateSettings({ showMarginLine: e.target.checked })}
              className="h-4 w-4 rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500"
            />
          </label>

          {/* Binder Holes / Spiral binding */}
          <div className="rounded-xl border border-slate-700/70 bg-slate-800/80 p-2 text-xs text-slate-200 flex items-center justify-between">
            <span className="font-medium flex items-center gap-1">
              <AlignLeft className="h-3 w-3 text-slate-400" /> Binding:
            </span>
            <div className="flex gap-1">
              {[
                { id: '3-hole', label: '3-Hole' },
                { id: 'spiral', label: 'Spiral' },
                { id: 'none', label: 'None' }
              ].map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() =>
                    onUpdateSettings({
                      showHoles: b.id !== 'none',
                      holeType: b.id as '3-hole' | 'spiral' | 'none'
                    })
                  }
                  className={`rounded px-1.5 py-0.5 text-[10px] font-medium transition ${
                    (b.id === 'none' && !settings.showHoles) ||
                    (settings.showHoles && settings.holeType === b.id)
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
