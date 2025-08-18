import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";


import Login from "./pages/Login/Login";
import ForgotPassword from "./pages/Login/ForgotPassword";
import Dashboard from "./pages/Dashboard/Dashboard";


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
        <Route path="/" element={<Login setUser={setUser} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* ✅ Protected Routes with Layout */}
        <Route
          element={
            user ? <Layout user={user} setUser={setUser} /> : <Navigate to="/" />
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
