import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportToExcel = (rows, fileName, sheetName = "Sheet1") => {
  const exportRows = Array.isArray(rows) ? rows : [];
  const headers = Array.from(
    exportRows.reduce((keys, row) => {
      if (row && typeof row === "object" && !Array.isArray(row)) {
        Object.keys(row).forEach((key) => keys.add(key));
      }
      return keys;
    }, new Set()),
  );

  const worksheet = XLSX.utils.json_to_sheet(exportRows, {
    header: headers,
    skipHeader: false,
  });

  if (headers.length > 0) {
    XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: "A1" });
    worksheet["!cols"] = headers.map((header) => ({
      wch: Math.max(
        String(header).length,
        ...exportRows.map((row) => String(row?.[header] ?? "").length),
        12,
      ),
    }));
  }

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const file = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
  });

  saveAs(file, fileName);
};
