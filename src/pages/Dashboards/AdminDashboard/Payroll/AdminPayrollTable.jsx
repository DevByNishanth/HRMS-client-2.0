import { Download } from "lucide-react";
import React from "react";

const headers = [
  "NAME",
  "DEPT",
  "MONTH",
  "GROSS EARNINGS",
  "LOP",
  "TOTAL DEDUCTION",
  "NET PAYABLE",
  "ACTION",
];

const AdminPayrollTable = ({ tableData }) => {
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
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[#193252]">
            {headers.map((header) => (
              <th
                key={header}
                className="px-5 py-2.5 text-left text-xs font-medium tracking-wide text-[#9db9dc]"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {tableData.map((item, index) => (
            <tr
              key={item._id || index}
              className="border-b border-[#183052]/50 transition hover:bg-[#183052]/30"
            >
              <td className="px-6 py-3 text-[13px] font-medium text-white">
                {item.employeeDetails?.name || item.name || "N/A"}
              </td>
              <td className="px-6 py-3 text-[13px] font-medium text-white">
                {item.employeeDetails?.department || "--"}
              </td>
              <td className="px-6 py-3 text-[13px] text-[#cad7eb]">
                {getMonth(item.payrollMonth)}
              </td>
              <td className="px-6 py-3 text-[13px] text-[#cad7eb]">
                {item.earnings?.grossSalary ?? "—"}
              </td>
              <td className="px-6 py-3 text-[13px] text-[#cad7eb]">
                {item?.attendance?.lopDays ?? "—"}
              </td>
              <td className="px-6 py-3 text-[13px] text-[#cad7eb]">
                {item?.totalDeduction ?? "—"}
              </td>
              <td className="px-6 py-3 text-[13px] font-semibold text-white">
                {item?.netSalary ?? "—"}
              </td>
              <td className="px-6 py-3">
                <button
                  onClick={() => {
                    window.open(`/payslip/${item.facultyId?._id}`, "_blank");
                  }}
                  className=""
                >
                  <Download
                    size={16}
                    className=" text-gray-500 cursor-pointer hover:text-white"
                  />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPayrollTable;
