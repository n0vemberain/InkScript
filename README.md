# InkScript

InkScript is a modern, responsive Single Page Application (SPA) designed to convert typed text and PDF documents into realistic handwritten notebook pages. The system provides client-side document parsing, real-time two-way synchronization, dynamic A4 auto-pagination, authentic paper and ink simulation, and high-resolution multi-page PDF generation.

---

## Key Features

### 1. Client-Side PDF Text Extraction
- In-browser PDF text parsing powered by `pdfjs-dist` with zero server transmission.
- Drag-and-drop file upload zone supporting files up to 20MB.
- Automatic paragraph and line-coordinate reconstruction preserving multi-page structure.
- Formatted page breaks (`--- Page Break ---`) automatically converted to discrete handwritten sheets.
- Graceful error detection for password-protected, encrypted, corrupted, or scanned image-only PDFs.
- Shimmer skeleton loader providing visual feedback during document extraction.

### 2. Live Two-Way Text Synchronization
- Instant bi-directional state synchronization between the multi-line editor and the paper preview.
- Real-time document metrics: character count, word count, estimated reading time, and estimated handwritten page count.
- Dedicated action buttons for inserting manual page breaks, clearing text, or loading instant sample texts.

### 3. Realistic Notebook Simulation
- **Authentic Paper Surfaces:**
  - **Lined / Ruled Paper:** Classic notebook blue lines synchronized with text line-height, accompanied by a distinct red left-margin rule.
  - **Plain White A4:** Clean ivory surface with subtle procedural paper grain texture (SVG noise filter).
  - **Grid / Graph Paper:** Precision technical graph grid for mathematical notes and diagrams.
  - **Vintage / Yellow Parchment:** Warm antique parchment surface with sepia tones and aged edge vignette.
- **Realistic Pen Inks:**
  - Royal Blue Ballpoint (`#1a365d`)
  - Gel Black (`#18181b`)
  - Classic Ink Pen (`#0f2b5c`)
  - Pencil Graphite (`#3f3f46`)
  - Custom hex color picker for specialized ink shades.

### 4. Handwriting Humanization (Jitter Effect)
- **Natural Handwriting Variance Toggle:**
  - Micro-rotation between -0.4 degrees and +0.4 degrees on individual words.
  - Baseline displacement within a +/- 1px tolerance.
  - Subtle opacity modulation (+/- 0.05 around base opacity) simulating realistic fountain and ballpoint ink flow variations.
  - Deterministic 32-bit hashing algorithm ensuring authentic organic variation without causing browser layout shifts (zero CLS).

### 5. Custom Font Engine
- Upload custom font files in `.ttf`, `.otf`, `.woff`, or `.woff2` formats.
- Dynamic font registration directly into browser runtime via the native `FontFace` API.
- Immediate live preview application with active font management.
- Built-in fallback Google Handwriting Fonts: Caveat, Kalam, Homemade Apple, Patrick Hand, Indie Flower, Shadows Into Light, Dancing Script, and Architects Daughter.

### 6. Dynamic A4 Auto-Pagination & Navigation
- Precise dimensional calculations based on A4 standards (210mm x 297mm; 794px x 1123px at 96 DPI).
- Automatically splits continuous text across multiple pages when content exceeds vertical printable boundaries.
- Interactive navigation: single-page view with page thumbnail strip, alongside continuous vertical scroll mode.

### 7. High-Resolution Multi-Page PDF Export
- Export multi-page documents as standard A4 PDFs using `jsPDF` and `html2canvas`.
- High-DPI capture (scale factor: 3.0) producing crisp 300 DPI print-ready output without text pixelation.
- Sequential rendering pipeline with live modal progress feedback (e.g., "Rendering Page 2 of 5...").
- Direct browser printing integration configured with `@media print` stylesheets.

---

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| Framework | React 19, TypeScript, Vite 8 |
| Styling | Tailwind CSS v4, Lucide React (Icons) |
| PDF Extraction | pdfjs-dist |
| PDF Generation | jsPDF, html2canvas |
| Typography | Google Fonts, Native FontFace API |

---

## Project Structure

```text
HandWritting/
├── index.html                     # Application entry HTML
├── package.json                   # Dependencies and build scripts
├── tsconfig.json                  # TypeScript configuration
├── vite.config.ts                 # Vite bundler configuration
├── src/
│   ├── main.tsx                   # React root entrypoint
│   ├── App.tsx                    # Main layout and global state orchestration
│   ├── index.css                  # Tailwind styles and paper textures
│   ├── types/
│   │   └── index.ts               # Core TypeScript interfaces and types
│   ├── constants/
│   │   └── presets.ts             # Paper styles, ink colors, themes, sample text
│   ├── utils/
│   │   ├── fontLoader.ts          # Custom font loading via FontFace API
│   │   ├── pagination.ts          # Dynamic text measurement and A4 auto-pagination
│   │   ├── pdfExporter.ts         # High-resolution multi-page PDF export
│   │   └── pdfParser.ts           # Browser-based PDF text extraction with polyfills
│   └── components/
│       ├── Toolbar.tsx            # Header actions, presets, view toggle, export
│       ├── PdfConverter.tsx       # PDF dropzone, text editor, live metrics
│       ├── StylePanel.tsx         # Paper type, ink colors, typography sliders
│       ├── FontUploader.tsx       # Custom font uploader and interactive sandbox
│       └── PaperPreview.tsx       # A4 paper canvas, jitter effect, thumbnails
```

---

## Quick Action Presets

The studio includes curated presets accessible with a single click:

- **College Assignment:** Ruled lined paper with Royal Blue ballpoint ink, red left margin line, and active handwriting variance.
- **Personal Letter:** Warm vintage parchment with Classic Ink Pen dark blue shading and Homemade Apple cursive script.
- **Quick Notes:** Plain White A4 paper with Gel Black ink and compact spacing.
- **Architect Grid:** Technical graph grid paper with Pencil Graphite styling and architectural lettering.

---

## Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
- npm (v9.0.0 or higher)

### Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/n0vemberain/InkScript.git
cd InkScript
npm install
```

### Development
Start the local development server with hot module replacement:
```bash
npm run dev
```

### Production Build
Compile and bundle the project for production:
```bash
npm run build
```

### Preview Production Build
Serve the production build locally to test performance and assets:
```bash
npm run preview
```

### Automated 100-File Test Suite
Execute the automated test suite across all 100 benchmark documents:
```bash
node scripts/run_100_tests.mjs
```

---

## Audit Report and Documentation

For a complete button-by-button inventory, responsiveness review, settings necessity assessment, and 100-file benchmark statistics, see [AUDIT_REPORT.md](AUDIT_REPORT.md).

---

## License

This project is licensed under the MIT License.
