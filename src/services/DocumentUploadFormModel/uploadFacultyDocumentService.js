import axios from "axios";

const api_url = `${import.meta.env.VITE_API_BASE_URL}/api/faculties`;

export const uploadFacultyDocument = async (
    facultyId,
    documentType,
    file
) => {
    try {
        const token = localStorage.getItem("hrms_token");

        const formData = new FormData();

        formData.append(documentType, file);

        const response = await axios.patch(
            `${api_url}/${facultyId}/documents`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            }
        );

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