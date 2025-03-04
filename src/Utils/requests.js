import axios from "axios";

const API_URL = import.meta.env.VITE_APP_URL_API;
if (!API_URL) {
  throw new Error("No API URL provided");
}

export const requests = axios.create({
  baseURL: API_URL.replace(/\/$/, ""), // Remove trailing slash if present
  headers: {
    "Content-Type": "application/json",
  },
  // Add timeout
  timeout: 10000,
  // Add withCredentials if your API requires cookies
  withCredentials: true,
});

// Add request debugging
requests.interceptors.request.use(
  (config) => {
    const userStr = localStorage.getItem("currentUser");
    if (userStr) {
      const currentUser = JSON.parse(userStr);
      if (currentUser?.accessToken) {
        config.headers.Authorization = `Bearer ${currentUser.accessToken}`;
      }
      console.log("Dữ liệu currentUser:", currentUser);
    }

    // Chỉ đặt `Content-Type` khi dữ liệu không phải FormData
    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
  
);


// Improve error handling in response interceptor
requests.interceptors.response.use(
  (response) => {
    console.log("Response Status:", response.status);
    return response;
  },
  (error) => {
    console.error("Full Error:", error);

    if (error.code === "ECONNABORTED") {
      console.error("Request timed out");
      return Promise.reject(new Error("Request timed out"));
    }

    if (!error.response) {
      console.error("Network Error:", error);
      return Promise.reject(
        new Error("Network error - please check your connection")
      );
    }

    if (error.response) {
      console.error("Response Error Status:", error.response.status);
      console.error("Response Error Data:", error.response.data);

      switch (error.response.status) {
        case 401:
          toast.error("Session expired. Please log in again.");

          // Avoid redirecting if the user is already on the login page
          if (!window.location.pathname.includes("/login")) {
            setTimeout(() => {
              localStorage.removeItem("currentUser");
              window.location.href = "/login";
            }, 3000); // Delay redirect to allow the user to see the error message
          }
          return Promise.reject(new Error("Unauthorized - please log in again"));

        case 403:
          return Promise.reject(
            new Error("Forbidden - you do not have permission")
          );
        case 404:
          return Promise.reject(new Error("Resource not found"));
        case 500:
          return Promise.reject(
            new Error("Server error - please try again later")
          );
        default:
          return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);



export default requests;
