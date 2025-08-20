// ihms-frontend/src/components/auth/SSOHandler.jsx
import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const SSOHandler = ({ setUser }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleSSO = async () => {
      try {
        // ✅ Get SSO parameters from URL
        const ssoToken = searchParams.get("sso_token");
        const ssoUser = searchParams.get("sso_user");
        const from = searchParams.get("from");

        console.log("🔐 SSO Login attempt:", { ssoToken: ssoToken ? "✓" : "✗", ssoUser, from });

        if (!ssoToken || !ssoUser || from !== "ems") {
          console.log("❌ Invalid SSO parameters, redirecting to EMS login");
          redirectToEMSLogin();
          return;
        }

        // ✅ Validate token by decoding it
        try {
          const decoded = jwtDecode(ssoToken);
          const currentTime = Math.floor(Date.now() / 1000);
          
          if (decoded.exp < currentTime) {
            console.log("❌ Token expired, redirecting to EMS login");
            redirectToEMSLogin();
            return;
          }

          console.log("✅ Valid SSO token:", decoded);

          // ✅ Additional validation: verify token with auth service
          const response = await fetch("http://localhost:8000/auth/me", {
            headers: {
              "Authorization": `Bearer ${ssoToken}`,
            },
          });

          if (!response.ok) {
            console.log("❌ Token validation failed, redirecting to EMS login");
            redirectToEMSLogin();
            return;
          }

          const userData = await response.json();
          console.log("✅ Token validated with auth service:", userData);

          // ✅ Set user session in IHMS
          localStorage.setItem("token", ssoToken);
          localStorage.setItem("user", userData.name || ssoUser);
          localStorage.setItem("sso_session", "true"); // Mark as SSO session
          
          setUser(userData.name || ssoUser);

          // ✅ Clear URL parameters and redirect to dashboard
          navigate("/dashboard", { replace: true });

        } catch (tokenError) {
          console.log("❌ Token decode error:", tokenError);
          redirectToEMSLogin();
        }

      } catch (error) {
        console.error("❌ SSO handler error:", error);
        redirectToEMSLogin();
      }
    };

    handleSSO();
  }, [searchParams, navigate, setUser]);

  const redirectToEMSLogin = () => {
    // ✅ Clear any existing tokens
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("sso_session");
    
    // ✅ Redirect to EMS login with return URL
    const emsLoginUrl = "http://localhost:5173/"; // EMS login page
    const returnUrl = encodeURIComponent(window.location.origin + "/dashboard");
    window.location.href = `${emsLoginUrl}?return=${returnUrl}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Authenticating...</h2>
        <p className="text-gray-600">Verifying your credentials from EMS</p>
      </div>
    </div>
  );
};

export default SSOHandler;