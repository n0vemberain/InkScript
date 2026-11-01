import type { FontOption, InkColorOption, PaperStyleConfig, PresetTheme, HandwritingSettings } from '../types';

export const HANDWRITING_FONTS: FontOption[] = [
  // 3 Primary Built-in Fallback Google Fonts
  {
    id: 'caveat',
    name: 'Caveat (Default)',
    fontFamily: "'Caveat', cursive",
    category: 'cursive',
    description: 'Natural, flowing everyday handwriting with organic character'
  },
  {
    id: 'kalam',
    name: 'Kalam (Ballpoint)',
    fontFamily: "'Kalam', cursive",
    category: 'neat',
    description: 'Smooth ballpoint pen lettering with curved strokes'
  },
  {
    id: 'homemade-apple',
    name: 'Homemade Apple (Cursive)',
    fontFamily: "'Homemade Apple', cursive",
    category: 'vintage',
    description: 'Classic vintage cursive manuscript and journal script'
  },
  // Additional Curated Handwriting Fonts
  {
    id: 'patrick-hand',
    name: 'Patrick Hand',
    fontFamily: "'Patrick Hand', cursive",
    category: 'neat',
    description: 'Clean student classroom handwriting, legible and friendly'
  },
  {
    id: 'indie-flower',
    name: 'Indie Flower',
    fontFamily: "'Indie Flower', cursive",
    category: 'casual',
    description: 'Bubbly, relaxed hand with rounded glyphs'
  },
  {
    id: 'shadows-into-light',
    name: 'Shadows Into Light',
    fontFamily: "'Shadows Into Light', cursive",
    category: 'casual',
    description: 'Sharp, authentic personal quick notes'
  },
  {
    id: 'dancing-script',
    name: 'Dancing Script',
    fontFamily: "'Dancing Script', cursive",
    category: 'cursive',
    description: 'Bouncy, elegant cursive calligraphy'
  },
  {
    id: 'architects-daughter',
    name: 'Architects Daughter',
    fontFamily: "'Architects Daughter', cursive",
    category: 'draftsman',
    description: 'Blueprint drafting and technical notes style'
  },
  {
    id: 'sacramento',
    name: 'Sacramento',
    fontFamily: "'Sacramento', cursive",
    category: 'cursive',
    description: 'Slender, formal calligraphy with open loops'
  },
  {
    id: 'gochi-hand',
    name: 'Gochi Hand',
    fontFamily: "'Gochi Hand', cursive",
    category: 'casual',
    description: 'Felt-tip marker handwriting with playful strokes'
  },
  {
    id: 'nanum-pen',
    name: 'Nanum Pen Script',
    fontFamily: "'Nanum Pen Script', cursive",
    category: 'neat',
    description: 'Fine 0.38mm gel pen notebook handwriting'
  },
  {
    id: 'reenie-beanie',
    name: 'Reenie Beanie',
    fontFamily: "'Reenie Beanie', cursive",
    category: 'casual',
    description: 'Quick scratchpad scribbles and thoughts'
  }
];

export const INK_COLORS: InkColorOption[] = [
  // 4 Primary Inks Requested
  {
    id: 'royal-blue',
    name: 'Royal Blue Ballpoint',
    hex: '#1a365d',
    description: 'Classic deep royal blue ballpoint pen ink',
    defaultOpacity: 0.95
  },
  {
    id: 'gel-black',
    name: 'Gel Black',
    hex: '#18181b',
    description: 'Intense, smooth rollerball gel ink',
    defaultOpacity: 0.94
  },
  {
    id: 'classic-ink',
    name: 'Classic Ink Pen',
    hex: '#0f2b5c',
    description: 'Fountain pen dark blue-black archival ink',
    defaultOpacity: 0.96
  },
  {
    id: 'pencil-graphite',
    name: 'Pencil Graphite',
    hex: '#3f3f46',
    description: 'Soft 2B mechanical pencil graphite texture',
    defaultOpacity: 0.88
  },
  // Additional Inks
  {
    id: 'teacher-red',
    name: 'Grading Red',
    hex: '#dc2626',
    description: 'Teacher red ballpoint correction ink',
    defaultOpacity: 0.94
  },
  {
    id: 'emerald-green',
    name: 'Emerald Green',
    hex: '#047857',
    description: 'Forest green fountain pen ink',
    defaultOpacity: 0.93
  },
  {
    id: 'antique-sepia',
    name: 'Antique Sepia',
    hex: '#78350f',
    description: 'Warm walnut ink for vintage papers',
    defaultOpacity: 0.90
  }
];

