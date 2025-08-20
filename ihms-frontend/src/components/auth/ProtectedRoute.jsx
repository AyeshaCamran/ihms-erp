// ihms-frontend/src/components/auth/ProtectedRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children, setUser }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");

        console.log("🔍 Checking authentication:", { 
          hasToken: !!token, 
          hasUser: !!user 
        });

        if (!token || !user) {
          console.log("❌ No token or user found");
          redirectToEMSLogin();
          return;
        }

        // ✅ Check if token is expired
        try {
          const decoded = jwtDecode(token);
          const currentTime = Math.floor(Date.now() / 1000);
          
          if (decoded.exp < currentTime) {
            console.log("❌ Token expired");
            redirectToEMSLogin();
            return;
          }

          // ✅ Validate token with auth service
          const response = await fetch("http://localhost:8000/auth/me", {
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            console.log("❌ Token validation failed with auth service");
            redirectToEMSLogin();
            return;
          }

          const userData = await response.json();
          console.log("✅ Authentication successful:", userData);

          // ✅ Set user data
          setUser(userData.name || user);
          setIsAuthenticated(true);

        } catch (tokenError) {
          console.log("❌ Token validation error:", tokenError);
          redirectToEMSLogin();
          return;
        }

      } catch (error) {
        console.error("❌ Authentication check error:", error);
        redirectToEMSLogin();
      } finally {
        setIsChecking(false);
      }
    };

    checkAuthentication();
  }, [setUser]);

  const redirectToEMSLogin = () => {
    // ✅ Clear all local storage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("sso_session");
    
    // ✅ Redirect to EMS login
    const emsLoginUrl = "http://localhost:5173/";
    const returnUrl = encodeURIComponent(window.location.href);
    window.location.href = `${emsLoginUrl}?return=${returnUrl}&message=Please login to access IHMS`;
  };

  // ✅ Show loading while checking authentication
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Verifying Access...</h2>
          <p className="text-gray-600">Checking your authentication status</p>
        </div>
      </div>
    );
  }

  // ✅ Redirect to EMS if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // ✅ Render protected content if authenticated
  return children;
};

export default ProtectedRoute;