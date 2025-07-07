import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard/Dashboard";
import InventoryList from "./pages/Inventory/InventoryList";
import Login from "./pages/Login/Login";
import AddInventoryItem from "./pages/Inventory/AddInventoryItem";
import EditInventoryItem from "./pages/Inventory/EditInventoryItem";
import InventoryCategory from "./pages/Inventory/InventoryCategory";
import InventoryByCategory from "./pages/Inventory/InventoryByCategory";



import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route element={<Layout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="inventory" element={<InventoryList />} />
        <Route path="/inventory/add" element={<AddInventoryItem />} />
        <Route path="/inventory/edit/:id" element={<EditInventoryItem />} />
        <Route path="/inventory/category" element={<InventoryCategory />} />
        <Route path="/inventory/category/:categoryName" element={<InventoryByCategory />} />

        {/* Add more routes here */}
      </Route>
    </Routes>
  </BrowserRouter>
);