export const PAPER_STYLES: Record<string, PaperStyleConfig> = {
  // 4 Primary Paper Types Requested
  ruled: {
    id: 'ruled',
    name: 'Lined / Ruled Paper',
    description: 'Classic blue ruled lines with distinct red left-margin line',
    bgColor: '#ffffff',
    lineColor: '#93c5fd', // Classic light blue ruling
    lineHeight: 32,
    hasMarginLine: true,
    marginLineColor: '#ef4444', // Distinct red margin line
    marginOffset: 68,
    previewBg: 'linear-gradient(#93c5fd 1px, transparent 1px)'
  },
  blank: {
    id: 'blank',
    name: 'Plain White A4',
    description: 'Plain White A4 paper with organic paper grain texture',
    bgColor: '#fafafa',
    lineColor: 'transparent',
    lineHeight: 32,
    hasMarginLine: false,
    marginLineColor: 'transparent',
    marginOffset: 0,
    previewBg: '#ffffff'
  },
  grid: {
    id: 'grid',
    name: 'Grid / Graph Paper',
    description: 'Precision technical grid for STEM notes and diagrams',
    bgColor: '#ffffff',
    lineColor: '#cbd5e1',
    lineHeight: 28,
    hasMarginLine: false,
    marginLineColor: '#ef4444',
    marginOffset: 0,
    previewBg: 'linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(90deg, #cbd5e1 1px, transparent 1px)'
  },
  vintage: {
    id: 'vintage',
    name: 'Vintage / Yellow Parchment',
    description: 'Warm aged antique parchment texture with sepia tones',
    bgColor: '#fbf5e6',
    lineColor: '#e7d8c5',
    lineHeight: 34,
    hasMarginLine: false,
    marginLineColor: '#d97706',
    marginOffset: 0,
    previewBg: '#fef08a'
  },
  // Additional Styles
  'college-ruled': {
    id: 'college-ruled',
    name: 'College Ruled',
    description: 'Dense 26mm ruling for compact notes',
    bgColor: '#ffffff',
    lineColor: '#bfdbfe',
    lineHeight: 26,
    hasMarginLine: true,
    marginLineColor: '#f87171',
    marginOffset: 64,
    previewBg: 'linear-gradient(#bfdbfe 1px, transparent 1px)'
  },
  'legal-pad': {
    id: 'legal-pad',
    name: 'Yellow Legal Pad',
    description: 'Canary yellow legal memo pad with red margin',
    bgColor: '#fef9c3',
    lineColor: '#cbd5e1',
    lineHeight: 32,
    hasMarginLine: true,
    marginLineColor: '#ef4444',
    marginOffset: 68,
    previewBg: '#fef9c3'
  },
  dotted: {
    id: 'dotted',
    name: 'Dot Matrix (Bujo)',
    description: 'Modern bullet journal subtle dot matrix',
    bgColor: '#ffffff',
    lineColor: '#94a3b8',
    lineHeight: 28,
    hasMarginLine: false,
    marginLineColor: '#fca5a5',
    marginOffset: 0,
    previewBg: 'radial-gradient(#94a3b8 1px, transparent 1px)'
  },
  'dark-grid': {
    id: 'dark-grid',
    name: 'Dark Slate Grid',
    description: 'Dark mode paper with chalk grid lines',
    bgColor: '#1e293b',
    lineColor: '#334155',
    lineHeight: 30,
    hasMarginLine: true,
    marginLineColor: '#475569',
    marginOffset: 64,
    previewBg: '#1e293b'
  }
};

export const DEFAULT_SETTINGS: HandwritingSettings = {
  fontId: 'caveat',
  fontSize: 20,
  lineHeight: 32,
  letterSpacing: 0.5,
  wordSpacing: 2,
  fontWeight: 500,
  inkColor: '#1a365d', // Royal Blue Ballpoint
  inkOpacity: 0.95,
  naturalJitter: true, // "Natural Handwriting Variance" enabled by default
  paperType: 'ruled',
  showMarginLine: true,
  marginLineColor: '#ef4444', // Distinct red left-margin line
  marginOffset: 68,
  showHoles: true,
  holeType: '3-hole',
  paperTexture: 'grain',
  paddingTop: 54,
  paddingBottom: 48,
  paddingLeft: 84, // inside the red margin line
  paddingRight: 48,
  zoom: 1
};

