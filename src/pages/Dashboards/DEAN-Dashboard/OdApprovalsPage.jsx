import { Check, Clock, Eye, FileText, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import CommonHeader from "../../../components/CommonHeader";
import Sidebar from "../../../components/Siedbar";
import userImg from "../../../assets/userImg.svg";

const statusStyles = {
  Approved: "text-[#18d3bf] bg-[#18d3bf1f]",
  Rejected: "text-[#f16868] bg-[#f168681f]",
  Pending: "text-[#f0a15f] bg-[#f0a15f1f]",
};

const odRequests = [
  {
    name: "Priya Sharma",
    designation: "Assistant Professor",
    department: "Computer Science",
    date: "Jun 10, 2026",
    session: "Full Day",
    purpose: "IEEE Conference at IIT Madras",
    status: "Pending",
  },
  {
    name: "Rahul Verma",
    designation: "Associate Professor",
    department: "Electronics",
    date: "Jun 12, 2026",
    session: "Forenoon",
    purpose: "Industrial Visit - BHEL Trichy",
    status: "Pending",
  },
  {
    name: "Sneha Patel",
    designation: "Lab Instructor",
    department: "Mechanical",
    date: "Jun 08, 2026",
    session: "Full Day",
    purpose: "Workshop on Advanced Manufacturing",
    status: "Approved",
  },
  {
    name: "Ankit Kumar",
    designation: "Assistant Professor",
    department: "Mathematics",
    date: "Jun 15, 2026",
    session: "Afternoon",
    purpose: "Seminar on Applied Statistics",
    status: "Pending",
  },
  {
    name: "Meera Iyer",
    designation: "Professor",
    department: "Physics",
    date: "Jun 05, 2026",
    session: "Full Day",
    purpose: "Research Collaboration - NIT Calicut",
    status: "Rejected",
  },
  {
    name: "Divya Nair",
    designation: "Assistant Professor",
    department: "Chemistry",
    date: "Jun 18, 2026",
    session: "Forenoon",
    purpose: "FDP on Green Chemistry",
    status: "Pending",
  },
  {
    name: "Karthik Rajan",
    designation: "Associate Professor",
    department: "Civil Engineering",
    date: "Jun 20, 2026",
    session: "Full Day",
    purpose: "Site Visit for Research Project",
    status: "Approved",
  },
];

const OdDetailsPopup = ({ request, onClose }) => {
  if (!request) return null;

  return (
    <section
      className="fixed inset-0 z-50 flex justify-end bg-[#020817]/50 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="flex h-full w-[26%] min-w-[380px] flex-col bg-[#071425] shadow-[-18px_0_50px_rgba(0,0,0,0.35)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-[#173150] bg-[#0a1a2d] px-5 py-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#3984ff]">
              OD Request Details
            </p>
            <h2 className="mt-1 text-[18px] font-semibold leading-tight text-white">
              Review On-Duty Request
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#223b5f] bg-[#102640] text-[#9eb0cc] transition hover:border-[#3984ff] hover:text-white"
            aria-label="Close OD details"
          >
            <X size={17} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-3 table-custom-scrollbar">
          <p className="text-[12px] leading-5 text-[#b8c7dd]">
            Review the faculty member's on-duty request details and take appropriate action.
          </p>

          <div className="mt-2 rounded-lg border border-[#1d395e] bg-[#0a1a2d] p-3 shadow-[0_12px_26px_rgba(0,0,0,0.16)]">
            <div className="flex min-w-0 items-center gap-3">
              <img src={userImg} alt="" className="h-11 w-11 shrink-0 rounded-full object-cover" />
              <div className="min-w-0">
                <p className="truncate text-[16px] font-semibold text-white">{request.name}</p>
                <p className="mt-1 truncate text-[12px] text-[#8ca1bd]">
                  {request.designation} - {request.department}
                </p>
              </div>
            </div>

            <div className="my-3 h-px bg-[#1a3556]" />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex items-center gap-2 text-[12px] font-medium text-[#9eb0cc]">
                  <Clock size={14} className="text-[#b8c7dd]" />
                  Date
                </div>
                <p className="mt-1 text-[15px] font-medium text-white">{request.date}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-[12px] font-medium text-[#9eb0cc]">
                  <Clock size={14} className="text-[#b8c7dd]" />
                  Session
                </div>
                <p className="mt-1 text-[15px] font-medium text-white">{request.session}</p>
              </div>
            </div>

            <div className="mt-3">
              <p className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-white">
                <FileText size={15} className="text-[#3984ff]" />
                Purpose
              </p>
              <div className="rounded-lg border border-[#244061] bg-[#0d2138] px-4 py-3 text-[13px] leading-5 text-[#cad7eb]">
                {request.purpose}
              </div>
            </div>
          </div>
        </div>

        <div className="shrink-0 border-t border-[#173150] bg-[#08182a] px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[#2563EB] text-[13px] font-semibold text-white shadow-[0_5px_20px_rgba(25,118,255,0.2)] transition hover:bg-[#0d2b55]"
          >
            Close Details
            <X size={14} />
          </button>
        </div>
      </div>
    </section>
  );
};

const OdApprovalsPage = () => {
  const [requests, setRequests] = useState(odRequests);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const statuses = ["All", "Pending", "Approved", "Rejected"];

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const searchMatch =
        !searchTerm ||
        request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.purpose.toLowerCase().includes(searchTerm.toLowerCase());
      const statusMatch = statusFilter === "All" || request.status === statusFilter;
      return searchMatch && statusMatch;
    });
  }, [requests, searchTerm, statusFilter]);

  const handleApprove = (request) => {
    setRequests((prev) =>
      prev.map((r) => (r === request ? { ...r, status: "Approved" } : r))
    );
  };

  const handleReject = (request) => {
    setRequests((prev) =>
      prev.map((r) => (r === request ? { ...r, status: "Rejected" } : r))
    );
  };

  const pendingCount = requests.filter((r) => r.status === "Pending").length;

  return (
    <div className="flex h-screen overflow-hidden bg-[#051424]">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <CommonHeader />

        <main className="max-h-[calc(100vh-56px)] overflow-y-auto bg-[#071425] px-4 py-4 text-white table-custom-scrollbar">
          <div className="mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-medium leading-tight text-white">
                  OD Approvals
                </h1>
                <p className="mt-1 text-[16px] text-[#9eb0cc]">
                  Review and approve on-duty requests from faculty members.
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-[#183052] bg-[#0a1a2d] p-4 flex items-center gap-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#3984ff1f]">
                  <FileText size={18} className="text-[#3984ff]" />
                </div>
                <div className="min-w-0">
                  <p className="text-[12px] uppercase tracking-wide text-[#8ca1bd]">Total Requests</p>
                  <p className="text-[16px] font-medium text-white">{requests.length}</p>
                </div>
              </div>
              <div className="rounded-lg border border-[#183052] bg-[#0a1a2d] p-4 flex items-start gap-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#e07f306b]">
                  <Clock size={18} className="text-[#ffffff]" />
                </div>
                <div className="min-w-0">
                  <p className="text-[12px] uppercase tracking-wide text-[#8ca1bd]">Pending</p>
                  <p className="text-[16px] font-medium text-[#ffffff]">{pendingCount}</p>
                </div>
              </div>
              <div className="rounded-lg border border-[#183052] bg-[#0a1a2d] p-4 flex items-start gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#18d3bf1f]">
                  <Check size={18} className="text-[#18d3bf]" />
                </div>
                <div className="min-w-0">
                  <p className="text-[12px] uppercase tracking-wide text-[#8ca1bd]">Approved</p>
                  <p className="mt-1 text-[16px] font-medium text-[#ffffff]">
                    {requests.filter((r) => r.status === "Approved").length}
                  </p>
                </div>
              </div>
            </div>

            {/* Table */}
            <section className="mt-5 rounded-xl border border-[#183052] bg-[#0a1a2d]">
              <div className="relative z-20 flex flex-col gap-3 px-4 py-3 xl:flex-row xl:items-center xl:justify-between">
                <h2 className="text-[18px] font-semibold text-white">
                  On-Duty Requests <span>({filteredRequests.length})</span>
                </h2>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Search */}
                  <div className="relative min-w-[220px]">
                    <Search
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6f839f]"
                    />
                    <input
                      type="text"
                      placeholder="Search by name, department..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="h-11 w-full rounded-lg border border-[#244061] bg-[#0d2138] pl-10 pr-3 text-[13px] text-white outline-none transition placeholder:text-[#6f839f] focus:border-[#3984ff] focus:ring-2 focus:ring-[#3984ff33]"
                    />
                  </div>

                  {/* Status Filter */}
                  <div className="flex gap-1 rounded-lg border border-[#244061] bg-[#0d2138] p-1">
                    {statuses.map((status) => (
                      <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-3 py-1.5 rounded-md text-[12px] font-semibold transition ${statusFilter === status
                            ? "bg-[#2563EB] text-white"
                            : "text-[#8ca1bd] hover:text-white"
                          }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="relative z-0 h-[calc(100vh-380px)] overflow-auto table-custom-scrollbar">
                <table className="w-full min-w-[980px] border-collapse text-left">
                  <thead className="sticky top-0 z-10 bg-[#172c46] text-[12px] uppercase tracking-wide text-[#9aacc7]">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Name</th>
                      <th className="px-4 py-3 font-semibold">Department</th>
                      <th className="px-4 py-3 font-semibold">Date</th>
                      <th className="px-4 py-3 font-semibold">Session</th>
                      <th className="px-4 py-3 font-semibold">Purpose</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-4 py-3 text-right font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-[13px] text-[#cad7eb]">
                    {filteredRequests.length > 0 ? (
                      filteredRequests.map((request, index) => (
                        <tr
                          key={`${request.name}-${request.date}-${index}`}
                          className="border-b border-[#132944] last:border-0"
                        >
                          <td className="px-4 py-3 font-semibold text-white">
                            <div className="flex items-center gap-2">
                              <img src={userImg} alt="" className="h-10 w-10 rounded-full object-cover" />
                              <div className="min-w-0">
                                <p className="truncate">{request.name}</p>
                                <p className="truncate text-[12px] font-normal text-[#8ca1bd]">
                                  {request.designation}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">{request.department}</td>
                          <td className="px-4 py-3 font-semibold text-white">{request.date}</td>
                          <td className="px-4 py-3">{request.session}</td>
                          <td className="max-w-[260px] truncate px-4 py-3" title={request.purpose}>
                            {request.purpose}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold ${statusStyles[request.status]}`}
                            >
                              <span className="h-[4px] w-[4px] rounded-full bg-current" />
                              {request.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-2 text-[#8ca1bd]">
                              {request.status === "Pending" && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleApprove(request)}
                                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#18d3bf12] text-[#18d3bf] transition hover:bg-[#18d3bf24] hover:text-white"
                                    aria-label="Approve OD request"
                                    title="Approve"
                                  >
                                    <Check className="h-4 w-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleReject(request)}
                                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#f1686812] text-[#f16868] transition hover:bg-[#f1686824] hover:text-white"
                                    aria-label="Reject OD request"
                                    title="Reject"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </>
                              )}
                              <button
                                type="button"
                                onClick={() => setSelectedRequest(request)}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#c4c6d010] transition hover:bg-[#183052] hover:text-white"
                                aria-label="View OD request details"
                                title="View"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="px-4 py-8 text-center text-[#8ca1bd]">
                          No on-duty requests found matching your filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </main>
      </div>

      <OdDetailsPopup
        request={selectedRequest}
        onClose={() => setSelectedRequest(null)}
      />
    </div>
  );
};

export default OdApprovalsPage;
