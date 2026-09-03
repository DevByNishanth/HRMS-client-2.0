import axios from "axios";

const api_url = `${import.meta.env.VITE_API_BASE_URL}/api/designations`;

export const createDesignation = async (designationData) => {
    try {
        const token = localStorage.getItem("hrms_token");

        const response = await axios.post(api_url, designationData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

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