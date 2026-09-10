import * as XLSX from "xlsx";
import { GrammatariSavedRecord } from "../types";

/**
 * Clean helper to format Greek date
 */
function formatGreekDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString("el-GR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return isoString;
  }
}

/**
 * Export a single Grammatari Research Record to a full-featured Excel (.xlsx) file
 */
export function exportGrammatariRecordToExcel(record: GrammatariSavedRecord): void {
  const wb = XLSX.utils.book_new();

  // 1. Summary Sheet
  const summaryData = [
    ["ΕΦΑΡΜΟΓΗ", "Λεξάριθμος - Αρχαία Ελληνική Ισοψηφία & Γραμματάρι"],
    ["ΤΙΤΛΟΣ ΕΡΕΥΝΑΣ", record.title || `Γραμματάρι: ${record.sourcePhrase}`],
    ["ΑΡΧΙΚΗ ΛΕΞΗ / ΦΡΑΣΗ", record.sourcePhrase],
    ["ΙΣΟΨΗΦΙΚΗ ΤΙΜΗ (ΛΕΞΑΡΙΘΜΟΣ)", record.sourceIsopsephy],
    ["ΠΥΘΑΓΟΡΕΙΟΣ ΠΥΘΜΕΝΑΣ (1-9)", record.sourcePythmen],
    ["ΗΜΕΡΟΜΗΝΙΑ ΕΡΕΥΝΑΣ", formatGreekDate(record.createdAt)],
    ["ΣΥΝΟΛΟ ΔΙΑΘΕΣΙΜΩΝ ΓΡΑΜΜΑΤΩΝ", record.totalLetters],
    ["ΟΡΙΑ ΜΗΚΟΥΣ ΓΡΑΜΜΑΤΩΝ", `${record.minLen} έως ${record.maxLen} γράμματα`],
    ["ΣΥΝΟΛΟ ΕΥΡΗΜΑΤΩΝ (ΛΕΞΕΩΝ)", record.totalMatches],
    ["ΣΗΜΕΙΩΣΕΙΣ ΕΡΕΥΝΗΤΗ", record.notes || "—"],
    [],
    ["ΑΠΟΘΕΜΑ & ΣΥΧΝΟΤΗΤΑ ΓΡΑΜΜΑΤΩΝ"],
    ["Γράμμα", "Πλήθος Εμφανίσεων"],
    ...record.availableLetters.map((l) => [l.letter, l.count]),
  ];

  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, wsSummary, "Σύνοψη Έρευνας");

  // 2. All Matches Master Sheet
  const allMatchesRows: any[] = [];
  const lengths = Object.keys(record.matchesByLength)
    .map(Number)
    .sort((a, b) => a - b);

  lengths.forEach((len) => {
    const list = record.matchesByLength[len] || [];
    list.forEach((m) => {
      allMatchesRows.push({
        "Μήκος (Γράμματα)": m.length,
        "Λέξη": m.word,
        "Ισοψηφία (Λεξάριθμος)": m.isopsephy,
        "Πυθμένας (Ρίζα)": m.pythmen,
        "Ανάλυση Γραμμάτων": m.letterBreakdown,
        "Αρχική Φράση Πηγής": record.sourcePhrase,
      });
    });
  });

  const wsAllMatches = XLSX.utils.json_to_sheet(allMatchesRows);
  XLSX.utils.book_append_sheet(wb, wsAllMatches, "Όλες οι Λέξεις");

  // 3. Separate sheet for each word length
  lengths.forEach((len) => {
    const list = record.matchesByLength[len] || [];
    if (list.length > 0) {
      const sheetRows = list.map((m, idx) => ({
        "Α/Α": idx + 1,
        "Λέξη": m.word,
        "Μήκος": m.length,
        "Ισοψηφία": m.isopsephy,
        "Πυθμένας": m.pythmen,
        "Ανάλυση": m.letterBreakdown,
      }));
      const wsLen = XLSX.utils.json_to_sheet(sheetRows);
      XLSX.utils.book_append_sheet(wb, wsLen, `${len} Γράμματα (${list.length})`);
    }
  });

  // Write file
  const safeTitle = record.sourcePhrase
    .replace(/[^Α-Ωα-ωa-zA-Z0-9]/g, "_")
    .substring(0, 30);
  XLSX.writeFile(wb, `ΓΡΑΜΜΑΤΑΡΙ_${safeTitle}_${Date.now()}.xlsx`);
}

