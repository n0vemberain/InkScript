export interface SplitTextOptions {
  lineHeight: number;
  fontSize?: number;
  fontFamily?: string;
  pageWidth?: number; // default A4 width: 794px
  pageHeight?: number; // default A4 height: 1123px
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
  letterSpacing?: number;
  wordSpacing?: number;
}

let measurementCanvas: HTMLCanvasElement | null = null;

function getWordWidth(word: string, fontSize: number, fontFamily: string, letterSpacing: number = 0): number {
  if (typeof document !== 'undefined') {
    try {
      if (!measurementCanvas) {
        measurementCanvas = document.createElement('canvas');
      }
      const ctx = measurementCanvas.getContext('2d');
      if (ctx) {
        ctx.font = `500 ${fontSize}px ${fontFamily}`;
        const measured = ctx.measureText(word).width;
        const spacingExtra = word.length * Math.max(0, letterSpacing);
        // Include subtle 5% buffer for cursive glyph slants, flourishes and handwriting jitter
        return Math.ceil(measured * 1.05 + spacingExtra);
      }
    } catch {
      // Fallback below
    }
  }
  // Heuristic average character width for handwriting glyphs (including cursive slant)
  return Math.ceil(word.length * (fontSize * 0.48 + Math.max(0, letterSpacing)));
}

/**
 * Dynamically calculates text height and wraps lines to accurately
 * paginate text across discrete A4 notebook pages.
 */
export function paginateText(
  rawText: string,
  options: SplitTextOptions
): string[] {
  if (!rawText.trim()) {
    return [''];
  }

  const {
    lineHeight,
    fontSize = 20,
    fontFamily = "'Caveat', cursive",
    pageWidth = 794,
    pageHeight = 1123,
    paddingTop = 54,
    paddingBottom = 48,
    paddingLeft = 84,
    paddingRight = 48,
    letterSpacing = 0.5,
    wordSpacing = 2
  } = options;

  // Natural right-margin safety padding (prevents overflow and awkward edge-hugging)
  const rightMarginSafety = 28;
  const usableWidth = Math.max(260, pageWidth - paddingLeft - paddingRight - rightMarginSafety);
  const usableHeight = Math.max(300, pageHeight - paddingTop - paddingBottom);
  
  // Maximum lines that fit vertically on one A4 paper sheet
  const maxLinesPerPage = Math.max(10, Math.floor(usableHeight / lineHeight));

  // Check for explicit page breaks '--- Page Break ---'
  const rawSections = rawText.split(/(?:--- Page Break ---|--- page break ---)/);
  const finalPages: string[] = [];

  for (const section of rawSections) {
    const trimmedSection = section.trim();
    if (!trimmedSection) continue;

    // Split section into paragraphs
    const paragraphs = section.split('\n');
    let currentLines: string[] = [];
    let currentLineCount = 0;

    for (let pIdx = 0; pIdx < paragraphs.length; pIdx++) {
      const para = paragraphs[pIdx];

      // Empty line / paragraph spacing
      if (para.trim() === '') {
        if (currentLineCount + 1 >= maxLinesPerPage && currentLines.length > 0) {
          finalPages.push(currentLines.join('\n'));
          currentLines = [];
          currentLineCount = 0;
        } else {
          currentLines.push('');
          currentLineCount += 1;
        }
        continue;
      }

      // Break paragraph into wrapped lines based on usable width
      const words = para.split(/\s+/).filter(Boolean);
      let activeLineWords: string[] = [];
      let activeLineWidth = 0;
      const spaceWidth = getWordWidth(' ', fontSize, fontFamily, letterSpacing) + wordSpacing;

      for (let wIdx = 0; wIdx < words.length; wIdx++) {
        const word = words[wIdx];
        const wordWidth = getWordWidth(word, fontSize, fontFamily, letterSpacing) + wordSpacing;

        if (activeLineWords.length === 0) {
          activeLineWords.push(word);
          activeLineWidth = wordWidth;
        } else if (activeLineWidth + spaceWidth + wordWidth <= usableWidth) {
          activeLineWords.push(word);
          activeLineWidth += spaceWidth + wordWidth;
        } else {
          // Current line filled, push to current page
          const completedLine = activeLineWords.join(' ');
          currentLines.push(completedLine);
          currentLineCount += 1;

          // Check vertical boundary of A4 sheet
          if (currentLineCount >= maxLinesPerPage) {
            finalPages.push(currentLines.join('\n'));
            currentLines = [];
            currentLineCount = 0;
          }

          activeLineWords = [word];
          activeLineWidth = wordWidth;
        }
      }

      if (activeLineWords.length > 0) {
        currentLines.push(activeLineWords.join(' '));
        currentLineCount += 1;

        if (currentLineCount >= maxLinesPerPage && pIdx < paragraphs.length - 1) {
          finalPages.push(currentLines.join('\n'));
          currentLines = [];
          currentLineCount = 0;
        }
      }
    }

    if (currentLines.length > 0) {
      finalPages.push(currentLines.join('\n'));
    }
  }

  return finalPages.length > 0 ? finalPages : [''];
}
