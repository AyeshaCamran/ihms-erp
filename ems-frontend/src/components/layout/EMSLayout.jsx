import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { FiSettings, FiBell, FiChevronDown, FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import EMSSidebar from "./EMSSidebar";

const EMSLayout = ({ user = "Employee", setUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Map for page title (unchanged)
  const pathTitleMap = {
    "/ems/home": "Employee Management System",
    "/ems/leave": "Leave",
    "/ems/attendance": "Attendance",
    "/ems/grievances": "Grievances",
    "/ems/salary": "Salary",
  };
  const pageTitle = pathTitleMap[location.pathname] || "EMS";

  // Same routes as sidebar for horizontal menu
  const topMenu = [
    { to: "/ems/home", label: "Home" },
    { to: "/ems/leave", label: "Leave" },
    { to: "/ems/attendance", label: "Attendance" },
    { to: "/ems/grievances", label: "Grievances" },
    { to: "/ems/salary", label: "Salary" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] h-screen w-screen overflow-hidden bg-[#F0F0F0]">
      {/* Sidebar desktop */}
      <div className="hidden md:block">
        <EMSSidebar />
      </div>

      {/* Sidebar mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.3 }}
            className="fixed z-50 top-0 left-0 h-screen w-[300] bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 shadow-2xl md:hidden"
          >
            <EMSSidebar />
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="absolute top-4 right-4 text-slate-600 hover:text-red-500 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-all duration-200"
            >
              <FiX size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex flex-col h-screen w-full overflow-hidden">
        {/* Enhanced Topbar with glass effect */}
        <header className="flex justify-between items-center bg-[#F0F0F0] px-4 md:px-6 py-4 relative">
          {/* Decorative gradient line */}
          {/* <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600"></div> */}
          
          <div className="flex items-center gap-4">
            <button
              className="md:hidden text-slate-700 hover:text-[#233955] p-2 rounded-lg hover:bg-blue-50 transition-all duration-200"
              onClick={() => setIsSidebarOpen(true)}
            >
              <FiMenu size={22} />
            </button>
            
            {/* Horizontal navigation menu */}
            <nav className="hidden md:flex justify-stretch items-center gap-4 rounded-lg px-8 py-2">
              {topMenu.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `px-8 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-[#233955] text-white shadow-md"
                        : "text-slate-600 hover:bg-white hover:text-[#233955]"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            {/* Mobile page title */}
            <div className="md:hidden">
              <h2 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                {pageTitle}
              </h2>
              <div className="w-8 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mt-1"></div>
            </div>
          </div>

          <div className="flex items-center gap-3 relative">
            {/* Enhanced action buttons */}
            <button className="relative p-2.5 rounded-lg bg-[#E6E6E7] hover:bg-[#233955] text-[#4B4D4F] hover:text-white hover:shadow-lg transition-all duration-300 group">
              <FiSettings size={18} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>
            
            <button className="relative p-2.5 rounded-lg bg-[#E6E6E7] hover:bg-[#233955] text-[#4B4D4F] hover:text-white hover:shadow-lg transition-all duration-300 group">
              <FiBell size={18} className="group-hover:animate-pulse" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FD4245] rounded-full border-2 border-white animate-pulse"></span>
            </button>

            {/* Enhanced user dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen((p) => !p)}
                className="flex items-center gap-2 px-2 py-1 rounded-lg bg-[#E6E6E7] hover:bg-[#233955] text-[#4B4D4F] hover:text-white transition duration-300 group"
              >
                <div className="w-8 h-8 rounded-full bg-[#A2F2EE] text-[#4B4D4F] font-bold flex items-center justify-center text-sm shadow-lg">
                  {user?.[0] || "U"}
                </div>
                <span className="text-sm font-medium hover:text-white pr-1 hidden sm:inline">
                  Hi, {user}
                </span>
                <FiChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -5}}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white rounded-lg shadow-md z-50"
                  >
                    <div className="py-1 text-sm text-gray-700">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 cursor-pointer"
                      >
                        <FiLogOut size={16} />
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Enhanced page content with subtle gradient background */}
        <main className="flex-1 overflow-auto px-4 md:px-6 pt-6 pb-6 bg-gradient-to-br from-white/50 via-slate-50/30 to-blue-50/20 relative">
          {/* Subtle decorative elements */}
          {/* <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100/20 to-indigo-100/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-indigo-100/20 to-blue-100/20 rounded-full blur-3xl pointer-events-none"></div>
           */}
          <div className="relative z-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default EMSLayout;