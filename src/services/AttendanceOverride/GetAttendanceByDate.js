import axios from "axios";

const api_url = `${import.meta.env.VITE_API_BASE_URL}/api/attendance-override/date/${date}`;

export const getAttendanceByDate = async () => {
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