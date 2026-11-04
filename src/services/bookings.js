import axios from "axios";
import { API_BASE } from "@/services/api";

function withAuth() {
  return { withCredentials: true };
}

export function fetchBookingByUserId() {
  return axios.get(`${API_BASE}/User/fetchBookingByUserId`, withAuth());
}

export function fetchBookingByBookingId(bookingId) {
  return axios.get(`${API_BASE}/User/fetchBookingByBookingId/${bookingId}`, withAuth());
}

export function bookSeat(eventId, body) {
  return axios.post(`${API_BASE}/User/bookSeat/${eventId}`, body, withAuth());
}

export function fetchAllBookingsByEventId(eventId) {
  return axios.get(`${API_BASE}/Organizer/fetchAllBookingsByEventId/${eventId}`, withAuth());
}
