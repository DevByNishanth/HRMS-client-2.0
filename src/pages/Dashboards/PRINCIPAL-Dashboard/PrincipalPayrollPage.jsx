import React, { useState, useMemo, useEffect } from "react";
import Sidebar from "../../../components/Siedbar";
import CommonHeader from "../../../components/CommonHeader";
import { FileUp, Search } from "lucide-react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import PrincipalPayrollTable from "./PrincipalPayrollTable";
import PayrollExcelUploadModal from "../../../components/PayrollExcelUploadModal";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const years = Array.from({ length: 10 }, (_, index) => 2026 - index);

function CustomDropdown({ value, options, onChange }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-40">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-lg border border-slate-200 dark:border-[#244061] bg-[#f9fafb] dark:bg-[#0d2138] px-4 py-2.5 text-sm font-medium text-slate-900 dark:text-white shadow-sm transition hover:bg-slate-50 dark:hover:bg-[#132b49]"
      >
        <span>{value}</span>
        <svg
          className={`h-4 w-4 text-slate-500 dark:text-[#8ca1bd] transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 max-h-60 w-full overflow-y-auto rounded-lg border border-slate-200 dark:border-[#244061] bg-white dark:bg-[#0a1a2d] p-1 shadow-lg">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              className={`w-full rounded-md px-3 py-2 text-left text-sm transition ${
                value === option
                  ? "bg-[#2563EB] font-medium text-white"
                  : "text-slate-700 dark:text-[#cad7eb] hover:bg-slate-100 dark:hover:bg-[#132b49]"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const PrincipalPayrollPage = () => {
  const token = localStorage.getItem("hrms_token");

  const [searchQuery, setSearchQuery] = useState("");
  const [month, setMonth] = useState("September");
  const [year, setYear] = useState(2026);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);

  async function fetchPayroll() {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/payroll/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setTableData(res.data.data || []);
    } catch (err) {
      console.error("Error fetching payroll data:", err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPayroll();
  }, []);

  const filteredData = useMemo(() => {
    if (!tableData) return [];

    const monthIndex = months.indexOf(month) + 1; // 1-12
    const selectedYear = Number(year);

    return tableData.filter((item) => {
      // Month filter
      if (monthIndex && item.payrollMonth && item.payrollMonth !== monthIndex) {
        return false;
      }
      // Year filter
      if (
        selectedYear &&
        item.payrollYear &&
        item.payrollYear !== selectedYear
      ) {
        return false;
      }
      // Name search
      const normalizedSearch = searchQuery.trim().toLowerCase();
      if (normalizedSearch) {
        return (
          item.facultyName?.toLowerCase().includes(normalizedSearch) ||
          item.name?.toLowerCase().includes(normalizedSearch)
        );
      }
      return true;
    });
  }, [tableData, searchQuery, month, year]);

  const handleUploadSuccess = () => {
    fetchPayroll();
  };

  return (
    <>
      <div className="flex h-screen overflow-hidden bg-[#f8fafc] dark:bg-[#051424] transition-colors duration-200">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <CommonHeader />

          <main className="max-h-[calc(100vh-56px)] overflow-y-auto bg-[#f8fafc] dark:bg-[#071425] px-4 py-4 text-slate-900 dark:text-white table-custom-scrollbar transition-colors duration-200">
            {/* Page Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-xl font-medium leading-tight text-slate-900 dark:text-white">
                  Payroll Management
                </h1>
                <p className="mt-1 text-[16px] text-slate-500 dark:text-[#9eb0cc]">
                  Manage payroll of faculties.
                </p>
              </div>

              <div className="btn-container flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(true)}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[#2563EB] bg-blue-600 px-4 text-sm font-semibold text-white transition hover:border-[#3984ff] hover:bg-blue-700"
                >
                  <FileUp size={16} className="text-white" />
                  Upload Excel
                </button>
              </div>
            </div>

            {/* Table Container */}
            <div className="mt-4 min-h-[calc(100vh-200px)] rounded-lg border border-slate-200 dark:border-[#183052] bg-white dark:bg-[#0a1a2d]">
              {/* Table Header / Controls */}
              <div className="flex items-center justify-between p-3">
                <h1 className="text-lg font-medium text-slate-900 dark:text-white">
                  Payroll list for the month of{" "}
                  <span className="text-blue-600">{month}</span>{" "}
                  <span className="text-[#2359a0]">
                    ({filteredData.length})
                  </span>
                </h1>

                <div className="flex items-center gap-3">
                  {/* Search */}
                  <div className="relative">
                    <Search
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#6f839f]"
                    />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by name..."
                      className="h-11 w-64 rounded-lg border border-slate-200 dark:border-[#244061] bg-[#f8fafc] dark:bg-[#0d2138] pl-10 pr-4 text-[14px] text-slate-900 dark:text-white outline-none transition placeholder:text-slate-400 dark:placeholder:text-[#6f839f] hover:border-[#3984ff] focus:border-[#3984ff] focus:ring-2 focus:ring-[#3984ff33]"
                    />
                  </div>

                  {/* Month */}
                  <CustomDropdown
                    value={month}
                    options={months}
                    onChange={setMonth}
                  />

                  {/* Year */}
                  <CustomDropdown
                    value={year}
                    options={years}
                    onChange={setYear}
                  />
                </div>
              </div>

              {/* Table */}
              <PrincipalPayrollTable tableData={filteredData} />
            </div>
          </main>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <PayrollExcelUploadModal
          onClose={() => setShowUploadModal(false)}
          onSuccess={handleUploadSuccess}
        />
      )}
    </>
  );
};

export default PrincipalPayrollPage;
