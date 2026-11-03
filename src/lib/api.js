import axios from "axios";

export const API_BASE = "https://bookingapp-backend-hsy3.onrender.com";

const TOKEN_KEY = "jwtToken";

export function extractAuthToken(data) {
  if (typeof data === "string" && data.trim() && !data.trim().startsWith("{")) {
    return data.trim();
  }
  if (data && typeof data === "object") {
    if (typeof data.token === "string" && data.token.trim()) return data.token.trim();
    if (typeof data.jwtToken === "string" && data.jwtToken.trim()) return data.jwtToken.trim();
  }
  return null;
}

export function getStoredAuthToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAuthToken(token) {
  if (token) {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch {
      // ignore storage failures
    }
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      // ignore storage failures
    }
    delete axios.defaults.headers.common.Authorization;
  }
}

export function clearAuthToken() {
  setAuthToken(null);
}

export function hydrateAuthToken(fallbackToken) {
  const stored = getStoredAuthToken() || fallbackToken || null;
  if (stored) setAuthToken(stored);
  return stored;
}

export function mapUserDetails(user) {
  if (!user || typeof user !== "object") return null;
  return {
    username: user.username,
    email: user.email,
    userId: user.userId || user.id || user._id,
    userImage: user.userImage,
    roles: Array.isArray(user.roles) ? user.roles : [],
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export async function fetchCurrentUserDetails() {
  const response = await axios.get(`${API_BASE}/User/getUserDetails`, {
    withCredentials: true,
  });
  return mapUserDetails(response.data);
}

export async function completeLogin(loginResponseData) {
  const token = extractAuthToken(loginResponseData);
  if (!token) {
    throw new Error("Login succeeded but no auth token was returned.");
  }
  setAuthToken(token);
  const userDetails = await fetchCurrentUserDetails();
  if (!userDetails) {
    throw new Error("Could not load your account details.");
  }
  return { token, userDetails };
}

// Restore Authorization header as soon as this module loads.
hydrateAuthToken();
