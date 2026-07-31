/**
 * Normalize attendance status to a consistent lowercase string
 * Handles variations like "MissedPunch", "missed_punch", "Missed Punch"
 */
const normalizeStatus = (status = "") =>
  String(status).trim().toLowerCase().replace(/[_-]/g, " ");

/**
 * Regularization is allowed for any attendance status except Present.
 */
export const canApplyRegularization = (record) => {
  const status = normalizeStatus(record?.status);
  return status !== "present";
};
