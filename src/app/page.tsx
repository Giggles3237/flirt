"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MeshGradient } from "@paper-design/shaders-react";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  RefreshCw,
  Share2,
  Shuffle,
} from "lucide-react";
import MonthPicker from "@/components/MonthPicker";
import {
  CommentEntry,
  FlirtLevel,
  MONTHS_LONG,
  WEEKDAYS_LONG,
  entryFor,
  hasEntry,
  neighbourOf,
  parseDateString,
  randomDate,
  todayDateString,
} from "@/lib/dates";

const SECRET_LEVEL: FlirtLevel = "graphicFlirtyComment";

const LEVELS: Array<{ key: FlirtLevel; label: string; theme: string }> = [
  { key: "innocentlyDirtyComment", label: "Innocent", theme: "innocent" },
  { key: "flirtyComment", label: "Flirty", theme: "flirty" },
  { key: "risqueComment", label: "Risqué", theme: "risque" },
  { key: SECRET_LEVEL, label: "After dark", theme: "afterdark" },
];

const FIELD_COLORS: Record<string, string[]> = {
  innocent: ["#fff0f3", "#ffd1dc", "#ffb8cb", "#ffe5ec"],
  flirty: ["#ff8fab", "#ff4d8d", "#ffb3c6", "#f72585"],
  risque: ["#e63946", "#9d0208", "#ff4d6d", "#c1121f"],
  afterdark: ["#1a0010", "#3c0a2a", "#7a0b3f", "#12000a"],
};

const SHAREABLE_LEVELS: FlirtLevel[] = ["innocentlyDirtyComment", "flirtyComment", "risqueComment"];
const COUNTDOWN_TARGET = new Date("December 17, 2027 00:00:00").getTime();

interface PhotoAttribution {
  name: string;
  profileUrl: string;
  photoUrl: string;
}

interface TornSheet {
  id: number;
  entry: CommentEntry;
  level: FlirtLevel;
}

function preloadImage(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(true);
    image.onerror = () => resolve(false);
    image.src = url;
  });
}

function lineSizeClass(line: string): string {
  if (line.length <= 55) return "line line-short";
  if (line.length <= 105) return "line line-medium";
  return "line line-long";
}

function SheetFace({
  entry,
  level,
  year,
  children,
}: {
  entry: CommentEntry;
  level: FlirtLevel;
  year: number;
  children?: React.ReactNode;
}) {
  const { month, day } = parseDateString(entry.date);
  const weekday = WEEKDAYS_LONG[new Date(year, month, day).getDay()];
  const line = entry[level];

  return (
    <>
      <div className="sheet-date">
        <span className="numeral">{day}</span>
        <div className="sheet-day">
          <span className="weekday">{weekday}</span>
          <h2 className="special">{entry.specialDay}</h2>
        </div>
      </div>
      <blockquote key={level} className={lineSizeClass(line)}>
        &ldquo;{line}&rdquo;
      </blockquote>
      {children}
    </>
  );
}

