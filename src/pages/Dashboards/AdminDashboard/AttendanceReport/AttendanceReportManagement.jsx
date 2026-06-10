
import React, { useEffect, useMemo, useState } from 'react'
import Sidebar from '../../../../components/Siedbar'
import CommonHeader from '../../../../components/CommonHeader'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://sece-hrms-server.onrender.com'
const summaryColumns = ['P', 'L', 'H', 'A', 'OFF', 'R', 'OD', '?']
const monthOptions = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]
const yearOptions = [2024, 2025, 2026, 2027, 2028]

const fallbackEmployees = [
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
  if (String(status).includes(':')) return 'attendance-cell attendance-cell-partial'
  return `attendance-cell ${isWeekend ? 'attendance-cell-weekend' : ''}`
}

function getEmployeeList(payload) {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.data)) return payload.data
  if (Array.isArray(payload?.employees)) return payload.employees
  if (Array.isArray(payload?.data?.employees)) return payload.data.employees
  if (Array.isArray(payload?.records)) return payload.records
  if (Array.isArray(payload?.data?.records)) return payload.data.records
  if (Array.isArray(payload?.muster)) return payload.muster
  if (Array.isArray(payload?.data?.muster)) return payload.data.muster
  if (Array.isArray(payload?.attendance)) return payload.attendance
  if (Array.isArray(payload?.data?.attendance)) return payload.data.attendance
  return []
}

function getEmployeeName(employee) {
  return (
    employee.name ||
    employee.employeeName ||
    employee.facultyName ||
    [employee.firstName, employee.lastName].filter(Boolean).join(' ').trim() ||
    [employee.facultyId?.firstName, employee.facultyId?.lastName].filter(Boolean).join(' ').trim() ||
    'Unnamed Employee'
  )
}

function getEmployeeId(employee) {
  return employee.id || employee.empId || employee.employeeId || employee.employeeCode || employee.facultyId?.empId || employee._id
}

function getEmployeeDesignation(employee) {
  return (
    employee.designation ||
    employee.department ||
    employee.facultyId?.designation ||
    employee.employeeDesignation ||
    employee.role ||
    ''
  )
}

function normalizeAttendanceMap(employee) {
  const rawAttendance =
    employee.attendance || employee.attendanceMap || employee.days || employee.dailyAttendance || employee.muster || {}

  if (Array.isArray(rawAttendance)) {
    return rawAttendance.reduce((attendance, item) => {
      const dateKey = item.date || item.attendanceDate || item.day || item.key
      const status = item.status || item.attendance || item.value || item.mark || '-'

      if (dateKey) {
        const parsedDate = new Date(dateKey)
        const normalizedKey = Number.isNaN(parsedDate.getTime())
          ? dateKey
          : `${parsedDate.getFullYear()}-${String(parsedDate.getMonth() + 1).padStart(2, '0')}-${String(
              parsedDate.getDate(),
            ).padStart(2, '0')}`
        attendance[normalizedKey] = status
      }

      return attendance
    }, {})
  }

  return rawAttendance || {}
}

function calculateSummary(attendance) {
  return Object.values(attendance).reduce(
    (summary, rawStatus) => {
      const status = String(rawStatus || '-')

      if (status === 'P') summary.P += 1
      else if (status === 'A') summary.A += 1
      else if (status === 'OFF') summary.OFF += 1
      else if (status === 'L') summary.L += 1
      else if (status === 'H') summary.H += 1
      else if (status === 'R') summary.R += 1
      else if (status === 'OD') summary.OD += 1
      else if (status.includes(':')) {
        status.split(':').forEach((part) => {
          if (summary[part] !== undefined) summary[part] += 0.5
        })
      } else if (status !== '-') {
        summary['?'] += 1
      }

      return summary
    },
    { P: 0, L: 0, H: 0, A: 0, OFF: 0, R: 0, OD: 0, '?': 0 },
  )
}

function normalizeEmployees(payload) {
  return getEmployeeList(payload).map((employee, index) => {
    const attendance = normalizeAttendanceMap(employee)

    return {
      id: getEmployeeId(employee) || `employee-${index}`,
      name: getEmployeeName(employee),
      designation: getEmployeeDesignation(employee),
      attendance,
      summary: employee.summary || employee.totals || employee.counts || calculateSummary(attendance),
    }
  })
}

function getAttendanceStatus(attendance, date) {
  return (
    attendance[date.key] ||
    attendance[String(date.day)] ||
    attendance[date.day] ||
    attendance[date.key.split('-').reverse().join('-')] ||
    '-'
  )
}

