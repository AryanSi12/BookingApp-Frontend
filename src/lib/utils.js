import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const REGULAR_PRICE = 50;
export const VIP_PRICE = 100;
export const MAX_SEATS = 10;

export function seatPrice(seatType) {
  return String(seatType || "").toUpperCase() === "VIP" ? VIP_PRICE : REGULAR_PRICE;
}

export function fromPrice(event) {
  const price = Number(event?.ticketPrice);
  return Number.isFinite(price) && price > 0 ? price : REGULAR_PRICE;
}

export function parseEventDate(value) {
  if (value == null || value === "") return null;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }
  if (Array.isArray(value)) {
    const [year, month, day, hour = 0, minute = 0, second = 0] = value;
    if (year == null || month == null || day == null) return null;
    const date = new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour) || 0,
      Number(minute) || 0,
      Number(second) || 0
    );
    return Number.isNaN(date.getTime()) ? null : date;
  }
  if (typeof value === "string" || typeof value === "number") {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  return null;
}

export function formatEventWhen(value) {
  const date = parseEventDate(value);
  if (!date) return "Date TBA";
  return date.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatEventDay(value) {
  const date = parseEventDate(value);
  if (!date) return "Date TBA";
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function formatEventTime(value) {
  const date = parseEventDate(value);
  if (!date) return "";
  return date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}
