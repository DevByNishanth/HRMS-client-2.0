import axios from "axios";

export const getMyTeamData = async () => {
  try {
    const token = localStorage.getItem("hrms_token");

    const response = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/api/myTeam`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching my team data:", error);
    throw error;
  }
};