export const SAMPLE_TEXTS = {
  college: `Physics 204: Quantum Mechanics & Wave Function Analysis
Date: November 2nd | Hall B | Prof. Sterling

I. The 1D Harmonic Oscillator
The Hamiltonian for a one-dimensional quantum harmonic oscillator is:
    H = p²/(2m) + (1/2)mω²x²

Where:
• m is the particle mass
• ω is the natural angular frequency
• x and p are position and momentum operators satisfying [x, p] = iħ

II. Energy Eigenvalues & Zero-Point Energy
Using ladder raising (a†) and lowering (a) operators:
    E_n = ħω (n + 1/2),   for n = 0, 1, 2, ...

Crucial observation: Even at ground state (n = 0), E_0 = (1/2)ħω > 0.
This zero-point energy is required by the Heisenberg Uncertainty Principle! A quantum particle cannot sit stationary at the absolute bottom of a potential well.

Assignment:
- Complete problems 4.1 to 4.7 by Thursday 5 PM.
- Read Griffiths Section 3.2 on Hilbert space projections.`,

  letter: `Dearest Eleanor,

I hope this letter finds you in peace and good spirits.

The autumn air here has turned crisp and golden. As I sit by the window writing this, the maple leaves outside are drifting slowly to the cobblestones below. Life moves at an unrelenting pace in the city, but whenever I pick up pen and paper, the world gently decelerates.

I was thinking back to our long conversation last winter by the harbor. You asked if I still believe that quiet craftsmanship can endure in a world enamored with quick shortcuts. The longer I observe, the more certain I become: genuine care and human warmth leave an indelible impression that mechanical speed can never duplicate.

Please give my warmest regards to everyone. Write back when time permits; I always look forward to hearing your voice through your handwriting.

Yours always,
Julian`,

  notes: `Daily Action Items & Brainstorming Notes
Focus: InkScript Studio Launch & Design Polish

1. Core Architecture Review:
   • Verify that client-side PDF text extraction runs strictly in-memory.
   • Ensure A4 auto-pagination splits text across pages without line clipping.
   • Verify 300 DPI high-res export via jsPDF + html2canvas.

2. Design & Humanization:
   • Natural Handwriting Variance: +/- 0.4deg rotation and +/- 1px baseline shift.
   • Subtle ink opacity fluctuation per word to emulate fountain pen flow.
   • Ruled line alignment with dynamic line-height.

3. Quick Decisions:
   • Keep interface clean and distraction-free in dark slate.
   • Support instant drag-and-drop font testing with .ttf, .otf, .woff.

"Simplicity is the prerequisite for reliability." — Edsger W. Dijkstra`,

  essay: `The Architecture of Thought: Reflections on Modern Problem Solving

Human intelligence is distinctly marked by our capacity to externalize thought through handwriting. When pen meets paper, the mechanical friction forces deliberate contemplation that digital keyboards often circumvent.

In cognitive psychology, the "generation effect" illustrates how physically forming letters reinforces synaptic pathways for memory retention. As we draft ideas by hand, we engage sensorimotor loops that anchor abstract concepts into tangible physical space.

Key Observations:
1. Spatial Organization: Handwriting naturally conforms to margins, annotations, and arrows.
2. Cognitive Pacing: Writing by hand is roughly 3x slower than typing, affording the mind time to synthesize before commitment.
3. Emotional Resonance: Handwritten notes convey intent, vulnerability, and human presence that sterile fonts cannot replicate.

"We do not write in order to be understood; we write in order to understand." — C. Day Lewis`
};

export const PRESET_THEMES: PresetTheme[] = [
  // 3 Primary Quick Action Presets Requested
  {
    id: 'college-assignment',
    name: 'College Assignment',
    description: 'Lined paper with Royal Blue ballpoint, red margin line, and natural handwriting variance',
    badge: 'Academic',
    settings: {
      fontId: 'patrick-hand',
      fontSize: 20,
      lineHeight: 32,
      letterSpacing: 0.5,
      inkColor: '#1a365d', // Royal Blue Ballpoint
      paperType: 'ruled',
      showMarginLine: true,
      marginLineColor: '#ef4444',
      showHoles: true,
      holeType: '3-hole',
      naturalJitter: true,
      paddingLeft: 84,
      paddingTop: 54
    },
    sampleText: SAMPLE_TEXTS.college
  },
  {
    id: 'personal-letter',
    name: 'Personal Letter',
    description: 'Warm yellow vintage parchment with Homemade Apple cursive script',
    badge: 'Letter',
    settings: {
      fontId: 'homemade-apple',
      fontSize: 20,
      lineHeight: 36,
      letterSpacing: 0.5,
      inkColor: '#0f2b5c', // Classic Ink Pen
      paperType: 'vintage',
      showMarginLine: false,
      showHoles: false,
      holeType: 'none',
      naturalJitter: true,
      paddingLeft: 60,
      paddingTop: 54
    },
    sampleText: SAMPLE_TEXTS.letter
  },
  {
    id: 'quick-notes',
    name: 'Quick Notes',
    description: 'Plain White A4 paper with Gel Black ink and organic letter spacing',
    badge: 'Notes',
    settings: {
      fontId: 'kalam',
      fontSize: 19,
      lineHeight: 30,
      letterSpacing: 0.2,
      inkColor: '#18181b', // Gel Black
      paperType: 'blank',
      showMarginLine: false,
      showHoles: false,
      holeType: 'none',
      naturalJitter: true,
      paddingLeft: 56,
      paddingTop: 48
    },
    sampleText: SAMPLE_TEXTS.notes
  },
  // Additional Presets
  {
    id: 'architect-grid',
    name: 'Architect Grid',
    description: 'Graph paper with 2B pencil drafting lettering',
    badge: 'Technical',
    settings: {
      fontId: 'architects-daughter',
      fontSize: 18,
      lineHeight: 28,
      letterSpacing: 1,
      inkColor: '#3f3f46', // Pencil Graphite
      paperType: 'grid',
      showMarginLine: false,
      showHoles: false,
      holeType: 'none',
      naturalJitter: true,
      paddingLeft: 48,
      paddingTop: 48
    },
    sampleText: SAMPLE_TEXTS.essay
  }
];
