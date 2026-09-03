import axios from "axios";

const api_url = `${import.meta.env.VITE_API_BASE_URL}/api/designations`;

export const updateDesignation = async (id, designationData) => {
    try {
        const token = localStorage.getItem("hrms_token");

        const response = await axios.put(`${api_url}/${id}`, designationData, {
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