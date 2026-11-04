import axios from "axios";
import {
  API_BASE,
  extractAuthToken,
  mapUserDetails,
  setAuthToken,
} from "@/services/api";
import { postMultipart } from "@/services/uploads";

function withAuth() {
  return { withCredentials: true };
}

export function loginUser(credentials) {
  return axios.post(`${API_BASE}/Public/LoginUser`, credentials, withAuth());
}

export function addUser(formData) {
  return postMultipart(`${API_BASE}/Public/AddUser`, formData);
}

export function addOrganizer(formData) {
  return postMultipart(`${API_BASE}/Public/AddOrganizer`, formData);
}

export function getCurrUser() {
  return axios.get(`${API_BASE}/User/getCurrUser`, withAuth());
}

export function updateUserDetails(body) {
  return axios.put(`${API_BASE}/User/updateUserDetails`, body, withAuth());
}

export function logoutUser() {
  return axios.post(`${API_BASE}/User/Logout`, null, withAuth());
}

export async function fetchCurrentUserDetails() {
  const response = await axios.get(`${API_BASE}/User/getUserDetails`, withAuth());
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
