// Token utility functions for decoding JWT and extracting role
export const getTokenFromLocalStorage = () => {
  return localStorage.getItem("hrms_token");
};

export const decodeToken = (token) => {
  try {
    // JWT format: header.payload.signature
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

export const getRoleFromToken = () => {
  const token = getTokenFromLocalStorage();
  if (!token) return null;

  const decoded = decodeToken(token);
  return decoded?.role || null;
};

export const isTokenValid = () => {
  const token = getTokenFromLocalStorage();
  if (!token) return false;

  const decoded = decodeToken(token);
  if (!decoded) return false;

  // Check if token has expired (if exp claim exists)
  if (decoded.exp) {
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp > currentTime;
  }

  return true;
};

export const getRoleBasedRoute = () => {
  const role = getRoleFromToken();
  switch (role?.toLowerCase()) {
    case "admin":
      return "/dashboard-admin";
    case "faculty":
      return "/dashboard-faculty";
    case "hod":
      return "/dashboard-faculty";
    case "principal":
      return "/dashboard-principal";
    case "non-teaching":
      return "/dashboard-faculty";
    default:
      return "/dashboard-faculty";
  }
};

export const logout = () => {
  // Remove token from localStorage
  localStorage.removeItem("hrms_token");
};
