// src/components/layout/Sidebar.jsx
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "../../assets/iul-logo.png";
import {
  FiChevronDown,
  FiChevronUp,
  FiBox,
  FiUsers,
  FiClipboard,
  FiHome,
  FiSettings,
  FiBell,
  FiMessageSquare,
  FiGrid,
  FiFileText,
  FiAlertCircle,
  FiDatabase,
  FiEdit,
  FiCheckCircle,
  FiShoppingCart,
} from "react-icons/fi";

const Sidebar = ({ userRole = "Administrator" }) => {
  const [openInventory, setOpenInventory] = useState(true);

  // ✅ Define role-based navigation structure
  const getNavigationItems = (role) => {
    const baseItems = [
      {
        key: "dashboard",
        label: "Dashboard",
        icon: <FiHome />,
        to: "/dashboard",
        roles: ["HOD", "Incharge", "Dean", "Competent Authority", "Administrator", "PO", "Inventory Admin"]
      }
    ];

    const inventoryItems = [
      { 
        key: "inventory-items", 
        label: "Inventory Items", 
        icon: <FiGrid />, 
        to: "/inventory",
        roles: ["Dean", "Competent Authority", "Administrator", "PO", "Inventory Admin"]
      },
      { 
        key: "requisition", 
        label: "Requisition", 
        icon: <FiFileText />, 
        to: "/inventory/requisition",
        roles: ["HOD", "Incharge", "Dean", "Competent Authority", "Administrator", "PO", "Inventory Admin"]
      },
      { 
        key: "complaint", 
        label: "Complaint & Maintenance", 
        icon: <FiAlertCircle />, 
        to: "/inventory/maintenance",
        roles: ["HOD", "Incharge", "Dean", "Competent Authority", "Administrator", "PO", "Inventory Admin"]
      },
      { 
        key: "purchase", 
        label: "Purchase Management", 
        icon: <FiShoppingCart />, 
        to: "/inventory/purchase",
        roles: ["Dean", "Competent Authority", "Administrator", "PO", "Inventory Admin"]
      },
      { 
        key: "stock", 
        label: "Stock & Departmental Stores", 
        icon: <FiDatabase />, 
        to: "/inventory/stock",
        roles: ["Dean", "Competent Authority", "Administrator", "PO", "Inventory Admin"]
      },
      { 
        key: "indent", 
        label: "Indent", 
        icon: <FiEdit />, 
        to: "/inventory/indent",
        roles: ["HOD", "Incharge", "Dean", "Competent Authority", "Administrator", "PO", "Inventory Admin"]
      },
      { 
        key: "audit", 
        label: "Audit & Compliance", 
        icon: <FiCheckCircle />, 
        to: "/inventory/audit",
        roles: ["Dean", "Competent Authority", "Administrator", "PO", "Inventory Admin"]
      }
    ];

    const otherItems = [
      {
        key: "patients",
        label: "Patients",
        icon: <FiUsers />,
        to: "/patients",
        roles: ["Dean", "Competent Authority", "Administrator"]
      },
      {
        key: "hospital",
        label: "Hospital Management",
        icon: <FiClipboard />,
        to: "/hospital",
        roles: ["Dean", "Competent Authority", "Administrator"]
      },
      {
        key: "messages",
        label: "Messages",
        icon: <FiMessageSquare />,
        to: "/messages",
        roles: ["HOD", "Incharge", "Dean", "Competent Authority", "Administrator", "PO", "Inventory Admin"]
      }
    ];

    // ✅ Filter items based on user role
    const filteredBaseItems = baseItems.filter(item => item.roles.includes(role));
    const filteredInventoryItems = inventoryItems.filter(item => item.roles.includes(role));
    const filteredOtherItems = otherItems.filter(item => item.roles.includes(role));

    return {
      baseItems: filteredBaseItems,
      inventoryItems: filteredInventoryItems,
      otherItems: filteredOtherItems,
      showInventorySection: filteredInventoryItems.length > 0
    };
  };

  const navigation = getNavigationItems(userRole);

  return (
    <aside className="w-[280px] h-screen fixed bg-[#F0F0F0] shadow-sm border-r border-[#E6E6E7] flex flex-col justify-between">
      <div className="px-6 py-6">
        {/* Brand Title */}
        <img src={logo} alt="Integral Logo" className="h-11 mb-10 md:mb-16" />
        
        <ul className="space-y-2 text-sm text-[#4B4D4F] font-medium">
          {/* ✅ Base Navigation Items (Dashboard) */}
          {navigation.baseItems.map((item) => (
            <li key={item.key}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-full ${
                    isActive
                      ? "bg-[#A2F2EE] text-[#233955]"
                      : "hover:bg-[#A2F2EE] hover:text-[#233955]"
                  }`
                }
              >
                {item.icon} {item.label}
              </NavLink>
            </li>
          ))}

          {/* ✅ Inventory Section (if user has access) */}
          {navigation.showInventorySection && (
            <li>
              <button
                onClick={() => setOpenInventory(!openInventory)}
                className="w-full flex items-center justify-between px-4 py-2 rounded-full hover:bg-[#A2F2EE] hover:text-[#233955]"
              >
                <span className="flex items-center gap-2">
                  <FiBox /> Inventory
                </span>
                {openInventory ? <FiChevronUp /> : <FiChevronDown />}
              </button>
              {openInventory && (
                <ul className="ml-4 mt-1 space-y-1 text-sm text-[#4B4D4F] font-normal">
                  {navigation.inventoryItems.map((item) => (
                    <li key={item.key}>
                      <NavLink
                        to={item.to}
                        className={({ isActive }) =>
                          `block px-3 py-1 rounded-full ${
                            isActive
                              ? "text-[#233955] bg-[#A2F2EE]"
                              : "hover:text-[#233955] hover:bg-[#A2F2EE]"
                          }`
                        }
                      >
                        <span className="flex items-center gap-2">
                          {item.icon} {item.label}
                        </span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          )}

          {/* ✅ Other Navigation Items */}
          {navigation.otherItems.map((item) => (
            <li key={item.key}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-full ${
                    isActive
                      ? "bg-[#A2F2EE] text-[#233955]"
                      : "hover:bg-[#A2F2EE] hover:text-[#233955]"
                  }`
                }
              >
                {item.icon} {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* ✅ Role indicator for development/testing */}
        <div className="mt-6 px-4 py-2 bg-gray-200 rounded-lg text-xs text-gray-600">
          <span className="font-semibold">Role:</span> {userRole}
        </div>
      </div>

      {/* Footer Icons */}
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

export default Sidebar;