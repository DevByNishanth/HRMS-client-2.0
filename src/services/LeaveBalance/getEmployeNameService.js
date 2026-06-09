import axios from "axios";

const api_url = `${import.meta.env.VITE_API_BASE_URL}/api/faculties/search`;

export const getfacultiesName = async (searchTerm) => {
    try {
        const token = localStorage.getItem("hrms_token");

        const response = await axios.get(api_url, {
            params: {
                q: searchTerm,
            },
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