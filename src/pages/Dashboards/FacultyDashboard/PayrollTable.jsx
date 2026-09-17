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
          {tableData?.map((item, index) => {
            console.log("item : ", item);
            return (
              <tr className="">
                <td className="pl-6">{getMonth(item.payrollMonth)}</td>
                <td className="pl-6 py-2">{item.earnings?.grossSalary}</td>
                <td className="pl-6 py-2">{item?.attendance?.lopDays}</td>
                <td className="pl-6 py-2">{item?.totalDeduction}</td>
                <td className="pl-6 py-2">{item?.netSalary}</td>
                <td className="pl-6 py-2">
                  <button
                    onClick={() => {
                      window.open(`/payroll/${item.facultyId}`, "_blank");
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
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PayrollTable;
