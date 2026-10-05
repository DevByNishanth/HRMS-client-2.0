import axios from "axios";

export const getMonthlyLateMinutes = async (month, year) => {
  try {
    const token = localStorage.getItem("hrms_token");

    const response = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/api/attendance/monthly-late-minutes`,
      {
        params: {
          month,
          year,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching monthly late minutes:", error);
    return null;
  }
};
