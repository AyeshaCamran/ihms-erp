// // src/components/layout/Sidebar.jsx
// import React, { useState } from "react";
// import { NavLink } from "react-router-dom";
// import logo from "../../assets/iul-logo.png";
// import {
//   FiChevronDown,
//   FiChevronUp,
//   FiBox,
//   FiUsers,
//   FiClipboard,
//   FiHome,
//   FiSettings,
//   FiBell,
//   FiMessageSquare,
//   FiGrid,
//   FiFileText,
//   FiAlertCircle,
//   FiDatabase,
//   FiEdit,
//   FiCheckCircle,
// } from "react-icons/fi";

// const Sidebar = () => {
//   const [openInventory, setOpenInventory] = useState(true);

//   return (
//     <aside className="w-[280px] h-screen fixed bg-[#F0F0F0] shadow-sm border-r border-[#E6E6E7] flex flex-col justify-between">
//       <div className="px-6 py-6">
//         {/* Brand Title */}
//         <img src={logo} alt="Integral Logo" className="h-11 mb-10 md:mb-16" />
        

//         <ul className="space-y-2 text-sm text-[#4B4D4F] font-medium">
//           <li>
//             <NavLink
//               to="/dashboard"
//               className={({ isActive }) =>
//                 `flex items-center gap-2 px-4 py-2 rounded-full ${
//                   isActive
//                     ? "bg-[#A2F2EE] text-[#233955]"
//                     : "hover:bg-[#A2F2EE] hover:text-[#233955]"
//                 }`
//               }
//             >
//               <FiHome /> Dashboard
//             </NavLink>
//           </li>

//           {/* Inventory */}
//           <li>
//             <button
//               onClick={() => setOpenInventory(!openInventory)}
//               className="w-full flex items-center justify-between px-4 py-2 rounded-full hover:bg-[#A2F2EE] hover:text-[#233955]"
//             >
//               <span className="flex items-center gap-2">
//                 <FiBox /> Inventory
//               </span>
//               {openInventory ? <FiChevronUp /> : <FiChevronDown />}
//             </button>
//             {openInventory && (
//               <ul className="ml-4 mt-1 space-y-1 text-sm text-[#4B4D4F] font-normal">
//                 {[
//                   { to: "/inventory", label: "Inventory Items", icon: <FiGrid /> },
//                   { to: "/inventory/requisition", label: "Requisition", icon: <FiFileText /> },
//                   { to: "/inventory/maintenance", label: "Complaint & Maintenance", icon: <FiAlertCircle /> },
//                   { to: "/inventory/stock", label: "Stock & Departmental Stores", icon: <FiDatabase /> },
//                   { to: "/inventory/indent", label: "Indent", icon: <FiEdit /> },
//                   { to: "/inventory/audit", label: "Audit & Compliance", icon: <FiCheckCircle /> },
//                 ].map((item, i) => (
//                   <li key={i}>
//                     <NavLink
//                       to={item.to}
//                       className={({ isActive }) =>
//                         `block px-3 py-1 rounded-full ${
//                           isActive
//                             ? "text-[#233955] bg-[#A2F2EE]"
//                             : "hover:text-[#233955] hover:bg-[#A2F2EE]"
//                         }`
//                       }
//                     >
//                       <span className="flex items-center gap-2">
//                         {item.icon} {item.label}
//                       </span>
//                     </NavLink>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </li>

//           <li>
//             <NavLink
//               to="/patients"
//               className={({ isActive }) =>
//                 `flex items-center gap-2 px-4 py-2 rounded-full ${
//                   isActive
//                     ? "bg-[#A2F2EE] text-[#233955]"
//                     : "hover:bg-[#A2F2EE] hover:text-[#233955]"
//                 }`
//               }
//             >
//               <FiUsers /> Patients
//             </NavLink>
//           </li>

//           <li>
//             <NavLink
//               to="/hospital"
//               className={({ isActive }) =>
//                 `flex items-center gap-2 px-4 py-2 rounded-full ${
//                   isActive
//                     ? "bg-[#A2F2EE] text-[#233955]"
//                     : "hover:bg-[#A2F2EE] hover:text-[#233955]"
//                 }`
//               }
//             >
//               <FiClipboard /> Hospital Management
//             </NavLink>
//           </li>

//           <li>
//             <NavLink
//               to="/messages"
//               className={({ isActive }) =>
//                 `flex items-center gap-2 px-4 py-2 rounded-full ${
//                   isActive
//                     ? "bg-[#A2F2EE] text-[#233955]"
//                     : "hover:bg-[#A2F2EE] hover:text-[#233955]"
//                 }`
//               }
//             >
//               <FiMessageSquare /> Messages
//             </NavLink>
//           </li>
//         </ul>
//       </div>

//       {/* Footer Icons */}
//       <div className="flex items-center justify-between px-6 py-4 border-t border-[#E6E6E7]">
//         <button className="p-2 rounded-lg bg-[#233955] hover:bg-[#1a2a40] text-[#E6E6E7]">
//           <FiBell size={18} />
//         </button>
//         <button className="p-2 rounded-lg bg-[#233955] hover:bg-[#1a2a40] text-[#E6E6E7]">
//           <FiSettings size={18} />
//         </button>
//       </div>
//     </aside>
//   );
// };

// export default Sidebar;
