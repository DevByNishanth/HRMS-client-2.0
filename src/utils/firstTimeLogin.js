import { jwtDecode } from "jwt-decode";

export const isFirstTimeLogin = async () => {
  let token = localStorage.getItem("hrms_token");

  if (!token) {
    return false;
  }

  try {
    //   ? decode token

    const decodedToken = jwtDecode(token);

    // ? check if the token has the "firstTimeLogin" claim and return its value
    if (
      decodedToken.isFirstTimeLogin == true ||
      decodedToken.isFirstTimeLogin == "true"
    ) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error decoding token:", error);
    return false;
  }
};
