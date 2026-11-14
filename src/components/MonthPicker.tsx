"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MONTHS_LONG, hasEntry, parseDateString, toDateString } from "@/lib/dates";

interface MonthPickerProps {
  year: number;
  selected: string;
  today: string;
  onSelect: (dateString: string) => void;
  onClose: () => void;
}

const WEEKDAY_INITIALS = ["S", "M", "T", "W", "T", "F", "S"];

export default function MonthPicker({ year, selected, today, onSelect, onClose }: MonthPickerProps) {
  const [month, setMonth] = useState(() => parseDateString(selected).month);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const handlePointer = (event: PointerEvent) => {
      const target = event.target as Element;
      // The band button toggles the picker itself; closing here would reopen it.
      if (target.closest(".band-button")) return;
      if (panelRef.current && !panelRef.current.contains(target)) onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.addEventListener("pointerdown", handlePointer);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.removeEventListener("pointerdown", handlePointer);
    };
  }, [onClose]);

  const leadingBlanks = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  return (
    <div className="picker" ref={panelRef} role="dialog" aria-label="Choose a date">
      <div className="picker-head">
        <button
          type="button"
          className="picker-step"
          onClick={() => setMonth((month + 11) % 12)}
          aria-label="Previous month"
        >
          <ChevronLeft size={18} aria-hidden />
        </button>
        <span className="picker-month" aria-live="polite">
          {MONTHS_LONG[month]}
        </span>
        <button
          type="button"
          className="picker-step"
          onClick={() => setMonth((month + 1) % 12)}
          aria-label="Next month"
        >
          <ChevronRight size={18} aria-hidden />
        </button>
      </div>

      <div className="picker-grid" aria-hidden>
        {WEEKDAY_INITIALS.map((initial, index) => (
          <span key={index} className="picker-weekday">
            {initial}
          </span>
        ))}
      </div>

      <div className="picker-grid">
        {Array.from({ length: leadingBlanks }, (_, index) => (
          <span key={`blank-${index}`} />
        ))}
        {Array.from({ length: daysInMonth }, (_, index) => {
          const day = index + 1;
          const dateString = toDateString(month, day);
          const classes = ["picker-day"];
          if (dateString === selected) classes.push("is-selected");
          if (dateString === today) classes.push("is-today");
          return (
            <button
              key={day}
              type="button"
              className={classes.join(" ")}
              disabled={!hasEntry(dateString)}
              aria-label={`${MONTHS_LONG[month]} ${day}`}
              aria-current={dateString === selected ? "date" : undefined}
              onClick={() => onSelect(dateString)}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
