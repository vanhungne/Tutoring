import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const useUserName = () => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const token = currentUser?.accessToken; // Lấy accessToken

    if (token) {
      try {
        const decoded = jwtDecode(token); 
        const extractedUserName =
          decoded[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
          ] || decoded.userName; 

        if (extractedUserName) {
          setUserName(extractedUserName); 
        } else {
          console.error("UserName not found in token.");
        }
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token"); 
      }
    }
  }, []);

  return userName;
};

export default useUserName;
