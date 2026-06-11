import axios from "axios";

const api_url = `${import.meta.env.VITE_API_BASE_URL}/api/attendance-override/employee/${date}?startDate=2026-06-01&endDate=2026-06-30`;

export const getAttendanceByEmployee = async () => {
    try {
        const token = localStorage.getItem("hrms_token");

        const response = await axios.get(api_url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        if (error.response?.status === 401) {
        localStorage.removeItem("token");

        alert("Session expired. Please login again.");

        window.location.href = "/";
        }

        throw error;
    }
}