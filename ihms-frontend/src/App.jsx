import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/layout/Layout";


import Dashboard from "./pages/Dashboard/Dashboard";
import InventoryList from "./pages/Inventory/InventoryList";
import AddInventoryItem from "./pages/Inventory/AddInventoryItem";
import EditInventoryItem from "./pages/Inventory/EditInventoryItem";
import InventoryCategory from "./pages/Inventory/InventoryCategory";
import InventoryByCategory from "./pages/Inventory/InventoryByCategory";
import RequisitionPage from "./pages/Inventory/RequisitionPage";
import RequestForm from "./pages/Inventory/RequestForm";
import MaintenancePage from "./pages/Inventory/MaintenancePage";
import MaintenanceForm from "./pages/Inventory/MaintenanceForm";
import StockPage from "./pages/Inventory/StockPage";
import IssueSlipForm from "./pages/Inventory/IssueSlipForm";
import PrintMaintenanceForm from "./pages/Inventory/PrintMaintenanceForm";
import IndentPage from "./pages/Inventory/IndentPage";
import IndentForm from "./pages/Inventory/IndentForm";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("user");

    if (token && name) {
      setUser(name); // Placeholder, can be extended
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* ✅ Public Routes without Layout */}
     

        {/* ✅ Protected Routes with Layout */}
        <Route
          element={
            user ? <Layout user={user} setUser={setUser} /> : <Navigate to="/" />
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/inventory" element={<InventoryList />} />
          <Route path="/inventory/add" element={<AddInventoryItem />} />
          <Route path="/inventory/edit/:id" element={<EditInventoryItem />} />
          <Route path="/inventory/category" element={<InventoryCategory />} />
          <Route
            path="/inventory/category/:categoryName"
            element={<InventoryByCategory />}
          />
          <Route path="/inventory/requisition" element={<RequisitionPage />} />
          <Route path="/inventory/requisition/request" element={<RequestForm />} />
          <Route path="/inventory/maintenance" element={<MaintenancePage />} />
          <Route
            path="/inventory/maintenance/complaint"
            element={<MaintenanceForm />}
          />
          <Route path="/inventory/stock" element={<StockPage />} />
          <Route path="/inventory/stock/issue-slip" element={<IssueSlipForm />} />
          <Route path="/maintenance/print/:id" element={<PrintMaintenanceForm />} />
          <Route path="/inventory/indent" element={<IndentPage />} />
          <Route path="/inventory/indent/indent-form" element={<IndentForm />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
