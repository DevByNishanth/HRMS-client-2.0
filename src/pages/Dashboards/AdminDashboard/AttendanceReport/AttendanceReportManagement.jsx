
import React, { useMemo, useState } from 'react'
import Sidebar from '../../../../components/Siedbar'
import CommonHeader from '../../../../components/CommonHeader'

const summaryColumns = ['P', 'L', 'H', 'A', 'OFF', 'R', 'OD', '?']

const employees = [
  {
    id: 'SECENAD002',
    name: 'A.ANBARASAN',
    designation: 'Senior Lab Technician, Coimbatore',
    attendance: {
      '2026-06-01': 'A',
      '2026-06-02': 'A',
      '2026-06-03': 'A',
      '2026-06-04': 'A',
      '2026-06-05': 'A',
      '2026-06-06': 'OFF',
      '2026-06-07': 'OFF',
      '2026-06-08': 'A',
      '2026-06-09': 'A',
      '2026-06-10': 'A',
      '2026-06-11': 'A',
      '2026-06-12': 'A',
      '2026-06-13': 'A',
      '2026-06-14': 'OFF',
      '2026-06-15': 'A',
    },
    summary: { P: 0, L: 0, H: 0, A: 12, OFF: 3, R: 0, OD: 0, '?': 0 },
  },
  {
    id: 'SECETCS136',
    name: 'ABINAYA M',
    designation: 'ASSISTANT PROFESSOR, Coimbatore',
    attendance: {
      '2026-06-01': 'A',
      '2026-06-02': 'A',
      '2026-06-03': 'A',
      '2026-06-04': 'A',
      '2026-06-05': 'A',
      '2026-06-06': 'OFF',
      '2026-06-07': 'OFF',
      '2026-06-08': 'A',
      '2026-06-09': 'A',
      '2026-06-10': 'A',
      '2026-06-11': 'A',
      '2026-06-12': 'A',
      '2026-06-13': 'A',
      '2026-06-14': 'OFF',
      '2026-06-15': 'A',
    },
    summary: { P: 0, L: 0, H: 0, A: 12, OFF: 3, R: 0, OD: 0, '?': 0 },
  },
  {
    id: 'SECEADM161',
    name: 'ABISHEK K',
    designation: 'Software Developer, Coimbatore',
    attendance: {
      '2026-06-01': 'P',
      '2026-06-02': 'P',
      '2026-06-03': 'A',
      '2026-06-04': 'P',
      '2026-06-05': 'A:P',
      '2026-06-06': 'OFF',
      '2026-06-07': 'OFF',
      '2026-06-08': 'A:P',
      '2026-06-09': 'A:P',
      '2026-06-10': 'A:P',
      '2026-06-11': 'A:P',
      '2026-06-12': 'A',
      '2026-06-13': 'A',
      '2026-06-14': 'OFF',
      '2026-06-15': 'A:P',
    },
    summary: { P: 6.5, L: 0, H: 0, A: 5.5, OFF: 3, R: 0, OD: 0, '?': 0 },
  },
  {
    id: 'SECETCS127',
    name: 'AGALYA K',
    designation: 'ASSISTANT PROFESSOR, Coimbatore',
    attendance: {
      '2026-06-01': 'A',
      '2026-06-02': 'A',
      '2026-06-03': 'A',
      '2026-06-04': 'A',
      '2026-06-05': 'A',
      '2026-06-06': 'OFF',
      '2026-06-07': 'OFF',
      '2026-06-08': 'A',
      '2026-06-09': 'A',
      '2026-06-10': 'A',
      '2026-06-11': 'A',
      '2026-06-12': 'A',
      '2026-06-13': 'A',
      '2026-06-14': 'OFF',
      '2026-06-15': 'P',
    },
    summary: { P: 1, L: 0, H: 0, A: 11, OFF: 3, R: 0, OD: 0, '?': 0 },
  },
  {
    id: 'SECETMA012',
    name: 'AKILADEVI N',
    designation: 'ASSISTANT PROFESSOR, Coimbatore',
    attendance: {
      '2026-06-01': 'A',
      '2026-06-02': 'A:P',
      '2026-06-03': 'A',
      '2026-06-04': 'P',
      '2026-06-05': 'A',
      '2026-06-06': 'OFF',
      '2026-06-07': 'OFF',
      '2026-06-08': 'A',
      '2026-06-09': 'A',
      '2026-06-10': 'P',
      '2026-06-11': 'A',
      '2026-06-12': 'A',
      '2026-06-13': 'A',
      '2026-06-14': 'OFF',
      '2026-06-15': 'P',
    },
    summary: { P: 3.5, L: 0, H: 0, A: 8.5, OFF: 3, R: 0, OD: 0, '?': 0 },
  },
  {
    id: 'SECEPLC013',
    name: 'ALOYSIUS JUDE L D',
    designation: 'Softskills Trainer, Coimbatore',
    attendance: {
      '2026-06-01': 'A',
      '2026-06-02': 'A',
      '2026-06-03': 'A',
      '2026-06-04': 'A',
      '2026-06-05': 'A',
      '2026-06-06': 'OFF',
      '2026-06-07': 'OFF',
      '2026-06-08': 'A',
      '2026-06-09': 'P',
      '2026-06-10': 'A',
      '2026-06-11': 'A:P',
      '2026-06-12': 'P',
      '2026-06-13': 'A:P',
      '2026-06-14': 'OFF',
      '2026-06-15': 'P',
    },
    summary: { P: 4, L: 0, H: 0, A: 8, OFF: 3, R: 0, OD: 0, '?': 0 },
  },
  {
    id: 'SECEADM102',
    name: 'ANAND BABU P',
    designation: 'Creative Head, Coimbatore',
    attendance: {
      '2026-06-01': 'A',
      '2026-06-02': 'P',
      '2026-06-03': 'A',
      '2026-06-04': 'P:A',
      '2026-06-05': 'A',
      '2026-06-06': 'OFF',
      '2026-06-07': 'OFF',
      '2026-06-08': 'P',
      '2026-06-09': 'P',
      '2026-06-10': 'P',
      '2026-06-11': 'P',
      '2026-06-12': 'A',
      '2026-06-13': 'A',
      '2026-06-14': 'OFF',
      '2026-06-15': 'A',
    },
    summary: { P: 5.5, L: 0, H: 0, A: 6.5, OFF: 3, R: 0, OD: 0, '?': 0 },
  },
  {
    id: 'SECETCS073',
    name: 'ANANDARAJ A',
    designation: 'ASSISTANT PROFESSOR, Coimbatore',
    attendance: {
      '2026-06-01': 'P',
      '2026-06-02': 'P',
      '2026-06-03': 'A',
      '2026-06-04': 'P',
      '2026-06-05': 'P',
      '2026-06-06': 'OFF',
      '2026-06-07': 'OFF',
      '2026-06-08': 'P',
      '2026-06-09': 'P',
      '2026-06-10': 'A',
      '2026-06-11': 'P',
      '2026-06-12': 'P',
      '2026-06-13': 'P',
      '2026-06-14': 'OFF',
      '2026-06-15': 'A:P',
    },
    summary: { P: 9.5, L: 0, H: 0, A: 2.5, OFF: 3, R: 0, OD: 0, '?': 0 },
  },
]

