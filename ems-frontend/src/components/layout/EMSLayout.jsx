import React, { useState } from "react";
import { Outlet, useNavigate, useLocation, NavLink } from "react-router-dom";
import { FiSettings, FiBell, FiChevronDown, FiLogOut, FiMenu, FiX } from "react-icons/fi";
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
    setUser?.(null);
    navigate("/");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] h-screen w-screen overflow-hidden bg-white">
      {/* Sidebar desktop */}
      <div className="hidden md:block">
        <EMSSidebar />
      </div>

      {/* Sidebar mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.3 }}
            className="fixed z-50 top-0 left-0 h-screen w-[280px] bg-white shadow-lg md:hidden"
          >
            <EMSSidebar />
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-red-500"
            >
              <FiX size={22} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex flex-col h-screen w-full overflow-hidden">
        {/* Topbar */}
        <header className="flex flex-col gap-2 bg-white shadow px-4 md:px-6 py-3">
          {/* Row 1: title + right controls */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                className="md:hidden text-gray-700 hover:text-blue-600"
                onClick={() => setIsSidebarOpen(true)}
              >
                <FiMenu size={22} />
              </button>
              <h2 className="text-[24px] font-semibold text-[#05080B]">
                {pageTitle}
              </h2>
            </div>

            <div className="flex items-center gap-3 relative">
              <button className="p-2 rounded-lg bg-[#E6E6E7] hover:bg-[#233955] text-[#4B4D4F] hover:text-white transition">
                <FiSettings size={18} />
              </button>
              <button className="relative p-2 rounded-lg bg-[#E6E6E7] hover:bg-[#233955] text-[#4B4D4F] hover:text-white transition">
                <FiBell size={18} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FD4245] rounded-full border-2 border-white" />
              </button>

              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen((p) => !p)}
                  className="flex items-center gap-2 px-2 py-1 rounded-full bg-[#E6E6E7] hover:bg-[#233955] text-[#4B4D4F] hover:text-white transition"
                >
                  <span className="w-6 h-6 rounded-full bg-[#A2F2EE] text-black font-semibold flex items-center justify-center text-xs">
                    {user?.[0] || "U"}
                  </span>
                  <span className="text-sm font-medium pr-1 hidden sm:inline">
                    Hi, {user}
                  </span>
                  <FiChevronDown size={14} />
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-44 bg-white rounded-md shadow-md z-50"
                    >
                      <ul className="py-1 text-sm text-gray-700">
                        <li
                          onClick={handleLogout}
                          className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                          <FiLogOut size={16} />
                          Logout
                        </li>
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Row 2: Horizontal EMS menu (desktop only) */}
          <nav className="hidden md:flex items-center gap-2">
            {topMenu.map((m) => (
              <NavLink
                key={m.to}
                to={m.to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-full text-sm ${
                    isActive
                      ? "bg-[#A2F2EE] text-[#233955]"
                      : "text-[#4B4D4F] hover:bg-[#A2F2EE] hover:text-[#233955]"
                  }`
                }
              >
                {m.label}
              </NavLink>
            ))}
          </nav>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto px-4 md:px-6 pt-4 pb-6 bg-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default EMSLayout;
