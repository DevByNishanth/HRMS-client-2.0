import { useState } from "react";
import { Check, X } from "lucide-react";
import { useLocation } from "react-router-dom";
import Sidebar from "../../components/Siedbar";
import CommonHeader from "../../components/CommonHeader";
import userImg from "../../assets/userImg.svg";

const statusStyles = {
  Approved: "text-[#18d3bf] bg-[#18d3bf1f]",
  Rejected: "text-[#f16868] bg-[#f168681f]",
  Pending: "text-[#f0a15f] bg-[#f0a15f1f]",
};

const regularizationListData = [
  {
    date: "Oct 24, 2023",
    session: "F/N",
    duration: "1 Hour",
    reason: "Missed check-in because of biometric device issue.",
    status: "Approved",
  },
  {
    date: "Oct 23, 2023",
    session: "A/N",
    duration: "2 Hours",
    reason: "Forgot to mark check-out after lab session.",
    status: "Pending",
  },
  {
    date: "Oct 21, 2023",
    session: "F/N",
    duration: "1 Hour",
    reason: "Network issue while marking attendance.",
    status: "Rejected",
  },
  {
    date: "Oct 19, 2023",
    session: "A/N",
    duration: "1 Hour",
    reason: "Attendance correction for approved on-duty work.",
    status: "Approved",
  },
];

const teamRegularizationRequests = [
  {
    name: "Surya Chandran",
    designation: "Assistant Professor",
    date: "Oct 24, 2023",
    session: "F/N",
    duration: "1 Hour",
    reason: "Missed check-in because of biometric device issue.",
    status: "Pending",
  },
  {
    name: "Nivetha Kumar",
    designation: "Associate Professor",
    date: "Oct 23, 2023",
    session: "A/N",
    duration: "2 Hours",
    reason: "Forgot to mark check-out after department meeting.",
    status: "Approved",
  },
  {
    name: "Arjun Prakash",
    designation: "Lab Instructor",
    date: "Oct 22, 2023",
    session: "F/N",
    duration: "1 Hour",
    reason: "Attendance punch was not captured by the device.",
    status: "Pending",
  },
  {
    name: "Maya Srinivasan",
    designation: "Professor",
    date: "Oct 20, 2023",
    session: "A/N",
    duration: "1 Hour",
    reason: "Requested correction for late checkout entry.",
    status: "Rejected",
    rejectionReason: "Checkout correction proof was not attached.",
  },
];

