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

  // Simple card data (hydrate later from auth)+
  const info = {
    code: "MA0203",
    name: localStorage.getItem("user") || "Anatomy HOD",
    designation: "Coordinator",
    department: "Medical Administration",
    doj: "18/06/2025",
    email: "ayeshac@iul.ac.in",
    mobile: "7906786232",
  };

  // ✅ Updated function to handle SSO with token passing
  const handleIHMSNavigation = () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    
    if (!token || !user) {
      alert("Please login first to access IHMS");
      return;
    }

    // ✅ Create SSO URL with token and user info
    const ihmsBaseUrl = "http://localhost:5174"; // or your IHMS port
    const ssoParams = new URLSearchParams({
      sso_token: token,
      sso_user: user,
      from: "ems"
    });
    
    const ihmsUrl = `${ihmsBaseUrl}/sso-login?${ssoParams.toString()}`;
    
    // ✅ Open in the same tab for seamless experience
    window.location.href = ihmsUrl;
  };


  return (
    <aside className="w-[300px] h-screen fixed bg-[#F0F0F0] shadow-sm flex flex-col justify-between">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-400/10 to-blue-400/10 rounded-full blur-2xl"></div>
      
      {/* Top brand */}
      <div className="px-6 pt-8 pb-4 relative z-10">
        <img src={logo} alt="Integral Logo" className="h-12 mb-2 md:mb" />
      </div>

      {/* Profile card – matches screenshot UI with gradient and glass effect */}
      <div className="mx-4 mb-6 relative z-10">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300">
          {/* Header with gradient */}
          <div className="relative p-6 overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-lg"></div>
            <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-white/10 rounded-lg"></div>
            
            <div className="relative z-10 text-center">
              <div className="w-20 h-20 rounded-lg mx-auto bg-[#A2F2EE]  flex items-center justify-center shadow-lg">
                <div className="w-16 h-16 rounded-lg bg-[#A2F2EE] flex items-center justify-center text-[#233955] font-bold text-4xl">
                  {info.name.split(' ').map(n => n[0]).join('')}
                </div>
              </div>
            </div>
          </div>
          
          {/* Profile info */}
          <div className="p-4 space-y-2">
            {Object.entries({
              'Employee Code': info.code,
              'Name': info.name,
              'Designation': info.designation,
              'Department': info.department,
              'Date of Joining': info.doj,
              'Official E-mail': info.email,
              'Mobile Number': info.mobile
            }).map(([key, value]) => (
              <div key={key} className="flex text-xs">
                <span className="font-semibold text-slate-600 w-20 flex-shrink-0">{key.split(' ')[0]}:</span>
                <span className="text-slate-700 ml-2">{value}</span>
              </div>
            ))}
          </div>

          {/* Action buttons with gradient */}
          <div className="border-t border-slate-100 divide-y divide-slate-100">
            <div className="px-4 py-3 font-bold text-sm bg-[#F0F0F0] text-slate-700 border-b border-slate-100 text-center">
              Account Settings
            </div>
            <button className="w-full text-left px-4 py-3 text-xs text-[#4B4D4F] hover:bg-[#A2F2EE] hover:text-[#233955] transition-all duration-200 font-normal hover:translate-x-1">
              Change Password
            </button>
          </div>

          {/* Quick Links section */}
          <div className="border-t border-slate-100">
            <div className="px-4 py-3 font-bold text-sm bg-[#F0F0F0] text-slate-700 border-b border-slate-100 text-center">
              Quick Links
            </div>
            <div className="divide-y divide-slate-100">
              {["Check Email", "University Website", "Student MIS", "Telephone Directory", "Phase-III"].map((q, i) => (
                <a 
                  key={i} 
                  href="#" 
                  className="block px-4 py-2.5 text-xs text-[#4B4D4F] hover:bg-[#A2F2EE] hover:text-[#233955] transition-all duration-200 font-normal hover:translate-x-1"
                >
                  {q}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer actions + pinned IHMS button */}
      <div className="mt-auto p-4 space-y-4 relative z-10">

        {/* IHMS Button */}
        <button
          onClick={handleIHMSNavigation}
          title="Open IHMS (Single Sign-On)"
          className="block w-full text-center rounded-lg px-1 py-2 font-bold text-[#E6E6E7] bg-[#233955] hover:bg-[#1a2a40] transition-all duration-300 hover:shadow-xl hover:scale-105 transform relative overflow-hidden group"
        >
          {/* Shine effect
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
           */}
          <span className="inline-flex items-center justify-center gap-2 relative z-10">
            <FiExternalLink className="group-hover:rotate-12 transition-transform duration-300" /> 
            IHMS
          </span>
        </button>
      </div>
    </aside>
  );
};

export default EMSSidebar;