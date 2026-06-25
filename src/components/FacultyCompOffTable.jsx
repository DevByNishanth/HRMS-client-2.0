import { Download, Eye, Search, CalendarDays, X, AlertCircle, ChevronDown, ChevronLeft, ChevronRight, FileText, TimerReset, Send, Layers, File, ShieldCheck, CheckCircle2, Clock, AlertTriangle, RotateCcw } from "lucide-react";
import React, { useState, useMemo, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { getTokenFromLocalStorage } from "../utils/tokenUtils";
import ExportPasswordModal from "./ExportPasswordModal";
import { exportToExcel } from "../utils/exportToExcel";
import { usePasswordProtectedExport } from "../hooks/usePasswordProtectedExport";

const statusStyles = {
  Approved: "text-[#18d3bf] bg-[#18d3bf1f]",
  Rejected: "text-[#f16868] bg-[#f168681f]",
  Pending: "text-[#f0a15f] bg-[#f0a15f1f]",
  Revoked: "text-[#8ca1bd] bg-[#8ca1bd1f]",
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://sece_hrms_server.onrender.com";

const FilterDatePicker = ({ id, value, onChange, placeholder = "Select date", popupAlign = "left", isOpen, onOpen, onClose }) => {
  const [viewDate, setViewDate] = useState(value || new Date());
  const [showAbove, setShowAbove] = useState(true);
  const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const formatDate = (date) => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
  };

  const calendarDays = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const dates = [];
    for (let i = 0; i < firstDay.getDay(); i += 1) dates.push(null);
    for (let d = 1; d <= lastDay.getDate(); d += 1) dates.push(new Date(year, month, d));
    return dates;
  }, [viewDate]);

  const moveMonth = (dir) => setViewDate((cd) => new Date(cd.getFullYear(), cd.getMonth() + dir, 1));
  const isSelectedDate = (date) => value && date && value.getFullYear() === date.getFullYear() && value.getMonth() === date.getMonth() && value.getDate() === date.getDate();
  const handleSelectDate = (date) => { onChange(date); onClose(); };

  const handleToggle = (e) => {
    if (!isOpen) {
      const rect = e.currentTarget.getBoundingClientRect();
      setShowAbove(rect.top > 320 || window.innerHeight - rect.bottom < 320);
      onOpen();
      return;
    }
    onClose();
  };

  return (
    <div className="relative">
      <button id={id} type="button" onClick={handleToggle}
        className="flex h-11 w-full items-center justify-between rounded-lg border border-[#244061] bg-[#0d2138] px-3 text-left text-[16px] text-white outline-none transition hover:border-[#3984ff] focus:border-[#3984ff] focus:ring-2 focus:ring-[#3984ff33]">
        <span className={value ? "text-white" : "text-[#6f839f]"}>{value ? formatDate(value) : placeholder}</span>
        <CalendarDays size={16} className="text-[#3984ff]" />
      </button>
      {isOpen && (
        <div className={`absolute ${showAbove ? "bottom-[calc(100%+8px)]" : "top-[calc(100%+8px)]"} z-[9999]  w-[280px] rounded-lg border border-[#244061] bg-[#0a1a2d] p-3 shadow-[0_18px_45px_rgba(0,0,0,0.35)] ${popupAlign === "right" ? "right-0" : "left-0"}`}>
          <div className="mb-3 flex items-center justify-between">
            <button type="button" onClick={() => moveMonth(-1)} className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[#9eb0cc] transition hover:bg-[#183052] hover:text-white"><ChevronLeft size={16} /></button>
            <p className="text-[13px] font-semibold text-white">{months[viewDate.getMonth()]} {viewDate.getFullYear()}</p>
            <button type="button" onClick={() => moveMonth(1)} className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[#9eb0cc] transition hover:bg-[#183052] hover:text-white"><ChevronRight size={16} /></button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center">
            {days.map((day) => (<span key={day} className="py-1 text-[10px] font-semibold text-[#8ca1bd]">{day}</span>))}
            {calendarDays.map((date, i) => (
              <button key={date ? date.toISOString() : `empty-${i}`} type="button" disabled={!date} onClick={() => handleSelectDate(date)}
                className={`h-8 rounded-md text-[12px] font-semibold transition ${isSelectedDate(date) ? "bg-[#2563EB] text-white shadow-[0_5px_18px_rgba(37,99,235,0.35)]" : "text-[#cad7eb] hover:bg-[#132b49] hover:text-white"} disabled:pointer-events-none disabled:opacity-0`}>
                {date?.getDate()}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const StatusDropdownFilter = ({ value, onChange, options, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative min-w-[150px]">
      <button type="button" onClick={() => setIsOpen((s) => !s)}
        className="flex h-11 w-full items-center justify-between rounded-lg border border-[#244061] bg-[#0d2138] px-3 text-left text-[16px] text-white outline-none transition hover:border-[#3984ff] focus:border-[#3984ff] focus:ring-2 focus:ring-[#3984ff33]">
        <span className={value !== "All" ? "text-white" : "text-[#6f839f]"}>{value || placeholder}</span>
        <ChevronDown size={16} className={`text-[#3984ff] transition ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-lg border border-[#244061] bg-[#0a1a2d] shadow-[0_18px_45px_rgba(0,0,0,0.35)]">
          {options.map((option) => (
            <button key={option} type="button" onClick={() => { onChange(option); setIsOpen(false); }}
              className={`block w-full px-4 py-3 text-left text-[13px] transition ${value === option ? "bg-[#132b49] text-white" : "text-[#cad7eb] hover:bg-[#102640] hover:text-white"}`}>
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const CompOffDetailsCanvas = ({ compOff, onClose }) => {
  if (!compOff) return null;
  const formatDate = (ds) => ds ? new Date(ds).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : "N/A";
  return (
    <section className="fixed inset-0 z-50 flex justify-end bg-[#020817]/50 backdrop-blur-[2px]" onClick={onClose}>
      <div className="flex h-full w-[26%] min-w-[380px] flex-col bg-[#071425] shadow-[-18px_0_50px_rgba(0,0,0,0.35)]" onClick={(e) => e.stopPropagation()}>
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-[#173150] bg-[#0a1a2d] px-5 py-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#3984ff]">Comp Off Details</p>
            <h2 className="mt-1 text-[18px] font-semibold leading-tight text-white">Review Comp Off</h2>
          </div>
          <button type="button" onClick={onClose} className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#223b5f] bg-[#102640] text-[#9eb0cc] transition hover:border-[#3984ff] hover:text-white"><X size={17} /></button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-3 table-custom-scrollbar">
          <p className="text-[12px] leading-5 text-[#b8c7dd]">Review the selected comp off request and its approval status.</p>
          <div className="mt-2 rounded-lg border border-[#1d395e] bg-[#0a1a2d] p-3 shadow-[0_12px_26px_rgba(0,0,0,0.16)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-[#8ca1bd]"><Layers size={13} className="text-[#3984ff]" /> Comp Off</div>
                <p className="mt-1 text-[16px] font-semibold text-white">Compensation Leave</p>
              </div>
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase ${compOff.statusColor}`}><span className="h-[5px] w-[5px] rounded-full bg-current" />{compOff.status}</span>
            </div>
            <div className="my-3 h-px bg-[#1a3556]" />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex items-center gap-2 text-[12px] font-medium text-[#9eb0cc]"><CalendarDays size={14} className="text-[#b8c7dd]" /> Worked From</div>
                <p className="mt-1 text-[15px] font-medium text-white">{formatDate(compOff.fromDate)}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-[12px] font-medium text-[#9eb0cc]"><CalendarDays size={14} className="text-[#b8c7dd]" /> Worked To</div>
                <p className="mt-1 text-[15px] font-medium text-white">{formatDate(compOff.toDate)}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between rounded-md bg-[#132b49] px-3 py-2.5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1f4070] text-[#6ea1ff]"><TimerReset size={18} /></div>
                <p className="text-[13px] font-medium text-[#cad7eb]">No of Days</p>
              </div>
              <p className="text-[15px] font-semibold text-white">{compOff.noOfDays} {compOff.noOfDays === 1 ? "Day" : "Days"}</p>
            </div>
          </div>
          <div className="mt-3">
            <p className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-white"><FileText size={15} className="text-[#3984ff]" /> Reason</p>
            <div className="rounded-lg border border-[#244061] bg-[#0d2138] px-4 py-3 text-[13px] leading-5 text-[#cad7eb]">{compOff.Reason || compOff.reason || "No reason provided"}</div>
          </div>
          {compOff.documentUrl && (
            <div className="mt-3">
              <p className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-white"><FileText size={15} className="text-[#3984ff]" /> Document</p>
              <div className="rounded-lg border border-[#244061] bg-[#0d2138] px-4 py-3">
                <p onClick={() => window.open(compOff.documentUrl, "_blank")} className="inline-flex cursor-pointer items-center gap-2 text-[13px] font-medium text-[#3984ff] underline transition hover:text-[#6ea1ff]">{"View Document"}</p>
              </div>
            </div>
          )}

          {compOff.approvalHistory && compOff.approvalHistory.length > 0 && (
            <div className="mt-4 border-t border-gray-400/20 pt-4">
              <p className="mb-3 flex items-center gap-2 text-[16px] text-white">
                <ShieldCheck size={15} className="text-[#3984ff]" />
                Approval Workflow
              </p>
              <div className="space-y-0">
                {compOff.approvalHistory.map((history, index) => {
                  const isLast = index === compOff.approvalHistory.length - 1;
                  const isApproved = history.action?.toLowerCase() === "approved";
                  const isRejected = history.action?.toLowerCase() === "rejected";
                  const isSubmitted = history.action?.toLowerCase() === "submitted";
                  const color = isApproved ? "text-[#10b981]" : isRejected ? "text-[#ef4444]" : "text-[#f59e0b]";
                  const bgColor = isApproved ? "bg-[#10b981]" : isRejected ? "bg-[#ef4444]" : "bg-[#f59e0b]";
                  const lightBg = isApproved ? "bg-[#10b98115]" : isRejected ? "bg-[#ef444415]" : "bg-[#f59e0b15]";

                  const getIcon = () => {
                    if (isApproved) return <CheckCircle2 size={18} />;
                    if (isRejected) return <AlertCircle size={18} />;
                    return <Clock size={18} />;
                  };

                  return (
                    <div key={index} className="relative">
                      {!isLast && (
                        <div className={`absolute left-[19px] top-[50px] w-[2px] h-[60px] ${bgColor}`} />
                      )}
                      <div className="relative flex gap-3 pb-4">
                        <div className="flex-shrink-0">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${isApproved ? `${bgColor} border-emerald-200/20` : isRejected ? `${bgColor} border-[#ef4444]` : `${lightBg} border-[#444c63]`} text-white`}>
                            {getIcon()}
                          </div>
                        </div>
                        <div className="flex-1 pt-0.5">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-[13px] font-semibold capitalize text-[#8ca1bd]">{history.role}</p>
                            </div>
                            <span className={`text-[10px] font-semibold uppercase px-2 py-1 rounded-full whitespace-nowrap ${isApproved ? "bg-[#10b98120] text-[#10b981]" : isRejected ? "bg-[#ef444420] text-[#ef4444]" : "bg-[#f59e0b20] text-[#f59e0b]"}`}>
                              {history.action}
                            </span>
                          </div>
                          <p className="text-[12px] text-[#cad7eb] mt-1">{history.remarks}</p>
                          <p className="text-[11px] text-[#6f839f] mt-1.5 flex items-center gap-1">
                            <Clock size={11} />
                            {new Date(history.actionDate).toLocaleDateString("en-US", {
                              month: "short", day: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const mapApiRequest = (req) => {
  const faculty = req.facultyId || {};
  const rejectionEntry = (req.approvalHistory || []).find((h) => h.action?.toLowerCase() === "rejected");
  const doc = req.supportingDocuments?.[0];
  return {
    _id: req._id,
    fromDate: req.workedFromDate,
    toDate: req.workedToDate,
    noOfDays: req.compOffDays,
    Reason: req.reason,
    status: req.status,
    statusColor: statusStyles[req.status] || "",
    documentUrl: doc?.url || "",
    documentName: doc?.publicId?.split("/").pop() || "",
    rejectionReason: rejectionEntry?.remarks || null,
    currentApprovalLevel: req.currentApprovalLevel,
    approvalHistory: req.approvalHistory || [],
  };
};

const FacultyCompOffTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterFromDate, setFilterFromDate] = useState(null);
  const [filterToDate, setFilterToDate] = useState(null);
  const [openDateFilter, setOpenDateFilter] = useState(null);
  const [selectedCompOff, setSelectedCompOff] = useState(null);
  const [revokeTarget, setRevokeTarget] = useState(null);
  const [revokeLoading, setRevokeLoading] = useState(false);
  const [revokeReason, setRevokeReason] = useState("");
  const statuses = ["All", "Approved", "Rejected", "Pending", "Revoked"];

  const {
    isExportModalOpen,
    exportLoading,
    exportError,
    handleExportClick,
    closeExportModal,
    handleConfirmExport,
  } = usePasswordProtectedExport();

  const exportCurrentFilteredRows = () => {
    const rows = filteredData.map((item) => ({
      "Worked From": item.fromDate ? new Date(item.fromDate).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : "",
      "Worked To": item.toDate ? new Date(item.toDate).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : "",
      "No. of Days": item.noOfDays || 0,
      "Reason": item.Reason || item.reason || "",
      "Status": item.status || "",
    }));
    exportToExcel(rows, "My-CompOff.xlsx");
  };

  const fetchCompOffs = useCallback(async () => {
    console.log("fetching")
    setLoading(true);
    setError("");
    try {
      const token = getTokenFromLocalStorage();
      if (!token) {
        setError("Authentication token not found");
        setLoading(false);
        return;
      }
      const response = await fetch(`${API_BASE_URL.replace(/\/$/, "")}/api/comp-off/me`, {
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch comp-off requests");
      }
      const result = await response.json();
      console.log("result : ", result)
      if (result.success && Array.isArray(result.requests)) {
        setData(result.requests.map(mapApiRequest));
      } else {
        setData([]);
      }
    } catch (err) {
      setError(err.message || "An error occurred");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCompOffs();
  }, [fetchCompOffs]);

  const formatDateDisplay = (ds) => ds ? new Date(ds).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : "";

  const filteredData = useMemo(() => data.filter((item) => {
    const q = searchQuery.trim().toLowerCase();
    const ms = !q || (item.Reason || "").toLowerCase().includes(q) || item.status.toLowerCase().includes(q);
    const sm = filterStatus === "All" || item.status === filterStatus;
    const n = (ds) => { const d = new Date(ds); return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())); };
    const ifd = n(item.fromDate), itd = n(item.toDate);
    const ffn = filterFromDate ? new Date(Date.UTC(filterFromDate.getFullYear(), filterFromDate.getMonth(), filterFromDate.getDate())) : null;
    const ftn = filterToDate ? new Date(Date.UTC(filterToDate.getFullYear(), filterToDate.getMonth(), filterToDate.getDate())) : null;
    return ms && sm && (!ffn || ifd >= ffn) && (!ftn || itd <= ftn);
  }), [searchQuery, filterStatus, filterFromDate, filterToDate, data]);

  const hasFilters = searchQuery.trim() !== "" || filterStatus !== "All" || filterFromDate || filterToDate;
  const resetFilters = () => { setSearchQuery(""); setFilterStatus("All"); setFilterFromDate(null); setFilterToDate(null); setOpenDateFilter(null); };

  const handleRevoke = async () => {
    if (!revokeTarget) return;
    setRevokeLoading(true);
    try {
      const token = getTokenFromLocalStorage();
      const response = await fetch(`${API_BASE_URL.replace(/\/$/, "")}/api/comp-off/${revokeTarget._id}/withdraw`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ reason: revokeReason }),
      });
      if (!response.ok) throw new Error("Failed to withdraw comp-off request");
      toast.success("Comp-off request withdrawn successfully");
      await fetchCompOffs();
    } catch (err) {
      toast.error(err.message || "Failed to withdraw request");
    } finally {
      setRevokeLoading(false);
      setRevokeTarget(null);
      setRevokeReason("");
    }
  };

  const openRevoke = (item) => { setRevokeTarget(item); setRevokeReason(""); };

  return (
    <>
      <section className="rounded-xl border border-[#183052] max-h-[calc(100vh-210px)] min-h-[calc(100vh-210px)] bg-[#0a1a2d] mt-3 ">
        <div className="relative z-20 flex flex-col gap-3 px-4 py-3 xl:flex-row xl:items-center xl:justify-between">
          <h2 className="text-[18px] font-semibold text-white">Comp off list <span>({filteredData.length})</span></h2>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-0 w-[200px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6f839f]" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search..." className="h-11 w-full rounded-lg border border-[#244061] bg-[#0d2138] px-3 pl-10 text-[14px] text-white outline-none transition placeholder:text-[#6f839f] hover:border-[#3984ff] focus:border-[#3984ff] focus:ring-2 focus:ring-[#3984ff33]" />
            </div>
            <div className="flex-shrink-0"><StatusDropdownFilter placeholder="Status" value={filterStatus} onChange={setFilterStatus} options={statuses} /></div>
            <div className="flex-shrink-0 min-w-[160px]"><FilterDatePicker id="compoff-filter-from" value={filterFromDate} onChange={setFilterFromDate} placeholder="From Date" isOpen={openDateFilter === "from"} onOpen={() => setOpenDateFilter("from")} onClose={() => setOpenDateFilter(null)} /></div>
            <div className="flex-shrink-0 min-w-[160px]"><FilterDatePicker id="compoff-filter-to" value={filterToDate} onChange={setFilterToDate} placeholder="To Date" popupAlign="right" isOpen={openDateFilter === "to"} onOpen={() => setOpenDateFilter("to")} onClose={() => setOpenDateFilter(null)} /></div>
            {hasFilters && <button type="button" onClick={resetFilters} className="h-11 rounded-lg border border-[#244061] bg-[#0d2138] px-4 text-[12px] font-semibold text-[#8ca1bd] transition hover:border-[#3984ff] hover:bg-[#132b49] hover:text-white">Reset Filters</button>}
          <button
            type="button"
            onClick={handleExportClick}
            disabled={filteredData.length === 0}
            className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#244061] bg-[#0d2138] px-3 text-[14px] font-medium text-white transition hover:border-[#3984ff] hover:bg-[#132b49] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download size={16} />
            Export
          </button>
          </div>
        </div>
        <ExportPasswordModal
          isOpen={isExportModalOpen}
          onClose={closeExportModal}
          onConfirm={(password) => handleConfirmExport(password, exportCurrentFilteredRows)}
          loading={exportLoading}
          error={exportError}
        />
        <div className="relative z-0 max-h-[calc(100vh-280px)] overflow-auto table-custom-scrollbar">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-[#9eb0cc]">Loading...</div>
          ) : error ? (
            <div className="flex items-center justify-center py-12 text-[#f16868]">{error}</div>
          ) : (
            <table className="w-full min-w-[820px] border-collapse text-left">
              <thead className="sticky top-0 z-10 bg-[#172c46] text-[12px] uppercase tracking-wide text-[#9aacc7]">
                <tr>
                  <th className="px-4 py-3 font-semibold">Worked From</th>
                  <th className="px-4 py-3 font-semibold">Worked To</th>
                  <th className="px-4 py-3 font-semibold">No of Days</th>
                  <th className="px-4 py-3 font-semibold">Reason</th>
                  <th className="px-4 py-3 font-semibold">Document</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="text-[12px] text-[#cad7eb]">

                {filteredData.length > 0 ? filteredData.map((item, i) => {
                  const iwc = { ...item, statusColor: statusStyles[item.status] };
                  return (
                    <tr key={i} className="border-b border-[#132944] last:border-0">
                      <td className="px-4 py-3">{formatDateDisplay(item.fromDate)}</td>
                      <td className="px-4 py-3">{formatDateDisplay(item.toDate)}</td>
                      <td className="px-4 py-3 font-semibold text-[#18d3bf]">{item.noOfDays} {item.noOfDays === 1 ? "Day" : "Days"}</td>
                      <td className="px-4 py-3"><div className="max-w-[160px] truncate" title={item.Reason || item.reason}>{item.Reason || item.reason}</div></td>
                      <td className="px-4 py-3"><span onClick={() => item.documentUrl && window.open(item.documentUrl, "_blank")} className={`inline-flex cursor-pointer items-center gap-1 text-[13px] font-medium underline transition ${item.documentUrl ? "text-[#3984ff] hover:text-[#6ea1ff]" : "text-[#6f839f] cursor-default"}`}>{item.documentUrl ? "View Doc" : "—"}</span></td>
                      <td className="px-4 py-3"><span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[13px] font-semibold ${statusStyles[item.status]}`}><span className="h-[4px] w-[4px] rounded-full bg-current" />{item.status}</span></td>
                      <td className="px-4 py-3"><div className="flex items-center justify-end gap-2 text-[#8ca1bd]">{item.currentApprovalLevel === "hod" && <button type="button" onClick={() => openRevoke(item)} className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#c4c6d010] transition hover:bg-[#ef444430] hover:text-[#ef4444]" title="Revoke"><RotateCcw className="h-4 w-4" /></button>}<button type="button" onClick={() => setSelectedCompOff(iwc)} className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#c4c6d010] transition hover:bg-[#183052] hover:text-white"><Eye className="h-4 w-4" /></button></div></td>
                    </tr>
                  );
                }) : (
                  <tr><td colSpan="7" className="px-4 py-8 text-center text-[#8ca1bd]">No comp off requests found matching your filters.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </section>
      <CompOffDetailsCanvas compOff={selectedCompOff} onClose={() => setSelectedCompOff(null)} />
      {revokeTarget && (
        <section
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020817]/60 px-4 backdrop-blur-[2px]"
          onClick={() => { setRevokeTarget(null); setRevokeReason(""); }}
        >
          <div
            className="w-full max-w-[420px] rounded-xl border border-[#1d395e] bg-[#071425] shadow-[0_24px_70px_rgba(0,0,0,0.45)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            <div className="flex items-start justify-between gap-4 border-b border-[#173150] bg-[#0a1a2d] rounded-t-xl px-5 py-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#3984ff]">Revoke Comp-Off</p>
                <h2 className="mt-1 text-[18px] font-semibold leading-tight text-white">Confirm Request</h2>
              </div>
              <button
                type="button"
                onClick={() => { setRevokeTarget(null); setRevokeReason(""); }}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#223b5f] bg-[#102640] text-[#9eb0cc] transition hover:border-[#3984ff] hover:text-white"
                aria-label="Close"
              >
                <X size={17} />
              </button>
            </div>

            {/* BODY */}
            <div className="px-5 py-4">
              <div className="flex gap-3 rounded-lg border border-[#f0a15f40] bg-[#f0a15f12] p-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f0a15f22] text-[#f0a15f]">
                  <AlertTriangle size={18} />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-white">Revoke this comp-off request?</p>
                  <p className="mt-1 text-[12px] leading-5 text-[#b8c7dd]">
                    This will cancel the pending comp-off request from{" "}
                    {revokeTarget.fromDate ? new Date(revokeTarget.fromDate).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : ""} to{" "}
                    {revokeTarget.toDate ? new Date(revokeTarget.toDate).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : ""}.
                  </p>
                </div>
              </div>

              <label htmlFor="revoke-reason" className="mb-2 mt-4 block text-[13px] font-semibold text-white">Reason for Withdrawal</label>
              <textarea
                id="revoke-reason"
                value={revokeReason}
                onChange={(e) => setRevokeReason(e.target.value)}
                rows={4}
                placeholder="Add a short reason..."
                className="w-full resize-none rounded-lg border border-[#244061] bg-[#0d2138] px-4 py-3 text-[13px] leading-5 text-white outline-none transition placeholder:text-[#6f839f] focus:border-[#3984ff] focus:ring-2 focus:ring-[#3984ff33]"
              />
            </div>

            {/* FOOTER */}
            <div className="flex items-center justify-end gap-3 border-t border-[#173150] bg-[#08182a] rounded-b-xl px-5 py-4">
              <button
                type="button"
                onClick={() => { setRevokeTarget(null); setRevokeReason(""); }}
                className="inline-flex h-10 items-center justify-center rounded-md border border-[#244061] px-5 text-[13px] font-semibold text-[#b8c7dd] transition hover:border-[#3984ff] hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={revokeLoading}
                onClick={handleRevoke}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#2563EB] px-5 text-[13px] font-semibold text-white shadow-[0_5px_20px_rgba(25,118,255,0.2)] transition hover:bg-[#1049c4] disabled:opacity-50"
              >
                {revokeLoading ? (
                  <div className="loader"></div>
                ) : (
                  <span className="flex items-center gap-2">
                    Withdraw
                    <Send size={14} />
                  </span>
                )}
              </button>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default FacultyCompOffTable;