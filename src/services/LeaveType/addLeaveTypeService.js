import axios from "axios";

console.log("ENV =", import.meta.env.VITE_API_BASE_URL);

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/leave-type`;

console.log("API_URL =", API_URL);

export const createLeaveType = async (leaveTypeData) => {
    const token = localStorage.getItem("hrms_token");
    console.log("TOKEN:", token);

    const response = await axios.post(
        API_URL,
        leaveTypeData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};