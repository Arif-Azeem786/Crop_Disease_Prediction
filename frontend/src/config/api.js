const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default {
  baseURL: API_BASE,
  upload: `${API_BASE}/upload`,
  chat: `${API_BASE}/chat`,
  translate: `${API_BASE}/translate`,
  dashboard: `${API_BASE}/dashboard`,
  statsPublic: `${API_BASE}/stats/public`,
  health: `${API_BASE}/health`,
  adminLogin: `${API_BASE}/admin/login`,
  adminVerify: `${API_BASE}/admin/verify`,
  userRegister: `${API_BASE}/users/register`,
  userLogin: `${API_BASE}/users/login`,
  userProfile: `${API_BASE}/users/profile`,
};
