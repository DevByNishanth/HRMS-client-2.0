import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const PayslipPage = () => {
  const { facultyId } = useParams();
  const [payrollData, setPayrollData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayrollData = async () => {
      try {
        const token = localStorage.getItem("hrms_token");
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/payroll/faculty/${facultyId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.data?.success && response.data?.data?.length > 0) {
          setPayrollData(response.data.data[0]);
        } else {
          setPayrollData(null);
        }
      } catch (error) {
        console.error("Error fetching payroll data:", error);
        // Set default empty object so we can still render placeholders if API fails
        setPayrollData({});
      } finally {
        setLoading(false);
      }
    };

    if (facultyId) {
      fetchPayrollData();
    }
  }, [facultyId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 text-gray-800">
        Loading Payslip...
      </div>
    );
  }

  if (!payrollData) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 text-gray-800">
        No Payroll Data Found
      </div>
    );
  }

  const monthNames = [
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
  const payrollMonthName = payrollData.payrollMonth
    ? monthNames[payrollData.payrollMonth - 1]
    : "March";
  const payrollYear = payrollData.payrollYear || "2024";

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB"); // DD/MM/YYYY format
  };

  // Mapping API response to our template data structure
  const data = {
    employeeName: payrollData.employeeDetails?.name || "N/A",
    designation: payrollData.employeeDetails?.designation || "N/A",
    employeeId: payrollData.employeeDetails?.empId || "N/A",
    department: payrollData.employeeDetails?.department || "N/A",
    dateOfJoining: formatDate(payrollData.employeeDetails?.dateOfJoining),

    netPay: payrollData.netSalary?.toFixed(2) || "0.00",
    totalDays: "31",
    lopDays: payrollData.attendance?.lopDays || "0",
    odDays: payrollData.attendance?.odDays || "0",

    // These fields are not in the provided API response, using placeholders
    pfAccountNumber: payrollData.facultyId?.identityDetails?.pfNumber,
    uan: payrollData.facultyId?.identityDetails?.uanNumber,

    earnings: {
      basic: payrollData.earnings?.basic?.toFixed(2) || "0.00",
      agp: payrollData.earnings?.agp?.toFixed(2) || "0.00",
      basicPay: payrollData.earnings?.basicPay?.toFixed(2) || "0.00",
      da: payrollData.earnings?.da?.toFixed(2) || "0.00",
      hra: payrollData.earnings?.hra?.toFixed(2) || "0.00",
      food: payrollData.earnings?.food?.toFixed(2) || "0.00",
      medical: payrollData.earnings?.medical?.toFixed(2) || "0.00",
      ta: payrollData.earnings?.ta?.toFixed(2) || "0.00",
      epf: payrollData.earnings?.epf?.toFixed(2) || "0.00",
      others: payrollData.earnings?.others?.toFixed(2) || "0.00",
    },
    grossEarnings: payrollData.earnings?.grossSalary?.toFixed(2) || "0.00",
    deductions: {
      lop: payrollData.deductions?.lop?.toFixed(2) || "0.00",
      hostel: payrollData.deductions?.hostel?.toFixed(2) || "0.00",
      transport: payrollData.deductions?.transportation?.toFixed(2) || "0.00",
      epf1: payrollData.deductions?.epf1?.toFixed(2) || "0.00",
      epf2: payrollData.deductions?.epf2?.toFixed(2) || "0.00",
      esi: payrollData.deductions?.esi?.toFixed(2) || "0.00",
      tds: payrollData.deductions?.tds?.toFixed(2) || "0.00",
      medical: payrollData.deductions?.medical?.toFixed(2) || "0.00",
      profTax: payrollData.deductions?.professionalTax?.toFixed(2) || "0.00",
      others: payrollData.deductions?.others?.toFixed(2) || "0.00",
      advanceAmount: payrollData.advance?.paid?.toFixed(2) || "0.00",
    },
    additionalMaintenanceSalary:payrollData.maintenanceSalary?.toFixed(2) || "0.00",
    totalDeductions: payrollData.totalDeduction?.toFixed(2) || "0.00",
    amountInWords: "Indian Rupee Sixty-Four Thousand Three Hundred Only", // Default fallback or implemented converting logic later
    payment: payrollData.payment || { byBank: 0, byCash: 0 },
  };

  let paymentModeText = "";
  if (data.payment.byBank > 0 && data.payment.byCash > 0) {
    paymentModeText = "( BY BANK & CASH )";
  } else if (data.payment.byBank > 0) {
    paymentModeText = "( BY BANK )";
  } else if (data.payment.byCash > 0) {
    paymentModeText = "( BY CASH )";
  }

  return (
    <div
      className="bg-[#f3f4f6] min-h-screen font-sans p-4 sm:p-8 print:p-0 print:bg-white print:min-h-0"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <style>{`
                @media print {
                    @page {
                        size: A4 portrait;
                        margin: 0; /* Margin 0 removes browser header and footer */
                    }
                    html, body {
                        height: auto !important;
                        min-height: 0 !important;
                    }
                    body {
                        background-color: white !important;
                        padding: 10mm !important; /* Add padding to body to keep it away from edges */
                        margin: 0 !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    .payslip-container {
                        box-shadow: none !important;
                        border: none !important;
                        padding: 0 !important;
                        max-width: 100% !important;
                        margin: 0 !important;
                        page-break-after: avoid;
                        page-break-inside: avoid;
                    }
                }
            `}</style>

      <div className="payslip-container bg-white max-w-[850px] mx-auto p-6 sm:p-10 print:p-0 rounded-lg shadow-md border border-gray-200 print:shadow-none print:border-none print:max-w-full">
        {/* Header */}
        <div className="flex justify-between items-start mb-2">
          <div>
            {/* Logo */}
            <div className="flex items-center">
              <img
                src="/clg2.png"
                alt="Sri Eshwar Logo"
                className="h-14 object-contain"
              />
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
              Payslip for the month
            </p>
            <h1 className="text-xl text-gray-800">
              {payrollMonthName} {payrollYear}
            </h1>
          </div>
        </div>

        <hr className="border-gray-200 mb-4" />

        {/* Employee Summary Section */}
        <div className="flex gap-8 mb-6">
          {/* Left side: Details */}
          <div className="flex-1 grid grid-cols-[140px_auto] gap-y-3 text-sm">
            <div className="text-gray-500">Employee Name</div>
            <div className=" text-gray-800">: {data.employeeName}</div>

            <div className="text-gray-500">Designation</div>
            <div className=" text-gray-800">: {data.designation}</div>

            <div className="text-gray-500">Employee ID</div>
            <div className=" text-gray-800">: {data.employeeId}</div>

            <div className="text-gray-500">Department</div>
            <div className=" text-gray-800">: {data.department}</div>

            <div className="text-gray-500">Date of Joining</div>
            <div className=" text-gray-800">: {data.dateOfJoining}</div>
          </div>

          {/* Right side: Net Pay Box */}
          <div className=" bg-[#f0fdf4] rounded-lg border p-6 border-green-100 h-32">
            <div className="flex items-center  justify-between mb-2">
              <div className="flex items-center">
                <div className="w-1 h-6 bg-green-500 mr-3 rounded"></div>
                <div className="text-sm text-green-600 font-medium ">
                  Employee Net Pay
                </div>
              </div>
              <div className="text-2xl text-gray-900">₹{data.netPay}</div>
            </div>

            <hr className="border-green-200 border-dashed ml-4 mb-2" />

            <div className="flex gap-4 text-sm ml-4 gap-y-1">
              <div className="text-gray-500 flex justify-between">
                Total Days <span>:</span>
              </div>
              <div className=" text-gray-800 ml-2">{data.totalDays}</div>
              <div className="border-r w-1 border-gray-400"></div>
              <div className="text-gray-500 flex justify-between">
                LOP <span>:</span>
              </div>
              <div className=" text-gray-800 ml-2">{data.lopDays}</div>
              
              <div className="border-r w-1 border-gray-400"></div>
              <div className="text-gray-500 flex justify-between">
                OD <span>:</span>
              </div>
              <div className=" text-gray-800 ml-2">{data.odDays}</div>
            </div>
          </div>
        </div>

        <hr className="border-gray-200 mb-4 border-dashed" />

        {/* PF and UAN */}
        <div className="flex gap-12 text-sm mb-4">
          <div className="flex w-1/2">
            <div className="w-[140px] text-gray-500">PF A/C Number</div>
            <div className=" text-gray-800">: {data.pfAccountNumber}</div>
          </div>
          <div className="flex w-1/2">
            <div className="w-20 text-gray-500">UAN</div>
            <div className=" text-gray-800">: {data.uan}</div>
          </div>
        </div>

        {/* Salary Details Table */}
        <div className="border border-gray-200 rounded-lg overflow-hidden mb-4 flex">
          {/* Earnings Column */}
          <div className="border-r border-gray-200 w-1/2 flex flex-col">
            <div className="flex justify-between p-3 border-b border-gray-200 bg-gray-50">
              <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                Earnings
              </span>
              <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                Amount
              </span>
            </div>
            <div className="p-3 space-y-2 sm:space-y-3 text-sm flex-grow">
              <div className="flex justify-between">
                <span className="text-gray-600">Basic</span>
                <span className=" text-gray-800">₹{data.earnings.basic}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">AGP</span>
                <span className=" text-gray-800">₹{data.earnings.agp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Basic Pay</span>
                <span className=" text-gray-800">
                  ₹{data.earnings.basicPay}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">DA</span>
                <span className=" text-gray-800">₹{data.earnings.da}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">HRA</span>
                <span className=" text-gray-800">₹{data.earnings.hra}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Food</span>
                <span className=" text-gray-800">₹{data.earnings.food}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Medical</span>
                <span className=" text-gray-800">₹{data.earnings.medical}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">TA</span>
                <span className=" text-gray-800">₹{data.earnings.ta}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">EPF</span>
                <span className=" text-gray-800">₹{data.earnings.epf}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Others</span>
                <span className=" text-gray-800">₹{data.earnings.others}</span>
              </div>
            </div>
            <div className="flex justify-between p-3 border-t border-gray-200 bg-gray-50">
              <span className="text-sm  text-gray-800">Gross Earnings</span>
              <span className="text-sm  text-gray-800">
                ₹{data.grossEarnings}
              </span>
            </div>
          </div>

          {/* Deductions Column */}
          <div className="w-1/2 flex flex-col">
            <div className="flex justify-between p-3 border-b border-gray-200 bg-gray-50">
              <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                Deductions
              </span>
              <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                Amount
              </span>
            </div>
            <div className="p-3 space-y-2 sm:space-y-3 text-sm flex-grow">
              <div className="flex justify-between">
                <span className="text-gray-600">LOP</span>
                <span className=" text-gray-800">₹{data.deductions.lop}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Hostel</span>
                <span className=" text-gray-800">
                  ₹{data.deductions.hostel}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Transport</span>
                <span className=" text-gray-800">
                  ₹{data.deductions.transport}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">EPF</span>
                <span className=" text-gray-800">₹{data.deductions.epf1}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">EPF</span>
                <span className=" text-gray-800">₹{data.deductions.epf2}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">ESI</span>
                <span className=" text-gray-800">₹{data.deductions.esi}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">TDS</span>
                <span className=" text-gray-800">₹{data.deductions.tds}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Medical</span>
                <span className=" text-gray-800">
                  ₹{data.deductions.medical}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Prof.Tax</span>
                <span className="text-gray-800">
                  ₹{data.deductions.profTax}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Others</span>
                <span className=" text-gray-800">
                  ₹{data.deductions.others}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Advance Amount</span>
                <span className=" text-gray-800">
                  ₹{data.deductions.advanceAmount}
                </span>
              </div>
            </div>
            <div className="flex justify-between p-3 border-t border-gray-200 bg-gray-50">
              <span className="text-sm text-gray-800">Total Deductions</span>
              <span className="text-sm text-gray-800">
                ₹{data.totalDeductions}
              </span>
            </div>
          </div>
        </div>
        {["Driver", "Housekeeping", "Security", "Electrical-Maintenance"].includes(
          payrollData.facultyId?.employeeCategory
        ) && (
          <div className="bg-[#f8fafc] rounded-lg p-2 px-4 border border-gray-200 flex justify-between items-center mb-4">
            <div className="text-sm text-gray-800 font-medium">
              Additional Maintenance Salary
            </div>
            <div className="text-sm text-gray-800 font-medium">
              ₹{data.additionalMaintenanceSalary}
            </div>
          </div>
        )}
        {/* Total Net Payable Box */}
        <div className="bg-[#f8fafc] rounded-lg p-5 border border-gray-200 flex justify-between items-center mb-6">
          <div>
            <div className="text-sm font-bold text-gray-800 uppercase tracking-wide">
              Total Net Payable{" "}
              {paymentModeText && (
                <span className="text-gray-600">{paymentModeText}</span>
              )}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Gross Earnings - Total Deductions
            </div>
          </div>
          <div className="text-3xl text-gray-900">₹{data.netPay}</div>
        </div>

        {/* Amount in Words */}
        {/* <div className="text-right text-sm text-gray-500 mb-6">
          Amount In Words :{" "}
          <span className="font-semibold text-gray-800 ml-1">
            {data.amountInWords}
          </span>
        </div> */}

        <hr className="border-gray-100 mb-2 border-dashed" />

        {/* Footer */}
        <div className="text-center text-xs text-gray-400 font-medium ">
          <p>
            -- This document has been automatically generated by Sri Eshwar HR
            Portal, therefore a signature is not required --
          </p>
          <p className="mt-2">
            -- For further queries contact{" "}
            <span className="hover:underline">
              <a
                href="mailto:hr@sece.ac.in"
                className="font-bold text-blue-600"
              >
                hr@sece.ac.in
              </a>
            </span>{" "}
            --
          </p>
        </div>
      </div>
    </div>
  );
};

export default PayslipPage;
