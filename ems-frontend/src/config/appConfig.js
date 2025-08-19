// ems-frontend/src/config/appConfig.js
export const APP_CONFIG = {
  IHMS_URL: import.meta.env.VITE_IHMS_URL || "http://localhost:5174",
  EMS_URL: import.meta.env.VITE_EMS_URL || "http://localhost:5173",
};

// Usage in EMSSidebar.jsx:
// import { APP_CONFIG } from "../config/appConfig";
// const ihmsUrl = `${APP_CONFIG.IHMS_URL}/dashboard`;