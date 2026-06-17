import { useMemo, useState, useEffect } from "react";
import { ChevronDown, Eye, RotateCcw } from "lucide-react";
import { useLocation } from "react-router-dom";
import { getRoleFromToken, getTokenFromLocalStorage } from "../../../utils/tokenUtils";
import CustomDatePicker from "../../../components/CustomDatePicker";
import PermissionDetailsPopup from "./PermissionDetailsPopup";
import WithdrawPermissionPopup from "./WithdrawPermissionPopup";
import HodPermissionRequestTable from "./HodPermissionRequestTable";

const statusStyles = {
  Approved: "text-[#18d3bf] bg-[#18d3bf1f]",
  Rejected: "text-[#f16868] bg-[#f168681f]",
  Pending: "text-[#f0a15f] bg-[#f0a15f1f]",
};

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

const PermissionTable = () => {
  const location = useLocation();
  const role = getRoleFromToken()?.toLowerCase();
  const isDeanOrIqac = role === "dean" || role === "iqac";
  const [selectedPermission, setSelectedPermission] = useState(null);
  const [withdrawPermission, setWithdrawPermission] = useState(null);
  const [permissionsData, setPermissionsData] = useState([]);
  const [status, setStatus] = useState("All");
  const [session, setSession] = useState("All");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [teamPermissionCount, setTeamPermissionCount] = useState(0);

  // Tabs for dean/iqac
  const deanTabs = ["My Permissions"];
  const initialTab = deanTabs.includes(location.state?.deanSelectedTab)
    ? location.state.deanSelectedTab
    : "My Permissions";
  const [selectedTab, setSelectedTab] = useState(initialTab);

  const filteredPermissions = useMemo(
    () =>
      permissionsData.filter((permission) => {
        const permissionDate = permission.dateObj || (permission.raw?.permissionDate ? new Date(permission.raw.permissionDate) : new Date(permission.date));
        const statusMatch = status === "All" || permission.status === status;
        const sessionMatch =
          session === "All" || permission.session === session;

        const normalizeDateOnly = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
        const fromMatch = !fromDate || normalizeDateOnly(permissionDate) >= normalizeDateOnly(fromDate);
        const toMatch = !toDate || normalizeDateOnly(permissionDate) <= normalizeDateOnly(toDate);

        return statusMatch && sessionMatch && fromMatch && toMatch;
      }),
    [permissionsData, fromDate, session, status, toDate],
  );

  const hasFilters =
    status !== "All" || session !== "All" || fromDate || toDate;

  const resetFilters = () => {
    setStatus("All");
    setSession("All");
    setFromDate(null);
    setToDate(null);
  };

  // Fetch my permissions from API
  const fetchPermissions = async () => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://sece_hrms_server.onrender.com";

    const mapApiToPermission = (p) => {
      let dateObj = null;
      if (p.permissionDate) {
        const datePart = String(p.permissionDate).split("T")[0];
        const [y, m, d] = datePart.split("-").map(Number);
        if (y && m && d) {
          dateObj = new Date(y, m - 1, d);
        }
      }

      const hour = p.fromTime ? parseInt(p.fromTime.split(":")[0], 10) : 9;
      const sessionLabel = hour >= 12 ? "Afternoon" : "Forenoon";
      const durationLabel = p.totalMinutes
        ? p.totalMinutes >= 120
          ? `${p.totalMinutes / 60} Hours`
          : `${p.totalMinutes / 60} Hour`
        : "";

      return {
        id: p._id,
        raw: p,
        dateObj,
        date: dateObj
          ? dateObj.toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "",
        session: sessionLabel,
        duration: durationLabel,
        reason: p.reason || "",
        status: p.status || "",
        fromTime: p.fromTime,
        toTime: p.toTime,
      };
    };

    try {
      const token = getTokenFromLocalStorage();
      const res = await fetch(`${API_BASE_URL.replace(/\/$/, "")}/api/permissions/my`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const data = await res.json();
      if (res.ok && data?.success) {
        setPermissionsData(data.data.map(mapApiToPermission));
      } else {
        console.error("Failed to fetch permissions:", data?.message || data);
      }
    } catch (err) {
      console.error("Error fetching permissions:", err);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  const myPermissionsTable = (
    <section className="mt-4 rounded-xl border border-[#183052] bg-[#0a1a2d]">
      <div className="relative z-20 flex flex-col gap-3 px-4 py-3 xl:flex-row xl:items-center xl:justify-between">
        <h2 className="text-[18px] font-semibold text-white">
          Permission requests <span>({filteredPermissions.length})</span>
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
              id="permission-filter-from"
              value={fromDate}
              onChange={setFromDate}
              placeholder="From Date"
            />
          </div>
          <div className="min-w-[160px]">
            <CustomDatePicker
              id="permission-filter-to"
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

      <div className="relative z-0 h-[calc(100vh-380px)]  overflow-auto table-custom-scrollbar">
        <table className="w-full min-w-[820px] border-collapse text-left">
          <thead className="sticky top-0 z-10 bg-[#172c46] text-[12px] uppercase tracking-wide text-[#9aacc7]">
            <tr>
              <th className="px-4 py-3 font-semibold">Date</th>
              <th className="px-4 py-3 font-semibold">Session</th>
              <th className="px-4 py-3 font-semibold">Duration</th>
              <th className="px-4 py-3 font-semibold">Reason</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 text-right font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="text-[16px] text-[#cad7eb]">
            {filteredPermissions.length > 0 ? (
              filteredPermissions.map((permission) => {
                const permissionWithColor = {
                  ...permission,
                  statusColor: statusStyles[permission.status],
                };

                return (
                  <tr
                    key={permission.id || `${permission.date}-${permission.session}`}
                    className="border-b border-[#132944] last:border-0"
                  >
                    <td className="px-4 py-3 font-semibold text-white">
                      {permission.date}
                    </td>
                    <td className="px-4 py-3">{permission.session}</td>
                    <td className="px-4 py-3 font-semibold text-[#18d3bf]">
                      {permission.duration}
                    </td>
                    <td className="max-w-[260px] truncate px-4 py-3">
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
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedPermission(permissionWithColor)
                          }
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#c4c6d010] transition hover:bg-[#183052] hover:text-white"
                          aria-label={`View permission for ${permission.date}`}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {permission.status === "Pending" && (
                          <button
                            type="button"
                            onClick={() =>
                              setWithdrawPermission(permissionWithColor)
                            }
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#f0a15f12] text-[#f0a15f] transition hover:bg-[#f0a15f24] hover:text-white"
                            aria-label={`Withdraw permission for ${permission.date}`}
                          >
                            <RotateCcw className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="px-4 py-8 text-center text-[#8ca1bd]"
                >
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
      <WithdrawPermissionPopup
        permission={withdrawPermission}
        onClose={() => setWithdrawPermission(null)}
        fetchPermissions={fetchPermissions}
        onPermissionCancelled={() => {
          if (withdrawPermission?.id) {
            setPermissionsData((prev) =>
              prev.filter((p) => p.id !== withdrawPermission.id)
            );
          }
        }}
      />
    </section>
  );

  if (!isDeanOrIqac) return myPermissionsTable;

  return (
    <>
      {/* <div className="tab-container mt-4 w-full rounded-lg border border-[#213857] bg-[#0d2138] px-4 py-2">
<div className="flex items-center gap-2">
          {deanTabs.map((tab) => (
            <button
              type="button"
              onClick={() => setSelectedTab(tab)}
              key={tab}
              className={`px-6 py-2 text-sm font-medium transition ${
                tab === selectedTab
                  ? "rounded-md bg-[#2563EB] text-white"
                  : "rounded-md hover:bg-slate-600/20"
              }`}
            >
              {tab}
              {tab === "Permission Requests" && (
                <span
                  className={`ml-1 rounded px-2 py-[2px] text-xs ${
                    tab === selectedTab
                      ? "bg-white font-semibold text-blue-700"
                      : "bg-slate-700 text-white"
                  }`}
                >
                  {teamPermissionCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div> */}

      {selectedTab === "My Permissions" ? myPermissionsTable : (
        <HodPermissionRequestTable
          onCountChange={setTeamPermissionCount}
        />
      )}
    </>
  );
};

export default PermissionTable;
