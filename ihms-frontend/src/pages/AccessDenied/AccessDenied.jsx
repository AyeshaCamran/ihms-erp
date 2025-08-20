// src/pages/AccessDenied/AccessDenied.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { ShieldX, ArrowLeft, Home } from "lucide-react";

const AccessDenied = ({ userRole = "Unknown", requiredRoles = [] }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Icon */}
        <div className="mx-auto flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <ShieldX className="w-8 h-8 text-red-600" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
        
        {/* Message */}
        <p className="text-gray-600 mb-4">
          You don't have permission to access this page.
        </p>

        {/* Role Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
          <div className="text-sm">
            <p className="font-medium text-gray-900 mb-1">Your Role:</p>
            <p className="text-gray-600 mb-3">{userRole}</p>
            
            <p className="font-medium text-gray-900 mb-1">Required Roles:</p>
            <p className="text-gray-600">
              {requiredRoles.length > 0 ? requiredRoles.join(", ") : "Not specified"}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            <Home className="w-4 h-4" />
            Go to Dashboard
          </button>
          
          <button
            onClick={() => navigate(-1)}
            className="w-full flex items-center justify-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>

        {/* Help Text */}
        <p className="text-xs text-gray-500 mt-6">
          If you believe this is an error, please contact your system administrator.
        </p>
      </div>
    </div>
  );
};

export default AccessDenied;