/**
 * Export all database records into one comprehensive Excel workbook
 */
export function exportAllGrammatariDatabaseToExcel(records: GrammatariSavedRecord[]): void {
  if (!records || records.length === 0) return;

  const wb = XLSX.utils.book_new();

  // Master overview of all saved phrases
  const summaryRows = records.map((r, i) => ({
    "Α/Α": i + 1,
    "Αρχική Φράση / Λέξη": r.sourcePhrase,
    "Ισοψηφία Φράσης": r.sourceIsopsephy,
    "Πυθμένας Φράσης": r.sourcePythmen,
    "Σύνολο Γραμμάτων": r.totalLetters,
    "Εύρος Μήκους": `${r.minLen}-${r.maxLen}`,
    "Σύνολο Ευρεθεισών Λέξεων": r.totalMatches,
    "Ημερομηνία Αποθήκευσης": formatGreekDate(r.createdAt),
    "Σημειώσεις": r.notes || "",
  }));

  const wsOverview = XLSX.utils.json_to_sheet(summaryRows);
  XLSX.utils.book_append_sheet(wb, wsOverview, "Ευρετήριο Ερευνών");

  // Flat list of all findings across all records
  const allFindings: any[] = [];
  records.forEach((r) => {
    Object.values(r.matchesByLength).forEach((list) => {
      list.forEach((m) => {
        allFindings.push({
          "Αρχική Φράση": r.sourcePhrase,
          "Μήκος": m.length,
          "Λέξη": m.word,
          "Ισοψηφία": m.isopsephy,
          "Πυθμένας": m.pythmen,
          "Ανάλυση": m.letterBreakdown,
          "Ημερομηνία": formatGreekDate(r.createdAt),
        });
      });
    });
  });

  const wsFindings = XLSX.utils.json_to_sheet(allFindings);
  XLSX.utils.book_append_sheet(wb, wsFindings, "Όλα τα Ευρήματα");

  XLSX.writeFile(wb, `ΒΑΣΗ_ΔΕΔΟΜΕΝΩΝ_ΓΡΑΜΜΑΤΑΡΙ_${Date.now()}.xlsx`);
}

/**
 * Export single Grammatari record to clean CSV file with UTF-8 BOM
 */
