import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/layout/Layout";
import SSOHandler from "./components/auth/SSOHandler";
import ProtectedRoute from "./components/auth/ProtectedRoute";

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
    // ✅ Check for existing valid session on app start
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("user");

    if (token && name) {
      // ✅ Verify token is still valid before setting user
      fetch("http://localhost:8000/auth/me", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      })
        .then(async (response) => {
          if (response.ok) {
            const userData = await response.json();
            setUser(userData.name || name);
            console.log("✅ Existing session validated:", userData);
          } else {
            console.log("❌ Existing session invalid, clearing storage");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("sso_session");
          }
        })
        .catch((error) => {
          console.log("❌ Session validation error:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("sso_session");
        });
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* ✅ SSO Login Route - No protection needed */}
        <Route path="/sso-login" element={<SSOHandler setUser={setUser} />} />

        {/* ✅ All other routes are protected and require authentication */}
        <Route
          path="/*"
          element={
            <ProtectedRoute setUser={setUser}>
              <Layout user={user} setUser={setUser} />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="inventory" element={<InventoryList />} />
          <Route path="inventory/add" element={<AddInventoryItem />} />
          <Route path="inventory/edit/:id" element={<EditInventoryItem />} />
          <Route path="inventory/category" element={<InventoryCategory />} />
          <Route path="inventory/category/:categoryName" element={<InventoryByCategory />} />
          <Route path="inventory/requisition" element={<RequisitionPage />} />
          <Route path="inventory/requisition/request" element={<RequestForm />} />
          <Route path="inventory/maintenance" element={<MaintenancePage />} />
          <Route path="inventory/maintenance/complaint" element={<MaintenanceForm />} />
          <Route path="inventory/stock" element={<StockPage />} />
          <Route path="inventory/stock/issue-slip" element={<IssueSlipForm />} />
          <Route path="maintenance/print/:id" element={<PrintMaintenanceForm />} />
          <Route path="inventory/indent" element={<IndentPage />} />
          <Route path="inventory/indent/indent-form" element={<IndentForm />} />
        </Route>

        {/* ✅ Default redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;