function getMonthDates(year, monthIndex) {
  const dates = []
  const cursor = new Date(year, monthIndex, 1)

  while (cursor.getMonth() === monthIndex) {
    const date = new Date(cursor)
    dates.push({
      date,
      day: date.getDate(),
      weekday: date.toLocaleDateString('en-US', { weekday: 'short' }),
      key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
        date.getDate(),
      ).padStart(2, '0')}`,
      isWeekend: date.getDay() === 0 || date.getDay() === 6,
    })
    cursor.setDate(cursor.getDate() + 1)
  }

  return dates
}

function getCellClass(status, isWeekend) {
  if (status === 'A') return 'attendance-cell attendance-cell-absent'
  if (status === 'P') return 'attendance-cell attendance-cell-present'
  if (status === 'OFF') return 'attendance-cell attendance-cell-off'
  if (status.includes(':')) return 'attendance-cell attendance-cell-partial'
  return `attendance-cell ${isWeekend ? 'attendance-cell-weekend' : ''}`
}

export default function AttendanceManagement() {
  const [selectedMonth] = useState(5)
  const [selectedYear] = useState(2026)
  const dates = useMemo(() => getMonthDates(selectedYear, selectedMonth), [selectedMonth, selectedYear])
  const monthTitle = new Date(selectedYear, selectedMonth).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="flex h-screen overflow-hidden bg-[#051424]">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <CommonHeader />
        <main className="min-h-0 flex-1 overflow-hidden bg-slate-100 p-4">
          <section className="attendance-report h-full overflow-hidden rounded border border-slate-300 bg-white">
            <div className="attendance-table-wrap">
              <table className="attendance-table">
                <thead>
                  <tr>
                    <th className="employee-header sticky-employee" rowSpan="2">
                      Employee
                    </th>
                    <th className="month-header" colSpan={dates.length}>
                      {monthTitle}
                    </th>
                    {summaryColumns.map((column) => (
                      <th className="summary-header" rowSpan="2" key={column}>
                        {column}
                      </th>
                    ))}
                  </tr>
                  <tr>
                    {dates.map((date) => (
                      <th className="date-header" key={date.key}>
                        <span>{date.day}</span>
                        <small>{date.weekday}</small>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => (
                    <tr key={employee.id}>
                      <th className="employee-cell sticky-employee" scope="row">
                        <strong>
                          {employee.name} [{employee.id}]
                        </strong>
                        <span>{employee.designation}</span>
                      </th>
                      {dates.map((date) => {
                        const status = employee.attendance[date.key] || '-'

                        return (
                          <td className={getCellClass(status, date.isWeekend)} key={`${employee.id}-${date.key}`}>
                            {status}
                          </td>
                        )
                      })}
                      {summaryColumns.map((column) => (
                        <td className="summary-cell" key={`${employee.id}-${column}`}>
                          {employee.summary[column]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
        <style>{`
          .attendance-report {
            box-shadow: 0 18px 50px rgba(15, 23, 42, 0.16);
          }

          .attendance-table-wrap {
            height: 100%;
            overflow: auto;
            scrollbar-color: #b7c4d3 #eef2f7;
            scrollbar-width: thin;
          }

          .attendance-table-wrap::-webkit-scrollbar {
            height: 10px;
            width: 10px;
          }

          .attendance-table-wrap::-webkit-scrollbar-track {
            background: #eef2f7;
          }

          .attendance-table-wrap::-webkit-scrollbar-thumb {
            background: #b7c4d3;
            border-radius: 999px;
          }

          .attendance-table {
            min-width: 1750px;
            width: max-content;
            border-collapse: separate;
            border-spacing: 0;
            color: #1f2937;
            font-size: 14px;
          }

          .attendance-table th,
          .attendance-table td {
            border-right: 1px dotted #cbd5e1;
            border-bottom: 1px solid #eef2f7;
            height: 50px;
            padding: 0;
            text-align: center;
            white-space: nowrap;
          }

          .attendance-table thead th {
            position: sticky;
            top: 0;
            z-index: 10;
            background: #e5ebf2;
            color: #334155;
            font-weight: 700;
          }

          .attendance-table thead tr:nth-child(2) th {
            top: 50px;
          }

          .employee-header {
            width: 310px;
            min-width: 310px;
            font-size: 16px;
          }

          .sticky-employee {
            left: 0;
            position: sticky;
            z-index: 20;
          }

          .attendance-table thead .sticky-employee {
            z-index: 30;
          }

          .month-header {
            height: 50px;
            min-width: 1240px;
            font-size: 16px;
          }

          .date-header {
            width: 40px;
            min-width: 40px;
          }

          .date-header span,
          .date-header small {
            display: block;
            line-height: 1.3;
          }

          .date-header span {
            font-size: 16px;
          }

          .date-header small {
            font-size: 13px;
            font-weight: 700;
          }

          .summary-header,
          .summary-cell {
            width: 38px;
            min-width: 38px;
          }

          .employee-cell {
            background: #f8fafc;
            padding: 6px 10px !important;
            text-align: left !important;
            vertical-align: middle;
          }

          .employee-cell strong,
          .employee-cell span {
            display: block;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .employee-cell strong {
            color: #334155;
            font-size: 14px;
            line-height: 1.25;
          }

          .employee-cell span {
            color: #0077aa;
            font-size: 12px;
            font-weight: 700;
            line-height: 1.35;
            margin-top: 2px;
          }

          .attendance-table tbody tr:nth-child(even) .employee-cell,
          .attendance-table tbody tr:nth-child(even) .summary-cell,
          .attendance-table tbody tr:nth-child(even) .attendance-cell:not(.attendance-cell-absent):not(.attendance-cell-present):not(.attendance-cell-partial):not(.attendance-cell-off) {
            background: #f9fafb;
          }

          .attendance-cell {
            background: #ffffff;
            color: #111827;
            font-weight: 500;
          }

          .attendance-cell-absent,
          .attendance-cell-partial {
            background: #72c9e8;
          }

          .attendance-cell-present {
            background: #d5d5d5;
          }

          .attendance-cell-off {
            background: #ffffff;
          }

          .attendance-cell-weekend {
            background: #f3f6fa;
            color: #64748b;
          }

          .summary-cell {
            background: #ffffff;
            font-weight: 700;
          }

          @media (max-width: 768px) {
            .attendance-table {
              min-width: 1620px;
              font-size: 13px;
            }

            .employee-header,
            .employee-cell {
              width: 240px;
              min-width: 240px;
            }
          }
        `}</style>
      </div>
    </div>
  )
}