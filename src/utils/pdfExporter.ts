import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface ExportPdfOptions {
  filename?: string;
  onProgress?: (progress: number, statusText: string) => void;
}

/**
 * Exports one or more HTML page elements to a high-resolution A4 PDF document.
 */
export async function exportElementsToPdf(
  elements: HTMLElement[],
  options?: ExportPdfOptions
): Promise<void> {
  const { filename = 'InkScript-Handwritten-Notes.pdf', onProgress } = options || {};

  if (!elements || elements.length === 0) {
    throw new Error('No pages available to export.');
  }

  // Create jsPDF instance in A4 portrait format
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true
  });

  const total = elements.length;

  for (let i = 0; i < total; i++) {
    const el = elements[i];

    if (onProgress) {
      const stepPercent = Math.round(((i) / total) * 90);
      onProgress(stepPercent, `Rendering handwritten page ${i + 1} of ${total}...`);
    }

    // Capture using html2canvas with high scale for 300DPI-like crisp text
    const canvas = await html2canvas(el, {
      scale: 2.5,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      logging: false,
      windowWidth: el.scrollWidth,
      windowHeight: el.scrollHeight
    });

    // JPEG at 95% quality for excellent visual fidelity with reasonable size
    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    if (i > 0) {
      pdf.addPage('a4', 'portrait');
    }

    // Standard A4 dimensions in mm: 210 x 297
    pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
  }

  if (onProgress) {
    onProgress(95, 'Finalizing PDF document...');
  }

  // Short delay so user perceives the completion
  await new Promise((resolve) => setTimeout(resolve, 200));

  pdf.save(filename);

  if (onProgress) {
    onProgress(100, 'Download complete!');
  }
}
