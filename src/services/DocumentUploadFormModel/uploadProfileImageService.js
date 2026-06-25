import axios from "axios";

const api_url = `${import.meta.env.VITE_API_BASE_URL}/api/faculties`;

export const uploadProfileImage = async (
    facultyId,
    file
) => {
    try {
        const token = localStorage.getItem("hrms_token");

        const formData = new FormData();

        formData.append("profileImage", file);

        const response = await axios.patch(
            `${api_url}/${facultyId}/profile-image`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
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