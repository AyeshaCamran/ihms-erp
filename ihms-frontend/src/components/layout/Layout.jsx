// import React, { useState } from "react";
// import { Outlet, useNavigate, useLocation } from "react-router-dom";
// import {
//   FiSettings,
//   FiBell,
//   FiChevronDown,
//   FiLogOut,
//   FiMenu,
//   FiX,
// } from "react-icons/fi";
// import Sidebar from "./Sidebar";
// import { motion, AnimatePresence } from "framer-motion";

// const Layout = ({ user = "Alfredo Westervelt", setUser }) => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   const pathTitleMap = {
//     "/dashboard": "Dashboard",
//     "/inventory": "Inventory",
//     "/inventory/requisition": "Requisition",
//     "/inventory/maintenance": "Complaint & Maintenance",
//     "/inventory/add": "Add Inventory Item",
//     "/inventory/indent": "Indent",
//     "/inventory/stock": "Stock",
//     "/inventory/audit": "Audit & Compliance",


//   };
//   const pageTitle = pathTitleMap[location.pathname] || "IHMS ERP";

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     setUser(null);
//     navigate("/");
//   };

//   const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
//   const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

//   return (
//   <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] h-screen w-screen overflow-hidden bg-white">
//       {/* Sidebar Section */}
//       <div className="hidden md:block">
//         <Sidebar />
//       </div>

//       {/* Mobile Sidebar */}
//       <AnimatePresence>
//         {isSidebarOpen && (
//           <motion.div
//             initial={{ x: -280 }}
//             animate={{ x: 0 }}
//             exit={{ x: -280 }}
//             transition={{ duration: 0.3 }}
//             className="fixed z-50 top-0 left-0 h-screen w-[280px] bg-white shadow-lg md:hidden"
//           >
//             <Sidebar />
//             <button
//               onClick={toggleSidebar}
//               className="absolute top-4 right-4 text-gray-600 hover:text-red-500"
//             >
//               <FiX size={22} />
//             </button>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Main Content Section */}
//       <div className="flex flex-col h-screen w-full overflow-hidden">
//         {/* Topbar */}
//         <header className="flex justify-between items-center bg-white shadow px-4 md:px-6 py-3">
//           <div className="flex items-center gap-4">
//             <button
//               className="md:hidden text-gray-700 hover:text-blue-600"
//               onClick={toggleSidebar}
//             >
//               <FiMenu size={22} />
//             </button>
//             <h2 className="text-[24px] md:text-[24px] font-semibold text-[#05080B]">
//               {pageTitle}
//             </h2>
//           </div>

//           <div className="flex items-center gap-3 relative">
//             <button className="p-2 rounded-lg bg-[#E6E6E7] hover:bg-[#233955] text-[#4B4D4F] hover:text-white transition">
//               <FiSettings size={18} />
//             </button>

//             <button className="relative p-2 rounded-lg bg-[#E6E6E7] hover:bg-[#233955] text-[#4B4D4F] hover:text-white transition">
//               <FiBell size={18} />
//               <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FD4245] rounded-full border-2 border-white" />
//             </button>

//             {user ? (
//               <div className="relative">
//                 <button
//                   onClick={toggleDropdown}
//                   className="flex items-center gap-2 px-2 py-1 rounded-full bg-[#E6E6E7] hover:bg-[#233955] text-[#4B4D4F] hover:text-white transition"
//                 >
//                   <span className="w-6 h-6 rounded-full bg-[#A2F2EE] text-black hover:text-white font-semibold flex items-center justify-center text-xs">
//                     {user[0]}
//                   </span>
//                   <span className="text-sm font-medium hover:text-white pr-1 hidden sm:inline">
//                     Hi, {user}
//                   </span>
//                   <FiChevronDown size={14} />
//                 </button>

//                 <AnimatePresence>
//                   {isDropdownOpen && (
//                     <motion.div
//                       initial={{ opacity: 0, y: -5 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, y: -5 }}
//                       transition={{ duration: 0.2 }}
//                       className="absolute right-0 mt-2 w-44 bg-white rounded-md shadow-md z-50"
//                     >
//                       <ul className="py-1 text-sm text-gray-700">
//                         <li
//                           onClick={handleLogout}
//                           className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                         >
//                           <FiLogOut size={16} />
//                           Logout
//                         </li>
//                       </ul>
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </div>
//             ) : (
//               <button
//                 onClick={() => navigate("/login")}
//                 className="bg-[#233955] text-white px-3 py-1 rounded hover:bg-opacity-90"
//               >
//                 Login
//               </button>
//             )}
//           </div>
//         </header>

//         {/* Page Scrollable Content */}
//         <main className="flex-1 overflow-auto px-4 md:px-6 pt-4 pb-6 bg-white">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Layout;