export default function AttendanceManagement() {
  const [selectedMonth, setSelectedMonth] = useState(5)
  const [selectedYear, setSelectedYear] = useState(2026)
  const [employees, setEmployees] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const dates = useMemo(() => getMonthDates(selectedYear, selectedMonth), [selectedMonth, selectedYear])
  const monthTitle = new Date(selectedYear, selectedMonth).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })
  const visibleEmployees = employees

  useEffect(() => {
    const controller = new AbortController()

    async function fetchAttendanceMuster() {
      const token = localStorage.getItem('hrms_token')

      setIsLoading(true)
      setErrorMessage('')

      try {
        const response = await fetch(
          `${API_BASE_URL.replace(/\/$/, '')}/api/attendance/muster?month=${selectedMonth + 1}&year=${selectedYear}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            signal: controller.signal,
          },
        )
        const data = await response.json().catch(() => null)

        if (!response.ok) {
          throw new Error(data?.message || data?.error || 'Unable to load attendance muster.')
        }

        setEmployees(normalizeEmployees(data))
      } catch (error) {
        if (error.name === 'AbortError') return
        setEmployees([])
        setErrorMessage(error.message || 'Unable to load attendance muster.')
      } finally {
        if (!controller.signal.aborted) setIsLoading(false)
      }
    }

    fetchAttendanceMuster()

    return () => controller.abort()
  }, [selectedMonth, selectedYear])

  return (
    <div className="flex h-screen overflow-hidden bg-[#051424]">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <CommonHeader />
        <main className="min-h-0 flex-1 overflow-hidden bg-slate-100 ">
          <section className="attendance-report flex h-full flex-col overflow-hidden rounded border border-slate-300 bg-white p-2">
            <div className="attendance-filter-bar">
              <div>
                <h1>Attendance Report</h1>
                <p>{isLoading ? 'Loading attendance...' : monthTitle}</p>
              </div>
              <div className="attendance-filter-controls">
                <label>
                  <span>Month</span>
                  <select value={selectedMonth} onChange={(event) => setSelectedMonth(Number(event.target.value))}>
                    {monthOptions.map((month, index) => (
                      <option value={index} key={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>Year</span>
                  <select value={selectedYear} onChange={(event) => setSelectedYear(Number(event.target.value))}>
                    {yearOptions.map((year) => (
                      <option value={year} key={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
            {errorMessage && (
              <div className="attendance-alert">
                {errorMessage}
              </div>
            )}
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
                  {isLoading && (
                    <tr>
                      <td className="attendance-empty-state" colSpan={dates.length + summaryColumns.length + 1}>
                        Loading attendance muster...
                      </td>
                    </tr>
                  )}
                  {!isLoading &&
                    visibleEmployees.map((employee) => (
                    <tr key={employee.id}>
                      <th className="employee-cell sticky-employee" scope="row">
                        <strong>
                          {employee.name} [{employee.id}]
                        </strong>
                        <span>{employee.designation}</span>
                      </th>
                      {dates.map((date) => {
                        const status = getAttendanceStatus(employee.attendance, date)

                        return (
                          <td className={getCellClass(status, date.isWeekend)} key={`${employee.id}-${date.key}`}>
                            {status}
                          </td>
                        )
                      })}
                      {summaryColumns.map((column) => (
                        <td className="summary-cell" key={`${employee.id}-${column}`}>
                          {employee.summary?.[column] ?? 0}
                        </td>
                      ))}
                    </tr>
                    ))}
                  {!isLoading && visibleEmployees.length === 0 && (
                    <tr>
                      <td className="attendance-empty-state" colSpan={dates.length + summaryColumns.length + 1}>
                        No attendance records found for {monthTitle}.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
        <style>{`
          .attendance-report {
            box-shadow: 0 18px 50px rgba(15, 23, 42, 0.16);
          }

          .attendance-filter-bar {
            align-items: center;
            background: #f8fafc;
            border-bottom: 1px solid #dbe3ed;
            display: flex;
            flex-wrap: wrap;
            gap: 14px;
            justify-content: space-between;
            padding: 12px 16px;
          }

          .attendance-filter-bar h1 {
            color: #1e293b;
            font-size: 18px;
            font-weight: 800;
            line-height: 1.25;
            margin: 0;
          }

          .attendance-filter-bar p {
            color: #0077aa;
            font-size: 13px;
            font-weight: 700;
            margin: 2px 0 0;
          }

          .attendance-filter-controls {
            align-items: end;
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
          }

          .attendance-filter-controls label {
            color: #475569;
            display: grid;
            font-size: 12px;
            font-weight: 800;
            gap: 5px;
            text-transform: uppercase;
          }

          .attendance-filter-controls select {
            appearance: none;
            background: #ffffff;
            border: 1px solid #cbd5e1;
            border-radius: 6px;
            color: #172554;
            cursor: pointer;
            font-size: 14px;
            font-weight: 700;
            min-height: 36px;
            min-width: 120px;
            padding: 7px 34px 7px 10px;
          }

          .attendance-filter-controls label {
            position: relative;
          }

          .attendance-filter-controls label::after {
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            border-top: 6px solid #475569;
            bottom: 14px;
            content: '';
            pointer-events: none;
            position: absolute;
            right: 12px;
          }

          .attendance-alert {
            background: #fff7ed;
            border-bottom: 1px solid #fed7aa;
            color: #9a3412;
            font-size: 13px;
            font-weight: 700;
            padding: 10px 16px;
          }

          .attendance-table-wrap {
            flex: 1;
            min-height: 0;
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

          .attendance-empty-state {
            background: #ffffff;
            color: #64748b;
            font-size: 14px;
            font-weight: 700;
            height: 120px !important;
          }

          @media (max-width: 768px) {
            .attendance-filter-bar {
              align-items: stretch;
            }

            .attendance-filter-controls,
            .attendance-filter-controls label {
              width: 100%;
            }

            .attendance-filter-controls select {
              width: 100%;
            }

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
