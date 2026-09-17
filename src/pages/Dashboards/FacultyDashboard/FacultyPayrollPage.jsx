import { useState, useEffect, useMemo } from "react";
import { ChevronDown } from "lucide-react";
import Sidebar from "../../../components/Siedbar";
import CommonHeader from "../../../components/CommonHeader";
import PayrollTable from "./PayrollTable";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

// table fields

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

// internal components
function CustomDropdown({ value, options, onChange }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-40">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-lg border border-[#183052] bg- px-4 py-2.5 text-sm font-medium text-white-700 shadow-sm hover:bg-[#183052]/30"
      >
        <span>{value}</span>

        <ChevronDown
          size={18}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 max-h-60 w-full overflow-y-auto rounded-lg  bg-[#183052] p-1 shadow-lg">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              className={`w-full rounded-md px-3 py-2 text-left text-sm hover:bg-gray-100 ${
                value === option
                  ? "bg-[#0b50b1] font-medium text-white"
                  : "text-gray-600"
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

const FacultyPayrollPage = () => {
  // auth
  const token = localStorage.getItem("hrms_token");
  const decoded = jwtDecode(token);
  const facultyId = decoded.facultyId;

  // states

  const [month, setMonth] = useState("September");
  const [year, setYear] = useState(2026);
  const [tableData, setTableData] = useState(null);

  // function

  async function fetchFacultyPayroll() {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/payroll/faculty/${facultyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log("data : ", res.data.data);
      setTableData(res.data.data);
    } catch (err) {
      console.error(
        "error occured while fetching fetchFaculty Payroll : ",
        err.message,
      );
    }
  }

  useEffect(() => {
    fetchFacultyPayroll();
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
      if (selectedYear && item.payrollYear && item.payrollYear !== selectedYear) {
        return false;
      }
      return true;
    });
  }, [tableData, month, year]);

  return (
    <>
      <div className="flex h-screen overflow-hidden bg-[#051424]">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <CommonHeader />

          <main className="max-h-[calc(100vh-56px] overflow-y-auto bg-[#071425] px-4 py-4 text-white table-custom-scrollbar">
            {/* header  */}

            <div className="header">
              <h1 className="font-semibold text-2xl">Payroll</h1>
              <h1 className="mt-1 text-[16px] text-[#9eb0cc]">
                View and manage faculty salary and payroll information.
              </h1>
            </div>

            {/* table container  */}

            <div className="table-container border border-[#183052] mt-4 rounded-lg  min-h-[calc(100vh-170px)]">
              {/* table header  */}
              <div className="header-container p-3 flex items-center justify-between">
                <h1 className="text-xl font-medium">
                  Payroll list <span>({filteredData.length})</span>
                </h1>
                <div className="flex items-center gap-3">
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

              {/* table  */}
              <PayrollTable tableData={filteredData} />
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default FacultyPayrollPage;
