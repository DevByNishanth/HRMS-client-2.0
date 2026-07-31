import axios from "axios";

export const getLeaveBalance = async (facultyId) => {
    try {
        const token = localStorage.getItem("hrms_token");

        const response = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/api/leave-balance/faculty/${facultyId}`,
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
            window.location.href="/";
        }

        throw error;
    }
};