export default function FlirtOfTheDay() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [today, setToday] = useState("");
  const [year, setYear] = useState(2026);
  const [level, setLevel] = useState<FlirtLevel>("flirtyComment");
  const [secretUnlocked, setSecretUnlocked] = useState(false);
  const [torn, setTorn] = useState<TornSheet | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [showAgeGate, setShowAgeGate] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoLoading, setPhotoLoading] = useState(false);
  const [photoAttribution, setPhotoAttribution] = useState<PhotoAttribution | null>(null);

  const tearCount = useRef(0);
  const swipeStart = useRef<number | null>(null);
  const photoRequest = useRef(0);

  const entry = selectedDate ? entryFor(selectedDate) : undefined;
  const theme = LEVELS.find((item) => item.key === level)?.theme ?? "flirty";
  const modalOpen = showAgeGate || showCountdown;

  // Open on the date in the link, or today's page.
  useEffect(() => {
    const now = new Date();
    const todayString = todayDateString(now);
    setToday(todayString);
    setYear(now.getFullYear());

    const params = new URLSearchParams(window.location.search);
    const dateParam = params.get("date");
    const levelParam = params.get("level") as FlirtLevel | null;

    setSelectedDate(dateParam && hasEntry(dateParam) ? dateParam : todayString);
    if (levelParam && SHAREABLE_LEVELS.includes(levelParam)) setLevel(levelParam);
  }, []);

  // Keep the address bar shareable. The after-dark level never goes in a link.
  useEffect(() => {
    if (!selectedDate) return;
    const params = new URLSearchParams();
    params.set("date", selectedDate);
    if (level !== SECRET_LEVEL) params.set("level", level);
    window.history.replaceState(null, "", `?${params.toString()}`);
  }, [selectedDate, level]);

  const turnTo = useCallback(
    (nextDate: string) => {
      if (!selectedDate || nextDate === selectedDate) return;
      const leaving = entryFor(selectedDate);
      if (leaving) {
        tearCount.current += 1;
        setTorn({ id: tearCount.current, entry: leaving, level });
      }
      setSelectedDate(nextDate);
      setCopied(false);
      setLinkCopied(false);
    },
    [selectedDate, level]
  );

  const step = useCallback(
    (direction: 1 | -1) => {
      if (selectedDate) turnTo(neighbourOf(selectedDate, direction));
    },
    [selectedDate, turnTo]
  );

  // Arrow keys flip pages.
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (modalOpen || pickerOpen) return;
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [modalOpen, pickerOpen, step]);

  // Escape closes whichever modal is open.
  useEffect(() => {
    if (!modalOpen) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowAgeGate(false);
        setShowCountdown(false);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [modalOpen]);

  const loadPhoto = useCallback(async (specialDay: string) => {
    const request = ++photoRequest.current;
    setPhotoLoading(true);
    let url = "";
    let attribution: PhotoAttribution | null = null;
    try {
      const response = await fetch(`/api/unsplash?specialDay=${encodeURIComponent(specialDay)}`, {
        cache: "no-store",
      });
      if (!response.ok) throw new Error("Image request failed");
      const data = (await response.json()) as { url: string; attribution: PhotoAttribution };
      url = data.url;
      attribution = data.attribution;
    } catch {
      url = `https://picsum.photos/seed/${encodeURIComponent(specialDay)}/800/600`;
    }
    // Only show the snapshot once the picture has actually arrived.
    const loaded = await preloadImage(url);
    if (request !== photoRequest.current) return;
    setPhotoUrl(loaded ? url : "");
    setPhotoAttribution(loaded ? attribution : null);
    setPhotoLoading(false);
  }, []);

  const specialDay = entry?.specialDay;
  useEffect(() => {
    if (specialDay) loadPhoto(specialDay);
  }, [specialDay, loadPhoto]);

  useEffect(() => {
    if (!showCountdown) return;
    const update = () => {
      const distance = Math.max(0, COUNTDOWN_TARGET - Date.now());
      setCountdown({
        days: Math.floor(distance / 86_400_000),
        hours: Math.floor((distance % 86_400_000) / 3_600_000),
        minutes: Math.floor((distance % 3_600_000) / 60_000),
        seconds: Math.floor((distance % 60_000) / 1000),
      });
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [showCountdown]);

  const handleCopy = async () => {
    if (!entry) return;
    await navigator.clipboard.writeText(entry[level]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (typeof navigator.share === "function" && entry) {
      try {
        await navigator.share({ title: `Flirt of the Day: ${entry.specialDay}`, url });
        return;
      } catch {
        // Share sheet dismissed or unavailable: fall through to copying the link.
      }
    }
    await navigator.clipboard.writeText(url);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleWink = () => {
    if (secretUnlocked) setLevel(SECRET_LEVEL);
    else setShowAgeGate(true);
  };

  const confirmAge = () => {
    setShowAgeGate(false);
    setSecretUnlocked(true);
    setLevel(SECRET_LEVEL);
  };

  const visibleLevels = LEVELS.filter((item) => item.key !== SECRET_LEVEL || secretUnlocked);
  const month = entry ? parseDateString(entry.date).month : 0;

  return (
    <div className="app" data-level={theme}>
      <div className="field" aria-hidden>
        <MeshGradient
          style={{ width: "100%", height: "100%" }}
          colors={FIELD_COLORS[theme]}
          distortion={theme === "risque" ? 0.9 : 0.6}
          swirl={0.25}
          speed={0.4}
        />
      </div>

      <header className="masthead">
        <div>
          <h1 className="wordmark">Flirt of the Day</h1>
          <p className="tagline">
            Your daily{" "}
            <button type="button" className="hidden-trigger" onClick={handleWink}>
              wink
            </button>{" "}
            and mischievous smile.
          </p>
        </div>
        <button
          type="button"
          className="field-button"
          onClick={() => selectedDate && turnTo(randomDate(selectedDate))}
        >
          <Shuffle size={16} aria-hidden />
          Surprise me
        </button>
      </header>

      <main className="stage">
        <div className="pad-wrap">
          <article
            className="pad"
            onTouchStart={(event) => {
              swipeStart.current = event.touches[0].clientX;
            }}
            onTouchEnd={(event) => {
              if (swipeStart.current === null) return;
              const travelled = event.changedTouches[0].clientX - swipeStart.current;
              swipeStart.current = null;
              if (Math.abs(travelled) > 60) step(travelled < 0 ? 1 : -1);
            }}
          >
            <div className="band">
              <button
                type="button"
                className="band-button"
                onClick={() => setPickerOpen((open) => !open)}
                aria-expanded={pickerOpen}
                aria-haspopup="dialog"
                aria-label={`${MONTHS_LONG[month]} ${year}. Choose a date`}
              >
                <span className="band-month">{entry ? MONTHS_LONG[month] : " "}</span>
                <ChevronDown size={20} aria-hidden />
              </button>
              <span className="band-year">{year}</span>
              {pickerOpen && selectedDate && (
                <MonthPicker
                  year={year}
                  selected={selectedDate}
                  today={today}
                  onSelect={(dateString) => {
                    setPickerOpen(false);
                    turnTo(dateString);
                  }}
                  onClose={() => setPickerOpen(false)}
                />
              )}
            </div>

            <div className="sheet-slot">
              {entry && (
                <section className="sheet" key={entry.date} aria-live="polite">
                  <SheetFace entry={entry} level={level} year={year}>
                    <div className="sheet-actions">
                      <button type="button" className="sheet-button" onClick={handleCopy}>
                        {copied ? <Check size={16} aria-hidden /> : <Copy size={16} aria-hidden />}
                        {copied ? "Copied" : "Copy line"}
                      </button>
                      <button type="button" className="sheet-button" onClick={handleShare}>
                        {linkCopied ? <Check size={16} aria-hidden /> : <Share2 size={16} aria-hidden />}
                        {linkCopied ? "Link copied" : "Share"}
                      </button>
                    </div>
                  </SheetFace>
                </section>
              )}
              {torn && (
                <div
                  className="sheet sheet-torn"
                  key={torn.id}
                  aria-hidden
                  onAnimationEnd={(event) => {
                    // The line inside has its own fade; only the tear itself ends the sheet.
                    if (event.target === event.currentTarget) setTorn(null);
                  }}
                >
                  <SheetFace entry={torn.entry} level={torn.level} year={year}>
                    <div className="sheet-actions sheet-actions-ghost" />
                  </SheetFace>
                </div>
              )}
            </div>
          </article>

        </div>

        <div className="heat" role="radiogroup" aria-label="How bold should the line be?">
          {visibleLevels.map((item) => (
            <button
              key={item.key}
              type="button"
              role="radio"
              aria-checked={level === item.key}
              className="heat-stop"
              onClick={() => setLevel(item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>

        {selectedDate && (
          <nav className="day-nav" aria-label="Other days">
            <button type="button" className="field-button" onClick={() => step(-1)}>
              <ChevronLeft size={16} aria-hidden />
              {neighbourOf(selectedDate, -1)}
            </button>
            <button
              type="button"
              className="field-button"
              onClick={() => turnTo(today)}
              disabled={selectedDate === today}
            >
              Today
            </button>
            <button type="button" className="field-button" onClick={() => step(1)}>
              {neighbourOf(selectedDate, 1)}
              <ChevronRight size={16} aria-hidden />
            </button>
          </nav>
        )}

        {entry && photoUrl && !photoLoading && (
          <figure className="snapshot" key={photoUrl}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photoUrl}
              alt={`Photo for ${entry.specialDay}`}
              onError={() => setPhotoUrl("")}
            />
            <figcaption>
              {photoAttribution ? (
                <span>
                  <a href={photoAttribution.profileUrl} target="_blank" rel="noopener noreferrer">
                    {photoAttribution.name}
                  </a>{" "}
                  on{" "}
                  <a href={photoAttribution.photoUrl} target="_blank" rel="noopener noreferrer">
                    Unsplash
                  </a>
                </span>
              ) : (
                <span>{entry.specialDay}</span>
              )}
              <button
                type="button"
                className="snapshot-refresh"
                onClick={() => loadPhoto(entry.specialDay)}
                aria-label="Show a different photo"
                title="Show a different photo"
              >
                <RefreshCw size={14} aria-hidden />
              </button>
            </figcaption>
          </figure>
        )}
      </main>

      <footer className="colophon">
        Made with{" "}
        <button
          type="button"
          className="hidden-trigger heart"
          onClick={() => setShowCountdown(true)}
          aria-label="Open the secret countdown"
        >
          💕
        </button>{" "}
        by <strong>LaskoCreative</strong>
      </footer>

      {showAgeGate && (
        <div className="veil" onClick={() => setShowAgeGate(false)}>
          <div
            className="note"
            role="dialog"
            aria-modal="true"
            aria-labelledby="age-title"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="age-title" className="note-title">
              Adults only past this page
            </h2>
            <p className="note-body">
              The after-dark lines are graphic. Confirm you are 18 or older to read them.
            </p>
            <div className="note-actions">
              <button type="button" className="note-primary" onClick={confirmAge} autoFocus>
                I am 18 or older
              </button>
              <button type="button" className="note-secondary" onClick={() => setShowAgeGate(false)}>
                Keep it innocent
              </button>
            </div>
          </div>
        </div>
      )}

      {showCountdown && (
        <div className="veil" id="secret-countdown" onClick={() => setShowCountdown(false)}>
          <div
            className="note"
            role="dialog"
            aria-modal="true"
            aria-labelledby="countdown-title"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="countdown-title" className="note-title">
              Until December 17, 2027
            </h2>
            <div className="countdown">
              {[
                { label: "days", value: countdown.days },
                { label: "hours", value: countdown.hours },
                { label: "minutes", value: countdown.minutes },
                { label: "seconds", value: countdown.seconds },
              ].map(({ label, value }) => (
                <div key={label} className="countdown-unit">
                  <span className="countdown-value">{value.toString().padStart(2, "0")}</span>
                  <span className="countdown-label">{label}</span>
                </div>
              ))}
            </div>
            <div className="note-actions">
              <button
                type="button"
                className="note-primary"
                onClick={() => setShowCountdown(false)}
                autoFocus
              >
                Keep it secret
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
