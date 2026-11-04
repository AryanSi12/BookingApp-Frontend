import axios from "axios";
import { API_BASE } from "@/services/api";
import { postMultipart } from "@/services/uploads";

function withAuth() {
  return { withCredentials: true };
}

export function getAllVenues() {
  return axios.get(`${API_BASE}/User/getAllVenues`, withAuth());
}

export function getVenueById(venueId) {
  return axios.get(`${API_BASE}/User/getVenueById/${venueId}`, withAuth());
}

export function getAllVenuesByUserId() {
  return axios.get(`${API_BASE}/Organizer/getAllVenuesByUserId`, withAuth());
}

export function deleteVenueById(venueId) {
  return axios.delete(`${API_BASE}/Organizer/deleteVenueById/${venueId}`, withAuth());
}

export function createVenue(formData) {
  return postMultipart(`${API_BASE}/Organizer/createVenue`, formData, {
    withCredentials: true,
  });
}
