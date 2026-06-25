import {
  Eye,
  Check,
  X,
  ChevronDown,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  FileText,
  Layers,
  Send,
  TimerReset,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  Loader2,
  RotateCcw,
  Download,
} from "lucide-react";
import { useState, useMemo, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import userImg from '../assets/userImg.svg';
import { getTokenFromLocalStorage } from "../utils/tokenUtils";
import ExportPasswordModal from "./ExportPasswordModal";
import { exportToExcel } from "../utils/exportToExcel";
import { usePasswordProtectedExport } from "../hooks/usePasswordProtectedExport";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://sece_hrms_server.onrender.com";

const statusStyles = {
  Approved: "text-[#18d3bf] bg-[#18d3bf1f]",
  Rejected: "text-[#f16868] bg-[#f168681f]",
  Pending: "text-[#f0a15f] bg-[#f0a15f1f]",
};

const mapApiRequest = (req) => {
  const faculty = req.facultyId || {};
  const name = [faculty.firstName, faculty.lastName].filter(Boolean).join(" ") || "Unknown";
  const rejectionEntry = (req.approvalHistory || []).find((h) => h.action?.toLowerCase() === "rejected");
  const doc = req.supportingDocuments?.[0];
  return {
    id: req._id,
    name,
    designation: faculty.designation || "",
    department: faculty.department || "",
    fromDate: req.workedFromDate,
    toDate: req.workedToDate,
    noOfDays: req.compOffDays,
    reason: req.reason,
    documentUrl: doc?.url || "",
    documentName: doc?.publicId?.split("/").pop() || "",
    status: req.status,
    rejectionReason: rejectionEntry?.remarks || null,
    approvalHistory: (req.approvalHistory || []).map((h) => ({
      role: h.role,
      action: h.action,
      remarks: h.remarks || "",
      actionDate: h.actionDate,
    })),
  };
};

const compOffRequests = [
  {
    id: 1,
    name: "John Doe",
    designation: "Assistant Professor",
    department: "Computer Science",
    fromDate: "Oct 24, 2023",
    toDate: "Oct 24, 2023",
    noOfDays: 1,
    reason: "Worked on weekend for university event coordination and management.",
    document: "CompOff_John.pdf",
    status: "Pending",
    rejectionReason: null,
    approvalHistory: [
      { role: "Faculty", action: "submitted", remarks: "Comp-off request submitted", actionDate: "2023-10-20T10:30:00Z" },
    ],
  },
  {
    id: 2,
    name: "Sarah Smith",
    designation: "Associate Professor",
    department: "Electronics",
    fromDate: "Oct 18, 2023",
    toDate: "Oct 19, 2023",
    noOfDays: 2,
    reason: "Additional duty hours for exam supervision.",
    document: "CompOff_Sarah.pdf",
    status: "Approved",
    rejectionReason: null,
    approvalHistory: [
      { role: "Faculty", action: "submitted", remarks: "Comp-off request submitted", actionDate: "2023-10-15T09:00:00Z" },
      { role: "HOD", action: "approved", remarks: "Approved for extra duty hours.", actionDate: "2023-10-16T14:20:00Z" },
    ],
  },
  {
    id: 3,
    name: "Michael Johnson",
    designation: "Lab Instructor",
    department: "Mechanical",
    fromDate: "Sep 28, 2023",
    toDate: "Sep 30, 2023",
    noOfDays: 3,
    reason: "Worked on holiday for lab setup and maintenance.",
    document: "CompOff_Michael.pdf",
    status: "Pending",
    rejectionReason: null,
    approvalHistory: [
      { role: "Faculty", action: "submitted", remarks: "Comp-off request submitted", actionDate: "2023-09-25T11:00:00Z" },
    ],
  },
  {
    id: 4,
    name: "Emma Wilson",
    designation: "Assistant Professor",
    department: "Computer Science",
    fromDate: "Sep 12, 2023",
    toDate: "Sep 12, 2023",
    noOfDays: 1,
    reason: "External academic review meeting attendance.",
    document: "CompOff_Emma.pdf",
    status: "Approved",
    rejectionReason: null,
    approvalHistory: [
      { role: "Faculty", action: "submitted", remarks: "Comp-off request submitted", actionDate: "2023-09-08T08:45:00Z" },
      { role: "HOD", action: "approved", remarks: "Approved for academic review participation.", actionDate: "2023-09-10T12:30:00Z" },
    ],
  },
  {
    id: 5,
    name: "David Brown",
    designation: "Associate Professor",
    department: "Civil",
    fromDate: "Aug 30, 2023",
    toDate: "Aug 30, 2023",
    noOfDays: 1,
    reason: "Compensation for weekend duty work.",
    document: "CompOff_David.pdf",
    status: "Rejected",
    rejectionReason: "Sufficient staff already available for that period.",
    approvalHistory: [
      { role: "Faculty", action: "submitted", remarks: "Comp-off request submitted", actionDate: "2023-08-25T09:15:00Z" },
      { role: "HOD", action: "rejected", remarks: "Sufficient staff already available for that period.", actionDate: "2023-08-27T16:00:00Z" },
    ],
  },
  {
    id: 1,
    name: "John Doe",
    designation: "Assistant Professor",
    department: "Computer Science",
    fromDate: "Oct 24, 2023",
    toDate: "Oct 24, 2023",
    noOfDays: 1,
    reason: "Worked on weekend for university event coordination and management.",
    document: "CompOff_John.pdf",
    status: "Pending",
    rejectionReason: null,
    approvalHistory: [
      { role: "Faculty", action: "submitted", remarks: "Comp-off request submitted", actionDate: "2023-10-20T10:30:00Z" },
    ],
  },
  {
    id: 2,
    name: "Sarah Smith",
    designation: "Associate Professor",
    department: "Electronics",
    fromDate: "Oct 18, 2023",
    toDate: "Oct 19, 2023",
    noOfDays: 2,
    reason: "Additional duty hours for exam supervision.",
    document: "CompOff_Sarah.pdf",
    status: "Approved",
    rejectionReason: null,
    approvalHistory: [
      { role: "Faculty", action: "submitted", remarks: "Comp-off request submitted", actionDate: "2023-10-15T09:00:00Z" },
      { role: "HOD", action: "approved", remarks: "Approved for extra duty hours.", actionDate: "2023-10-16T14:20:00Z" },
    ],
  },
  {
    id: 3,
    name: "Michael Johnson",
    designation: "Lab Instructor",
    department: "Mechanical",
    fromDate: "Sep 28, 2023",
    toDate: "Sep 30, 2023",
    noOfDays: 3,
    reason: "Worked on holiday for lab setup and maintenance.",
    document: "CompOff_Michael.pdf",
    status: "Pending",
    rejectionReason: null,
    approvalHistory: [
      { role: "Faculty", action: "submitted", remarks: "Comp-off request submitted", actionDate: "2023-09-25T11:00:00Z" },
    ],
  },
  {
    id: 4,
    name: "Emma Wilson",
    designation: "Assistant Professor",
    department: "Computer Science",
    fromDate: "Sep 12, 2023",
    toDate: "Sep 12, 2023",
    noOfDays: 1,
    reason: "External academic review meeting attendance.",
    document: "CompOff_Emma.pdf",
    status: "Approved",
    rejectionReason: null,
    approvalHistory: [
      { role: "Faculty", action: "submitted", remarks: "Comp-off request submitted", actionDate: "2023-09-08T08:45:00Z" },
      { role: "HOD", action: "approved", remarks: "Approved for academic review participation.", actionDate: "2023-09-10T12:30:00Z" },
    ],
  },
  {
    id: 5,
    name: "David Brown",
    designation: "Associate Professor",
    department: "Civil",
    fromDate: "Aug 30, 2023",
    toDate: "Aug 30, 2023",
    noOfDays: 1,
    reason: "Compensation for weekend duty work.",
    document: "CompOff_David.pdf",
    status: "Rejected",
    rejectionReason: "Sufficient staff already available for that period.",
    approvalHistory: [
      { role: "Faculty", action: "submitted", remarks: "Comp-off request submitted", actionDate: "2023-08-25T09:15:00Z" },
      { role: "HOD", action: "rejected", remarks: "Sufficient staff already available for that period.", actionDate: "2023-08-27T16:00:00Z" },
    ],
  },
  {
    id: 1,
    name: "John Doe",
    designation: "Assistant Professor",
    department: "Computer Science",
    fromDate: "Oct 24, 2023",
    toDate: "Oct 24, 2023",
    noOfDays: 1,
    reason: "Worked on weekend for university event coordination and management.",
    document: "CompOff_John.pdf",
    status: "Pending",
    rejectionReason: null,
    approvalHistory: [
      { role: "Faculty", action: "submitted", remarks: "Comp-off request submitted", actionDate: "2023-10-20T10:30:00Z" },
    ],
  },
  {
    id: 2,
    name: "Sarah Smith",
    designation: "Associate Professor",
    department: "Electronics",
    fromDate: "Oct 18, 2023",
    toDate: "Oct 19, 2023",
    noOfDays: 2,
    reason: "Additional duty hours for exam supervision.",
    document: "CompOff_Sarah.pdf",
    status: "Approved",
    rejectionReason: null,
    approvalHistory: [
      { role: "Faculty", action: "submitted", remarks: "Comp-off request submitted", actionDate: "2023-10-15T09:00:00Z" },
      { role: "HOD", action: "approved", remarks: "Approved for extra duty hours.", actionDate: "2023-10-16T14:20:00Z" },
    ],
  },
  {
    id: 3,
    name: "Michael Johnson",
    designation: "Lab Instructor",
    department: "Mechanical",
    fromDate: "Sep 28, 2023",
    toDate: "Sep 30, 2023",
    noOfDays: 3,
    reason: "Worked on holiday for lab setup and maintenance.",
    document: "CompOff_Michael.pdf",
    status: "Pending",
    rejectionReason: null,
    approvalHistory: [
      { role: "Faculty", action: "submitted", remarks: "Comp-off request submitted", actionDate: "2023-09-25T11:00:00Z" },
    ],
  },
  {
    id: 4,
    name: "Emma Wilson",
    designation: "Assistant Professor",
    department: "Computer Science",
    fromDate: "Sep 12, 2023",
    toDate: "Sep 12, 2023",
    noOfDays: 1,
    reason: "External academic review meeting attendance.",
    document: "CompOff_Emma.pdf",
    status: "Approved",
    rejectionReason: null,
    approvalHistory: [
      { role: "Faculty", action: "submitted", remarks: "Comp-off request submitted", actionDate: "2023-09-08T08:45:00Z" },
      { role: "HOD", action: "approved", remarks: "Approved for academic review participation.", actionDate: "2023-09-10T12:30:00Z" },
    ],
  },
  {
    id: 5,
    name: "David Brown",
    designation: "Associate Professor",
    department: "Civil",
    fromDate: "Aug 30, 2023",
    toDate: "Aug 30, 2023",
    noOfDays: 1,
    reason: "Compensation for weekend duty work.",
    document: "CompOff_David.pdf",
    status: "Rejected",
    rejectionReason: "Sufficient staff already available for that period.",
    approvalHistory: [
      { role: "Faculty", action: "submitted", remarks: "Comp-off request submitted", actionDate: "2023-08-25T09:15:00Z" },
      { role: "HOD", action: "rejected", remarks: "Sufficient staff already available for that period.", actionDate: "2023-08-27T16:00:00Z" },
    ],
  },
  {
    id: 1,
    name: "John Doe",
    designation: "Assistant Professor",
    department: "Computer Science",
    fromDate: "Oct 24, 2023",
    toDate: "Oct 24, 2023",
    noOfDays: 1,
    reason: "Worked on weekend for university event coordination and management.",
    document: "CompOff_John.pdf",
    status: "Pending",
    rejectionReason: null,
    approvalHistory: [
      { role: "Faculty", action: "submitted", remarks: "Comp-off request submitted", actionDate: "2023-10-20T10:30:00Z" },
    ],
  },
  {
    id: 2,
    name: "Sarah Smith",
    designation: "Associate Professor",
    department: "Electronics",
    fromDate: "Oct 18, 2023",
    toDate: "Oct 19, 2023",
    noOfDays: 2,
    reason: "Additional duty hours for exam supervision.",
    document: "CompOff_Sarah.pdf",
    status: "Approved",
    rejectionReason: null,
    approvalHistory: [
      { role: "Faculty", action: "submitted", remarks: "Comp-off request submitted", actionDate: "2023-10-15T09:00:00Z" },
      { role: "HOD", action: "approved", remarks: "Approved for extra duty hours.", actionDate: "2023-10-16T14:20:00Z" },
    ],
  },
  {
    id: 3,
    name: "Michael Johnson",
    designation: "Lab Instructor",
    department: "Mechanical",
    fromDate: "Sep 28, 2023",
    toDate: "Sep 30, 2023",
    noOfDays: 3,
    reason: "Worked on holiday for lab setup and maintenance.",
    document: "CompOff_Michael.pdf",
    status: "Pending",
    rejectionReason: null,
    approvalHistory: [
      { role: "Faculty", action: "submitted", remarks: "Comp-off request submitted", actionDate: "2023-09-25T11:00:00Z" },
    ],
  },
  {
    id: 4,
    name: "Emma Wilson",
    designation: "Assistant Professor",
    department: "Computer Science",
    fromDate: "Sep 12, 2023",
    toDate: "Sep 12, 2023",
    noOfDays: 1,
    reason: "External academic review meeting attendance.",
    document: "CompOff_Emma.pdf",
    status: "Approved",
    rejectionReason: null,
    approvalHistory: [
      { role: "Faculty", action: "submitted", remarks: "Comp-off request submitted", actionDate: "2023-09-08T08:45:00Z" },
      { role: "HOD", action: "approved", remarks: "Approved for academic review participation.", actionDate: "2023-09-10T12:30:00Z" },
    ],
  },
  {
    id: 5,
    name: "David Brown",
    designation: "Associate Professor",
    department: "Civil",
    fromDate: "Aug 30, 2023",
    toDate: "Aug 30, 2023",
    noOfDays: 1,
    reason: "Compensation for weekend duty work.",
    document: "CompOff_David.pdf",
    status: "Rejected",
    rejectionReason: "Sufficient staff already available for that period.",
    approvalHistory: [
      { role: "Faculty", action: "submitted", remarks: "Comp-off request submitted", actionDate: "2023-08-25T09:15:00Z" },
      { role: "HOD", action: "rejected", remarks: "Sufficient staff already available for that period.", actionDate: "2023-08-27T16:00:00Z" },
    ],
  },
  {
    id: 1,
    name: "John Doe",
    designation: "Assistant Professor",
    department: "Computer Science",
    fromDate: "Oct 24, 2023",
    toDate: "Oct 24, 2023",
    noOfDays: 1,
    reason: "Worked on weekend for university event coordination and management.",
    document: "CompOff_John.pdf",
    status: "Pending",
    rejectionReason: null,
    approvalHistory: [
      { role: "Faculty", action: "submitted", remarks: "Comp-off request submitted", actionDate: "2023-10-20T10:30:00Z" },
    ],
  },
  {
    id: 2,
    name: "Sarah Smith",
    designation: "Associate Professor",
    department: "Electronics",
    fromDate: "Oct 18, 2023",
    toDate: "Oct 19, 2023",
    noOfDays: 2,
    reason: "Additional duty hours for exam supervision.",
    document: "CompOff_Sarah.pdf",
    status: "Approved",
    rejectionReason: null,
    approvalHistory: [
      { role: "Faculty", action: "submitted", remarks: "Comp-off request submitted", actionDate: "2023-10-15T09:00:00Z" },
      { role: "HOD", action: "approved", remarks: "Approved for extra duty hours.", actionDate: "2023-10-16T14:20:00Z" },
    ],
  },
  {
    id: 3,
    name: "Michael Johnson",
    designation: "Lab Instructor",
    department: "Mechanical",
    fromDate: "Sep 28, 2023",
    toDate: "Sep 30, 2023",
    noOfDays: 3,
    reason: "Worked on holiday for lab setup and maintenance.",
    document: "CompOff_Michael.pdf",
    status: "Pending",
    rejectionReason: null,
    approvalHistory: [
      { role: "Faculty", action: "submitted", remarks: "Comp-off request submitted", actionDate: "2023-09-25T11:00:00Z" },
    ],
  },
  {
    id: 4,
    name: "Emma Wilson",
    designation: "Assistant Professor",
    department: "Computer Science",
    fromDate: "Sep 12, 2023",
    toDate: "Sep 12, 2023",
    noOfDays: 1,
    reason: "External academic review meeting attendance.",
    document: "CompOff_Emma.pdf",
    status: "Approved",
    rejectionReason: null,
    approvalHistory: [
      { role: "Faculty", action: "submitted", remarks: "Comp-off request submitted", actionDate: "2023-09-08T08:45:00Z" },
      { role: "HOD", action: "approved", remarks: "Approved for academic review participation.", actionDate: "2023-09-10T12:30:00Z" },
    ],
  },
  {
    id: 5,
    name: "David Brown",
    designation: "Associate Professor",
    department: "Civil",
    fromDate: "Aug 30, 2023",
    toDate: "Aug 30, 2023",
    noOfDays: 1,
    reason: "Compensation for weekend duty work.",
    document: "CompOff_David.pdf",
    status: "Rejected",
    rejectionReason: "Sufficient staff already available for that period.",
    approvalHistory: [
      { role: "Faculty", action: "submitted", remarks: "Comp-off request submitted", actionDate: "2023-08-25T09:15:00Z" },
      { role: "HOD", action: "rejected", remarks: "Sufficient staff already available for that period.", actionDate: "2023-08-27T16:00:00Z" },
    ],
  },
  {
    id: 1,
    name: "John Doe",
    designation: "Assistant Professor",
    department: "Computer Science",
    fromDate: "Oct 24, 2023",
    toDate: "Oct 24, 2023",
    noOfDays: 1,
    reason: "Worked on weekend for university event coordination and management.",
    document: "CompOff_John.pdf",
    status: "Pending",
    rejectionReason: null,
    approvalHistory: [
      { role: "Faculty", action: "submitted", remarks: "Comp-off request submitted", actionDate: "2023-10-20T10:30:00Z" },
    ],
  },
  {
    id: 2,
    name: "Sarah Smith",
    designation: "Associate Professor",
    department: "Electronics",
    fromDate: "Oct 18, 2023",
    toDate: "Oct 19, 2023",
    noOfDays: 2,
    reason: "Additional duty hours for exam supervision.",
    document: "CompOff_Sarah.pdf",
    status: "Approved",
    rejectionReason: null,
    approvalHistory: [
      { role: "Faculty", action: "submitted", remarks: "Comp-off request submitted", actionDate: "2023-10-15T09:00:00Z" },
      { role: "HOD", action: "approved", remarks: "Approved for extra duty hours.", actionDate: "2023-10-16T14:20:00Z" },
    ],
  },
  {
    id: 3,
    name: "Michael Johnson",
    designation: "Lab Instructor",
    department: "Mechanical",
    fromDate: "Sep 28, 2023",
    toDate: "Sep 30, 2023",
    noOfDays: 3,
    reason: "Worked on holiday for lab setup and maintenance.",
    document: "CompOff_Michael.pdf",
    status: "Pending",
    rejectionReason: null,
    approvalHistory: [
      { role: "Faculty", action: "submitted", remarks: "Comp-off request submitted", actionDate: "2023-09-25T11:00:00Z" },
    ],
  },
  {
    id: 4,
    name: "Emma Wilson",
    designation: "Assistant Professor",
    department: "Computer Science",
    fromDate: "Sep 12, 2023",
    toDate: "Sep 12, 2023",
    noOfDays: 1,
    reason: "External academic review meeting attendance.",
    document: "CompOff_Emma.pdf",
    status: "Approved",
    rejectionReason: null,
    approvalHistory: [
      { role: "Faculty", action: "submitted", remarks: "Comp-off request submitted", actionDate: "2023-09-08T08:45:00Z" },
      { role: "HOD", action: "approved", remarks: "Approved for academic review participation.", actionDate: "2023-09-10T12:30:00Z" },
    ],
  },
  {
    id: 5,
    name: "David Brown",
    designation: "Associate Professor",
    department: "Civil",
    fromDate: "Aug 30, 2023",
    toDate: "Aug 30, 2023",
    noOfDays: 1,
    reason: "Compensation for weekend duty work.",
    document: "CompOff_David.pdf",
    status: "Rejected",
    rejectionReason: "Sufficient staff already available for that period.",
    approvalHistory: [
      { role: "Faculty", action: "submitted", remarks: "Comp-off request submitted", actionDate: "2023-08-25T09:15:00Z" },
      { role: "HOD", action: "rejected", remarks: "Sufficient staff already available for that period.", actionDate: "2023-08-27T16:00:00Z" },
    ],
  },
  {
    id: 1,
    name: "John Doe",
    designation: "Assistant Professor",
    department: "Computer Science",
    fromDate: "Oct 24, 2023",
    toDate: "Oct 24, 2023",
    noOfDays: 1,
    reason: "Worked on weekend for university event coordination and management.",
    document: "CompOff_John.pdf",
    status: "Pending",
    rejectionReason: null,
    approvalHistory: [
      { role: "Faculty", action: "submitted", remarks: "Comp-off request submitted", actionDate: "2023-10-20T10:30:00Z" },
    ],
  },
  {
    id: 2,
    name: "Sarah Smith",
    designation: "Associate Professor",
    department: "Electronics",
    fromDate: "Oct 18, 2023",
    toDate: "Oct 19, 2023",
    noOfDays: 2,
    reason: "Additional duty hours for exam supervision.",
    document: "CompOff_Sarah.pdf",
    status: "Approved",
    rejectionReason: null,
    approvalHistory: [
      { role: "Faculty", action: "submitted", remarks: "Comp-off request submitted", actionDate: "2023-10-15T09:00:00Z" },
      { role: "HOD", action: "approved", remarks: "Approved for extra duty hours.", actionDate: "2023-10-16T14:20:00Z" },
    ],
  },
  {
    id: 3,
    name: "Michael Johnson",
    designation: "Lab Instructor",
    department: "Mechanical",
    fromDate: "Sep 28, 2023",
    toDate: "Sep 30, 2023",
    noOfDays: 3,
    reason: "Worked on holiday for lab setup and maintenance.",
    document: "CompOff_Michael.pdf",
    status: "Pending",
    rejectionReason: null,
    approvalHistory: [
      { role: "Faculty", action: "submitted", remarks: "Comp-off request submitted", actionDate: "2023-09-25T11:00:00Z" },
    ],
  },
  {
    id: 4,
    name: "Emma Wilson",
    designation: "Assistant Professor",
    department: "Computer Science",
    fromDate: "Sep 12, 2023",
    toDate: "Sep 12, 2023",
    noOfDays: 1,
    reason: "External academic review meeting attendance.",
    document: "CompOff_Emma.pdf",
    status: "Approved",
    rejectionReason: null,
    approvalHistory: [
      { role: "Faculty", action: "submitted", remarks: "Comp-off request submitted", actionDate: "2023-09-08T08:45:00Z" },
      { role: "HOD", action: "approved", remarks: "Approved for academic review participation.", actionDate: "2023-09-10T12:30:00Z" },
    ],
  },
  {
    id: 5,
    name: "David Brown",
    designation: "Associate Professor",
    department: "Civil",
    fromDate: "Aug 30, 2023",
    toDate: "Aug 30, 2023",
    noOfDays: 1,
    reason: "Compensation for weekend duty work.",
    document: "CompOff_David.pdf",
    status: "Rejected",
    rejectionReason: "Sufficient staff already available for that period.",
    approvalHistory: [
      { role: "Faculty", action: "submitted", remarks: "Comp-off request submitted", actionDate: "2023-08-25T09:15:00Z" },
      { role: "HOD", action: "rejected", remarks: "Sufficient staff already available for that period.", actionDate: "2023-08-27T16:00:00Z" },
    ],
  },
  {
    id: 1,
    name: "John Doe",
    designation: "Assistant Professor",
    department: "Computer Science",
    fromDate: "Oct 24, 2023",
    toDate: "Oct 24, 2023",
    noOfDays: 1,
    reason: "Worked on weekend for university event coordination and management.",
    document: "CompOff_John.pdf",
    status: "Pending",
    rejectionReason: null,
    approvalHistory: [
      { role: "Faculty", action: "submitted", remarks: "Comp-off request submitted", actionDate: "2023-10-20T10:30:00Z" },
    ],
  },
  {
    id: 2,
    name: "Sarah Smith",
    designation: "Associate Professor",
    department: "Electronics",
    fromDate: "Oct 18, 2023",
    toDate: "Oct 19, 2023",
    noOfDays: 2,
    reason: "Additional duty hours for exam supervision.",
    document: "CompOff_Sarah.pdf",
    status: "Approved",
    rejectionReason: null,
    approvalHistory: [
      { role: "Faculty", action: "submitted", remarks: "Comp-off request submitted", actionDate: "2023-10-15T09:00:00Z" },
      { role: "HOD", action: "approved", remarks: "Approved for extra duty hours.", actionDate: "2023-10-16T14:20:00Z" },
    ],
  },
  {
    id: 3,
    name: "Michael Johnson",
    designation: "Lab Instructor",
    department: "Mechanical",
    fromDate: "Sep 28, 2023",
    toDate: "Sep 30, 2023",
    noOfDays: 3,
    reason: "Worked on holiday for lab setup and maintenance.",
    document: "CompOff_Michael.pdf",
    status: "Pending",
    rejectionReason: null,
    approvalHistory: [
      { role: "Faculty", action: "submitted", remarks: "Comp-off request submitted", actionDate: "2023-09-25T11:00:00Z" },
    ],
  },
  {
    id: 4,
    name: "Emma Wilson",
    designation: "Assistant Professor",
    department: "Computer Science",
    fromDate: "Sep 12, 2023",
    toDate: "Sep 12, 2023",
    noOfDays: 1,
    reason: "External academic review meeting attendance.",
    document: "CompOff_Emma.pdf",
    status: "Approved",
    rejectionReason: null,
    approvalHistory: [
      { role: "Faculty", action: "submitted", remarks: "Comp-off request submitted", actionDate: "2023-09-08T08:45:00Z" },
      { role: "HOD", action: "approved", remarks: "Approved for academic review participation.", actionDate: "2023-09-10T12:30:00Z" },
    ],
  },
  {
    id: 5,
    name: "David Brown",
    designation: "Associate Professor",
    department: "Civil",
    fromDate: "Aug 30, 2023",
    toDate: "Aug 30, 2023",
    noOfDays: 1,
    reason: "Compensation for weekend duty work.",
    document: "CompOff_David.pdf",
    status: "Rejected",
    rejectionReason: "Sufficient staff already available for that period.",
    approvalHistory: [
      { role: "Faculty", action: "submitted", remarks: "Comp-off request submitted", actionDate: "2023-08-25T09:15:00Z" },
      { role: "HOD", action: "rejected", remarks: "Sufficient staff already available for that period.", actionDate: "2023-08-27T16:00:00Z" },
    ],
  },
  {
    id: 1,
    name: "John Doe",
    designation: "Assistant Professor",
    department: "Computer Science",
    fromDate: "Oct 24, 2023",
    toDate: "Oct 24, 2023",
    noOfDays: 1,
    reason: "Worked on weekend for university event coordination and management.",
    document: "CompOff_John.pdf",
    status: "Pending",
    rejectionReason: null,
    approvalHistory: [
      { role: "Faculty", action: "submitted", remarks: "Comp-off request submitted", actionDate: "2023-10-20T10:30:00Z" },
    ],
  },
  {
    id: 2,
    name: "Sarah Smith",
    designation: "Associate Professor",
    department: "Electronics",
    fromDate: "Oct 18, 2023",
    toDate: "Oct 19, 2023",
    noOfDays: 2,
    reason: "Additional duty hours for exam supervision.",
    document: "CompOff_Sarah.pdf",
    status: "Approved",
    rejectionReason: null,
    approvalHistory: [
      { role: "Faculty", action: "submitted", remarks: "Comp-off request submitted", actionDate: "2023-10-15T09:00:00Z" },
      { role: "HOD", action: "approved", remarks: "Approved for extra duty hours.", actionDate: "2023-10-16T14:20:00Z" },
    ],
  },
  {
    id: 3,
    name: "Michael Johnson",
    designation: "Lab Instructor",
    department: "Mechanical",
    fromDate: "Sep 28, 2023",
    toDate: "Sep 30, 2023",
    noOfDays: 3,
    reason: "Worked on holiday for lab setup and maintenance.",
    document: "CompOff_Michael.pdf",
    status: "Pending",
    rejectionReason: null,
    approvalHistory: [
      { role: "Faculty", action: "submitted", remarks: "Comp-off request submitted", actionDate: "2023-09-25T11:00:00Z" },
    ],
  },
  {
    id: 4,
    name: "Emma Wilson",
    designation: "Assistant Professor",
    department: "Computer Science",
    fromDate: "Sep 12, 2023",
    toDate: "Sep 12, 2023",
    noOfDays: 1,
    reason: "External academic review meeting attendance.",
    document: "CompOff_Emma.pdf",
    status: "Approved",
    rejectionReason: null,
    approvalHistory: [
      { role: "Faculty", action: "submitted", remarks: "Comp-off request submitted", actionDate: "2023-09-08T08:45:00Z" },
      { role: "HOD", action: "approved", remarks: "Approved for academic review participation.", actionDate: "2023-09-10T12:30:00Z" },
    ],
  },
  {
    id: 5,
    name: "David Brown",
    designation: "Associate Professor",
    department: "Civil",
    fromDate: "Aug 30, 2023",
    toDate: "Aug 30, 2023",
    noOfDays: 1,
    reason: "Compensation for weekend duty work.",
    document: "CompOff_David.pdf",
    status: "Rejected",
    rejectionReason: "Sufficient staff already available for that period.",
    approvalHistory: [
      { role: "Faculty", action: "submitted", remarks: "Comp-off request submitted", actionDate: "2023-08-25T09:15:00Z" },
      { role: "HOD", action: "rejected", remarks: "Sufficient staff already available for that period.", actionDate: "2023-08-27T16:00:00Z" },
    ],
  },
  {
    id: 1,
    name: "John Doe",
    designation: "Assistant Professor",
    department: "Computer Science",
    fromDate: "Oct 24, 2023",
    toDate: "Oct 24, 2023",
    noOfDays: 1,
    reason: "Worked on weekend for university event coordination and management.",
    document: "CompOff_John.pdf",
    status: "Pending",
    rejectionReason: null,
    approvalHistory: [
      { role: "Faculty", action: "submitted", remarks: "Comp-off request submitted", actionDate: "2023-10-20T10:30:00Z" },
    ],
  },
  {
    id: 2,
    name: "Sarah Smith",
    designation: "Associate Professor",
    department: "Electronics",
    fromDate: "Oct 18, 2023",
    toDate: "Oct 19, 2023",
    noOfDays: 2,
    reason: "Additional duty hours for exam supervision.",
    document: "CompOff_Sarah.pdf",
    status: "Approved",
    rejectionReason: null,
    approvalHistory: [
      { role: "Faculty", action: "submitted", remarks: "Comp-off request submitted", actionDate: "2023-10-15T09:00:00Z" },
      { role: "HOD", action: "approved", remarks: "Approved for extra duty hours.", actionDate: "2023-10-16T14:20:00Z" },
    ],
  },
  {
    id: 3,
    name: "Michael Johnson",
    designation: "Lab Instructor",
    department: "Mechanical",
    fromDate: "Sep 28, 2023",
    toDate: "Sep 30, 2023",
    noOfDays: 3,
    reason: "Worked on holiday for lab setup and maintenance.",
    document: "CompOff_Michael.pdf",
    status: "Pending",
    rejectionReason: null,
    approvalHistory: [
      { role: "Faculty", action: "submitted", remarks: "Comp-off request submitted", actionDate: "2023-09-25T11:00:00Z" },
    ],
  },
  {
    id: 4,
    name: "Emma Wilson",
    designation: "Assistant Professor",
    department: "Computer Science",
    fromDate: "Sep 12, 2023",
    toDate: "Sep 12, 2023",
    noOfDays: 1,
    reason: "External academic review meeting attendance.",
    document: "CompOff_Emma.pdf",
    status: "Approved",
    rejectionReason: null,
    approvalHistory: [
      { role: "Faculty", action: "submitted", remarks: "Comp-off request submitted", actionDate: "2023-09-08T08:45:00Z" },
      { role: "HOD", action: "approved", remarks: "Approved for academic review participation.", actionDate: "2023-09-10T12:30:00Z" },
    ],
  },
  {
    id: 5,
    name: "David Brown",
    designation: "Associate Professor",
    department: "Civil",
    fromDate: "Aug 30, 2023",
    toDate: "Aug 30, 2023",
    noOfDays: 1,
    reason: "Compensation for weekend duty work.",
    document: "CompOff_David.pdf",
    status: "Rejected",
    rejectionReason: "Sufficient staff already available for that period.",
    approvalHistory: [
      { role: "Faculty", action: "submitted", remarks: "Comp-off request submitted", actionDate: "2023-08-25T09:15:00Z" },
      { role: "HOD", action: "rejected", remarks: "Sufficient staff already available for that period.", actionDate: "2023-08-27T16:00:00Z" },
    ],
  },
  {
    id: 1,
    name: "John Doe",
    designation: "Assistant Professor",
    department: "Computer Science",
    fromDate: "Oct 24, 2023",
    toDate: "Oct 24, 2023",
    noOfDays: 1,
    reason: "Worked on weekend for university event coordination and management.",
    document: "CompOff_John.pdf",
    status: "Pending",
    rejectionReason: null,
    approvalHistory: [
      { role: "Faculty", action: "submitted", remarks: "Comp-off request submitted", actionDate: "2023-10-20T10:30:00Z" },
    ],
  },
  {
    id: 2,
    name: "Sarah Smith",
    designation: "Associate Professor",
    department: "Electronics",
    fromDate: "Oct 18, 2023",
    toDate: "Oct 19, 2023",
    noOfDays: 2,
    reason: "Additional duty hours for exam supervision.",
    document: "CompOff_Sarah.pdf",
    status: "Approved",
    rejectionReason: null,
    approvalHistory: [
      { role: "Faculty", action: "submitted", remarks: "Comp-off request submitted", actionDate: "2023-10-15T09:00:00Z" },
      { role: "HOD", action: "approved", remarks: "Approved for extra duty hours.", actionDate: "2023-10-16T14:20:00Z" },
    ],
  },
  {
    id: 3,
    name: "Michael Johnson",
    designation: "Lab Instructor",
    department: "Mechanical",
    fromDate: "Sep 28, 2023",
    toDate: "Sep 30, 2023",
    noOfDays: 3,
    reason: "Worked on holiday for lab setup and maintenance.",
    document: "CompOff_Michael.pdf",
    status: "Pending",
    rejectionReason: null,
    approvalHistory: [
      { role: "Faculty", action: "submitted", remarks: "Comp-off request submitted", actionDate: "2023-09-25T11:00:00Z" },
    ],
  },
  {
    id: 4,
    name: "Emma Wilson",
    designation: "Assistant Professor",
    department: "Computer Science",
    fromDate: "Sep 12, 2023",
    toDate: "Sep 12, 2023",
    noOfDays: 1,
    reason: "External academic review meeting attendance.",
    document: "CompOff_Emma.pdf",
    status: "Approved",
    rejectionReason: null,
    approvalHistory: [
      { role: "Faculty", action: "submitted", remarks: "Comp-off request submitted", actionDate: "2023-09-08T08:45:00Z" },
      { role: "HOD", action: "approved", remarks: "Approved for academic review participation.", actionDate: "2023-09-10T12:30:00Z" },
    ],
  },
  {
    id: 5,
    name: "David Brown",
    designation: "Associate Professor",
    department: "Civil",
    fromDate: "Aug 30, 2023",
    toDate: "Aug 30, 2023",
    noOfDays: 1,
    reason: "Compensation for weekend duty work.",
    document: "CompOff_David.pdf",
    status: "Rejected",
    rejectionReason: "Sufficient staff already available for that period.",
    approvalHistory: [
      { role: "Faculty", action: "submitted", remarks: "Comp-off request submitted", actionDate: "2023-08-25T09:15:00Z" },
      { role: "HOD", action: "rejected", remarks: "Sufficient staff already available for that period.", actionDate: "2023-08-27T16:00:00Z" },
    ],
  },
  {
    id: 6,
    name: "Lisa Anderson",
    designation: "Assistant Professor",
    department: "Electronics",
    fromDate: "May 29, 2026",
    toDate: "May 30, 2026",
    noOfDays: 2,
    reason: "Extra teaching hours for guest lecture series.",
    document: "CompOff_Lisa.pdf",
    status: "Pending",
    rejectionReason: null,
    approvalHistory: [
      { role: "Faculty", action: "submitted", remarks: "Comp-off request submitted", actionDate: "2026-05-25T07:30:00Z" },
    ],
  },
];

const CustomDropdown = ({ placeholder = "Select", value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-11 w-full min-w-[140px] items-center justify-between rounded-lg border border-[#244061] bg-[#0d2138] px-3 py-2 text-left text-[16px] text-white outline-none transition hover:border-[#3984ff] focus:border-[#3984ff] focus:ring-2 focus:ring-[#3984ff33]"
      >
        <span className={value ? "text-white" : "text-[#6f839f]"}>
          {value || placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`text-[#3984ff] transition ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+4px)] left-0 z-50 w-full rounded-lg border border-[#244061] bg-[#0a1a2d] shadow-[0_18px_45px_rgba(0,0,0,0.35)]">
          <div className="max-h-[200px] overflow-y-auto table-custom-scrollbar">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 text-left text-[12px] transition ${value === option
                  ? "bg-[#2563EB] text-white"
                  : "text-[#cad7eb] hover:bg-[#132b49]"
                  }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const FilterDatePicker = ({
  id,
  value,
  onChange,
  placeholder = "Select date",
  popupAlign = "left",
  isOpen,
  onOpen,
  onClose,
}) => {
  const [viewDate, setViewDate] = useState(value || new Date());
  const [showAbove, setShowAbove] = useState(true);

  const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const formatDate = (date) => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  const calendarDays = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const dates = [];

    for (let index = 0; index < firstDay.getDay(); index += 1) {
      dates.push(null);
    }

    for (let day = 1; day <= lastDay.getDate(); day += 1) {
      dates.push(new Date(year, month, day));
    }

    return dates;
  }, [viewDate]);

  const moveMonth = (direction) => {
    setViewDate(
      (currentDate) =>
        new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1)
    );
  };

  const isSelectedDate = (date) =>
    value &&
    date &&
    value.getFullYear() === date.getFullYear() &&
    value.getMonth() === date.getMonth() &&
    value.getDate() === date.getDate();

  const handleSelectDate = (date) => {
    onChange(date);
    onClose();
  };

  const handleToggle = (e) => {
    if (!isOpen) {
      const buttonElement = e.currentTarget;
      const rect = buttonElement.getBoundingClientRect();
      const spaceAbove = rect.top;
      const spaceBelow = window.innerHeight - rect.bottom;
      setShowAbove(spaceAbove > 320 || spaceBelow < 320);
      onOpen();
      return;
    }

    onClose();
  };

  return (
    <div className="relative">
      <button
        id={id}
        type="button"
        onClick={handleToggle}
        className="flex h-11 w-full items-center justify-between rounded-lg border border-[#244061] bg-[#0d2138] px-3 text-left text-[16px] text-white outline-none transition hover:border-[#3984ff] focus:border-[#3984ff] focus:ring-2 focus:ring-[#3984ff33]"
      >
        <span className={value ? "text-white" : "text-[#6f839f]"}>
          {value ? formatDate(value) : placeholder}
        </span>
        <CalendarDays size={16} className="text-[#3984ff]" />
      </button>

      {isOpen && (
        <div
          className={`absolute ${showAbove ? "bottom" : ""
            } z-[9999] w-[280px] rounded-lg border border-[#244061] bg-[#0a1a2d] p-3 shadow-[0_18px_45px_rgba(0,0,0,0.35)] ${popupAlign === "right" ? "right-0" : "-left-30"
            }`}
        >
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => moveMonth(-1)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[#9eb0cc] transition hover:bg-[#183052] hover:text-white"
              aria-label="Previous month"
            >
              <ChevronLeft size={16} />
            </button>
            <p className="text-[13px] font-semibold text-white">
              {months[viewDate.getMonth()]} {viewDate.getFullYear()}
            </p>
            <button
              type="button"
              onClick={() => moveMonth(1)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[#9eb0cc] transition hover:bg-[#183052] hover:text-white"
              aria-label="Next month"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {days.map((day) => (
              <span
                key={day}
                className="py-1 text-[10px] font-semibold text-[#8ca1bd]"
              >
                {day}
              </span>
            ))}

            {calendarDays.map((date, index) => (
              <button
                key={date ? date.toISOString() : `empty-${index}`}
                type="button"
                disabled={!date}
                onClick={() => handleSelectDate(date)}
                className={`h-8 rounded-md text-[12px] font-semibold transition ${isSelectedDate(date)
                  ? "bg-[#2563EB] text-white shadow-[0_5px_18px_rgba(37,99,235,0.35)]"
                  : "text-[#cad7eb] hover:bg-[#132b49] hover:text-white"
                  } disabled:pointer-events-none disabled:opacity-0`}
              >
                {date?.getDate()}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const PrincipalCompOffDetailsCanvas = ({ request, onClose }) => {
  if (!request) return null;

  const getActionColor = (action) => {
    if (action?.toLowerCase() === "approved") {
      return { bg: "bg-emerald-800", text: "text-[#10b981]", light: "bg-[#10b98115]" };
    } else if (action?.toLowerCase() === "rejected") {
      return { bg: "bg-[#ef4444]", text: "text-[#ef4444]", light: "bg-[#ef444415]" };
    }
    return { bg: "bg-[#f59e0b]", text: "text-[#f59e0b]", light: "bg-[#f59e0b15]" };
  };

  const getActionIcon = (action) => {
    switch (action?.toLowerCase()) {
      case "approved":
        return <CheckCircle2 size={18} />;
      case "rejected":
        return <AlertCircle size={18} />;
      case "submitted":
        return <Clock size={18} />;
      default:
        return <Clock size={18} />;
    }
  };

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
              Comp-Off Request
            </p>
            <h2 className="mt-1 text-[18px] font-semibold leading-tight text-white">
              Review Comp-Off Details
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#223b5f] bg-[#102640] text-[#9eb0cc] transition hover:border-[#3984ff] hover:text-white"
            aria-label="Close comp-off details"
          >
            <X size={17} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-3 table-custom-scrollbar">
          <p className="text-[12px] leading-5 text-[#b8c7dd]">
            Review the request details, current status, and reason before taking an action.
          </p>

          <div className="mt-2 rounded-lg border border-[#1d395e] bg-[#0a1a2d] p-3 shadow-[0_12px_26px_rgba(0,0,0,0.16)]">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <img src={userImg} alt="" className="h-11 w-11 shrink-0 rounded-full object-cover" />
                <div className="min-w-0">
                  <p className="truncate text-[16px] font-semibold text-white">{request.name}</p>
                  <p className="mt-1 truncate text-[12px] text-[#8ca1bd]">
                    {request.designation}
                  </p>
                </div>
              </div>

              <span
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase ${statusStyles[request.status]}`}
              >
                <span className="h-[5px] w-[5px] rounded-full bg-current" />
                {request.status}
              </span>
            </div>

            <div className="my-3 h-px bg-[#1a3556]" />

            <div>
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-[#8ca1bd]">
                <Layers size={13} className="text-[#3984ff]" />
                Comp-Off Details
              </div>
              <p className="mt-1 text-[16px] font-semibold text-white">
                {request.noOfDays} Day{request.noOfDays > 1 ? "s" : ""}
              </p>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <div className="flex items-center gap-2 text-[12px] font-medium text-[#9eb0cc]">
                  <CalendarDays size={14} className="text-[#b8c7dd]" />
                  Worked From
                </div>
                <p className="mt-1 text-[15px] font-medium text-white">{request.fromDate ? new Date(request.fromDate).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : ""}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-[12px] font-medium text-[#9eb0cc]">
                  <TimerReset size={14} className="text-[#b8c7dd]" />
                  Worked To
                </div>
                <p className="mt-1 text-[15px] font-medium text-white">{request.toDate ? new Date(request.toDate).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : ""}</p>
              </div>
            </div>
          </div>

          <div className="mt-3">
            <p className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-white">
              <FileText size={15} className="text-[#3984ff]" />
              Reason
            </p>
            <div className="rounded-lg border border-[#244061] bg-[#0d2138] px-4 py-3 text-[13px] leading-5 text-[#cad7eb]">
              {request.reason}
            </div>
          </div>

          {request.documentUrl && (
            <div className="mt-3">
              <p className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-white">
                <FileText size={15} className="text-[#3984ff]" />
                Document
              </p>
              <div className="rounded-lg border border-[#244061] bg-[#0d2138] px-4 py-3">
                <p onClick={() => window.open(request.documentUrl, "_blank")} className="inline-flex cursor-pointer items-center gap-2 text-[13px] font-medium text-[#3984ff] underline transition hover:text-[#6ea1ff]">{request.documentName || "View Document"}</p>
              </div>
            </div>
          )}

          {request.rejectionReason && (
            <div className="mt-3">
              <p className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-white">
                <FileText size={15} className="text-[#f16868]" />
                Rejection Reason
              </p>
              <div className="rounded-lg border border-[#f1686833] bg-[#f1686812] px-4 py-3 text-[13px] leading-5 text-[#ffd1d1]">
                {request.rejectionReason}
              </div>
            </div>
          )}

          {request.approvalHistory && request.approvalHistory.length > 0 && (
            <div className="mt-4 border-t border-gray-400/20 pt-4">
              <p className="mb-3 flex items-center gap-2 text-[16px] text-white">
                <ShieldCheck size={15} className="text-[#3984ff]" />
                Approval Workflow
              </p>

              <div className="space-y-0">
                {request.approvalHistory.map((history, index) => {
                  const actionColor = getActionColor(history.action);
                  const isLast = index === request.approvalHistory.length - 1;
                  const isApproved = history.action?.toLowerCase() === "approved";
                  const isRejected = history.action?.toLowerCase() === "rejected";

                  return (
                    <div key={index} className="relative">
                      {!isLast && (
                        <div
                          className={`absolute left-[19px] top-[50px] w-[2px] h-[60px] ${isApproved ? "bg-[#10b981]" : isRejected ? "bg-[#ef4444]" : "bg-[#444c63]"
                            }`}
                        />
                      )}

                      <div className="relative flex gap-3 pb-4">
                        <div className="flex-shrink-0">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${isApproved
                              ? `${actionColor.bg} border-emerald-200/20`
                              : isRejected
                                ? `${actionColor.bg} border-[#ef4444]`
                                : `${actionColor.light} border-[#444c63]`
                              } text-white`}
                          >
                            {getActionIcon(history.action)}
                          </div>
                        </div>

                        <div className="flex-1 pt-0.5">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-[13px] font-semibold capitalize text-[#8ca1bd]">
                                {history.role}
                              </p>
                            </div>
                            <span
                              className={`text-[10px] font-semibold uppercase px-2 py-1 rounded-full whitespace-nowrap ${isApproved
                                ? "bg-[#10b98120] text-[#10b981]"
                                : isRejected
                                  ? "bg-[#ef444420] text-[#ef4444]"
                                  : "bg-[#f59e0b20] text-[#f59e0b]"
                                }`}
                            >
                              {history.action}
                            </span>
                          </div>

                          <p className="text-[12px] text-[#cad7eb] mt-1">
                            {history.remarks}
                          </p>

                          <p className="text-[11px] text-[#6f839f] mt-1.5 flex items-center gap-1">
                            <Clock size={11} />
                            {new Date(history.actionDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
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

        <div className="shrink-0 border-t border-[#173150] bg-[#08182a] px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[#2563EB] text-[13px] font-semibold text-white shadow-[0_5px_20px_rgba(25,118,255,0.2)] transition hover:bg-[#0d2b55]"
          >
            Close Details
            <Send size={14} />
          </button>
        </div>
      </div>
    </section>
  );
};

const ConfirmationPopup = ({
  action,
  request,
  reason,
  onReasonChange,
  onClose,
  onConfirm,
  confirmLoading,
}) => {
  if (!action || !request) return null;

  const isReject = action === "reject";
  const title = "Reject Comp-Off Request";

  return (
    <section
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[#020817]/60 px-4 backdrop-blur-[2px]"
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
            <h2 className="mt-1 text-[18px] font-semibold text-white">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#223b5f] bg-[#102640] text-[#9eb0cc] transition hover:border-[#3984ff] hover:text-white"
            aria-label="Close confirmation"
          >
            <X size={17} />
          </button>
        </div>

        <div className="px-5 py-4">
          {isReject && (
            <div className="">
              <label
                htmlFor="reject-reason"
                className="mb-2 block text-[13px] font-semibold text-white"
              >
                Reason for rejection
              </label>
              <textarea
                id="reject-reason"
                value={reason}
                onChange={(event) => onReasonChange(event.target.value)}
                rows={4}
                placeholder="Type the reason..."
                className="w-full resize-none rounded-lg border border-[#244061] bg-[#0d2138] px-4 py-3 text-[13px] leading-5 text-white outline-none transition placeholder:text-[#6f839f] focus:border-[#3984ff] focus:ring-2 focus:ring-[#3984ff33]"
              />
            </div>
          )}
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
            disabled={(isReject && !reason.trim()) || confirmLoading}
            className="h-10 rounded-md px-4 text-[16px] font-medium transition disabled:cursor-not-allowed disabled:opacity-50 bg-[#c44848] text-white hover:bg-[#d94f4f]"
          >
            {confirmLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              "Reject Request"
            )}
          </button>
        </div>
      </div>
    </section>
  );
};

const PrincipalCompOffTable = ({ filterDepartment, onDepartmentOptionsChange }) => {
  const {
    isExportModalOpen,
    exportLoading,
    exportError,
    handleExportClick,
    closeExportModal,
    handleConfirmExport,
  } = usePasswordProtectedExport();

  const exportCurrentFilteredRows = () => {
    const rows = filteredRequests.map((r) => ({
      "Name": r.name || "",
      "Designation": r.designation || "",
      "Department": r.department || "",
      "Worked From": r.fromDate ? new Date(r.fromDate).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : "",
      "Worked To": r.toDate ? new Date(r.toDate).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : "",
      "No. of Days": r.noOfDays || 0,
      "Reason": r.reason || "",
      "Status": r.status || "",
    }));
    exportToExcel(rows, "CompOff-Requests.xlsx");
  };
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterDate, setFilterDate] = useState(null);
  const [openDateFilter, setOpenDateFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [confirmation, setConfirmation] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [approvingId, setApprovingId] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const statuses = ["All", "Approved", "Rejected", "Pending"];

  const fetchCompOffs = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const token = getTokenFromLocalStorage();
      if (!token) {
        setError("Authentication token not found");
        setLoading(false);
        return;
      }
      const response = await fetch(`${API_BASE_URL.replace(/\/$/, "")}/api/comp-off/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch comp-off requests");
      }
      const result = await response.json();
      let filtered = result.formattedRequests.filter((item, index) => {
        return item.currentApprovalLevel.toLowerCase() == "principal" || item.currentApprovalLevel.toLowerCase() == "completed";
      })
      console.log("result : ", filtered);
      if (result.success && Array.isArray(result.formattedRequests)) {
        setRequests(filtered.map(mapApiRequest));
      } else {
        setRequests([]);
      }
    } catch (err) {
      setError(err.message || "An error occurred");
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCompOffs();
  }, [fetchCompOffs]);

  const departmentOptions = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(requests.map((r) => r.department).filter(Boolean)),
      ),
    ],
    [requests],
  );

  useEffect(() => {
    if (onDepartmentOptionsChange) {
      onDepartmentOptionsChange(departmentOptions);
    }
  }, [departmentOptions, onDepartmentOptionsChange]);

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const statusMatch = filterStatus === "All" || request.status === filterStatus;

      const filterDateCheck =
        !filterDate ||
        (request.fromDate && new Date(request.fromDate).toDateString() === filterDate.toDateString());

      const departmentMatch = filterDepartment === "All" || request.department === filterDepartment;

      const searchMatch =
        !searchQuery ||
        request.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.reason.toLowerCase().includes(searchQuery.toLowerCase());

      return statusMatch && filterDateCheck && departmentMatch && searchMatch;
    });
  }, [filterStatus, filterDate, filterDepartment, searchQuery, requests]);

  const resetFilters = () => {
    setFilterStatus("All");
    setFilterDate(null);
    setSearchQuery("");
    setOpenDateFilter(false);
  };

  const hasActiveFilters = filterStatus !== "All" || filterDate || searchQuery;

  const truncateReason = (reason, maxLength = 35) => {
    if (reason?.length > maxLength) {
      return reason.substring(0, maxLength) + "...";
    }
    return reason;
  };

  const handleApprove = async (request) => {
    setApprovingId(request.id);
    try {
      const token = getTokenFromLocalStorage();
      if (!token) {
        setError("Authentication token not found");
        setApprovingId(null);
        return;
      }
      const response = await fetch(
        `${API_BASE_URL.replace(/\/$/, "")}/api/comp-off/${request.id}/approve`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to approve comp-off request");
      }
      toast.success("Comp-off request approved successfully");
      await fetchCompOffs();
    } catch (err) {
      toast.error(err.message || "Failed to approve request");
    } finally {
      setApprovingId(null);
    }
  };

  const handleReject = (request) => {
    setRejectReason("");
    setConfirmation({ action: "reject", request });
  };

  const handleView = (request) => {
    setSelectedRequest(request);
  };

  const closeConfirmation = () => {
    setConfirmation(null);
    setRejectReason("");
  };

  const handleConfirmAction = async () => {
    if (!confirmation) return;

    if (confirmation.action === "reject") {
      setConfirmLoading(true);
      try {
        const token = getTokenFromLocalStorage();
        if (!token) {
          setError("Authentication token not found");
          setConfirmLoading(false);
          return;
        }
        const response = await fetch(
          `${API_BASE_URL.replace(/\/$/, "")}/api/comp-off/${confirmation.request.id}/reject`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ reason: rejectReason.trim() }),
          }
        );
        if (!response.ok) {
          throw new Error("Failed to reject comp-off request");
        }
        toast.success("Comp-off request rejected");
        closeConfirmation();
        await fetchCompOffs();
      } catch (err) {
        toast.error(err.message || "Failed to reject request");
      } finally {
        setConfirmLoading(false);
      }
    }
  };

  return (
    <>
      <section className="rounded-xl border border-[#244061]  min-h-[calc(100vh-160px)] max-h-[calc(100vh-160px)] bg-[#0a1a2d] mt-4 ">
        <div className="relative z-20 space-y-3 px-4 py-3 flex items-start justify-between">
          <div className="flex items-center justify-between">
            <h2 className="text-[18px] font-semibold text-white">
              Comp-Off Requests <span>({filteredRequests.length})</span>
            </h2>
          </div>

          <div className="filter-container">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-shrink-0">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6f839f]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search name, designation..."
                  className="h-11 w-[200px] rounded-lg border border-[#244061] bg-[#0d2138] pl-9 pr-3 text-[14px] text-white outline-none transition placeholder:text-[#6f839f] hover:border-[#3984ff] focus:border-[#3984ff] focus:ring-2 focus:ring-[#3984ff33]"
                />
              </div>

              <div className="flex-shrink-0">
                <CustomDropdown
                  placeholder="Status"
                  value={filterStatus}
                  onChange={setFilterStatus}
                  options={statuses}
                />
              </div>

              <div className="flex-shrink-0 min-w-[160px]">
                <FilterDatePicker
                  id="filter-date"
                  value={filterDate}
                  onChange={setFilterDate}
                  placeholder="Select Date"
                  isOpen={openDateFilter}
                  onOpen={() => setOpenDateFilter(true)}
                  onClose={() => setOpenDateFilter(false)}
                />
              </div>

              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="flex-shrink-0 h-11 px-4 rounded-lg border border-[#244061] bg-[#0d2138] text-[12px] font-semibold text-[#8ca1bd] transition hover:bg-[#132b49] hover:text-white hover:border-[#3984ff]"
                >
                  Reset Filters
                </button>
              )}
              <button
                type="button"
                onClick={handleExportClick}
                disabled={filteredRequests.length === 0}
                className="flex-shrink-0 inline-flex h-11 items-center gap-2 rounded-lg border border-[#244061] bg-[#0d2138] px-3 text-[14px] font-medium text-white transition hover:border-[#3984ff] hover:bg-[#132b49] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Download size={16} />
                Export
              </button>
            </div>
          </div>
        </div>

        <ExportPasswordModal
          isOpen={isExportModalOpen}
          onClose={closeExportModal}
          onConfirm={(password) => handleConfirmExport(password, exportCurrentFilteredRows)}
          loading={exportLoading}
          error={exportError}
        />

        <div className="relative z-0 max-h-[calc(100vh-240px)] overflow-auto table-custom-scrollbar">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-[#9eb0cc]">Loading...</div>
          ) : error ? (
            <div className="flex items-center justify-center py-12 text-[#f16868]">{error}</div>
          ) : (
            <table className="w-full min-w-[900px] border-collapse text-left">
              <thead className="sticky top-0 z-10 bg-[#172c46] text-[12px] uppercase tracking-wide text-[#9aacc7]">
                <tr>
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Worked From</th>
                  <th className="px-4 py-3 font-semibold">Worked To</th>
                  <th className="px-4 py-3 font-semibold">No. of Days</th>
                  <th className="px-4 py-3 font-semibold">Reason</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="text-[12px] text-[#cad7eb]">
                {filteredRequests.length > 0 ? (
                  filteredRequests.map((request, index) => (
                    <tr
                      key={`${request.name}-${request.fromDate}-${index}`}
                      className="border-b border-[#132944] last:border-0"
                    >
                      <td className="px-4 py-2 font-semibold text-white">
                        <div className="flex items-center gap-2">
                          <span>
                            <img src={userImg} alt="" className="h-10 w-10 rounded-full object-cover" />
                          </span>
                          <div className="flex flex-col">
                            {request.name}
                            <p className="text-[#8ca1bd]">{request.designation}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2">{request.fromDate ? new Date(request.fromDate).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : ""}</td>
                      <td className="px-4 py-2">{request.toDate ? new Date(request.toDate).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : ""}</td>
                      <td className="px-4 py-2">{request.noOfDays}</td>
                      <td className="px-4 py-2 truncate max-w-[130px]" title={request.reason}>
                        {truncateReason(request.reason)}
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[13px] font-semibold ${statusStyles[request.status]
                            }`}
                        >
                          <span className="h-[4px] w-[4px] rounded-full bg-current" />
                          {request.status}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-2 text-[#8ca1bd]">
                          {request.status === "Pending" ? (
                            <>
                              {approvingId === request.id ? (
                                <Loader2 size={16} className="animate-spin text-[#18d3bf]" />
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleApprove(request)}
                                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#18d3bf12] text-[#18d3bf] transition hover:bg-[#18d3bf24] hover:text-white"
                                  aria-label="Approve request"
                                  title="Approve"
                                >
                                  <Check className="h-4 w-4" />
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleReject(request)}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#f1686812] text-[#f16868] transition hover:bg-[#f1686824] hover:text-white"
                                aria-label="Reject request"
                                title="Reject"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </>
                          ) : null}
                          <button
                            type="button"
                            onClick={() => handleView(request)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#c4c6d010] transition hover:bg-[#183052] hover:text-white"
                            aria-label="View request details"
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
                      No comp-off requests found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </section>
      <PrincipalCompOffDetailsCanvas
        request={selectedRequest}
        onClose={() => setSelectedRequest(null)}
      />
      <ConfirmationPopup
        action={confirmation?.action}
        request={confirmation?.request}
        reason={rejectReason}
        onReasonChange={setRejectReason}
        onClose={closeConfirmation}
        onConfirm={handleConfirmAction}
        confirmLoading={confirmLoading}
      />
    </>
  );
};

export default PrincipalCompOffTable;
