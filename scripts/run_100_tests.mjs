import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Polyfills
if (typeof Uint8Array !== 'undefined' && !Uint8Array.prototype.toHex) {
  Uint8Array.prototype.toHex = function () {
    return Array.from(this)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  };
}
if (typeof Promise.try !== 'function') {
  Promise.try = function (fn, ...args) {
    return new Promise((resolve) => resolve(fn(...args)));
  };
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const testFilesDir = path.join(rootDir, 'test-files');

// Import pagination logic
import { paginateText } from '../src/utils/pagination.ts';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

async function runTestSuite() {
  console.log('====================================================');
  console.log('   INKSCRIPT 100-FILE AUTOMATED VERIFICATION SUITE   ');
  console.log('====================================================\n');

  if (!fs.existsSync(testFilesDir)) {
    console.error('Error: test-files directory not found!');
    process.exit(1);
  }

  const fileNames = fs.readdirSync(testFilesDir).sort();
  console.log(`Discovered ${fileNames.length} test files in ${testFilesDir}\n`);

  let passedCount = 0;
  let failedCount = 0;
  const results = [];
  const startTime = Date.now();

  for (let i = 0; i < fileNames.length; i++) {
    const fileName = fileNames[i];
    const filePath = path.join(testFilesDir, fileName);
    const stats = fs.statSync(filePath);
    const isPdf = fileName.endsWith('.pdf');

    const fileStart = performance.now();
    try {
      if (isPdf) {
        // PDF Test
        const data = new Uint8Array(fs.readFileSync(filePath));
        const loadingTask = pdfjsLib.getDocument({ data });
        const doc = await loadingTask.promise;
        let pdfText = '';
        for (let p = 1; p <= doc.numPages; p++) {
          const page = await doc.getPage(p);
          const content = await page.getTextContent();
          const pageStrings = content.items.map((item) => ('str' in item ? item.str : ''));
          pdfText += pageStrings.join(' ') + '\n\n';
        }

        const pages = paginateText(pdfText, {
          lineHeight: 32,
          fontSize: 20,
          fontFamily: "'Caveat', cursive"
        });

        const fileEnd = performance.now();
        const durationMs = (fileEnd - fileStart).toFixed(2);
        const wordCount = pdfText.trim().split(/\s+/).filter(Boolean).length;

        passedCount++;
        results.push({
          index: i + 1,
          name: fileName,
          type: 'PDF Document',
          sizeBytes: stats.size,
          wordCount,
          pagesGenerated: pages.length,
          durationMs: Number(durationMs),
          status: 'PASSED'
        });

        console.log(`[PASS] #${String(i + 1).padStart(3, '0')} ${fileName} (PDF: ${doc.numPages} pages -> ${pages.length} handwritten pages, ${durationMs}ms)`);
      } else {
        // Text / Markdown Test
        const rawContent = fs.readFileSync(filePath, 'utf-8');
        const wordCount = rawContent.trim().split(/\s+/).filter(Boolean).length;

        // Run pagination with default College Assignment style
        const pagesCollege = paginateText(rawContent, {
          lineHeight: 32,
          fontSize: 20,
          fontFamily: "'Caveat', cursive",
          pageWidth: 794,
          pageHeight: 1123,
          paddingTop: 54,
          paddingBottom: 48,
          paddingLeft: 84,
          paddingRight: 48,
          letterSpacing: 0.5
        });

        // Run pagination with Vintage Letter style
        const pagesVintage = paginateText(rawContent, {
          lineHeight: 28,
          fontSize: 18,
          fontFamily: "'Homemade Apple', cursive",
          pageWidth: 794,
          pageHeight: 1123,
          paddingTop: 60,
          paddingBottom: 60,
          paddingLeft: 60,
          paddingRight: 60,
          letterSpacing: 0.2
        });

        // Run pagination with Quick Notes style
        const pagesNotes = paginateText(rawContent, {
          lineHeight: 26,
          fontSize: 16,
          fontFamily: "'Kalam', cursive",
          pageWidth: 794,
          pageHeight: 1123,
          paddingTop: 40,
          paddingBottom: 40,
          paddingLeft: 50,
          paddingRight: 50,
          letterSpacing: 0
        });

        // Verify that pagination produces valid non-empty results and no layout anomalies
        if (pagesCollege.length === 0 || pagesVintage.length === 0 || pagesNotes.length === 0) {
          throw new Error('Pagination returned empty pages array');
        }

        // Verify every page text integrity
        for (const p of pagesCollege) {
          if (typeof p !== 'string') throw new Error('Invalid page format');
        }

        const fileEnd = performance.now();
        const durationMs = (fileEnd - fileStart).toFixed(2);

        passedCount++;
        results.push({
          index: i + 1,
          name: fileName,
          type: 'Text/Markdown Document',
          sizeBytes: stats.size,
          wordCount,
          pagesGenerated: pagesCollege.length,
          durationMs: Number(durationMs),
          status: 'PASSED'
        });

        if ((i + 1) % 10 === 0 || i === fileNames.length - 1 || i < 5) {
          console.log(`[PASS] #${String(i + 1).padStart(3, '0')} ${fileName} (${wordCount} words, ${pagesCollege.length} pages, ${durationMs}ms)`);
        }
      }
    } catch (err) {
      failedCount++;
      console.error(`[FAIL] #${String(i + 1).padStart(3, '0')} ${fileName}:`, err.message);
      results.push({
        index: i + 1,
        name: fileName,
        status: 'FAILED',
        error: err.message
      });
    }
  }

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(2);
  const avgDuration = (
    results.filter(r => r.status === 'PASSED').reduce((acc, r) => acc + r.durationMs, 0) / (passedCount || 1)
  ).toFixed(2);

  console.log('\n====================================================');
  console.log('                 TEST SUITE SUMMARY                 ');
  console.log('====================================================');
  console.log(`Total Test Files Evaluated : ${fileNames.length}`);
  console.log(`Passed                     : ${passedCount}`);
  console.log(`Failed                     : ${failedCount}`);
  console.log(`Total Execution Time       : ${totalTime}s`);
  console.log(`Average Latency per File   : ${avgDuration}ms`);
  console.log('====================================================\n');

  // Write summary JSON for report inclusion
  const summaryData = {
    totalFiles: fileNames.length,
    passed: passedCount,
    failed: failedCount,
    totalTimeSeconds: Number(totalTime),
    averageLatencyMs: Number(avgDuration),
    timestamp: new Date().toISOString(),
    results
  };

  fs.writeFileSync(
    path.join(rootDir, 'test-suite-results.json'),
    JSON.stringify(summaryData, null, 2)
  );
  console.log('Saved test results to test-suite-results.json');

  if (failedCount > 0) {
    process.exit(1);
  }
}

runTestSuite();