export function exportGrammatariRecordToCsv(record: GrammatariSavedRecord): void {
  const lines: string[] = [];

  lines.push(`"ΓΡΑΜΜΑΤΑΡΙ - ΑΝΑΛΥΣΗ ΥΠΟ-ΑΝΑΓΡΑΜΜΑΤΙΣΜΩΝ"`);
  lines.push(`"Αρχική Φράση / Λέξη:","${record.sourcePhrase}"`);
  lines.push(`"Ισοψηφία Φράσης:","${record.sourceIsopsephy}"`);
  lines.push(`"Πυθμένας Φράσης:","${record.sourcePythmen}"`);
  lines.push(`"Σύνολο Γραμμάτων:","${record.totalLetters}"`);
  lines.push(`"Σύνολο Ευρημάτων:","${record.totalMatches}"`);
  lines.push(`"Ημερομηνία:","${formatGreekDate(record.createdAt)}"`);
  lines.push("");
  lines.push(`"ΜΗΚΟΣ","ΛΕΞΗ","ΙΣΟΨΗΦΙΑ","ΠΥΘΜΕΝΑΣ","ΑΝΑΛΥΣΗ ΓΡΑΜΜΑΤΩΝ","ΑΡΧΙΚΗ ΦΡΑΣΗ"`);

  const lengths = Object.keys(record.matchesByLength)
    .map(Number)
    .sort((a, b) => a - b);

  lengths.forEach((len) => {
    const list = record.matchesByLength[len] || [];
    list.forEach((m) => {
      lines.push(
        `"${m.length}","${m.word}","${m.isopsephy}","${m.pythmen}","${m.letterBreakdown}","${record.sourcePhrase}"`
      );
    });
  });

  const csvContent = "\uFEFF" + lines.join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const safeTitle = record.sourcePhrase.replace(/[^Α-Ωα-ωa-zA-Z0-9]/g, "_").substring(0, 30);
  a.download = `ΓΡΑΜΜΑΤΑΡΙ_${safeTitle}_${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Generate a beautifully styled, high-resolution printable report (Print / Save as PDF)
 * that produces a flawless vector PDF with full Greek typography, headers, statistics,
 * and multi-column tables.
 */
export function printOrExportGrammatariToPdf(record: GrammatariSavedRecord): void {
  const lengths = Object.keys(record.matchesByLength)
    .map(Number)
    .sort((a, b) => a - b);

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Παρακαλούμε επιτρέψτε τα αναδυόμενα παράθυρα (popups) για την εξαγωγή PDF/Εκτύπωση.");
    return;
  }

  const html = `
    <!DOCTYPE html>
    <html lang="el">
    <head>
      <meta charset="UTF-8">
      <title>Γραμματάρι - ${record.sourcePhrase} (Έκθεση Έρευνας)</title>
      <style>
        @page {
          size: A4;
          margin: 15mm 15mm 15mm 15mm;
        }
        body {
          font-family: 'Times New Roman', 'Garamond', Georgia, serif;
          color: #1a1a1a;
          background: #ffffff;
          margin: 0;
          padding: 20px;
          line-height: 1.4;
        }
        .header {
          border-bottom: 2px solid #8b6b23;
          padding-bottom: 12px;
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }
        .logo-title {
          font-size: 22px;
          font-weight: bold;
          color: #63470d;
          letter-spacing: 1px;
        }
        .subtitle {
          font-size: 13px;
          color: #555;
          margin-top: 4px;
        }
        .meta-box {
          background: #fbf9f4;
          border: 1px solid #e2d7c0;
          border-radius: 8px;
          padding: 14px 18px;
          margin-bottom: 24px;
        }
        .meta-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px 24px;
          font-size: 13.5px;
        }
        .meta-item strong {
          color: #3e2e1c;
        }
        .highlight-phrase {
          font-size: 19px;
          font-weight: bold;
          color: #795713;
          letter-spacing: 1.5px;
        }
        .letters-bar {
          margin-top: 10px;
          padding-top: 8px;
          border-top: 1px dashed #d5c8ad;
          font-size: 13px;
        }
        .letter-pill {
          display: inline-block;
          background: #ede6d6;
          border: 1px solid #cfc2a5;
          padding: 2px 7px;
          border-radius: 4px;
          margin-right: 5px;
          margin-bottom: 4px;
          font-family: monospace;
          font-weight: bold;
        }
        h2.section-title {
          font-size: 16px;
          color: #4a381e;
          border-bottom: 1.5px solid #d5c8ad;
          padding-bottom: 5px;
          margin-top: 24px;
          margin-bottom: 12px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 18px;
          font-size: 12.5px;
          page-break-inside: avoid;
        }
        th {
          background: #f0eae0;
          color: #3b2c15;
          text-align: left;
          padding: 6px 10px;
          border: 1px solid #d2c5af;
          font-weight: bold;
        }
        td {
          padding: 5.5px 10px;
          border: 1px solid #e0d7c7;
        }
        tr:nth-child(even) {
          background: #faf7f2;
        }
        .word-cell {
          font-weight: bold;
          color: #1a1a1a;
          letter-spacing: 0.5px;
        }
        .isop-cell {
          font-family: monospace;
          font-weight: bold;
          text-align: right;
          color: #63470d;
        }
        .pyth-cell {
          font-family: monospace;
          text-align: center;
        }
        .footer {
          margin-top: 30px;
          border-top: 1px solid #ddd;
          padding-top: 10px;
          text-align: center;
          font-size: 11px;
          color: #777;
        }
        @media print {
          body {
            padding: 0;
          }
          .no-print {
            display: none !important;
          }
        }
      </style>
    </head>
    <body>
      <div class="no-print" style="background:#f4ece1; padding:12px 20px; border-radius:6px; margin-bottom:20px; display:flex; justify-content:space-between; align-items:center; border:1px solid #d5c4a1;">
        <div>
          <strong style="color:#63470d; font-size:15px;">Έτοιμο για Εκτύπωση & Αποθήκευση PDF</strong>
          <div style="font-size:12px; color:#666;">Επιλέξτε «Αποθήκευση ως PDF» στον διάλογο εκτύπωσης του περιηγητή σας.</div>
        </div>
        <button onclick="window.print()" style="background:#8b6b23; color:#fff; font-weight:bold; border:none; padding:8px 18px; border-radius:6px; cursor:pointer; font-size:13px;">
          🖨️ Εκτύπωση / Αποθήκευση ως PDF
        </button>
      </div>

      <div class="header">
        <div>
          <div class="logo-title">ΓΡΑΜΜΑΤΑΡΙ — ΕΚΘΕΣΗ ΥΠΟ-ΑΝΑΓΡΑΜΜΑΤΙΣΜΩΝ</div>
          <div class="subtitle">ΙΩΑΝΝΗΣ ΒΕΛΟΥΔΟΣ — ΕΓΩ ΕΙΜΙ | Αρχαία Ελληνική Ισοψηφία &amp; Λεξαριθμική Έρευνα</div>
        </div>
        <div style="text-align:right; font-size:12px; color:#666;">
          <div>${formatGreekDate(record.createdAt)}</div>
        </div>
      </div>

      <div class="meta-box">
        <div style="margin-bottom: 12px;">
          <span style="font-size:12px; color:#777; text-transform:uppercase;">Αρχική Φράση Αναφοράς:</span>
          <div class="highlight-phrase">${record.sourcePhrase}</div>
        </div>
        <div class="meta-grid">
          <div class="meta-item"><strong>Ισοψηφία Φράσης (Λεξάριθμος):</strong> ${record.sourceIsopsephy}</div>
          <div class="meta-item"><strong>Πυθαγόρειος Πυθμένας:</strong> ${record.sourcePythmen}</div>
          <div class="meta-item"><strong>Σύνολο Γραμμάτων:</strong> ${record.totalLetters}</div>
          <div class="meta-item"><strong>Συνολικά Ευρήματα (Λέξεις):</strong> ${record.totalMatches}</div>
        </div>
        <div class="letters-bar">
          <strong>Διαθέσιμο Απόθεμα Γραμμάτων:</strong>
          <div style="margin-top:5px;">
            ${record.availableLetters
              .map((l) => `<span class="letter-pill">${l.letter} ×${l.count}</span>`)
              .join("")}
          </div>
        </div>
      </div>

      ${lengths
        .map((len) => {
          const list = record.matchesByLength[len] || [];
          if (list.length === 0) return "";
          return `
            <h2 class="section-title">Λέξεις με ${len} Γράμματα (${list.length} ${list.length === 1 ? "λέξη" : "λέξεις"})</h2>
            <table>
              <thead>
                <tr>
                  <th style="width: 25%;">Λέξη</th>
                  <th style="width: 15%; text-align: right;">Ισοψηφία</th>
                  <th style="width: 12%; text-align: center;">Πυθμένας</th>
                  <th style="width: 48%;">Ανάλυση Γραμμάτων</th>
                </tr>
              </thead>
              <tbody>
                ${list
                  .map(
                    (m) => `
                  <tr>
                    <td class="word-cell">${m.word}</td>
                    <td class="isop-cell">${m.isopsephy}</td>
                    <td class="pyth-cell">${m.pythmen}</td>
                    <td style="color:#555; font-family: monospace; font-size: 11.5px;">${m.letterBreakdown}</td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
          `;
        })
        .join("")}

      <div class="footer">
        Εξήχθη αυτόματα από το <strong>Γραμματάρι</strong> | Εφαρμογή «Λεξάριθμος - Ιωάννης Βελούδος»
      </div>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
