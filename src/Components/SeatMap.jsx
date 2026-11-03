import { useState } from "react";
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

function SeatButton({ seat, rowLabel, selected, interactive, onToggle }) {
  const status = seat.status || "AVAILABLE";
  const booked = status === "BOOKED";
  const price = seatPrice(seat.seatType);
  const category = String(seat.seatType || "REGULAR").toUpperCase() === "VIP" ? "VIP" : "Regular";

  let color = "bg-[#38bdf8] text-sky-950 hover:brightness-95";
  if (booked) color = "cursor-not-allowed bg-[#d7d2cb] text-slate-500";
  else if (selected) color = "bg-[#16a34a] text-white shadow-[0_0_0_2px_rgba(22,163,74,0.25)]";
  else if (category === "VIP") color = "bg-[#f59e0b] text-amber-950 hover:brightness-95";

  return (
    <button
      type="button"
      disabled={!interactive || booked}
      aria-pressed={selected}
      title={`${seat.seatNumber} · ${category} · ₹${price}${booked ? " · Sold" : ""}`}
      aria-label={`Seat ${seat.seatNumber}, ${category}, ₹${price}, ${booked ? "sold" : selected ? "selected" : "available"}`}
      onClick={() => onToggle?.(seat)}
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-t-[10px] rounded-b-[4px] text-[10px] font-bold leading-none transition ${color} ${
        interactive && !booked ? "cursor-pointer active:scale-95" : ""
      }`}
    >
      {displayNumber(seat, rowLabel)}
    </button>
  );
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
  const [partySize, setPartySize] = useState(2);
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

  return (
    <div className="surface-card overflow-hidden">
      <div className="border-b border-[color:var(--border)] bg-[#faf7f3] px-4 py-5 md:px-6">
        <div className="[perspective:900px]">
          <div className="mx-auto h-3.5 w-[min(100%,34rem)] origin-bottom rounded-[50%] bg-gradient-to-b from-[#d6d0c8] to-[#bbb3a8] shadow-[0_18px_28px_rgba(17,24,39,0.16)] [transform:rotateX(58deg)]" />
          <p className="mt-3 text-center text-[11px] font-bold tracking-[0.35em] text-slate-400">SCREEN THIS WAY</p>
        </div>
      </div>

      <div className="p-4 md:p-6">
        {rows.length === 0 ? (
          <p className="py-10 text-center text-sm text-slate-500">Seat layout is not available for this venue.</p>
        ) : (
          <div className="overflow-x-auto pb-2">
            <div className="mx-auto flex w-max min-w-full flex-col items-center gap-2.5">
              {rows.map((row) => {
                const blocks = splitForAisle(row.seats);
                return (
                  <div key={row.label} className="flex items-center gap-3">
                    <span className="w-6 shrink-0 text-center text-xs font-bold text-slate-400">{row.label}</span>
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
        )}

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 rounded-xl bg-[#faf7f3] px-4 py-3 text-xs font-medium text-slate-600">
          <span className="inline-flex items-center gap-2">
            <span className="h-3.5 w-3.5 rounded-sm bg-[#f59e0b]" /> VIP ₹{VIP_PRICE}
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-3.5 w-3.5 rounded-sm bg-[#38bdf8]" /> Regular ₹{REGULAR_PRICE}
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-3.5 w-3.5 rounded-sm bg-[#d7d2cb]" /> Sold
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-3.5 w-3.5 rounded-sm bg-[#16a34a]" /> Selected
          </span>
        </div>

        {interactive && (
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 border-t border-[color:var(--border)] pt-5">
            <label htmlFor="party-size" className="text-sm font-semibold text-slate-700">
              Best available
            </label>
            <input
              id="party-size"
              type="number"
              min={1}
              max={MAX_SEATS}
              value={partySize}
              onChange={(event) => setPartySize(event.target.value)}
              className="field-input h-10 w-16 text-center"
            />
            <button
              type="button"
              onClick={applyBestAvailable}
              className="ghost-btn h-10"
            >
              Pick seats
            </button>
            <span className="text-xs text-slate-400">Up to {MAX_SEATS} seats</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeatMap;