const StatusBadge = ({ status }) => (
  <span
    className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[13px] font-semibold ${statusStyles[status]}`}
  >
    <span className="h-[4px] w-[4px] rounded-full bg-current" />
    {status}
  </span>
);

const RejectConfirmationPopup = ({
  request,
  reason,
  onReasonChange,
  onClose,
  onConfirm,
}) => {
  if (!request) return null;

  return (
    <section
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#020817]/60 px-4 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[440px] rounded-xl border border-[#1d395e] bg-[#0a1a2d] shadow-[0_22px_70px_rgba(0,0,0,0.4)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#173150] px-5 py-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#3984ff]">
              Confirmation
            </p>
            <h2 className="mt-1 text-[18px] font-semibold text-white">
              Reject Regularization
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#223b5f] bg-[#102640] text-[#9eb0cc] transition hover:border-[#3984ff] hover:text-white"
            aria-label="Close rejection confirmation"
          >
            <X size={17} />
          </button>
        </div>

        <div className="px-5 py-4">
          <p className="text-[13px] leading-5 text-[#cad7eb]">
            Reject {request.name}'s regularization request for {request.date}?
          </p>

          <div className="mt-4">
            <label
              htmlFor="regularization-reject-reason"
              className="mb-2 block text-[13px] font-semibold text-white"
            >
              Reason for rejection
            </label>
            <textarea
              id="regularization-reject-reason"
              value={reason}
              onChange={(event) => onReasonChange(event.target.value)}
              rows={4}
              placeholder="Type the reason..."
              className="w-full resize-none rounded-lg border border-[#244061] bg-[#0d2138] px-4 py-3 text-[13px] leading-5 text-white outline-none transition placeholder:text-[#6f839f] focus:border-[#3984ff] focus:ring-2 focus:ring-[#3984ff33]"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-[#173150] px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-md border border-[#244061] px-4 text-[13px] font-semibold text-[#cad7eb] transition hover:bg-[#132b49] hover:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={!reason.trim()}
            className="inline-flex h-10 w-fit px-4 items-center justify-center gap-2 rounded-md bg-[#2563EB] text-[16px] font-semibold text-white shadow-[0_2px_10px_rgba(25,118,255,0.2)] transition hover:bg-[#0d2b55]"
          >
            Reject Request
          </button>
        </div>
      </div>
    </section>
  );
};

const MyRegularizationTable = () => (
  <section className="mt-4 rounded-xl border border-[#183052] bg-[#0a1a2d]">
    <div className="relative z-20 flex items-center justify-between px-4 py-3">
      <h2 className="text-[18px] font-semibold text-white">
        My regularization requests <span>({regularizationListData.length})</span>
      </h2>
    </div>

    <div className="relative z-0 mt-3 max-h-[calc(100vh-280px)] overflow-auto table-custom-scrollbar">
      <table className="w-full min-w-[760px] border-collapse text-left">
        <thead className="sticky top-0 z-10 bg-[#172c46] text-[12px] uppercase tracking-wide text-[#9aacc7]">
          <tr>
            <th className="px-4 py-3 font-semibold">Date</th>
            <th className="px-4 py-3 font-semibold">Session</th>
            <th className="px-4 py-3 font-semibold">Duration</th>
            <th className="px-4 py-3 font-semibold">Reason</th>
            <th className="px-8 py-3 text-right font-semibold">Status</th>
          </tr>
        </thead>
        <tbody className="text-[14px] text-[#cad7eb]">
          {regularizationListData.map((item, index) => (
            <tr key={`${item.date}-${item.session}-${index}`} className="border-b border-[#132944] last:border-0">
              <td className="px-4 py-3 font-semibold text-white">{item.date}</td>
              <td className="px-4 py-3 font-semibold text-white">{item.session}</td>
              <td className="px-4 py-3 font-semibold text-white">{item.duration}</td>
              <td className="max-w-[260px] truncate px-4 py-3 text-white" title={item.reason}>
                {item.reason}
              </td>
              <td className="px-4 py-3 text-right">
                <StatusBadge status={item.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);

const HodRegularizationTable = () => {
  const [requests, setRequests] = useState(teamRegularizationRequests);
  const [rejectRequest, setRejectRequest] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const handleApprove = (request) => {
    setRequests((currentRequests) =>
      currentRequests.map((item) =>
        item === request ? { ...item, status: "Approved", rejectionReason: "" } : item,
      ),
    );
  };

  const handleReject = (request) => {
    setRejectReason("");
    setRejectRequest(request);
  };

  const closeRejectPopup = () => {
    setRejectRequest(null);
    setRejectReason("");
  };

  const confirmReject = () => {
    setRequests((currentRequests) =>
      currentRequests.map((item) =>
        item === rejectRequest
          ? { ...item, status: "Rejected", rejectionReason: rejectReason.trim() }
          : item,
      ),
    );
    closeRejectPopup();
  };

  return (
    <>
      <section className="mt-4 rounded-xl border border-[#183052] bg-[#0a1a2d]">
        <div className="relative z-20 flex items-center justify-between px-4 py-3">
          <h2 className="text-[18px] font-semibold text-white">
            Team regularization requests <span>({requests.length})</span>
          </h2>
        </div>

        <div className="relative z-0 mt-3 max-h-[calc(100vh-280px)] overflow-auto table-custom-scrollbar">
          <table className="w-full min-w-[980px] border-collapse text-left">
            <thead className="sticky top-0 z-10 bg-[#172c46] text-[12px] uppercase tracking-wide text-[#9aacc7]">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Session</th>
                <th className="px-4 py-3 font-semibold">Duration</th>
                <th className="px-4 py-3 font-semibold">Reason</th>
                <th className="px-4 py-3 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="text-[14px] text-[#cad7eb]">
              {requests.map((request, index) => (
                <tr
                  key={`${request.name}-${request.date}-${request.session}-${index}`}
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
                  <td className="px-4 py-3 font-semibold text-white">{request.date}</td>
                  <td className="px-4 py-3">{request.session}</td>
                  <td className="px-4 py-3 font-semibold text-[#18d3bf]">{request.duration}</td>
                  <td className="max-w-[260px] truncate px-4 py-3" title={request.reason}>
                    {request.reason}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {request.status === "Pending" ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleApprove(request)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#18d3bf12] text-[#18d3bf] transition hover:bg-[#18d3bf24] hover:text-white"
                            aria-label="Approve regularization request"
                            title="Approve"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReject(request)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#f1686812] text-[#f16868] transition hover:bg-[#f1686824] hover:text-white"
                            aria-label="Reject regularization request"
                            title="Reject"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        <StatusBadge status={request.status} />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <RejectConfirmationPopup
        request={rejectRequest}
        reason={rejectReason}
        onReasonChange={setRejectReason}
        onClose={closeRejectPopup}
        onConfirm={confirmReject}
      />
    </>
  );
};

const RegularaizationListPage = () => {
  // Auth: replace this hardcoded role with the decoded localStorage token role later.
  const role = "hod";
  const location = useLocation();
  const hodTabs = ["My Regularizations", "Team Regularizations"];
  const initialHodSelectedTab = hodTabs.includes(location.state?.hodSelectedTab)
    ? location.state.hodSelectedTab
    : "My Regularizations";
  const [hodSelectedTab, setHodSelectedTab] = useState(initialHodSelectedTab);

  const content = hodSelectedTab === "My Regularizations"
    ? <MyRegularizationTable />
    : <HodRegularizationTable />;

  return (
    <div className="flex h-screen overflow-hidden bg-[#051424]">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <CommonHeader />

        <main className="max-h-[calc(100vh-56px)] overflow-y-auto bg-[#071425] px-4 py-4 text-white table-custom-scrollbar">
          <div>
            <h1 className="text-xl font-medium leading-tight text-white">
              Regularization History
            </h1>
            <p className="mt-1 text-[16px] text-[#9eb0cc]">
              Review regularization history and track approvals.
            </p>
          </div>

          {role === "hod" && (
            <div className="mt-4 w-full rounded-lg border border-[#213857] bg-[#0d2138] px-4 py-2">
              <div className="flex items-center gap-2">
                {hodTabs.map((tab) => (
                  <button
                    type="button"
                    onClick={() => setHodSelectedTab(tab)}
                    key={tab}
                    className={`px-6 py-2 text-sm font-medium transition ${tab === hodSelectedTab
                        ? "rounded-md bg-[#2563EB] text-white"
                        : "rounded-md hover:bg-slate-600/20"
                      }`}
                  >
                    {tab}
                    {tab === "Team Regularizations" && (
                      <span
                        className={`ml-1 rounded px-2 py-[2px] text-xs ${tab === hodSelectedTab
                            ? "bg-white font-semibold text-blue-700"
                            : "bg-slate-700 text-white"
                          }`}
                      >
                        2
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {role === "hod" ? content : <MyRegularizationTable />}
        </main>
      </div>
    </div>
  );
};

export default RegularaizationListPage;
