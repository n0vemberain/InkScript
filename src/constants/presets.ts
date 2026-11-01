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
  naturalJitter: true,
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

export const PRESET_THEMES: PresetTheme[] = [
  {
    id: 'student-notebook',
    name: 'Student Notebook',
    description: 'Royal Blue Ballpoint on classic ruled lined paper',
    badge: 'Popular',
    settings: {
      fontId: 'caveat',
      fontSize: 20,
      lineHeight: 32,
      letterSpacing: 0.5,
      inkColor: '#1a365d',
      paperType: 'ruled',
      showMarginLine: true,
      marginLineColor: '#ef4444',
      showHoles: true,
      holeType: '3-hole',
      paddingLeft: 84,
      paddingTop: 54
    }
  },
  {
    id: 'ballpoint-memo',
    name: 'Gel Black Memo',
    description: 'Gel black ink on clean college ruled paper',
    badge: 'Daily',
    settings: {
      fontId: 'kalam',
      fontSize: 19,
      lineHeight: 30,
      letterSpacing: 0.2,
      inkColor: '#18181b',
      paperType: 'ruled',
      showMarginLine: true,
      marginLineColor: '#ef4444',
      showHoles: false,
      holeType: 'none',
      paddingLeft: 84,
      paddingTop: 54
    }
  },
  {
    id: 'architect-notes',
    name: 'Architect Grid',
    description: 'Graph paper with 2B pencil drafting lettering',
    badge: 'Technical',
    settings: {
      fontId: 'architects-daughter',
      fontSize: 18,
      lineHeight: 28,
      letterSpacing: 1,
      inkColor: '#3f3f46',
      paperType: 'grid',
      showMarginLine: false,
      showHoles: false,
      holeType: 'none',
      paddingLeft: 48,
      paddingTop: 48
    }
  },
  {
    id: 'vintage-letter',
    name: 'Vintage Letter',
    description: 'Yellow parchment with Homemade Apple cursive script',
    badge: 'Artisan',
    settings: {
      fontId: 'homemade-apple',
      fontSize: 19,
      lineHeight: 36,
      letterSpacing: 0.5,
      inkColor: '#0f2b5c',
      paperType: 'vintage',
      showMarginLine: false,
      showHoles: false,
      holeType: 'none',
      paddingLeft: 56,
      paddingTop: 54
    }
  },
  {
    id: 'clean-art-paper',
    name: 'Plain White A4',
    description: 'Textured ivory A4 art paper with classic fountain ink',
    badge: 'Clean',
    settings: {
      fontId: 'caveat',
      fontSize: 21,
      lineHeight: 34,
      letterSpacing: 0.3,
      inkColor: '#0f2b5c',
      paperType: 'blank',
      showMarginLine: false,
      showHoles: false,
      holeType: 'none',
      paddingLeft: 60,
      paddingTop: 54
    }
  }
];

export const SAMPLE_TEXTS = {
  essay: `The Architecture of Thought: Reflections on Modern Problem Solving

Human intelligence is distinctly marked by our capacity to externalize thought through handwriting. When pen meets paper, the mechanical friction forces deliberate contemplation that digital keyboards often circumvent.

In cognitive psychology, the "generation effect" illustrates how physically forming letters reinforces synaptic pathways for memory retention. As we draft ideas by hand, we engage sensorimotor loops that anchor abstract concepts into tangible physical space.

Key Observations:
1. Spatial Organization: Handwriting naturally conforms to margins, annotations, and arrows.
2. Cognitive Pacing: Writing by hand is roughly 3x slower than typing, affording the mind time to synthesize before commitment.
3. Emotional Resonance: Handwritten notes convey intent, vulnerability, and human presence that sterile fonts cannot replicate.

"We do not write in order to be understood; we write in order to understand." — C. Day Lewis`,

  lecture: `Physics 204: Quantum Harmonic Oscillators & Wave Functions
Date: November 2nd | Prof. Sterling | Hall B

I. Basic Formulation
The 1D harmonic oscillator Hamiltonian is governed by:
   H = p²/(2m) + (1/2)mω²x²

Where:
• m is the particle mass
• ω is the angular frequency of the oscillator
• x and p are position and momentum operators with [x, p] = iħ

II. Energy Eigenvalues
By defining ladder operators (raising a† and lowering a):
   E_n = ħω (n + 1/2), where n = 0, 1, 2, ...

Notice that the ground state energy E_0 = (1/2)ħω is strictly positive!
This zero-point energy is a direct consequence of Heisenberg's Uncertainty Principle. A particle cannot rest at the bottom of the potential well with zero kinetic energy without violating Δx·Δp ≥ ħ/2.

Next Assignment:
- Complete problem set 4 by Thursday 5 PM.
- Read Griffiths Chapter 3 on Hilbert spaces.`,

  recipe: `Grandmother's Sunday Cinnamon Sourdough Braided Loaf

Ingredients:
• 500g unbleached bread flour
• 350ml warm filtered water (around 85°F)
• 100g active sourdough starter (fed 4 hours prior)
• 10g fine sea salt
• Filling: 60g softened brown butter, 3 tbsp Ceylon cinnamon, 70g dark muscovado sugar

Preparation Protocol:
1. The Autolyse: Mix flour and warm water in an earthenware bowl. Let rest covered for 45 minutes to hydrate gluten.
2. Ferment: Fold in the starter and salt until silky. Perform 4 sets of stretch-and-folds spaced 30 minutes apart.
3. Bulk Rise: Allow dough to rise until aerated and increased in volume by ~75%.
4. Shape & Cinnamon Layer: Gently stretch into a 12x18 inch rectangle. Brush with melted brown butter, dust heavily with cinnamon sugar, roll into a log and slice lengthwise to braid.
5. Bake at 425°F in a preheated Dutch oven with lid on for 22 mins, remove lid and finish for 18 mins until deep mahogany crust develops.`,

  reflection: `November 2nd — Late Night Journal Entry

Quiet evening. Rain gently tapping against the study windowpane.

It is easy to get caught in the velocity of life—deadlines, notifications, and endless tabs. Today I took an hour to disconnect and simply write down what actually matters right now:

• Focus on craftsmanship over speed. Quality compounds silently.
• Protect morning hours for creative synthesis before consuming news.
• Be generous with encouragement; everyone is fighting their own quiet battle.

Tomorrow's primary goal: Finish the ink converter application and ensure the handwriting preview feels indistinguishable from an actual notebook page.

Good night world.`
};
