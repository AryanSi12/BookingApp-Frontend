import axios from "axios";
import { API_BASE } from "@/services/api";
import { postMultipart } from "@/services/uploads";

function withAuth() {
  return { withCredentials: true };
}

export function getAllEvents() {
  return axios.get(`${API_BASE}/User/getAllEvents`, withAuth());
}

export function getEventById(eventId) {
  return axios.get(`${API_BASE}/User/getEventById/${eventId}`, withAuth());
}

export function getSeatStatusByEventId(eventId) {
  return axios.get(`${API_BASE}/User/getSeatStatusByEventId/${eventId}`, withAuth());
}

export function getAllEventsByUserId() {
  return axios.get(`${API_BASE}/Organizer/getAllEventsByUserId`, withAuth());
}

export function deleteEventById(eventId) {
  return axios.delete(`${API_BASE}/Organizer/deleteEventById/${eventId}`, withAuth());
}

export function createEvent(venueId, formData) {
  return postMultipart(`${API_BASE}/Organizer/createEvent/${venueId}`, formData, {
    withCredentials: true,
  });
}
