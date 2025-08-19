import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import EMSLayout from "./components/layout/EMSLayout";
import EMSDashboard from "./pages/Dashboard/EMSDashboard";
import LeavePage from "./pages/Leave/LeavePage";
import AttendancePage from "./pages/Attendance/AttendancePage";
import GrievancesPage from "./pages/Grievances/GrievancesPage";
import SalaryPage from "./pages/Salary/SalaryPage";
import Login from "./pages/Login/Login";
import ForgotPassword from "./pages/Login/ForgotPassword";
import Dashboard from "/Users/fuzailakhtar/Documents/ihms-erp/ihms-frontend/src/pages/Dashboard/Dashboard";


function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Reuse the same auth pattern you use in IHMS
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("user");
    
    if (token && name) setUser(name);
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
         <Route path="/" element={<Login setUser={setUser} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* Protected Routes with Layout */}
        <Route
          element={
            user ? <EMSLayout user={user} setUser={setUser} /> : <Navigate to="/" />
          }
        >
          <Route path="/ems/home" element={<EMSDashboard />} />
          <Route path="/ems/leave" element={<LeavePage />} />
          <Route path="/ems/attendance" element={<AttendancePage />} />
          <Route path="/ems/grievances" element={<GrievancesPage />} />
          <Route path="/ems/salary" element={<SalaryPage />} />
          <Route path="/dashboard" element={<Dashboard />} />

        </Route>

        {/* Catch-all route for unmatched paths */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
export default App;