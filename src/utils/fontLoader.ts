import type { CustomFontInfo } from '../types';

export async function loadCustomFontFile(file: File): Promise<CustomFontInfo> {
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  const validExtensions = ['ttf', 'otf', 'woff', 'woff2'];

  if (!validExtensions.includes(ext)) {
    throw new Error(`Unsupported font file format (.${ext}). Please upload a .ttf, .otf, .woff, or .woff2 file.`);
  }

  // Generate safe sanitized font identifier
  const cleanBaseName = file.name
    .replace(/\.[^/.]+$/, '')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .slice(0, 24);
  const uniqueId = `custom-font-${Date.now()}`;
  const fontFamily = `Custom_${cleanBaseName}_${Date.now()}`;

  const arrayBuffer = await file.arrayBuffer();

  // Create FontFace instance
  const fontFace = new FontFace(fontFamily, arrayBuffer);
  const loadedFace = await fontFace.load();

  // Add to browser's document.fonts
  document.fonts.add(loadedFace);

  return {
    id: uniqueId,
    name: file.name.replace(/\.[^/.]+$/, ''),
    fontFamily: `"${fontFamily}", cursive`,
    fileSize: file.size,
    format: ext.toUpperCase(),
    addedAt: Date.now()
  };
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
