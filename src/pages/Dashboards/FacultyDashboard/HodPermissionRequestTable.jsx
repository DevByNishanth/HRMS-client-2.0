import { useMemo, useState } from "react";
import { Check, ChevronDown, Eye, X } from "lucide-react";
import CustomDatePicker from "../../../components/CustomDatePicker";
import PermissionDetailsPopup from "./PermissionDetailsPopup";
import userImg from "../../../assets/userImg.svg";

const statusStyles = {
  Approved: "text-[#18d3bf] bg-[#18d3bf1f]",
  Rejected: "text-[#f16868] bg-[#f168681f]",
  Pending: "text-[#f0a15f] bg-[#f0a15f1f]",
};

const permissionRequests = [
  {
    name: "Surya Chandran",
    designation: "Assistant Professor",
    date: "May 30, 2026",
    session: "Forenoon",
    duration: "1 Hour",
    reason: "Bank appointment during working hours.",
    status: "Pending",
  },
  {
    name: "Nivetha Kumar",
    designation: "Associate Professor",
    date: "May 24, 2026",
    session: "Afternoon",
    duration: "2 Hours",
    reason: "Parent teacher meeting at school.",
    status: "Approved",
  },
  {
    name: "Arjun Prakash",
    designation: "Lab Instructor",
    date: "May 16, 2026",
    session: "Forenoon",
    duration: "1 Hour",
    reason: "Personal documentation work.",
    status: "Rejected",
  },
  {
    name: "Maya Srinivasan",
    designation: "Assistant Professor",
    date: "May 09, 2026",
    session: "Afternoon",
    duration: "1 Hour",
    reason: "Medical consultation.",
    status: "Pending",
  },
  {
    name: "Karthik Raman",
    designation: "Associate Professor",
    date: "May 03, 2026",
    session: "Forenoon",
    duration: "2 Hours",
    reason: "Family emergency.",
    status: "Pending",
  },
];

