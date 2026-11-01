export interface SplitTextOptions {
  lineHeight: number;
  pageHeight?: number; // default A4 pixel height ~1123
  paddingTop?: number;
  paddingBottom?: number;
}

/**
 * Splits text into discrete pages suited for A4 notebook paper.
 * Supports explicit page breaks '--- Page Break ---' as well as
 * line-count based pagination.
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
    pageHeight = 1123,
    paddingTop = 54,
    paddingBottom = 48
  } = options;

  // Approximate maximum lines per page based on line-height and printable area
  const availableHeight = Math.max(300, pageHeight - paddingTop - paddingBottom);
  const maxLinesPerPage = Math.max(12, Math.floor(availableHeight / lineHeight));

  // Check if explicit page breaks exist from PDF import
  if (rawText.includes('--- Page Break ---')) {
    const rawPages = rawText.split(/--- Page Break ---/);
    const result: string[] = [];
    for (const p of rawPages) {
      const trimmed = p.trim();
      if (trimmed) {
        // If a single page from PDF has too many lines, break it further
        const subPages = paginateByLines(trimmed, maxLinesPerPage);
        result.push(...subPages);
      }
    }
    return result.length > 0 ? result : [''];
  }

  return paginateByLines(rawText, maxLinesPerPage);
}

function paginateByLines(text: string, maxLinesPerPage: number): string[] {
  const paragraphs = text.split('\n');
  const pages: string[] = [];
  let currentLines: string[] = [];
  let currentEstimatedLineCount = 0;

  for (const para of paragraphs) {
    // Empty line counts as 1 line of vertical space
    if (para.trim() === '') {
      if (currentEstimatedLineCount + 1 > maxLinesPerPage && currentLines.length > 0) {
        pages.push(currentLines.join('\n'));
        currentLines = [];
        currentEstimatedLineCount = 0;
      } else {
        currentLines.push('');
        currentEstimatedLineCount += 1;
      }
      continue;
    }

    // Estimate number of wrapped lines for this paragraph
    // At ~60-70 characters per line in A4 ruled margins
    const approxCharsPerLine = 60;
    const estimatedWrappedLines = Math.max(1, Math.ceil(para.length / approxCharsPerLine));

    if (currentEstimatedLineCount + estimatedWrappedLines > maxLinesPerPage && currentLines.length > 0) {
      // If paragraph itself is huge, break it into chunks
      if (estimatedWrappedLines > maxLinesPerPage) {
        const words = para.split(' ');
        let tempLine = '';
        for (const w of words) {
          if ((tempLine + ' ' + w).length > approxCharsPerLine) {
            currentLines.push(tempLine);
            currentEstimatedLineCount += 1;
            tempLine = w;

            if (currentEstimatedLineCount >= maxLinesPerPage) {
              pages.push(currentLines.join('\n'));
              currentLines = [];
              currentEstimatedLineCount = 0;
            }
          } else {
            tempLine = tempLine ? `${tempLine} ${w}` : w;
          }
        }
        if (tempLine) {
          currentLines.push(tempLine);
          currentEstimatedLineCount += 1;
        }
      } else {
        pages.push(currentLines.join('\n'));
        currentLines = [para];
        currentEstimatedLineCount = estimatedWrappedLines;
      }
    } else {
      currentLines.push(para);
      currentEstimatedLineCount += estimatedWrappedLines;
    }
  }

  if (currentLines.length > 0) {
    pages.push(currentLines.join('\n'));
  }

  return pages.length > 0 ? pages : [''];
}
