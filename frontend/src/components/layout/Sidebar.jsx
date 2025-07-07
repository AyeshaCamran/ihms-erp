// src/components/layout/Sidebar.jsx
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

const Sidebar = () => {
  const [openInventory, setOpenInventory] = useState(true);

  return (
    <aside className="w-64 bg-white h-screen shadow-md p-4">
      <h1 className="text-2xl font-bold text-blue-600 mb-6">IHMS</h1>
      <ul className="space-y-2 text-sm">
        <li>
          <NavLink
            to="/dashboard"
            className="block px-4 py-2 rounded hover:bg-gray-100"
          >
            Dashboard
          </NavLink>
        </li>

        {/* Inventory with collapse */}
        <li>
          <button
            className="w-full flex items-center justify-between px-4 py-2 font-medium hover:bg-blue-50 rounded"
            onClick={() => setOpenInventory(!openInventory)}
          >
            Inventory
            {openInventory ? <FiChevronUp /> : <FiChevronDown />}
          </button>
          {openInventory && (
            <ul className="pl-6 space-y-1 mt-1 text-gray-700">
              <li>
                <NavLink to="/inventory" className="block hover:text-blue-700">
                  Inventory Items
                </NavLink>
              </li>
              <li>
                <NavLink to="/inventory/stock-receive" className="block hover:text-blue-700">
                  Stock Receive
                </NavLink>
              </li>
              <li>
                <NavLink to="/inventory/condemnation" className="block hover:text-blue-700">
                  Condemnations
                </NavLink>
              </li>
              <li>
                <NavLink to="/inventory/return" className="block hover:text-blue-700">
                  Return to Vendor
                </NavLink>
              </li>
              <li>
                <NavLink to="/inventory/issue" className="block hover:text-blue-700">
                  Issue to Department
                </NavLink>
              </li>
              <li>
                <NavLink to="/inventory/category" className="block hover:text-blue-700">
                  Categories
                </NavLink>
              </li>
            </ul>
          )}
        </li>

        <li>
          <NavLink
            to="/patients"
            className="block px-4 py-2 rounded hover:bg-gray-100"
          >
            Patients
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/hospital"
            className="block px-4 py-2 rounded hover:bg-gray-100"
          >
            Hospital Management
          </NavLink>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
