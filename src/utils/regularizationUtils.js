/**
 * Normalize attendance status to a consistent lowercase string
 * Handles variations like "MissedPunch", "missed_punch", "Missed Punch"
 */
const normalizeStatus = (status = "") =>
  String(status).trim().toLowerCase().replace(/[_-]/g, " ");

/**
 * Determine if regularization can be applied for a given attendance record.
 *
 * Rules:
 * 1. "Leave" → do not allow
 * 2. "Present" → do not allow
 * 3. "Absent" → allow
 * 4. "Missed Punch" (any casing/format) → allow
 * 5. workingHours < shift.workingMinutes → allow
 * 6. workingHours >= shift.workingMinutes → do not allow (unless Absent or Missed Punch)
 *
 * @param {Object} record - Attendance record
 * @param {string} [record.status] - Attendance status
 * @param {number} [record.workingHours] - Working hours in minutes
 * @param {Object} [record.shift] - Shift details
 * @param {number} [record.shift.workingMinutes] - Expected working minutes for the shift
 * @returns {boolean}
 */
export const canApplyRegularization = (record) => {
  const status = normalizeStatus(record?.status);
  const workingHours = Number(record?.workingHours ?? 0);
  const shiftMinutes = Number(record?.shift?.workingMinutes ?? 0);

  // Block Leave and Present regardless of hours worked
  if (status === "leave") return false;
  if (status === "present") return false;

  // Always allow for Absent and Missed Punch (any format)
  if (status === "absent") return true;
  // Handle multiple variants: "Missed Punch", "missed_punch", "MissedPunch"
  if (status === "missed punch" || status === "missedpunch") return true;

  // For other statuses (e.g. "Partially Present", "Second Half Leave"),
  // allow only if working hours are less than shift minimum
  if (shiftMinutes > 0 && workingHours < shiftMinutes) return true;

  return false;
};
