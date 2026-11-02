// Standard browser polyfills for modern TypedArray & Promise features required by recent pdfjs-dist builds
if (typeof Uint8Array !== 'undefined' && !(Uint8Array.prototype as any).toHex) {
  (Uint8Array.prototype as any).toHex = function () {
    return Array.from(this)
      .map((b: any) => b.toString(16).padStart(2, '0'))
      .join('');
  };
}

if (typeof (Promise as any).try !== 'function') {
  (Promise as any).try = function (fn: (...args: any[]) => any, ...args: any[]) {
    return new Promise((resolve) => resolve(fn(...args)));
  };
}

import * as pdfjsLib from 'pdfjs-dist';

// Setup worker for browser environment
if (typeof window !== 'undefined') {
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.mjs',
      import.meta.url
    ).toString();
  } catch {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.10.38'}/pdf.worker.min.mjs`;
  }
}

export class PdfEncryptedError extends Error {
  constructor(message = 'This PDF document is encrypted or password-protected. Please provide an unlocked document.') {
    super(message);
    this.name = 'PdfEncryptedError';
  }
}

export class PdfEmptyError extends Error {
  constructor(message = 'No extractable text was found in this PDF. It appears to be a scanned document or image-only file.') {
    super(message);
    this.name = 'PdfEmptyError';
  }
}

export class PdfCorruptedError extends Error {
  constructor(message = 'Could not read PDF. The file may be corrupted or is not a valid PDF document.') {
    super(message);
    this.name = 'PdfCorruptedError';
  }
}

export interface PdfExtractProgress {
  percent: number;
  currentPage: number;
  totalPages: number;
  stage: 'loading' | 'extracting' | 'formatting';
}

export interface PdfExtractResult {
  text: string;
  pageCount: number;
  wordCount: number;
  charCount: number;
  pages: string[];
}

export async function extractTextFromPdf(
  file: File,
  onProgress?: (progress: PdfExtractProgress) => void,
  abortSignal?: AbortSignal
): Promise<PdfExtractResult> {
  // Validate file size (max 20MB)
  const MAX_FILE_SIZE = 20 * 1024 * 1024;
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File exceeds the 20MB limit. Please upload a PDF under 20MB.');
  }

  // Validate MIME / extension
  const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
  if (!isPdf) {
    throw new Error('Invalid file format. Please upload a valid .pdf document.');
  }

  if (onProgress) {
    onProgress({
      percent: 5,
      currentPage: 0,
      totalPages: 0,
      stage: 'loading'
    });
  }

  const arrayBuffer = await file.arrayBuffer();

  if (abortSignal?.aborted) {
    throw new Error('Extraction cancelled by user.');
  }

  let loadingTask: ReturnType<typeof pdfjsLib.getDocument>;

  try {
    loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/cmaps/',
      cMapPacked: true,
      standardFontDataUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/standard_fonts/'
    });

    loadingTask.onPassword = () => {
      throw new PdfEncryptedError();
    };
  } catch (err: any) {
    if (err?.name === 'PasswordException' || err?.message?.toLowerCase().includes('password')) {
      throw new PdfEncryptedError();
    }
    throw new PdfCorruptedError();
  }

  let pdfDoc: pdfjsLib.PDFDocumentProxy;

  try {
    pdfDoc = await loadingTask.promise;
  } catch (err: any) {
    if (err instanceof PdfEncryptedError) throw err;
    if (
      err?.name === 'PasswordException' ||
      err?.message?.toLowerCase().includes('password') ||
      err?.message?.toLowerCase().includes('encrypted')
    ) {
      throw new PdfEncryptedError();
    }
    if (err?.name === 'InvalidPDFException' || err?.message?.toLowerCase().includes('invalid pdf')) {
      throw new PdfCorruptedError();
    }
    throw new PdfCorruptedError(err?.message || 'Failed to open PDF document.');
  }

  const numPages = pdfDoc.numPages;
  const pageTexts: string[] = [];

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    if (abortSignal?.aborted) {
      loadingTask.destroy();
      throw new Error('Extraction cancelled by user.');
    }

    if (onProgress) {
      const percent = Math.round(10 + (pageNum / numPages) * 80);
      onProgress({
        percent,
        currentPage: pageNum,
        totalPages: numPages,
        stage: 'extracting'
      });
    }

    const page = await pdfDoc.getPage(pageNum);
    const textContent = await page.getTextContent();

    const items = textContent.items as Array<{
      str: string;
      transform: number[];
      hasEOL?: boolean;
    }>;

    let lastY: number | null = null;
    let pageString = '';

    for (const item of items) {
      if (!item.str && !item.hasEOL) continue;

      const currentY = item.transform ? Math.round(item.transform[5]) : null;

      if (lastY !== null && currentY !== null && Math.abs(currentY - lastY) > 5) {
        pageString += '\n';
      } else if (pageString.length > 0 && !pageString.endsWith(' ') && !pageString.endsWith('\n')) {
        pageString += ' ';
      }

      pageString += item.str;
      if (currentY !== null) {
        lastY = currentY;
      }
    }

    const trimmed = pageString.trim();
    if (trimmed) {
      pageTexts.push(trimmed);
    }
  }

  if (onProgress) {
    onProgress({
      percent: 95,
      currentPage: numPages,
      totalPages: numPages,
      stage: 'formatting'
    });
  }

  if (pageTexts.length === 0) {
    throw new PdfEmptyError();
  }

  // Join pages with clean Page Break delimiter
  const fullText = pageTexts.join('\n\n--- Page Break ---\n\n');
  const words = fullText.trim().split(/\s+/).filter(Boolean);

  if (onProgress) {
    onProgress({
      percent: 100,
      currentPage: numPages,
      totalPages: numPages,
      stage: 'formatting'
    });
  }

  return {
    text: fullText,
    pageCount: numPages,
    wordCount: words.length,
    charCount: fullText.length,
    pages: pageTexts
  };
}
