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

  // Simple card data (hydrate later from auth)
  const info = {
    code: "MA0203",
    name: localStorage.getItem("user") || "Anatomy HOD",
    designation: "Coordinator",
    department: "Medical Administration",
    doj: "18/06/2025",
    email: "ayeshac@iul.ac.in",
    mobile: "7906786232",
  };

  return (
    <aside className="w-[280px] h-screen fixed bg-[#F0F0F0] shadow-sm border-r border-[#E6E6E7] flex flex-col">
      {/* Top brand */}
      <div className="px-6 pt-6">
        <img src={logo} alt="Integral Logo" className="h-11 mb-6" />
      </div>

      {/* Profile card — matches screenshot */}
      <div className="mx-4 bg-white border border-[#E6E6E7] rounded-lg overflow-hidden shadow-sm">
        <div className="p-4 bg-[#233955]">
          <div className="w-20 h-20 rounded-md mx-auto bg-[#A2F2EE]" />
        </div>
        <div className="p-4 text-[12px] leading-5 text-[#05080B] space-y-1">
          <div><b>Employee Code :</b> {info.code}</div>
          <div><b>Name :</b> {info.name}</div>
          <div><b>Designation :</b> {info.designation}</div>
          <div><b>Department :</b> {info.department}</div>
          <div><b>Date of Joining :</b> {info.doj}</div>
          <div><b>Official E-mail :</b> {info.email}</div>
          <div><b>Mobile Number :</b> {info.mobile}</div>
        </div>

        <div className="border-t border-[#E6E6E7]">
          <button className="w-full text-left px-4 py-3 text-sm hover:bg-[#F0F0F0]">Account Settings</button>
          <button className="w-full text-left px-4 py-3 text-sm hover:bg-[#F0F0F0]">Change Password</button>
        </div>

        <div className="border-t border-[#E6E6E7]">
          <div className="px-4 py-2 font-semibold text-sm bg-[#E6E6E7]">Quick Links</div>
          <div className="flex flex-col">
            {["Check Email", "University Website", "Student MIS", "Telephone Directory", "Phase-III"].map((q, i) => (
              <a key={i} href="#" className="px-4 py-2 text-sm hover:bg-[#F0F0F0]">{q}</a>
            ))}
          </div>
        </div>
      </div>

      {/* Menu */}
      

      {/* Footer actions + pinned IHMS button */}
      <div className="mt-auto border-t border-[#E6E6E7] p-4 space-y-3">
        <div className="flex items-center justify-between">
          <button className="p-2 rounded-lg bg-[#233955] hover:bg-[#1a2a40] text-[#E6E6E7]">
            <FiBell size={18} />
          </button>
          <button className="p-2 rounded-lg bg-[#233955] hover:bg-[#1a2a40] text-[#E6E6E7]">
            <FiSettings size={18} />
          </button>
        </div>

        {/* IHMS Button (bottom) */}
        <NavLink
          to="/dashboard"
          title="Open IHMS"
          className="block w-full text-center rounded-full px-4 py-2 font-medium bg-[#A2F2EE] text-[#233955] hover:bg-[#8DE9E5] transition"
        >
          <span className="inline-flex items-center justify-center gap-2">
            <FiExternalLink /> IHMS
          </span>
        </NavLink>
      </div>
    </aside>
  );
};

export default EMSSidebar;
