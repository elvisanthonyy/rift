import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoutes = ({ children }) => {
  const [isAuthorizerd, setIsAuthorized] = useState(null);

  useEffect(() => {
    auth();
  }, []);

  const auth = async () => {
    const token = localStorage.getItem("token");

    try {
      if (token) {
        const user = jwtDecode(token);
        if (!user) {
          setIsAuthorized(false);
          const token = localStorage.removeItem("token");
          return;
        } else {
          setIsAuthorized(true);
        }
      } else {
        setIsAuthorized(false);
      }
    } catch (error) {
      alert(error);
    }
  };

  if (isAuthorizerd === null) {
    return <div>Loading...</div>;
  }

  return isAuthorizerd ? children : <Navigate to="/login" />;
};

export default ProtectedRoutes;
