import { memo, useRef, useState } from "react";
import { Check, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { MAX_SEATS, REGULAR_PRICE, VIP_PRICE, seatPrice } from "@/lib/utils";

const SEAT_PATTERN = /^([A-Za-z]+)(\d+)$/;

function groupSeatsIntoRows(seats, cols) {
  if (!seats?.length) return [];

  const labeled = seats.every((seat) => SEAT_PATTERN.test(String(seat.seatNumber ?? "")));
  if (labeled) {
    const grouped = new Map();
    seats.forEach((seat) => {
      const match = String(seat.seatNumber).match(SEAT_PATTERN);
      const label = match[1].toUpperCase();
      const number = parseInt(match[2], 10);
      if (!grouped.has(label)) grouped.set(label, []);
      grouped.get(label).push({ ...seat, _number: number });
    });
    return [...grouped.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([label, rowSeats]) => ({
        label,
        seats: rowSeats.sort((a, b) => a._number - b._number),
      }));
  }

  const width = Math.max(1, Number(cols) || seats.length);
  const rows = [];
  for (let index = 0; index < seats.length; index += width) {
    const rowIndex = rows.length;
    const label = rowIndex < 26 ? String.fromCharCode(65 + rowIndex) : `R${rowIndex + 1}`;
    rows.push({ label, seats: seats.slice(index, index + width) });
  }
  return rows;
}

function splitForAisle(seats) {
  if (seats.length < 4) return [seats];
  const midpoint = Math.ceil(seats.length / 2);
  return [seats.slice(0, midpoint), seats.slice(midpoint)];
}

function findBestAvailable(rows, count) {
  for (const row of rows) {
    for (const block of splitForAisle(row.seats)) {
      let run = [];
      for (const seat of block) {
        if ((seat.status || "AVAILABLE") === "AVAILABLE") {
          run.push(seat);
          if (run.length === count) return run;
        } else {
          run = [];
        }
      }
    }
  }
  return [];
}

function displayNumber(seat, rowLabel) {
  const raw = String(seat.seatNumber ?? "");
  const match = raw.match(SEAT_PATTERN);
  if (match) return match[2];
  if (rowLabel && raw.toUpperCase().startsWith(rowLabel)) {
    return raw.slice(rowLabel.length) || raw;
  }
  return raw;
}

const SeatButton = memo(function SeatButton({ seat, rowLabel, selected, interactive, onToggle }) {
  const status = seat.status || "AVAILABLE";
  const booked = status === "BOOKED";
  const price = seatPrice(seat.seatType);
  const category = String(seat.seatType || "REGULAR").toUpperCase() === "VIP" ? "VIP" : "Regular";

  let color = "bg-primary text-primary-foreground hover:bg-primary-700";
  if (booked) color = "cursor-not-allowed bg-muted text-muted-foreground";
  else if (selected) color = "bg-emerald-600 text-white shadow-[0_0_0_2px_hsl(var(--primary)/0.35)]";
  else if (category === "VIP") color = "bg-accent text-accent-foreground hover:brightness-95";

  return (
    <button
      type="button"
      data-seat={seat.seatNumber}
      disabled={!interactive || booked}
      aria-pressed={selected}
      title={`${seat.seatNumber} · ${category} · ₹${price}${booked ? " · Sold" : ""}`}
      aria-label={`Seat ${seat.seatNumber}, ${category}, ₹${price}, ${booked ? "sold" : selected ? "selected" : "available"}`}
      onClick={() => onToggle?.(seat)}
      className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-t-[12px] rounded-b-[5px] text-[10px] font-bold leading-none transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${color} ${
        interactive && !booked ? "cursor-pointer active:scale-95" : ""
      }`}
    >
      {selected ? <Check className="h-3.5 w-3.5" strokeWidth={2.5} /> : displayNumber(seat, rowLabel)}
    </button>
  );
});

function moveSeatFocus(root, key) {
  const rows = [...root.querySelectorAll("[data-row]")];
  const active = document.activeElement;
  let rowIndex = -1;
  let seatIndex = -1;
  rows.forEach((row, index) => {
    const seats = [...row.querySelectorAll("button[data-seat]")];
    const found = seats.indexOf(active);
    if (found >= 0) {
      rowIndex = index;
      seatIndex = found;
    }
  });
  if (rowIndex < 0) return;
  const current = [...rows[rowIndex].querySelectorAll("button[data-seat]")];
  if (key === "ArrowRight") current[seatIndex + 1]?.focus();
  if (key === "ArrowLeft") current[seatIndex - 1]?.focus();
  if (key === "ArrowDown" || key === "ArrowUp") {
    const next = rows[rowIndex + (key === "ArrowDown" ? 1 : -1)];
    if (!next) return;
    const seats = [...next.querySelectorAll("button[data-seat]")];
    seats[Math.min(seatIndex, seats.length - 1)]?.focus();
  }
}

const SeatMap = ({
  seats = [],
  cols,
  selectedSeats = [],
  onToggle,
  onReplace,
  interactive = false,
}) => {
  const rows = groupSeatsIntoRows(seats, cols);
  const mapRef = useRef(null);
  const [partySize, setPartySize] = useState(2);
  const [zoom, setZoom] = useState(1);
  const selectedKeys = new Set(selectedSeats.map((seat) => String(seat.seatNumber)));

  const applyBestAvailable = () => {
    const count = Math.min(MAX_SEATS, Math.max(1, Number(partySize) || 1));
    const picked = findBestAvailable(rows, count);
    if (picked.length < count) {
      toast.error(`No ${count} seats together are available.`);
      return;
    }
    onReplace?.(picked);
  };

  const onKeyDown = (event) => {
    if (!["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"].includes(event.key)) return;
    if (!mapRef.current) return;
    event.preventDefault();
    moveSeatFocus(mapRef.current, event.key);
  };

  return (
    <div className="surface-card overflow-hidden">
      <div className="border-b border-border bg-muted/60 px-4 py-5 md:px-6">
        <div className="mx-auto h-2.5 w-[min(100%,28rem)] rounded-full bg-foreground/80" />
        <p className="mt-3 text-center text-[11px] font-bold tracking-[0.35em] text-muted-foreground">STAGE</p>
      </div>

      <div className="p-4 md:p-6">
        <p className="sr-only" aria-live="polite">
          {selectedSeats.length} {selectedSeats.length === 1 ? "seat" : "seats"} selected
        </p>
        {rows.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">Seat layout is not available for this venue.</p>
        ) : (
          <>
            <div className="mb-3 flex justify-end gap-2">
              <button
                type="button"
                className="ghost-btn h-10 w-10 px-0"
                aria-label="Zoom out"
                onClick={() => setZoom((value) => Math.max(0.8, Number((value - 0.1).toFixed(2))))}
              >
                <Minus className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="ghost-btn h-10 w-10 px-0"
                aria-label="Zoom in"
                onClick={() => setZoom((value) => Math.min(1.6, Number((value + 0.1).toFixed(2))))}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="overflow-auto pb-2" onKeyDown={onKeyDown}>
              <div
                ref={mapRef}
                className="mx-auto flex w-max min-w-full origin-top flex-col items-center gap-2.5 py-2"
                style={{ transform: `scale(${zoom})` }}
              >
                {rows.map((row) => {
                  const blocks = splitForAisle(row.seats);
                  return (
                    <div key={row.label} data-row={row.label} className="flex items-center gap-3">
                      <span className="w-6 shrink-0 text-center text-xs font-bold text-muted-foreground">{row.label}</span>
                      <div className="flex items-center gap-7">
                        {blocks.map((block, blockIndex) => (
                          <div key={`${row.label}-${blockIndex}`} className="flex gap-1.5">
                            {block.map((seat) => (
                              <SeatButton
                                key={seat.seatStatusId || seat._id || seat.seatNumber}
                                seat={seat}
                                rowLabel={row.label}
                                selected={selectedKeys.has(String(seat.seatNumber))}
                                interactive={interactive}
                                onToggle={onToggle}
                              />
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 rounded-xl bg-muted px-4 py-3 text-xs font-medium text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <span className="h-3.5 w-3.5 rounded-sm bg-accent" /> VIP ₹{VIP_PRICE}
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-3.5 w-3.5 rounded-sm bg-primary" /> Regular ₹{REGULAR_PRICE}
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-3.5 w-3.5 rounded-sm bg-muted-foreground/30" /> Sold
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-3.5 w-3.5 rounded-sm bg-emerald-600" /> Selected
          </span>
        </div>

        {interactive && (
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 border-t border-border pt-5">
            <label htmlFor="party-size" className="text-sm font-semibold text-foreground">
              Best available
            </label>
            <input
              id="party-size"
              type="number"
              min={1}
              max={MAX_SEATS}
              value={partySize}
              onChange={(event) => setPartySize(event.target.value)}
              className="field-input h-11 w-16 text-center"
            />
            <button type="button" onClick={applyBestAvailable} className="ghost-btn h-11">
              Pick seats
            </button>
            <span className="text-xs text-muted-foreground">Up to {MAX_SEATS} seats</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeatMap;
