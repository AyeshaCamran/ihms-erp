import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "/Users/fuzailakhtar/Documents/ihms-erp/ems-frontend/src/assets/iul-logo.png";
import {
  FiChevronDown,
  FiChevronUp,
  FiHome,
  FiCalendar,
  FiClock,
  FiAlertCircle,
  FiDollarSign,
  FiExternalLink,
  FiSettings,
  FiBell,
} from "react-icons/fi";

const EMSSidebar = () => {
  const [openEMS, setOpenEMS] = useState(true);

  return (
    <aside className="w-[280px] h-screen fixed bg-[#F0F0F0] shadow-sm border-r border-[#E6E6E7] flex flex-col justify-between">
      <div className="px-6 py-6">
        <img src={logo} alt="Integral Logo" className="h-11 mb-10 md:mb-16" />

        <ul className="space-y-2 text-sm text-[#4B4D4F] font-medium">
          <li>
            <NavLink
              to="/ems/home"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-full ${
                  isActive ? "bg-[#A2F2EE] text-[#233955]" : "hover:bg-[#A2F2EE] hover:text-[#233955]"
                }`
              }
            >
              <FiHome /> Home
            </NavLink>
          </li>

          <li>
            <button
              onClick={() => setOpenEMS(!openEMS)}
              className="w-full flex items-center justify-between px-4 py-2 rounded-full hover:bg-[#A2F2EE] hover:text-[#233955]"
            >
              <span className="flex items-center gap-2">
                Employee Menu
              </span>
              {openEMS ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            {openEMS && (
              <ul className="ml-4 mt-1 space-y-1 text-sm text-[#4B4D4F] font-normal">
                <li>
                  <NavLink
                    to="/ems/leave"
                    className={({ isActive }) =>
                      `block px-3 py-1 rounded-full ${
                        isActive ? "text-[#233955] bg-[#A2F2EE]" : "hover:text-[#233955] hover:bg-[#A2F2EE]"
                      }`
                    }
                  >
                    <span className="flex items-center gap-2">
                      <FiCalendar /> Leave
                    </span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/ems/attendance"
                    className={({ isActive }) =>
                      `block px-3 py-1 rounded-full ${
                        isActive ? "text-[#233955] bg-[#A2F2EE]" : "hover:text-[#233955] hover:bg-[#A2F2EE]"
                      }`
                    }
                  >
                    <span className="flex items-center gap-2">
                      <FiClock /> Attendance
                    </span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/ems/grievances"
                    className={({ isActive }) =>
                      `block px-3 py-1 rounded-full ${
                        isActive ? "text-[#233955] bg-[#A2F2EE]" : "hover:text-[#233955] hover:bg-[#A2F2EE]"
                      }`
                    }
                  >
                    <span className="flex items-center gap-2">
                      <FiAlertCircle /> Grievances
                    </span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/ems/salary"
                    className={({ isActive }) =>
                      `block px-3 py-1 rounded-full ${
                        isActive ? "text-[#233955] bg-[#A2F2EE]" : "hover:text-[#233955] hover:bg-[#A2F2EE]"
                      }`
                    }
                  >
                    <span className="flex items-center gap-2">
                      <FiDollarSign /> Salary
                    </span>
                  </NavLink>
                </li>
              </ul>
            )}
          </li>

          {/* Link to IHMS (SSO can be added later) */}
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-full ${
                  isActive ? "bg-[#A2F2EE] text-[#233955]" : "hover:bg-[#A2F2EE] hover:text-[#233955]"
                }`
              }
              title="Open IHMS"
            >
              <FiExternalLink /> IHMS
            </NavLink>
          </li>
        </ul>
      </div>

      <div className="flex items-center justify-between px-6 py-4 border-t border-[#E6E6E7]">
        <button className="p-2 rounded-lg bg-[#233955] hover:bg-[#1a2a40] text-[#E6E6E7]">
          <FiBell size={18} />
        </button>
        <button className="p-2 rounded-lg bg-[#233955] hover:bg-[#1a2a40] text-[#E6E6E7]">
          <FiSettings size={18} />
        </button>
      </div>
    </aside>
  );
};

export default EMSSidebar;
