import * as XLSX from "xlsx";

const EXCLUDED_FACULTY_FILE = "/excluded-faculty.xlsx";

let excludedFacultyIdsPromise;

const normalizeEmployeeId = (employeeId) => {
  if (employeeId === null || employeeId === undefined) {
    return "";
  }

  return String(employeeId)
    .trim()
    .toUpperCase();
};

const normalizeColumnName = (columnName) => {
  return normalizeEmployeeId(columnName).replace(/[^A-Z0-9]/g, "");
};

/**
 * Loads excluded faculty IDs from public/excluded-faculty.xlsx
 *
 * Supported Excel column names:
 * - Emp ID
 * - Employee ID
 * - Employee_ID
 * - employee_id
 * - EmpID
 */
export const loadExcludedFacultyIds = () => {
  if (!excludedFacultyIdsPromise) {
    excludedFacultyIdsPromise = fetch(EXCLUDED_FACULTY_FILE)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(
            `Unable to load ${EXCLUDED_FACULTY_FILE}: ${response.status}`
          );
        }

        const workbook = XLSX.read(await response.arrayBuffer(), {
          type: "array",
        });

        const firstSheetName = workbook.SheetNames[0];

        if (!firstSheetName) {
          throw new Error(
            "The excluded faculty workbook has no worksheets"
          );
        }

        const worksheet = workbook.Sheets[firstSheetName];

        const rows = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          defval: "",
        });

        if (!rows.length) {
          throw new Error(
            "The excluded faculty workbook is empty"
          );
        }

        const headerRow = rows[0] || [];

        /**
         * Your Excel currently contains:
         *
         * Emp ID
         *
         * This becomes EMPID after normalization.
         */
        const employeeIdColumnIndex = headerRow.findIndex((header) => {
          const normalizedHeader = normalizeColumnName(header);

          return [
            "EMPID",
            "EMPLOYEEID",
            "EMPLOYEEIDNO",
            "FACULTYID",
          ].includes(normalizedHeader);
        });

        if (employeeIdColumnIndex === -1) {
          console.error(
            "Excluded faculty Excel headers:",
            headerRow
          );

          throw new Error(
            "The excluded faculty workbook has no supported Employee ID column"
          );
        }

        const excludedIds = new Set();

        rows.slice(1).forEach((row) => {
          const employeeId = normalizeEmployeeId(
            row[employeeIdColumnIndex]
          );

          if (employeeId) {
            excludedIds.add(employeeId);
          }
        });

        console.log(
          `Loaded ${excludedIds.size} excluded faculty IDs`
        );

        console.log(
          "Excluded Faculty IDs:",
          Array.from(excludedIds)
        );

        return excludedIds;
      })
      .catch((error) => {
        console.error(
          "Excluded faculty list could not be loaded:",
          error
        );

        /**
         * IMPORTANT:
         * Returning an empty Set means the normal attendance
         * report continues working if the Excel cannot be loaded.
         */
        return new Set();
      });
  }

  return excludedFacultyIdsPromise;
};

/**
 * Checks whether an employee is present in excluded-faculty.xlsx
 */
export const isFacultyExcluded = (
  employeeId,
  excludedFacultyIds
) => {
  const normalizedId = normalizeEmployeeId(employeeId);

  if (!normalizedId) {
    return false;
  }

  return excludedFacultyIds.has(normalizedId);
};