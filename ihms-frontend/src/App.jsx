import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/layout/Layout";
import SSOHandler from "./components/auth/SSOHandler";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import RoleBasedRoute from "./components/auth/RoleBasedRoute";

import Dashboard from "./pages/Dashboard/Dashboard";
import InventoryList from "./pages/Inventory/InventoryList";
import AddInventoryItem from "./pages/Inventory/AddInventoryItem";
import EditInventoryItem from "./pages/Inventory/EditInventoryItem";
import InventoryCategory from "./pages/Inventory/InventoryCategory";
import InventoryByCategory from "./pages/Inventory/InventoryByCategory";
import RequisitionPage from "./pages/Inventory/RequisitionPage";
import RequestForm from "./pages/Inventory/RequestForm";
import RequisitionView from "./pages/Inventory/RequisitionView";
import MaintenancePage from "./pages/Inventory/MaintenancePage";
import MaintenanceForm from "./pages/Inventory/MaintenanceForm";
import StockPage from "./pages/Inventory/StockPage";
import IssueSlipForm from "./pages/Inventory/IssueSlipForm";
import IndentPage from "./pages/Inventory/IndentPage";
import IndentForm from "./pages/Inventory/IndentForm";
import PurchasePage from "./pages/Inventory/PurchasePage";
import MaterialVoucherForm from './pages/Inventory/MaterialVoucherForm';
import MaterialVoucherView from './pages/Inventory/MaterialVoucherView';


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

  // ✅ Define role-based access control
  const ROLE_PERMISSIONS = {
    // All roles that can access dashboard
    DASHBOARD: ["HOD", "Incharge", "Dean", "Competent Authority", "Administrator", "PO", "Inventory Admin"],
    
    // Inventory main page access
    INVENTORY_MAIN: ["Dean", "Competent Authority", "Administrator", "PO", "Inventory Admin"],
    
    // Inventory CRUD operations
    INVENTORY_CRUD: ["Dean", "Competent Authority", "Administrator", "PO", "Inventory Admin"],
    
    // Requisition access
    REQUISITION: ["HOD", "Incharge", "Dean", "Competent Authority", "Administrator", "PO", "Inventory Admin"],
    
    // Complaint & Maintenance access
    MAINTENANCE: ["HOD", "Incharge", "Dean", "Competent Authority", "Administrator", "PO", "Inventory Admin"],
    
    // Stock management access
    STOCK: ["Dean", "Competent Authority", "Administrator", "PO", "Inventory Admin"],
    
    // Indent access
    INDENT: ["HOD", "Incharge", "Dean", "Competent Authority", "Administrator", "PO", "Inventory Admin"],
    
    // Audit access
    AUDIT: ["Dean", "Competent Authority", "Administrator", "PO", "Inventory Admin"],

    // Purchase access
    PURCHASE: ["Dean", "Competent Authority", "Administrator", "PO", "Inventory Admin"],

    // Messages access
    MESSAGES: ["HOD", "Incharge", "Dean", "Competent Authority", "Administrator", "PO", "Inventory Admin"],
    
    // Patients access
    PATIENTS: ["Dean", "Competent Authority", "Administrator"],
    
    // Hospital Management access
    HOSPITAL: ["Dean", "Competent Authority", "Administrator"]
  };

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
          {/* ✅ Dashboard - Accessible to all authenticated users */}
          <Route 
            path="dashboard" 
            element={
              <RoleBasedRoute allowedRoles={ROLE_PERMISSIONS.DASHBOARD}>
                <Dashboard />
              </RoleBasedRoute>
            } 
          />

          {/* ✅ Inventory Main Pages - Role-restricted */}
          <Route 
            path="inventory" 
            element={
              <RoleBasedRoute allowedRoles={ROLE_PERMISSIONS.INVENTORY_MAIN}>
                <InventoryList />
              </RoleBasedRoute>
            } 
          />
          
          <Route 
            path="inventory/add" 
            element={
              <RoleBasedRoute allowedRoles={ROLE_PERMISSIONS.INVENTORY_CRUD}>
                <AddInventoryItem />
              </RoleBasedRoute>
            } 
          />
          
          <Route 
            path="inventory/edit/:id" 
            element={
              <RoleBasedRoute allowedRoles={ROLE_PERMISSIONS.INVENTORY_CRUD}>
                <EditInventoryItem />
              </RoleBasedRoute>
            } 
          />
          
          <Route 
            path="inventory/category" 
            element={
              <RoleBasedRoute allowedRoles={ROLE_PERMISSIONS.INVENTORY_MAIN}>
                <InventoryCategory />
              </RoleBasedRoute>
            } 
          />
          
          <Route 
            path="inventory/category/:categoryName" 
            element={
              <RoleBasedRoute allowedRoles={ROLE_PERMISSIONS.INVENTORY_MAIN}>
                <InventoryByCategory />
              </RoleBasedRoute>
            } 
          />

          {/* ✅ Requisition Pages */}
          <Route 
            path="inventory/requisition" 
            element={
              <RoleBasedRoute allowedRoles={ROLE_PERMISSIONS.REQUISITION}>
                <RequisitionPage />
              </RoleBasedRoute>
            } 
          />
          
          <Route 
            path="inventory/requisition/request" 
            element={
              <RoleBasedRoute allowedRoles={ROLE_PERMISSIONS.REQUISITION}>
                <RequestForm />
              </RoleBasedRoute>
            } 
          />

          {/* ✅ Maintenance/Complaint Pages */}
          <Route 
            path="inventory/maintenance" 
            element={
              <RoleBasedRoute allowedRoles={ROLE_PERMISSIONS.MAINTENANCE}>
                <MaintenancePage />
              </RoleBasedRoute>
            } 
          />
          
          <Route 
            path="inventory/maintenance/complaint" 
            element={
              <RoleBasedRoute allowedRoles={ROLE_PERMISSIONS.MAINTENANCE}>
                <MaintenanceForm />
              </RoleBasedRoute>
            } 
          />

          {/* ✅ Stock Pages */}
          <Route 
            path="inventory/stock" 
            element={
              <RoleBasedRoute allowedRoles={ROLE_PERMISSIONS.STOCK}>
                <StockPage />
              </RoleBasedRoute>
            } 
          />
          
          <Route 
            path="inventory/stock/issue-slip" 
            element={
              <RoleBasedRoute allowedRoles={ROLE_PERMISSIONS.STOCK}>
                <IssueSlipForm />
              </RoleBasedRoute>
            } 
          />

          {/* ✅ Indent Pages */}
          <Route 
            path="inventory/indent" 
            element={
              <RoleBasedRoute allowedRoles={ROLE_PERMISSIONS.INDENT}>
                <IndentPage />
              </RoleBasedRoute>
            } 
          />
          
          <Route 
            path="inventory/indent/indent-form" 
            element={
              <RoleBasedRoute allowedRoles={ROLE_PERMISSIONS.INDENT}>
                <IndentForm />
              </RoleBasedRoute>
            } 
          />

          {/* ✅ Audit Pages */}
          <Route 
            path="inventory/audit" 
            element={
              <RoleBasedRoute allowedRoles={ROLE_PERMISSIONS.AUDIT}>
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Audit & Compliance</h2>
                  <p className="text-gray-600">Audit and compliance features coming soon...</p>
                </div>
              </RoleBasedRoute>
            } 
          />

          {/* {Requisition View} */}
          <Route 
            path="inventory/requisition/view/:id" 
            element={
              <RoleBasedRoute allowedRoles={ROLE_PERMISSIONS.REQUISITION}>
                <RequisitionView />
              </RoleBasedRoute>
            } 
          />

          {/* ✅ Purchase Management Pages */}
          <Route 
            path="inventory/purchase" 
            element={
              <RoleBasedRoute allowedRoles={ROLE_PERMISSIONS.PURCHASE}>
                <PurchasePage />
              </RoleBasedRoute>
            } 
          />

           {/* {PO Material Voucher New} */}
          <Route 
            path="inventory/purchase/material-vouchers/new" 
            element={
              <RoleBasedRoute allowedRoles={ROLE_PERMISSIONS.REQUISITION}>
                <MaterialVoucherForm />
              </RoleBasedRoute>
            } 
          />

           {/* {PO Material Voucher Edit} */}
          <Route 
            path="inventory/purchase/material-vouchers/edit/:id" 
            element={
              <RoleBasedRoute allowedRoles={ROLE_PERMISSIONS.REQUISITION}>
                <MaterialVoucherForm />
              </RoleBasedRoute>
            } 
          />

            {/* {PO Material Voucher View} */}
          <Route 
            path="inventory/purchase/material-vouchers/:id" 
            element={
              <RoleBasedRoute allowedRoles={ROLE_PERMISSIONS.REQUISITION}>
                <MaterialVoucherView />
              </RoleBasedRoute>
            } 
          />

          {/* ✅ Future Pages - Role-protected placeholders */}
          <Route 
            path="patients" 
            element={
              <RoleBasedRoute allowedRoles={ROLE_PERMISSIONS.PATIENTS}>
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Patients</h2>
                  <p className="text-gray-600">Patient management features coming soon...</p>
                </div>
              </RoleBasedRoute>
            } 
          />

          <Route 
            path="hospital" 
            element={
              <RoleBasedRoute allowedRoles={ROLE_PERMISSIONS.HOSPITAL}>
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Hospital Management</h2>
                  <p className="text-gray-600">Hospital management features coming soon...</p>
                </div>
              </RoleBasedRoute>
            } 
          />

          <Route 
            path="messages" 
            element={
              <RoleBasedRoute allowedRoles={ROLE_PERMISSIONS.MESSAGES}>
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Messages</h2>
                  <p className="text-gray-600">Messaging features coming soon...</p>
                </div>
              </RoleBasedRoute>
            } 
          />
        </Route>

        {/* ✅ Default redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;