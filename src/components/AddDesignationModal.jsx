import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Check,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { getDesignations } from "../services/designation/getDesignationsService";
import { createDesignation } from "../services/designation/addDesignationService";
import { updateDesignation } from "../services/designation/updateDesignationService";
import { deleteDesignation } from "../services/designation/deleteDesignationService";

/**
 * AddDesignationModal
 * -------------------
 * A right-side drawer ("half canvas") for managing designations through
 * the /api/designations endpoint. It fetches the live list on open,
 * filters it with a search box + status filter, and supports
 * add / edit / delete with toast feedback for every action.
 *
 * Props:
 *  - onDesignationsChange : optional callback receiving the designation
 *                           names whenever the list changes
 *  - onClose              : closes the drawer
 */
const AddDesignationModal = ({ onDesignationsChange, onClose }) => {
  // Designations fetched from the API
  const [designations, setDesignations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  // Search + status filter
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all | active | inactive

  // "Add" form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // Row being edited (store its _id)
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editActive, setEditActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Row waiting for delete confirmation
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Small inline validation message
  const [error, setError] = useState("");

  // ---------- Fetching ----------
  const fetchDesignations = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");

    try {
      const response = await getDesignations();
      // The API may return the list as an array or a single object.
      const list = Array.isArray(response?.data)
        ? response.data
        : response?.data
          ? [response.data]
          : [];
      setDesignations(list);
      setError("");
      if (onDesignationsChange) {
        onDesignationsChange(
          list.map((item) => item.designationName).filter(Boolean),
        );
      }
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load designations.";
      setLoadError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [onDesignationsChange]);

  // Load the list as soon as the drawer opens.
  useEffect(() => {
    const timerId = window.setTimeout(fetchDesignations, 0);
    return () => window.clearTimeout(timerId);
  }, [fetchDesignations]);

  // Allow closing the drawer with Escape (but not while typing).
  useEffect(() => {
    const handleKeyDown = (event) => {
      const tagName = event.target?.tagName;
      const isTyping = tagName === "INPUT" || tagName === "TEXTAREA";
      if (event.key === "Escape" && !isTyping) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // ---------- Helpers ----------
  const isDuplicate = (name, ignoreId = null) =>
    designations.some(
      (item) =>
        item._id !== ignoreId &&
        item.designationName.toLowerCase() === name.toLowerCase(),
    );

  const resetTransientState = () => {
    setShowAddForm(false);
    setNewName("");
    setEditingId(null);
    setEditName("");
    setDeleteId(null);
    setError("");
  };

  // ---------- Add ----------
  const handleAdd = async () => {
    const trimmed = newName.trim();
    if (!trimmed) {
      setError("Designation name cannot be empty.");
      return;
    }
    if (isDuplicate(trimmed)) {
      setError(`"${trimmed}" already exists.`);
      return;
    }

    setIsAdding(true);
    setError("");

    try {
      const response = await createDesignation({ designationName: trimmed });
      toast.success(
        response?.message || "Designation added successfully.",
      );
      resetTransientState();
      setQuery("");
      await fetchDesignations();
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to add designation.";
      setError(message);
      toast.error(message);
    } finally {
      setIsAdding(false);
    }
  };

  // ---------- Edit ----------
  const startEditing = (designation) => {
    resetTransientState();
    setEditingId(designation._id);
    setEditName(designation.designationName);
    setEditActive(designation.isActive);
  };

  const handleSaveEdit = async () => {
    const trimmed = editName.trim();
    if (!trimmed) {
      setError("Designation name cannot be empty.");
      return;
    }
    if (isDuplicate(trimmed, editingId)) {
      setError(`"${trimmed}" already exists.`);
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const response = await updateDesignation(editingId, {
        designationName: trimmed,
        isActive: editActive,
      });
      toast.success(
        response?.message || "Designation updated successfully.",
      );
      resetTransientState();
      await fetchDesignations();
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update designation.";
      setError(message);
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  // ---------- Delete ----------
  const handleDelete = async () => {
    setIsDeleting(true);
    setError("");

    try {
      const response = await deleteDesignation(deleteId);
      toast.success(
        response?.message || "Designation deleted successfully.",
      );
      resetTransientState();
      await fetchDesignations();
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to delete designation.";
      setError(message);
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  // ---------- Derived display list ----------
  // The row being edited is always kept visible so it never unmounts
  // mid-typing just because the new name stopped matching a filter.
  const normalizedQuery = query.trim().toLowerCase();
  const visibleList = designations.filter((item) => {
    if (item._id === editingId) return true;

    const matchesQuery =
      !normalizedQuery ||
      item.designationName.toLowerCase().includes(normalizedQuery);
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && item.isActive) ||
      (statusFilter === "inactive" && !item.isActive);
    return matchesQuery && matchesStatus;
  });

  const activeCount = designations.filter((item) => item.isActive).length;
  const inactiveCount = designations.length - activeCount;

  const statusOptions = [
    { value: "all", label: "All", count: designations.length },
    { value: "active", label: "Active", count: activeCount },
    { value: "inactive", label: "Inactive", count: inactiveCount },
  ];

  return (
    <section
      className="fixed inset-0 z-50 flex justify-end bg-[#020817]/60 backdrop-blur-[4px]"
      onClick={onClose}
    >
      <div
        className="flex h-full w-full flex-col bg-[#071425] shadow-[-18px_0_50px_rgba(0,0,0,0.35)] sm:w-[520px]"
        style={{ animation: "slideIn 0.25s ease-out" }}
        onClick={(event) => event.stopPropagation()}
      >
        {/* ============ Header ============ */}
        <div className="shrink-0 border-b border-[#173150] bg-[#0a1a2d] px-5 py-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#3984ff]">
                Designation Setup
              </p>
              <h2 className="mt-1 text-[18px] font-semibold leading-tight text-white">
                Add Designation
              </h2>
              <p className="mt-1 text-[12px] text-[#9eb0cc]">
                Create, rename, or remove designations used across the system.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#223b5f] bg-[#102640] text-[#9eb0cc] transition hover:border-[#3984ff] hover:text-white"
              aria-label="Close add designation panel"
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {/* ============ Search + "+" + status filter ============ */}
        <div className="shrink-0 border-b border-[#173150] px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="relative min-w-0 flex-1">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#6f839f]"
              />
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search designations..."
                className="h-11 w-full rounded-lg border border-[#244061] bg-[#0d2138] pl-10 pr-9 text-[14px] text-white outline-none transition placeholder:text-[#6f839f] hover:border-[#3984ff] focus:border-[#3984ff] focus:ring-2 focus:ring-[#3984ff33]"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-[#8ca1bd] transition hover:bg-[#183052] hover:text-white"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                resetTransientState();
                setShowAddForm((open) => !open);
              }}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#2563EB] text-white shadow-[0_5px_20px_rgba(25,118,255,0.25)] transition hover:bg-[#1049c4]"
              aria-label="Add a designation"
              title="Add a designation"
            >
              <Plus size={18} />
            </button>
          </div>

          {/* Status filter pills */}
          <div className="mt-3 flex items-center gap-2">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setStatusFilter(option.value)}
                className={`inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-[12px] font-medium transition ${
                  statusFilter === option.value
                    ? "bg-[#2563EB] text-white"
                    : "border border-[#244061] bg-[#0d2138] text-[#8ca1bd] hover:border-[#3984ff] hover:text-white"
                }`}
              >
                {option.label}
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                    statusFilter === option.value
                      ? "bg-white/20 text-white"
                      : "bg-[#132b49] text-[#9eb0cc]"
                  }`}
                >
                  {option.count}
                </span>
              </button>
            ))}
          </div>

          {/* Inline "add" form revealed by the + button */}
          {showAddForm && (
            <div className="mt-3 rounded-lg border border-[#244061] bg-[#0a1a2d] p-2.5">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  autoFocus
                  value={newName}
                  onChange={(event) => {
                    setNewName(event.target.value);
                    setError("");
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") handleAdd();
                    if (event.key === "Escape") {
                      setShowAddForm(false);
                      setNewName("");
                      setError("");
                    }
                  }}
                  placeholder="Type new designation name..."
                  className="h-10 min-w-0 flex-1 rounded-lg border border-[#244061] bg-[#0d2138] px-3 text-[13px] text-white outline-none transition placeholder:text-[#6f839f] focus:border-[#3984ff] focus:ring-2 focus:ring-[#3984ff33]"
                />
                <button
                  type="button"
                  onClick={handleAdd}
                  disabled={isAdding}
                  className="inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-[#2563EB] px-3 text-[12px] font-semibold text-white transition hover:bg-[#1049c4] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isAdding ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Check size={14} />
                  )}
                  {isAdding ? "Adding..." : "Add"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setNewName("");
                    setError("");
                  }}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#244061] bg-[#0d2138] text-[#9eb0cc] transition hover:border-[#3984ff] hover:text-white"
                  aria-label="Cancel add designation"
                >
                  <X size={15} />
                </button>
              </div>
            </div>
          )}

          {/* Shared validation / server message */}
          {error && (
            <p className="mt-2 rounded-md bg-[#f168681f] px-3 py-1.5 text-[12px] font-medium text-[#f16868]">
              {error}
            </p>
          )}
        </div>

        {/* ============ Section label ============ */}
        <div className="flex shrink-0 items-center justify-between px-5 pb-2 pt-4">
          <h3 className="text-[14px] font-semibold text-white">
            Designations{" "}
            <span className="font-medium text-[#8ca1bd]">
              ({designations.length})
            </span>
          </h3>
          {normalizedQuery && (
            <span className="text-[12px] text-[#8ca1bd]">
              {visibleList.length} match{visibleList.length === 1 ? "" : "es"}
            </span>
          )}
        </div>

        {/* ============ Scrollable list ============ */}
        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5 table-custom-scrollbar">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-[#183052] bg-[#0a1a2d] px-6 py-14 text-center">
              <Loader2 size={24} className="animate-spin text-[#3984ff]" />
              <p className="mt-3 text-[13px] text-[#9eb0cc]">
                Loading designations...
              </p>
            </div>
          ) : loadError && designations.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#f1686840] bg-[#0a1a2d] px-6 py-12 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f168681f] text-[#f16868]">
                <X size={20} />
              </span>
              <p className="mt-3 text-[14px] font-semibold text-white">
                Failed to load designations
              </p>
              <p className="mt-1 text-[12px] leading-5 text-[#8ca1bd]">
                {loadError}
              </p>
              <button
                type="button"
                onClick={fetchDesignations}
                className="mt-4 inline-flex h-9 items-center justify-center rounded-lg bg-[#2563EB] px-4 text-[12px] font-semibold text-white transition hover:bg-[#1049c4]"
              >
                Try Again
              </button>
            </div>
          ) : visibleList.length > 0 ? (
            <div className="overflow-hidden rounded-xl border border-[#183052] bg-[#0a1a2d]">
              {visibleList.map((designation) => {
                const isEditing = editingId === designation._id;
                const isAwaitingDelete = deleteId === designation._id;

                return (
                  <div
                    key={designation._id}
                    className={`flex items-center gap-3 border-b border-[#132944] px-4 py-3 transition last:border-b-0 ${
                      isAwaitingDelete
                        ? "bg-[#f1686812]"
                        : isEditing
                          ? "bg-[#132b49]"
                          : "hover:bg-[#102640]"
                    }`}
                  >
                    {/* Initial-letter badge (avatar style) */}
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#3984ff1f] text-[15px] font-bold uppercase text-[#3984ff]">
                      {(designation.designationName || "?").charAt(0)}
                    </span>

                    {/* Name / rename input */}
                    <div className="min-w-0 flex-1">
                      {isEditing ? (
                        <input
                          type="text"
                          autoFocus
                          value={editName}
                          onChange={(event) => {
                            setEditName(event.target.value);
                            setError("");
                          }}
                          onKeyDown={(event) => {
                            if (event.key === "Enter") handleSaveEdit();
                            if (event.key === "Escape") resetTransientState();
                          }}
                          className="h-10 w-full rounded-lg border border-[#3984ff] bg-[#0d2138] px-3 text-[14px] text-white outline-none focus:ring-2 focus:ring-[#3984ff33]"
                        />
                      ) : (
                        <div className="min-w-0">
                          <p className="truncate text-[14px] font-medium text-white">
                            {designation.designationName}
                          </p>
                          <span
                            className={`mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                              designation.isActive
                                ? "bg-[#18d3bf1f] text-[#18d3bf]"
                                : "bg-[#8ca1bd1f] text-[#8ca1bd]"
                            }`}
                          >
                            <span className="h-[4px] w-[4px] rounded-full bg-current" />
                            {designation.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Row actions */}
                    {isEditing ? (
                      <div className="flex shrink-0 items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setEditActive((value) => !value)}
                          className={`inline-flex h-8 items-center rounded-lg px-2.5 text-[11px] font-semibold transition ${
                            editActive
                              ? "bg-[#18d3bf1f] text-[#18d3bf] hover:bg-[#18d3bf33]"
                              : "bg-[#8ca1bd1f] text-[#8ca1bd] hover:bg-[#8ca1bd33]"
                          }`}
                          title="Toggle active / inactive"
                        >
                          {editActive ? "Active" : "Inactive"}
                        </button>
                        <button
                          type="button"
                          onClick={handleSaveEdit}
                          disabled={isSaving}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#18d3bf1f] text-[#18d3bf] transition hover:bg-[#18d3bf33] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                          aria-label="Save designation name"
                          title="Save"
                        >
                          {isSaving ? (
                            <Loader2 size={15} className="animate-spin" />
                          ) : (
                            <Check size={15} />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={resetTransientState}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#c4c6d010] text-[#8ca1bd] transition hover:bg-[#183052] hover:text-white"
                          aria-label="Cancel editing"
                          title="Cancel"
                        >
                          <X size={15} />
                        </button>
                      </div>
                    ) : isAwaitingDelete ? (
                      <div className="flex shrink-0 items-center gap-2">
                        <button
                          type="button"
                          onClick={handleDelete}
                          disabled={isDeleting}
                          className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-[#f16868] px-3 text-[12px] font-semibold text-white transition hover:bg-[#c94a4a] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isDeleting && (
                            <Loader2 size={13} className="animate-spin" />
                          )}
                          {isDeleting ? "Deleting..." : "Delete"}
                        </button>
                        <button
                          type="button"
                          onClick={resetTransientState}
                          className="inline-flex h-8 items-center justify-center rounded-lg border border-[#244061] bg-[#0d2138] px-3 text-[12px] font-medium text-[#cad7eb] transition hover:border-[#3984ff] hover:text-white"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex shrink-0 items-center gap-2">
                        <button
                          type="button"
                          onClick={() => startEditing(designation)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#3984ff12] text-green-400/70 transition hover:bg-[#3984ff24] hover:text-white"
                          aria-label={`Edit ${designation.designationName}`}
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            resetTransientState();
                            setDeleteId(designation._id);
                          }}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#f1686812] text-[#f16868] transition hover:bg-[#f1686824] hover:text-white"
                          aria-label={`Delete ${designation.designationName}`}
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            // Empty states
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#244061] bg-[#0a1a2d] px-6 py-12 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#3984ff1f] text-[#3984ff]">
                <Search size={20} />
              </span>
              <p className="mt-3 text-[14px] font-semibold text-white">
                {designations.length === 0
                  ? "No designations yet"
                  : "No matching designations"}
              </p>
              <p className="mt-1 text-[12px] leading-5 text-[#8ca1bd]">
                {designations.length === 0
                  ? "Click the + button above to add your first designation."
                  : "Try a different search keyword or status filter."}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AddDesignationModal;