import axios from "axios";

// console.log("ENV =", import.meta.env.VITE_API_BASE_URL);

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/holidays/import`;

console.log("API_URL =", API_URL);

export const createBulkUploadHoliday = async (holidayData) => {
    const token = localStorage.getItem("hrms_token");

    try {
        const response = await axios.post(
            API_URL,
            holidayData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return response.data;
    } catch (error) {
        console.log("Status:", error.response?.status);
        console.log("Response:", error.response?.data);
        throw error;
    }
};