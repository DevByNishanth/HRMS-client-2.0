import axios from "axios";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "https://sece-hrms-server.onrender.com"
).replace(/\/$/, "");

export const updateAttendanceOverrideEmployeeBulk = async (employeeId, payload) => {
  try {
    const token = localStorage.getItem("hrms_token");
    const response = await axios.put(
      `${API_BASE_URL}/api/attendance-override/employee/${encodeURIComponent(employeeId)}/date-range`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
    );
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem("hrms_token");
      alert("Session expired. Please login again.");
      window.location.href = "/";
    }
    throw error;
  }
};