import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface ExportPdfOptions {
  filename?: string;
  scale?: number; // High DPI scale factor (default: 3 for crisp 300 DPI print quality)
  onProgress?: (progress: number, statusText: string) => void;
}

/**
 * Exports one or more HTML page elements into a single multi-page high-resolution A4 PDF document.
 */
export async function exportElementsToPdf(
  elements: HTMLElement[],
  options?: ExportPdfOptions
): Promise<void> {
  const {
    filename = 'InkScript-Handwritten-Notes.pdf',
    scale = 3,
    onProgress
  } = options || {};

  if (!elements || elements.length === 0) {
    throw new Error('No pages available to export.');
  }

  // Create jsPDF instance in A4 portrait format (210mm x 297mm)
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
      const stepPercent = Math.round((i / total) * 90);
      onProgress(stepPercent, `Rendering Page ${i + 1} of ${total}...`);
    }

    // Capture using html2canvas with high scale (3x) for ultra-sharp 300DPI text
    const canvas = await html2canvas(el, {
      scale: scale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      logging: false,
      onclone: (clonedDoc, clonedElement) => {
        const exportContainer = clonedDoc.getElementById('inkscript-export-container');
        if (exportContainer) {
          exportContainer.style.opacity = '1';
          exportContainer.style.position = 'static';
          exportContainer.style.left = '0';
          exportContainer.style.top = '0';
          exportContainer.style.zIndex = '1';
        }
        // Strip zoom scaling, outer margins and box shadows for clean print output
        clonedElement.style.position = 'static';
        clonedElement.style.left = '0';
        clonedElement.style.top = '0';
        clonedElement.style.opacity = '1';
        clonedElement.style.visibility = 'visible';
        clonedElement.style.transform = 'none';
        clonedElement.style.margin = '0';
        clonedElement.style.boxShadow = 'none';
        clonedElement.style.borderRadius = '0';
      }
    });

    // JPEG at 96% quality for high visual fidelity
    const imgData = canvas.toDataURL('image/jpeg', 0.96);

    // Free canvas GPU memory
    canvas.width = 0;
    canvas.height = 0;

    if (i > 0) {
      pdf.addPage('a4', 'portrait');
    }

    // Standard A4 dimensions in mm: 210 x 297
    pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
  }

  if (onProgress) {
    onProgress(95, 'Compiling and saving multi-page PDF document...');
  }

  // Brief pause for browser rendering
  await new Promise((resolve) => setTimeout(resolve, 250));

  pdf.save(filename);

  if (onProgress) {
    onProgress(100, `Successfully downloaded ${total} ${total === 1 ? 'page' : 'pages'}!`);
  }
}
