export type PaperType =
  | 'ruled'
  | 'college-ruled'
  | 'grid'
  | 'dotted'
  | 'legal-pad'
  | 'vintage'
  | 'blank'
  | 'dark-grid';

export interface PaperStyleConfig {
  id: PaperType;
  name: string;
  description: string;
  bgColor: string;
  lineColor: string;
  lineHeight: number;
  hasMarginLine: boolean;
  marginLineColor: string;
  marginOffset: number; // px from left
  previewBg: string;
}

export interface FontOption {
  id: string;
  name: string;
  fontFamily: string;
  category: 'casual' | 'cursive' | 'neat' | 'draftsman' | 'vintage' | 'custom';
  description: string;
  isCustom?: boolean;
}

export interface CustomFontInfo {
  id: string;
  name: string;
  fontFamily: string;
  fileSize: number;
  format: string;
  addedAt: number;
}

export interface InkColorOption {
  id: string;
  name: string;
  hex: string;
  description: string;
  defaultOpacity: number;
}

export interface HandwritingSettings {
  // Font
  fontId: string;
  fontSize: number; // in px
  lineHeight: number; // in px or multiplier
  letterSpacing: number; // in px
  wordSpacing: number; // in px
  fontWeight: number;
  
  // Ink
  inkColor: string;
  inkOpacity: number;
  naturalJitter: boolean; // realistic organic variation
  
  // Paper
  paperType: PaperType;
  showMarginLine: boolean;
  marginLineColor: string;
  marginOffset: number; // in px
  showHoles: boolean;
  holeType: '3-hole' | 'spiral' | 'none';
  paperTexture: 'smooth' | 'grain' | 'vintage';
  
  // Margins
  paddingTop: number;
  paddingBottom: number;
  paddingLeft: number;
  paddingRight: number;

  // View
  zoom: number; // 0.5 to 1.5
}

export interface DocumentState {
  rawText: string;
  activeTab: 'editor' | 'style' | 'custom-font';
  currentPage: number;
  totalPages: number;
  isExtractingPdf: boolean;
  extractionProgress: number;
  isExportingPdf: boolean;
  exportProgress: number;
  exportStatusText: string;
}

export interface PresetTheme {
  id: string;
  name: string;
  description: string;
  badge: string;
  settings: Partial<HandwritingSettings>;
  sampleText?: string;
}