const DropdownFilter = ({ value, onChange, options, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative min-w-[150px]">
      <button
        type="button"
        onClick={() => setIsOpen((currentState) => !currentState)}
        className="flex h-11 w-full items-center justify-between rounded-lg border border-[#244061] bg-[#0d2138] px-3 text-left text-[16px] text-white outline-none transition hover:border-[#3984ff] focus:border-[#3984ff] focus:ring-2 focus:ring-[#3984ff33]"
      >
        <span className={value !== "All" ? "text-white" : "text-[#6f839f]"}>
          {value || placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`text-[#3984ff] transition ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-lg border border-[#244061] bg-[#0a1a2d] shadow-[0_18px_45px_rgba(0,0,0,0.35)]">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className={`block w-full px-4 py-3 text-left text-[13px] transition ${
                value === option
                  ? "bg-[#132b49] text-white"
                  : "text-[#cad7eb] hover:bg-[#102640] hover:text-white"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const HodPermissionRequestTable = () => {
  const [requests, setRequests] = useState(permissionRequests);
  const [selectedPermission, setSelectedPermission] = useState(null);
  const [status, setStatus] = useState("All");
  const [session, setSession] = useState("All");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const filteredRequests = useMemo(
    () =>
      requests.filter((permission) => {
        const permissionDate = new Date(permission.date);
        const statusMatch = status === "All" || permission.status === status;
        const sessionMatch = session === "All" || permission.session === session;
        const fromMatch = !fromDate || permissionDate >= fromDate;
        const toMatch = !toDate || permissionDate <= toDate;

        return statusMatch && sessionMatch && fromMatch && toMatch;
      }),
    [fromDate, requests, session, status, toDate],
  );

  const hasFilters = status !== "All" || session !== "All" || fromDate || toDate;

  const resetFilters = () => {
    setStatus("All");
    setSession("All");
    setFromDate(null);
    setToDate(null);
  };

  const updateStatus = (request, nextStatus) => {
    setRequests((currentRequests) =>
      currentRequests.map((item) =>
        item === request ? { ...item, status: nextStatus } : item,
      ),
    );
  };

  return (
    <section className="mt-4 rounded-xl border border-[#183052] bg-[#0a1a2d]">
      <div className="relative z-20 flex flex-col gap-3 px-4 py-3 xl:flex-row xl:items-start xl:justify-between">
        <h2 className="text-[18px] font-semibold text-white">
          Permission Requests <span>({filteredRequests.length})</span>
        </h2>

        <div className="flex flex-wrap items-center gap-3">
          <DropdownFilter
            value={session}
            onChange={setSession}
            options={["All", "Forenoon", "Afternoon"]}
            placeholder="Session"
          />
          <DropdownFilter
            value={status}
            onChange={setStatus}
            options={["All", "Approved", "Rejected", "Pending"]}
            placeholder="Status"
          />
          <div className="min-w-[160px]">
            <CustomDatePicker
              id="hod-permission-filter-from"
              value={fromDate}
              onChange={setFromDate}
              placeholder="From Date"
            />
          </div>
          <div className="min-w-[160px]">
            <CustomDatePicker
              id="hod-permission-filter-to"
              value={toDate}
              onChange={setToDate}
              placeholder="To Date"
              popupAlign="right"
            />
          </div>
          {hasFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="h-11 rounded-lg border border-[#244061] bg-[#0d2138] px-4 text-[12px] font-semibold text-[#8ca1bd] transition hover:border-[#3984ff] hover:bg-[#132b49] hover:text-white"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      <div className="relative z-0 h-[calc(100vh-380px)] overflow-auto table-custom-scrollbar">
        <table className="w-full min-w-[980px] border-collapse text-left">
          <thead className="sticky top-0 z-10 bg-[#172c46] text-[12px] uppercase tracking-wide text-[#9aacc7]">
            <tr>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Date</th>
              <th className="px-4 py-3 font-semibold">Session</th>
              <th className="px-4 py-3 font-semibold">Duration</th>
              <th className="px-4 py-3 font-semibold">Reason</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 text-right font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="text-[13px] text-[#cad7eb]">
            {filteredRequests.length > 0 ? (
              filteredRequests.map((permission, index) => {
                const permissionWithColor = {
                  ...permission,
                  statusColor: statusStyles[permission.status],
                };

                return (
                  <tr
                    key={`${permission.name}-${permission.date}-${permission.session}-${index}`}
                    className="border-b border-[#132944] last:border-0"
                  >
                    <td className="px-4 py-3 font-semibold text-white">
                      <div className="flex items-center gap-2">
                        <img src={userImg} alt="" className="h-10 w-10 rounded-full object-cover" />
                        <div className="min-w-0">
                          <p className="truncate">{permission.name}</p>
                          <p className="truncate text-[12px] font-normal text-[#8ca1bd]">
                            {permission.designation}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-white">{permission.date}</td>
                    <td className="px-4 py-3">{permission.session}</td>
                    <td className="px-4 py-3 font-semibold text-[#18d3bf]">
                      {permission.duration}
                    </td>
                    <td className="max-w-[260px] truncate px-4 py-3" title={permission.reason}>
                      {permission.reason}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold ${statusStyles[permission.status]}`}
                      >
                        <span className="h-[4px] w-[4px] rounded-full bg-current" />
                        {permission.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2 text-[#8ca1bd]">
                        {permission.status === "Pending" && (
                          <>
                            <button
                              type="button"
                              onClick={() => updateStatus(permission, "Approved")}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#18d3bf12] text-[#18d3bf] transition hover:bg-[#18d3bf24] hover:text-white"
                              aria-label="Approve permission request"
                              title="Approve"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => updateStatus(permission, "Rejected")}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#f1686812] text-[#f16868] transition hover:bg-[#f1686824] hover:text-white"
                              aria-label="Reject permission request"
                              title="Reject"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        <button
                          type="button"
                          onClick={() => setSelectedPermission(permissionWithColor)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#c4c6d010] transition hover:bg-[#183052] hover:text-white"
                          aria-label="View permission request details"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="px-4 py-8 text-center text-[#8ca1bd]">
                  No permission requests found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <PermissionDetailsPopup
        permission={selectedPermission}
        onClose={() => setSelectedPermission(null)}
      />
    </section>
  );
};

export default HodPermissionRequestTable;
