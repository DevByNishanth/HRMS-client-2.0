import axios from "axios";

// console.log("ENV =", import.meta.env.VITE_API_BASE_URL);

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/holidays`;

// console.log("API_URL =", API_URL);

export const createHoliday = async (holidayData) => {
    const token = localStorage.getItem("hrms_token");
    // console.log("TOKEN:", token);

    const response = await axios.post(
        API_URL,
        holidayData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};