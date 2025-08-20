// src/components/auth/RoleBasedRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import AccessDenied from "../../pages/AccessDenied/AccessDenied";

const RoleBasedRoute = ({ children, allowedRoles = [], redirectTo = "/dashboard", showAccessDenied = true }) => {
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await fetch("http://localhost:8000/auth/me", {
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          });
          
          if (response.ok) {
            const userData = await response.json();
            setUserRole(userData.role);
            console.log("🔐 RoleGuard - User role:", userData.role);
          } else {
            console.error("❌ Failed to fetch user role");
            setUserRole(null);
          }
        }
      } catch (error) {
        console.error("❌ Role fetch error:", error);
        setUserRole(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  // ✅ Show loading while fetching role
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Checking Access...</h2>
          <p className="text-gray-600">Verifying your permissions</p>
        </div>
      </div>
    );
  }

  // ✅ Check if user role is allowed
  const hasAccess = userRole && allowedRoles.includes(userRole);

  if (!hasAccess) {
    console.log(`❌ Access denied for role: ${userRole}, allowed: ${allowedRoles.join(", ")}`);
    
    // ✅ Show Access Denied page or redirect
    if (showAccessDenied) {
      return <AccessDenied userRole={userRole || "Unknown"} requiredRoles={allowedRoles} />;
    } else {
      return <Navigate to={redirectTo} replace />;
    }
  }

  console.log(`✅ Access granted for role: ${userRole}`);
  return children;
};

export default RoleBasedRoute;