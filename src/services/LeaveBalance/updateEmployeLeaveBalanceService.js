import axios from "axios";

const api_url = `${import.meta.env.VITE_API_BASE_URL}/api/leave-balance`;

export const updateLeaveBalance = async (id, leaveBalanceData) => {
    const token = localStorage.getItem("hrms_token");

    const response = await axios.put(
        `${api_url}/${id}`,
        leaveBalanceData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};