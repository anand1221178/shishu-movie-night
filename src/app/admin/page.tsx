"use client";

import { useState, useEffect, useCallback, useMemo } from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Registration {
  ticketId: string;
  childName: string;
  gender: string;
  age: number | string;
  guardianName: string;
  guardianPhone: string;
  attended: boolean;
}

type FilterMode = "all" | "checked-in" | "not-yet";

const AUTH_KEY = "smn-admin-auth";
const ADMIN_PASSWORD =
  process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "shishu2026";
const GOOGLE_SCRIPT_URL =
  process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL ?? "";

/* ------------------------------------------------------------------ */
/*  Password gate                                                      */
/* ------------------------------------------------------------------ */

function PasswordGate({ onAuth }: { onAuth: () => void }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem(AUTH_KEY, "1");
      onAuth();
    } else {
      setError(true);
      setPw("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-peach px-5">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl p-8 sm:p-10 card-glow w-full max-w-sm text-center"
      >
        <div className="text-4xl mb-3">🔒</div>
        <h1 className="font-display text-navy font-bold text-xl mb-1">
          Admin Check-In
        </h1>
        <p className="text-navy/50 text-sm font-semibold mb-6">
          Enter the volunteer password to continue.
        </p>

        <input
          type="password"
          value={pw}
          onChange={(e) => {
            setPw(e.target.value);
            setError(false);
          }}
          placeholder="Password"
          className="input-styled text-center mb-4"
          autoFocus
        />

        {error && (
          <p className="text-crimson text-sm font-bold mb-4">
            Wrong password. Try again.
          </p>
        )}

        <button
          type="submit"
          className="w-full py-4 bg-navy text-white rounded-2xl font-display font-bold text-base transition-all active:scale-[0.97] hover:-translate-y-0.5 cursor-pointer"
        >
          Unlock
        </button>
      </form>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Registration card                                                  */
/* ------------------------------------------------------------------ */

function CheckInCard({
  entry,
  updating,
  onToggle,
}: {
  entry: Registration;
  updating: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={`rounded-2xl p-5 transition-all border-2 ${
        entry.attended
          ? "bg-green-50 border-green-300"
          : "bg-white border-peach-dark/60"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-lg">
              {entry.gender === "Girl" ? "👧" : "👦"}
            </span>
            <h3 className="font-display font-bold text-navy text-base truncate">
              {entry.childName}
            </h3>
            {entry.attended && (
              <span className="shrink-0 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                In
              </span>
            )}
          </div>

          <div className="mt-2 space-y-1 text-sm text-navy/70 font-semibold">
            <p>
              Age: <span className="text-navy">{entry.age}</span>
            </p>
            <p>
              Guardian: <span className="text-navy">{entry.guardianName}</span>
            </p>
            {entry.guardianPhone && (
              <p>
                Phone:{" "}
                <a
                  href={`tel:${entry.guardianPhone}`}
                  className="text-navy underline"
                >
                  {entry.guardianPhone}
                </a>
              </p>
            )}
          </div>

          <p className="mt-2 font-mono text-xs text-navy/40 font-bold tracking-wider">
            {entry.ticketId}
          </p>
        </div>

        <button
          onClick={onToggle}
          disabled={updating}
          className={`shrink-0 px-4 py-3 rounded-xl font-display font-bold text-sm transition-all active:scale-95 cursor-pointer disabled:opacity-50 ${
            entry.attended
              ? "bg-green-500/10 text-green-700 border-2 border-green-400 hover:bg-green-500/20"
              : "bg-navy text-white hover:-translate-y-0.5 shadow-lg shadow-navy/20"
          }`}
        >
          {updating ? "..." : entry.attended ? "Undo" : "Check In"}
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Manual entry form (for walk-ins without pre-registration)          */
/* ------------------------------------------------------------------ */

function ManualEntryForm({
  onAdd,
}: {
  onAdd: (entry: { childName: string; gender: string; age: string; guardianName: string; guardianPhone: string }) => void;
}) {
  const [open, setOpen] = useState(false);
  const [childName, setChildName] = useState("");
  const [gender, setGender] = useState<"Boy" | "Girl">("Boy");
  const [age, setAge] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [guardianPhone, setGuardianPhone] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      childName: childName.trim(),
      gender,
      age: age || "?",
      guardianName: guardianName.trim(),
      guardianPhone: guardianPhone.trim(),
    });
    setChildName("");
    setGender("Boy");
    setAge("");
    setGuardianName("");
    setGuardianPhone("");
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full py-4 border-2 border-dashed border-navy/20 rounded-2xl bg-transparent text-navy font-display font-bold text-sm hover:border-navy/40 hover:bg-peach-light/50 transition-all active:scale-[0.98] cursor-pointer"
      >
        + Add Walk-In / Manual Entry
      </button>
    );
  }

  const labelCls =
    "block font-bold text-xs mb-1.5 text-navy/60 uppercase tracking-wider";

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl p-5 border-2 border-gold/60 space-y-3"
    >
      <h4 className="font-display font-bold text-navy text-sm flex items-center gap-2">
        <span className="text-lg">✏️</span> Walk-In Check-In
      </h4>

      <div>
        <label className={labelCls}>
          Child Name <span className="text-crimson">*</span>
        </label>
        <input
          type="text"
          required
          placeholder="Child's full name"
          className="input-styled"
          value={childName}
          onChange={(e) => setChildName(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Gender</label>
          <div className="grid grid-cols-2 gap-2">
            {(["Boy", "Girl"] as const).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGender(g)}
                className={`py-2 rounded-xl text-sm font-bold border-2 transition-all cursor-pointer ${
                  gender === g
                    ? g === "Boy"
                      ? "border-blue-500 bg-blue-500 text-white"
                      : "border-pink-500 bg-pink-500 text-white"
                    : "border-peach-dark bg-peach-light text-navy"
                }`}
              >
                {g === "Boy" ? "👦" : "👧"} {g}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className={labelCls}>Age</label>
          <input
            type="number"
            placeholder="e.g. 6"
            className="input-styled"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className={labelCls}>Guardian Name</label>
        <input
          type="text"
          placeholder="Parent / guardian"
          className="input-styled"
          value={guardianName}
          onChange={(e) => setGuardianName(e.target.value)}
        />
      </div>

      <div>
        <label className={labelCls}>Guardian Phone</label>
        <input
          type="tel"
          placeholder="07123 456789"
          className="input-styled"
          value={guardianPhone}
          onChange={(e) => setGuardianPhone(e.target.value)}
        />
      </div>

      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          className="flex-1 py-3 bg-navy text-white rounded-xl font-display font-bold text-sm transition-all active:scale-[0.97] cursor-pointer"
        >
          Check In
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="px-5 py-3 bg-peach-light border-2 border-peach-dark rounded-xl font-display font-bold text-sm text-navy transition-all active:scale-[0.97] cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/*  Main admin dashboard                                               */
/* ------------------------------------------------------------------ */

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterMode>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());
  const [lastSync, setLastSync] = useState<Date | null>(null);

  // Check session auth on mount
  useEffect(() => {
    if (sessionStorage.getItem(AUTH_KEY) === "1") {
      setAuthed(true);
    }
  }, []);

  // Fetch registrations from Google Sheets (includes attended status)
  const fetchRegistrations = useCallback(async () => {
    if (!GOOGLE_SCRIPT_URL) {
      setError("Google Script URL not configured. Add NEXT_PUBLIC_GOOGLE_SCRIPT_URL to your environment variables.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${GOOGLE_SCRIPT_URL}?action=getAll&t=${Date.now()}`);
      const data = await res.json();

      if (data.status === "success" && Array.isArray(data.registrations)) {
        const regs: Registration[] = data.registrations.map(
          (row: { ticketId: string; childName: string; gender: string; age: string | number; guardianName: string; guardianPhone: string; attended: boolean | string }) => ({
            ticketId: row.ticketId || "",
            childName: row.childName || "",
            gender: row.gender || "",
            age: row.age || "?",
            guardianName: row.guardianName || "",
            guardianPhone: row.guardianPhone || "",
            attended: row.attended === true || row.attended === "YES",
          })
        );
        setRegistrations(regs);
        setLastSync(new Date());
      } else {
        setError("Failed to load registrations. Check your Google Script.");
      }
    } catch {
      setError("Could not connect to Google Sheets. Check your internet and script URL.");
    }
    setLoading(false);
  }, []);

  // Load data when authed + auto-refresh every 10 seconds for multi-device sync
  useEffect(() => {
    if (!authed) return;
    fetchRegistrations();
    const interval = setInterval(() => {
      // Silent background refresh (don't show loading spinner)
      if (!GOOGLE_SCRIPT_URL) return;
      fetch(`${GOOGLE_SCRIPT_URL}?action=getAll&t=${Date.now()}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success" && Array.isArray(data.registrations)) {
            const regs: Registration[] = data.registrations.map(
              (row: { ticketId: string; childName: string; gender: string; age: string | number; guardianName: string; guardianPhone: string; attended: boolean | string }) => ({
                ticketId: row.ticketId || "",
                childName: row.childName || "",
                gender: row.gender || "",
                age: row.age || "?",
                guardianName: row.guardianName || "",
                guardianPhone: row.guardianPhone || "",
                attended: row.attended === true || row.attended === "YES",
              })
            );
            setRegistrations(regs);
            setLastSync(new Date());
          }
        })
        .catch(() => {}); // Silent fail on background refresh
    }, 10000);
    return () => clearInterval(interval);
  }, [authed, fetchRegistrations]);

  // Toggle check-in — updates Google Sheet so all devices see it
  const toggleCheckIn = useCallback(async (ticketId: string) => {
    const reg = registrations.find((r) => r.ticketId === ticketId);
    if (!reg) return;

    const newStatus = !reg.attended;

    // Optimistic UI update
    setRegistrations((prev) =>
      prev.map((r) =>
        r.ticketId === ticketId ? { ...r, attended: newStatus } : r
      )
    );

    // Mark as updating
    setUpdatingIds((prev) => new Set(prev).add(ticketId));

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "checkIn",
          ticketId,
          attended: newStatus,
        }),
      });
    } catch {
      // Revert on failure
      setRegistrations((prev) =>
        prev.map((r) =>
          r.ticketId === ticketId ? { ...r, attended: !newStatus } : r
        )
      );
    }

    setUpdatingIds((prev) => {
      const next = new Set(prev);
      next.delete(ticketId);
      return next;
    });
  }, [registrations]);

  // Add walk-in — writes to Google Sheet + marks attended
  const addWalkIn = useCallback(async (entry: { childName: string; gender: string; age: string; guardianName: string; guardianPhone: string }) => {
    const ticketId = `WALK-${Date.now().toString(36).toUpperCase()}`;

    // Add to local state immediately
    const newReg: Registration = {
      ticketId,
      childName: entry.childName,
      gender: entry.gender,
      age: entry.age,
      guardianName: entry.guardianName,
      guardianPhone: entry.guardianPhone,
      attended: true,
    };
    setRegistrations((prev) => [newReg, ...prev]);

    // Write to Google Sheet
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "walkIn",
          ticketId,
          ...entry,
        }),
      });
    } catch {
      console.warn("Failed to save walk-in to sheet.");
    }
  }, []);

  // Counts
  const checkedInCount = useMemo(
    () => registrations.filter((r) => r.attended).length,
    [registrations]
  );
  const totalCount = registrations.length;

  // Filter + search
  const filteredEntries = useMemo(() => {
    let entries = [...registrations];

    if (filter === "checked-in") {
      entries = entries.filter((r) => r.attended);
    } else if (filter === "not-yet") {
      entries = entries.filter((r) => !r.attended);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      entries = entries.filter(
        (e) =>
          e.ticketId.toLowerCase().includes(q) ||
          e.childName.toLowerCase().includes(q) ||
          e.guardianName.toLowerCase().includes(q)
      );
    }

    return entries;
  }, [registrations, filter, search]);

  /* ---- Password gate ---- */
  if (!authed) {
    return <PasswordGate onAuth={() => setAuthed(true)} />;
  }

  /* ---- Dashboard ---- */
  return (
    <div className="min-h-screen bg-gradient-peach">
      {/* Sticky header */}
      <header className="sticky top-0 z-30 bg-navy text-white shadow-lg">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <h1 className="font-display font-bold text-base flex items-center gap-2">
              <span className="text-xl">🎬</span> Check-In
            </h1>
            <div className="font-display font-bold text-sm bg-white/15 px-3 py-1.5 rounded-full">
              {checkedInCount} / {totalCount} in
            </div>
          </div>
          <div className="flex items-center justify-between text-xs">
            <div className="text-gold font-bold">
              💰 R{checkedInCount * 50} collected ({checkedInCount} × R50)
            </div>
            {lastSync && (
              <div className="text-white/40 font-semibold">
                Synced {lastSync.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-5 space-y-4">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search ticket ID, child or guardian name..."
            className="input-styled"
            style={{ paddingLeft: "44px" }}
            autoComplete="off"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/30 pointer-events-none" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-navy/40 hover:text-navy text-lg font-bold w-8 h-8 flex items-center justify-center cursor-pointer"
              aria-label="Clear search"
            >
              &times;
            </button>
          )}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2">
          {(
            [
              { key: "all", label: `All (${totalCount})` },
              { key: "checked-in", label: `In (${checkedInCount})` },
              { key: "not-yet", label: `Left (${totalCount - checkedInCount})` },
            ] as { key: FilterMode; label: string }[]
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`flex-1 py-2.5 rounded-xl font-display font-bold text-sm transition-all active:scale-[0.97] cursor-pointer ${
                filter === tab.key
                  ? "bg-navy text-white shadow-md shadow-navy/20"
                  : "bg-white/70 text-navy/60 border border-peach-dark/40"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Loading state */}
        {loading && (
          <div className="bg-white rounded-2xl p-8 text-center">
            <div className="flex items-center justify-center gap-2 text-navy/60 font-semibold text-sm">
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Loading registrations...
            </div>
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="bg-crimson/5 border-2 border-crimson/20 rounded-2xl p-4 text-sm text-crimson font-semibold">
            <p className="mb-3">{error}</p>
            <button
              onClick={fetchRegistrations}
              className="bg-crimson text-white px-4 py-2 rounded-xl font-display font-bold text-xs cursor-pointer active:scale-95"
            >
              Retry
            </button>
          </div>
        )}

        {/* Results */}
        {!loading && !error && (
          <div className="space-y-3">
            {filteredEntries.map((entry) => (
              <CheckInCard
                key={entry.ticketId}
                entry={entry}
                updating={updatingIds.has(entry.ticketId)}
                onToggle={() => toggleCheckIn(entry.ticketId)}
              />
            ))}

            {filteredEntries.length === 0 && (
              <div className="bg-white/60 rounded-2xl p-6 text-center text-navy/50 font-semibold text-sm">
                <p className="text-2xl mb-2">
                  {search ? "🔎" : filter === "checked-in" ? "✨" : filter === "not-yet" ? "🎉" : "📋"}
                </p>
                <p>
                  {search
                    ? "No matching registrations found."
                    : filter === "checked-in"
                    ? "No one checked in yet."
                    : filter === "not-yet"
                    ? "Everyone is checked in!"
                    : "No registrations yet."}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Manual entry for walk-ins */}
        <ManualEntryForm onAdd={addWalkIn} />

        {/* Sync info + manual refresh */}
        <div className="text-center space-y-2">
          <p className="text-navy/30 text-xs font-semibold">
            Auto-syncs every 10 seconds across all devices
          </p>
          <button
            onClick={fetchRegistrations}
            disabled={loading}
            className="w-full py-3 bg-white border-2 border-navy/15 rounded-xl font-display font-bold text-sm text-navy/70 hover:border-navy/30 transition-all active:scale-[0.97] cursor-pointer disabled:opacity-50"
          >
            {loading ? "Loading..." : "🔄 Refresh Now"}
          </button>
        </div>
      </main>
    </div>
  );
}
