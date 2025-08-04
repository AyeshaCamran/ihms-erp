import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock, Building2, ShieldCheck, Eye, EyeOff } from "lucide-react";
import logo from "../../assets/iul-logo.png";
import { jwtDecode } from "jwt-decode";

export default function Login({ setUser }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    department: "",
    role: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const departments = [
    "Anatomy", "Anesthesia", "Biochemistry", "Community Medicine", "Dentistry",
    "Dermatology, Ven. & Lep.", "ENT", "Forensic Medicine", "General Medicine",
    "General Surgery", "Microbiology", "Obstetrics & Gynecology", "Ophthalmology",
    "Orthopedics", "Pathology", "Pediatrics", "Pharmacology", "Physiology",
    "Psychiatry", "Radiology", "TB & Chest", "Casuality & Emergency Medicine"
  ];

  const roles = ["Administrator", "HOD", "Dean", "Director", "Executive Director", "Inventory Admin"];

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (response.ok) {
          const decoded = jwtDecode(data.access_token);
          console.log("✅ Decoded Token:", decoded);
          localStorage.setItem("token", data.access_token);
          localStorage.setItem("user", decoded.name);  // or email if name not in token
          setUser(decoded.name);
          navigate("/dashboard");
        }

      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError("Something went wrong. Try again.");
    }
  };

  return (
    <div className="relative h-screen bg-gray-100 flex items-center justify-center font-sans">
      {/* ✅ Login Card */}
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md px-10 py-8 space-y-6 overflow-hidden">
        
        {/* ✅ Background SVGs inside the card */}
        <span className="absolute right-1 top-1 pointer-events-none opacity-80">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            {[1.39737, 13.6943, 25.9911, 38.288].map((cx, i) =>
              [38.6026, 1.99122, 26.3057, 14.0086].map((cy, j) => (
                <circle key={`${i}-${j}`} cx={cx} cy={cy} r="1.39737" transform={`rotate(-90 ${cx} ${cy})`} fill="#3056D3" />
              ))
            )}
          </svg>
        </span>

        <span className="absolute bottom-1 left-1 pointer-events-none opacity-80">
          <svg width="29" height="40" viewBox="0 0 29 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            {[2.288, 14.5849, 26.7216].map((cx, i) =>
              [25.9912, 13.6944, 38.0087, 1.39739].map((cy, j) => (
                <circle key={`${i}-${j}`} cx={cx} cy={cy} r="1.39737" transform={`rotate(-90 ${cx} ${cy})`} fill="#3056D3" />
              ))
            )}
          </svg>
        </span>

        {/* ✅ Logo + Title */}
        <div className="flex flex-col items-center">
          <img src={logo} alt="Integral Logo" className="h-16 mb-10 md:mb-16" />
          <h2 className="text-bluedark font-semibold text-lg">IHMS Login</h2>
        </div>

        {/* ✅ Form */}
        <form className="mb-6" onSubmit={handleSubmit}>
          {/* ✅ Role */}
          <div className="relative mb-6">
            <ShieldCheck className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="input-field pl-10 bg-gray-100 w-full rounded-md border border-gray-200 px-5 py-3 text-base text-gray-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
              required
            >
              <option value="">Select Role</option>
              {roles.map((role) => (
                <option key={role}>{role}</option>
              ))}
            </select>
          </div>

          {/* ✅ Department (for HOD only) */}
          {formData.role === "HOD" && (
            <div className="relative mb-6">
              <Building2 className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="input-field pl-10 bg-gray-100 w-full rounded-md border border-gray-200 px-5 py-3 text-base text-gray-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                required
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept}>{dept}</option>
                ))}
              </select>
            </div>
          )}

          {/* ✅ Email */}
          <div className="relative mb-6">
            <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            <input
              name="email"
              type="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              className="input-field pl-10 bg-gray-100 w-full rounded-md border border-gray-200 px-5 py-3 text-base text-gray-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
              required
            />
          </div>

          {/* ✅ Password with Show/Hide */}
          <div className="relative mb-6">
            <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              className="input-field pl-10 pr-10 bg-gray-100 w-full rounded-md border border-gray-200 px-5 py-3 text-base text-gray-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3.5 text-gray-400 focus:outline-none"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          {/* ✅ Submit */}
          <button
            type="submit"
            className="w-full bg-bluedark text-white font-medium py-3 rounded-md transition duration-200 cursor-pointer"
          >
            Sign In
          </button>

          {/* ✅ Error Message */}
          {error && <p className="text-red-600 text-sm text-center mt-2">{error}</p>}

          {/* ✅ Forgot Password */}
          <p 
            className="text-xs text-blue-600 text-right hover:underline cursor-pointer mt-3"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </p>
        </form>
      </div>
    </div>
  );
}
