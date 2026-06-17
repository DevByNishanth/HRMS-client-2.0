import axios from "axios";

export const getAttendanceByDate = async (date) => {
    try {
        const token = localStorage.getItem("hrms_token");

        const response = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/api/attendance-override/date/${date}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
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