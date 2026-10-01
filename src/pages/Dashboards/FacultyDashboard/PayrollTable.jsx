import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Download } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const headers = [
  "MONTH",
  "GROSS EARNINGS",
  "LOP",
  "TOTAL DEDUCTION",
  "NET PAYABLE",
  "ACTION",
];

const PayrollTable = ({ tableData }) => {
  const navigate = useNavigate();

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

    return months[monthNumber - 1];
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-slate-100 dark:bg-[#193252]">
            {headers.map((header) => (
              <th
                key={header}
                className="px-5 py-2.5 text-left text-xs font-medium tracking-wide text-slate-600 dark:text-[#9db9dc]"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {tableData?.map((item, index) => {
            console.log("item : ", item);
            return (
              <tr className="">
                <td className="border-b border-slate-100 py-2 pl-6 text-slate-900 dark:border-[#183052] dark:text-white">{getMonth(item.payrollMonth)}</td>
                <td className="border-b border-slate-100 py-2 pl-6 text-slate-700 dark:border-[#183052] dark:text-[#cad7eb]">{item.earnings?.grossSalary}</td>
                <td className="border-b border-slate-100 py-2 pl-6 text-slate-700 dark:border-[#183052] dark:text-[#cad7eb]">{item?.attendance?.lopDays}</td>
                <td className="border-b border-slate-100 py-2 pl-6 text-slate-700 dark:border-[#183052] dark:text-[#cad7eb]">{item?.totalDeduction}</td>
                <td className="border-b border-slate-100 py-2 pl-6 font-semibold text-slate-900 dark:border-[#183052] dark:text-white">{item?.netSalary}</td>
                <td className="pl-6 py-2">
                  <button
                    onClick={() => {
                      window.open(`/payslip/${item.facultyId?._id}`, "_blank");
                    }}
                    className=""
                  >
                    <Download
                      size={16}
                      className="cursor-pointer text-slate-500 transition hover:text-blue-700 dark:text-slate-400 dark:hover:text-white"
                    />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PayrollTable;
