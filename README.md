# InkScript — Handwriting Studio ✍️📄

**InkScript** is a modern, responsive Single Page Application (SPA) that transforms typed text and PDF documents into realistic handwritten notebook pages, ready for preview, printing, and high-resolution PDF download.

---

## 🚀 Features

- **Split-Screen Studio Layout:**
  - **Left Panel (Control & Editor):**
    - **Upload & Text:** Multi-line editor with drag-and-drop PDF extraction (powered by `pdfjs-dist`), quick sample essays/lectures, word & character counters, and manual page break insertion (`--- Page Break ---`).
    - **Style & Paper:** 8 notebook paper styles (Standard Ruled, College Ruled, Graph / Grid, Dot Matrix, Yellow Legal Pad, Aged Parchment, Blank, Dark Slate Grid), 12 curated Google handwriting fonts, realistic ink palettes (Royal Gel Blue, Ballpoint Black, Navy Fountain, Teacher Red, Graphite, Emerald, Antique Sepia, and custom hex picker), and precise typography & geometry sliders.
    - **Custom Font:** Dynamic uploader for `.ttf`, `.otf`, `.woff`, and `.woff2` font files using the browser `FontFace` API with live testing sandbox and status badges.
  - **Right Panel (Live Paper Preview):**
    - Proportional A4 paper view (210 × 297mm) with realistic notebook drop shadows, texture grain, vertical red margin rule, 3-hole binder punches or spiral binding, and realistic organic word angle jitter.
    - Page navigator (Page X of Y, Previous / Next), zoom controls (50% to 140%, Reset), and "Single Page" vs "All Pages" view.
- **Export & Print:**
  - High-resolution A4 multi-page PDF export via `html2canvas` + `jspdf` with 2.5x crisp DPI scaling and real-time progress feedback.
  - Direct browser printing with `@media print` layout formatting.
- **Quick Presets:**
  - 1-click presets: *Student Notebook*, *Architect Grid*, *Legal Memo*, *Vintage Letter*, and *Bullet Journal*.

---

## 🛠️ Tech Stack

- **Framework:** React 19 + TypeScript + Vite 8
- **Styling:** Tailwind CSS v4 + Lucide React
- **Document Processing:** `pdfjs-dist` (PDF text extraction), `jspdf` & `html2canvas` (PDF generation)
- **Typography:** Google Fonts (`Caveat`, `Kalam`, `Patrick Hand`, `Indie Flower`, `Shadows Into Light`, `Dancing Script`, `Architects Daughter`, `Homemade Apple`, `Sacramento`, `Gochi Hand`, `Nanum Pen Script`, `Reenie Beanie`) + Native `FontFace` loader for custom files.

---

## 📦 Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Start the development server
```bash
npm run dev
```

### 3. Build for production
```bash
npm run build
```

### 4. Preview the production build
```bash
npm run preview
```
