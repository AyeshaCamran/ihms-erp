// src/components/layout/Layout.jsx
import React from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import { FiSettings, FiBell } from "react-icons/fi";

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar - full height */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="flex justify-between items-center bg-white shadow px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Welcome to IHMS ERP
          </h2>
          <div className="flex items-center gap-4">
            <button className="text-gray-600 hover:text-blue-600">
              <FiBell size={20} />
            </button>
            <button className="text-gray-600 hover:text-blue-600">
              <FiSettings size={20} />
            </button>
            <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
              Login
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
