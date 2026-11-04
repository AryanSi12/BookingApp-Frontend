import { parseEventDate } from "@/lib/utils";

function pad(value) {
  return String(value).padStart(2, "0");
}

function toStamp(value) {
  const date = parseEventDate(value);
  if (!date) return "";
  return (
    `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}` +
    `T${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`
  );
}

function escapeText(value) {
  return String(value || "")
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

export function buildIcs({ title, start, end, location, description }) {
  const startStamp = toStamp(start);
  const endStamp = toStamp(end) || startStamp;
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//EventSphere//Booking//EN",
    "BEGIN:VEVENT",
    `DTSTAMP:${toStamp(new Date())}`,
    startStamp ? `DTSTART:${startStamp}` : "",
    endStamp ? `DTEND:${endStamp}` : "",
    `SUMMARY:${escapeText(title || "EventSphere booking")}`,
    location ? `LOCATION:${escapeText(location)}` : "",
    description ? `DESCRIPTION:${escapeText(description)}` : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean);
  return `${lines.join("\r\n")}\r\n`;
}

export function downloadIcs(details, filename = "event.ics") {
  const blob = new Blob([buildIcs(details)], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
