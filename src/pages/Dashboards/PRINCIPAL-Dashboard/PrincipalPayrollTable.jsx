import { Download } from "lucide-react";
import React from "react";

const headers = [
  "Name",
  "Dept",
  "Month",
  "Gross Earnings",
  "LOP",
  "Total Deduction",
  "Net Payable",
  "Action",
];

const PrincipalPayrollTable = ({ tableData }) => {
  function getMonth(monthNumber) {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return months[monthNumber - 1] || "N/A";
  }

  if (!tableData || tableData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-[14px] text-[#6f839f]">No payroll records found.</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full table-fixed border-collapse text-left">
        <thead className="sticky top-0 z-10 bg-slate-100 dark:bg-[#172c46] text-sm font-medium text-slate-500 dark:text-[#9aacc7]">
          <tr>
            {headers.map((header, index) => (
              <th
                key={header}
                className={`px-4 py-3 font-semibold ${index === 0 ? "w-[20%]" : index === 7 ? "w-[10%] text-right" : "w-[12%]"}`}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="text-[12px] text-slate-700 dark:text-[#cad7eb]">
          {tableData.map((item, index) => (
            <tr
              key={item._id || index}
              className="border-b border-slate-200 dark:border-[#132944] last:border-0 hover:bg-slate-50 dark:hover:bg-transparent transition-colors"
            >
              <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                {item.employeeDetails?.name || item.name || "N/A"}
              </td>
              <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                {item.employeeDetails?.department || "--"}
              </td>
              <td className="px-4 py-3">
                {getMonth(item.payrollMonth)}
              </td>
              <td className="px-4 py-3">
                {item.earnings?.grossSalary ?? "—"}
              </td>
              <td className="px-4 py-3 text-[#f16868]">
                {item?.attendance?.lopDays ?? "—"}
              </td>
              <td className="px-4 py-3">
                {item?.totalDeduction ?? "—"}
              </td>
              <td className="px-4 py-3 font-semibold text-[#18d3bf]">
                {item?.netSalary ?? "—"}
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => {
                    window.open(`/payslip/${item.facultyId?._id}`, "_blank");
                  }}
                  className="inline-flex h-8 w-8 items-center bg-gray-100 justify-center rounded-lg dark:bg-[#c4c6d010] transition hover:bg-[#183052] hover:text-white text-[#3984ff]"
                  title="Download Payslip"
                >
                  <Download size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PrincipalPayrollTable;
