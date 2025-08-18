import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import EMSLayout from "./components/layout/EMSLayout";
import EMSDashboard from "./pages/Dashboard/EMSDashboard";
import LeavePage from "./pages/Leave/LeavePage";
import AttendancePage from "./pages/Attendance/AttendancePage";
import GrievancesPage from "./pages/Grievances/GrievancesPage";
import SalaryPage from "./pages/Salary/SalaryPage";

export default function App() {
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
        </Route>
      </Routes>
    </Router>
  );
}
