import axios from "axios";

console.log("ENV =", import.meta.env.VITE_API_BASE_URL);

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/shifts`;

console.log("API_URL =", API_URL);

export const createShifts = async (shiftData) => {
    const token = localStorage.getItem("token");
    console.log("TOKEN:", token);

    const response = await axios.post(
        API_URL,
        shiftData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};