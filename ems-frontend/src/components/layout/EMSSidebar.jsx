import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "/Users/fuzailakhtar/Documents/ihms-erp/ems-frontend/src/assets/iul-logo.png";
import {
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
    <aside className="w-[280px] h-screen fixed bg-[#E2E8F0] shadow-md flex flex-col font-sans">
      {/* Top brand */}
      <div className="px-6 pt-6">
        <img src={logo} alt="Integral Logo" className="h-11 mb-6" />
      </div>

      {/* Profile card — matches screenshot UI */}
      <div className="mx-4 bg-white rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 bg-[#4A5568] rounded-t-xl">
          <div className="w-20 h-20 rounded-full mx-auto bg-white/30 border-2 border-white" />
        </div>
        <div className="p-4 text-[12px] leading-5 text-[#4A5568] space-y-1">
          <div><b>Employee Code :</b> {info.code}</div>
          <div><b>Name :</b> {info.name}</div>
          <div><b>Designation :</b> {info.designation}</div>
          <div><b>Department :</b> {info.department}</div>
          <div><b>Date of Joining :</b> {info.doj}</div>
          <div><b>Official E-mail :</b> {info.email}</div>
          <div><b>Mobile Number :</b> {info.mobile}</div>
        </div>

        <div className="border-t border-[#E2E8F0] divide-y divide-[#E2E8F0]">
          <button className="w-full text-left px-4 py-3 text-sm text-[#4A5568] hover:bg-[#F0F4F9] transition-colors">Account Settings</button>
          <button className="w-full text-left px-4 py-3 text-sm text-[#4A5568] hover:bg-[#F0F4F9] transition-colors">Change Password</button>
        </div>

        <div className="border-t border-[#E2E8F0]">
          <div className="px-4 py-2 font-semibold text-sm bg-[#E2E8F0] text-[#2D3748]">Quick Links</div>
          <div className="flex flex-col">
            {["Check Email", "University Website", "Student MIS", "Telephone Directory", "Phase-III"].map((q, i) => (
              <a key={i} href="#" className="px-4 py-2 text-sm text-[#4A5568] hover:bg-[#F0F4F9] transition-colors">{q}</a>
            ))}
          </div>
        </div>
      </div>

      {/* Menu - kept as is */}


      {/* Footer actions + pinned IHMS button */}
      <div className="mt-auto border-t border-[#E2E8F0] p-4 space-y-3">
        <div className="flex items-center justify-between">
          <button className="p-2 rounded-xl bg-white text-[#4A5568] hover:bg-[#E2E8F0] transition-colors">
            <FiBell size={18} />
          </button>
          <button className="p-2 rounded-xl bg-white text-[#4A5568] hover:bg-[#E2E8F0] transition-colors">
            <FiSettings size={18} />
          </button>
        </div>

        {/* IHMS Button (bottom) - updated to navy blue shade */}
        <NavLink
          to="/dashboard"
          title="Open IHMS"
          className="block w-full text-center rounded-full px-4 py-2 font-me bg-[#233955] text-white hover:bg-[#233955] transition-colors"
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