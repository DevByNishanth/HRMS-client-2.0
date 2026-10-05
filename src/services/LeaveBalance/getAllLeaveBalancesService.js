import axios from "axios";

export const getAllLeaveBalances = async () => {
  try {
    const token = localStorage.getItem("hrms_token");

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth(); 
    const academicYear = currentMonth >= 5 
      ? `${currentYear}-${currentYear + 1}` 
      : `${currentYear - 1}-${currentYear}`;

    const response = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/api/leave-balance/faculty-leave-report?academicYear=${academicYear}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching all leave balances:", error);
    return null;
  }
};
