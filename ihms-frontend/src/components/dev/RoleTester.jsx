// src/components/dev/RoleTester.jsx
import React, { useState } from "react";
import { RefreshCw, User, Settings } from "lucide-react";

const RoleTester = ({ onRoleChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("Admin");

  const availableRoles = [
    "HOD", 
    "Incharge",
    "Dean",
    "Competent Authority", 
    "Administrator",
    "PO",
    "Inventory Admin"
  ];

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    
    // ✅ Simulate role change by updating localStorage
    const mockUserData = {
      name: `Test User (${role})`,
      email: `test.${role.toLowerCase().replace(/\s+/g, '.')}@hospital.com`,
      role: role,
      department: role === "HOD" || role === "Incharge" ? "Cardiology" : "Administrator"
    };

    // Create a mock JWT token (for testing only)
    const mockToken = btoa(JSON.stringify({
      sub: mockUserData.email,
      role: mockUserData.role,
      name: mockUserData.name,
      department: mockUserData.department,
      exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour expiry
    }));

    localStorage.setItem("token", mockToken);
    localStorage.setItem("user", mockUserData.name);
    
    // ✅ Trigger role change callback
    if (onRoleChange) {
      onRoleChange(role);
    }

    // ✅ Refresh the page to apply changes
    window.location.reload();
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition z-50"
        title="Role Tester (Dev Mode)"
      >
        <Settings className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-xl border p-4 min-w-[280px] z-50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <User className="w-4 h-4" />
          Role Tester
        </h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      <div className="mb-3">
        <p className="text-sm text-gray-600 mb-2">Current Role:</p>
        <div className="bg-gray-100 px-3 py-2 rounded text-sm font-medium">
          {selectedRole}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">Switch to:</p>
        <div className="grid grid-cols-2 gap-1 max-h-40 overflow-y-auto">
          {availableRoles.map((role) => (
            <button
              key={role}
              onClick={() => handleRoleChange(role)}
              className={`text-xs px-2 py-1 rounded border text-left ${
                role === selectedRole
                  ? "bg-purple-100 text-purple-700 border-purple-200"
                  : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t pt-3">
        <button
          onClick={() => window.location.reload()}
          className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white px-3 py-2 rounded text-sm hover:bg-purple-700 transition"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh App
        </button>
      </div>

      <p className="text-xs text-gray-500 mt-2 text-center">
        🚨 Development Only
      </p>
    </div>
  );
};

export default RoleTester;