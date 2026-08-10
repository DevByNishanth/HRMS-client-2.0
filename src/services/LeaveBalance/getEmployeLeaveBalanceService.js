import axios from "axios";

export const getEmployeLeaveBalance = async (id, date) => {
    try {
        const token = localStorage.getItem("hrms_token");
        const query = date ? `?date=${encodeURIComponent(date)}` : "";

        const response = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/api/leave-balance/faculty/${id}${query}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const payload = response.data || {};
        if (!payload.balances) {
            payload.balances =
                payload.leaveBalances ||
                payload.data?.balances ||
                payload.data?.leaveBalances ||
                [];
        }

        return payload;
    } catch (error) {
        if (error.response?.status === 401) {
            localStorage.removeItem("hrms_token");

            alert("Session expired. Please login again.");
            window.location.href = "/";
        }

        throw error;
    }
};