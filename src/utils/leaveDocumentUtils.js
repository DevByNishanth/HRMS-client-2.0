/**
 * Determine if a leave type requires a supporting file upload.
 * Matches leave names that contain any file-required keyword (case-insensitive).
 *
 * @param {string} leaveName - Name of the leave type
 * @returns {boolean}
 */
export const isFileUploadRequired = (leaveName = "") => {
  const fileRequiredKeywords = ["medical", "on duty", "on-duty", "onduty", "maternity", "paternity"];
  return fileRequiredKeywords.some((keyword) =>
    String(leaveName).toLowerCase().includes(keyword)
  );
};

/**
 * Get the first supporting document of a leave record, or null.
 * Safely handles: undefined/null supportingDocuments, empty arrays,
 * and document objects without a url field.
 *
 * @param {Object} leave - Leave record
 * @returns {Object|null} The first document that has a url, or null
 */
export const getLeaveSupportingDocument = (leave) => {
  const docs = leave?.supportingDocuments;
  if (!Array.isArray(docs) || docs.length === 0) return null;
  const doc = docs[0];
  if (!doc?.url) return null;
  return doc;
};
