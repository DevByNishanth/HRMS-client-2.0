// import axios from "axios";
// const api_url = `${import.meta.env.VITE_API_BASE_URL}/api/faculties`;
// export const firstLoginComplete = async (token) => {
//     try {
//         const response = await axios.patch(
//             `${api_url}/api/auth/first-login-complete`,
//             {},
//             {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             }
//         );

//         return response.data;
//     } catch (error) {
//         console.log("FULL ERROR:", error);
//         console.log("MESSAGE:", error.message);
//         console.log("REQUEST:", error.request);
//         console.log("RESPONSE:", error.response);

//         throw error;

//         alert(
//             error.response?.data?.message ||
//             "Failed to complete first login"
//         );

//         throw error;
//     }
// };

import axios from "axios";

export const firstLoginComplete = async () => {
    try {
        const token = localStorage.getItem("hrms_token");

        const response = await axios.patch(
            `${import.meta.env.VITE_API_BASE_URL}/api/auth/first-login-complete`,
            {},
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

            // FIXED
            window.location.href = "/";
        }

        throw error;
    }
};