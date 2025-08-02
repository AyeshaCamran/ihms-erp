// Dynamic API Configuration that works for all collaborators

const getBaseURL = (port) => {
  // Check if we're in Codespaces (works for any Codespace)
  if (window.location.hostname.includes('.app.github.dev')) {
    // Extract the Codespace name from current URL
    const codespaceName = window.location.hostname.split('-')[0] + '-' + window.location.hostname.split('-')[1];
    return `https://${codespaceName}-${port}.app.github.dev`;
  }
  
  // Check if we're in local development
  if (window.location.hostname === 'localhost') {
    return `http://localhost:${port}`;
  }
  
  // Fallback for other environments
  return `http://${window.location.hostname}:${port}`;
};

export const API_CONFIG = {
  AUTH_SERVICE: getBaseURL(8000),
  INVENTORY_SERVICE: getBaseURL(8001),
  API_GATEWAY: getBaseURL(9000),
};

// Helper function for making API calls
export const apiCall = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    console.log(`🔗 Making API call to: ${url}`);
    const response = await fetch(url, { ...defaultOptions, ...options });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('❌ API call failed:', error);
    throw error;
  }
};

console.log('🔧 API Configuration (Auto-detected):', API_CONFIG);