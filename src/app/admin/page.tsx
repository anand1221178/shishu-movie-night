"use client";

import { useState, useEffect, useCallback, useMemo } from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface CheckInEntry {
  ticketId: string;
  childName: string;
  gender: string;
  age: number | string;
  guardianName: string;
  guardianPhone: string;
  checkedInAt: string; // ISO string
}

type FilterMode = "all" | "checked-in" | "not-yet";

const STORAGE_KEY = "smn-checkins";
const AUTH_KEY = "smn-admin-auth";
const ADMIN_PASSWORD =
  process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "shishu2026";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function loadCheckins(): Record<string, CheckInEntry> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveCheckins(data: Record<string, CheckInEntry>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

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
          className="w-full py-4 bg-navy text-white rounded-2xl font-display font-bold text-base transition-all active:scale-[0.97] hover:-translate-y-0.5"
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
  isCheckedIn,
  onToggle,
}: {
  entry: {
    ticketId: string;
    childName: string;
    gender: string;
    age: number | string;
    guardianName: string;
    guardianPhone: string;
  };
  isCheckedIn: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={`rounded-2xl p-5 transition-all border-2 ${
        isCheckedIn
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
            {isCheckedIn && (
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
            <p>
              Phone:{" "}
              <a
                href={`tel:${entry.guardianPhone}`}
                className="text-navy underline"
              >
                {entry.guardianPhone}
              </a>
            </p>
          </div>

          <p className="mt-2 font-mono text-xs text-navy/40 font-bold tracking-wider">
            {entry.ticketId}
          </p>
        </div>

        <button
          onClick={onToggle}
          className={`shrink-0 px-4 py-3 rounded-xl font-display font-bold text-sm transition-all active:scale-95 ${
            isCheckedIn
              ? "bg-green-500/10 text-green-700 border-2 border-green-400 hover:bg-green-500/20"
              : "bg-navy text-white hover:-translate-y-0.5 shadow-lg shadow-navy/20"
          }`}
        >
          {isCheckedIn ? "Undo" : "Check In"}
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Manual entry form                                                  */
/* ------------------------------------------------------------------ */

function ManualEntryForm({
  onAdd,
}: {
  onAdd: (entry: CheckInEntry) => void;
}) {
  const [open, setOpen] = useState(false);
  const [ticketId, setTicketId] = useState("");
  const [childName, setChildName] = useState("");
  const [gender, setGender] = useState<"Boy" | "Girl">("Boy");
  const [age, setAge] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [guardianPhone, setGuardianPhone] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = ticketId.trim() || `WALK-${Date.now().toString(36).toUpperCase()}`;
    onAdd({
      ticketId: id,
      childName: childName.trim(),
      gender,
      age: age ? Number(age) : "?",
      guardianName: guardianName.trim(),
      guardianPhone: guardianPhone.trim(),
      checkedInAt: new Date().toISOString(),
    });
    setTicketId("");
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
        className="w-full py-4 border-2 border-dashed border-navy/20 rounded-2xl bg-transparent text-navy font-display font-bold text-sm hover:border-navy/40 hover:bg-peach-light/50 transition-all active:scale-[0.98]"
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
        <span className="text-lg">✏️</span> Manual Check-In
      </h4>

      <div>
        <label className={labelCls}>Ticket ID (optional)</label>
        <input
          type="text"
          placeholder="SMN-XXXXXX or leave blank"
          className="input-styled"
          value={ticketId}
          onChange={(e) => setTicketId(e.target.value.toUpperCase())}
        />
      </div>

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
                className={`py-2 rounded-xl text-sm font-bold border-2 transition-all ${
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
          className="flex-1 py-3 bg-navy text-white rounded-xl font-display font-bold text-sm transition-all active:scale-[0.97]"
        >
          Check In
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="px-5 py-3 bg-peach-light border-2 border-peach-dark rounded-xl font-display font-bold text-sm text-navy transition-all active:scale-[0.97]"
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
  const [checkins, setCheckins] = useState<Record<string, CheckInEntry>>({});
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterMode>("all");

  // Check session auth on mount
  useEffect(() => {
    if (sessionStorage.getItem(AUTH_KEY) === "1") {
      setAuthed(true);
    }
  }, []);

  // Load check-ins from localStorage
  useEffect(() => {
    if (authed) {
      setCheckins(loadCheckins());
    }
  }, [authed]);

  // Persist whenever checkins change
  const updateCheckins = useCallback(
    (next: Record<string, CheckInEntry>) => {
      setCheckins(next);
      saveCheckins(next);
    },
    []
  );

  const toggleCheckIn = useCallback(
    (entry: {
      ticketId: string;
      childName: string;
      gender: string;
      age: number | string;
      guardianName: string;
      guardianPhone: string;
    }) => {
      setCheckins((prev) => {
        const next = { ...prev };
        if (next[entry.ticketId]) {
          delete next[entry.ticketId];
        } else {
          next[entry.ticketId] = {
            ...entry,
            checkedInAt: new Date().toISOString(),
          };
        }
        saveCheckins(next);
        return next;
      });
    },
    []
  );

  const addManualEntry = useCallback((entry: CheckInEntry) => {
    setCheckins((prev) => {
      const next = { ...prev, [entry.ticketId]: entry };
      saveCheckins(next);
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    if (
      window.confirm(
        "Are you sure you want to clear ALL check-in data? This cannot be undone."
      )
    ) {
      updateCheckins({});
    }
  }, [updateCheckins]);

  // All checked-in entries as a list
  const checkedInList = useMemo(
    () => Object.values(checkins),
    [checkins]
  );

  const checkedInCount = checkedInList.length;

  // For the search + filter to work, we need a combined list.
  // Checked-in entries are stored; for "not yet" / "all", we only know
  // about entries that have been checked in (since we don't have the
  // full sheet). So "all" and "not yet" show checked-in entries, and
  // the search/manual entry handles walk-ins.
  //
  // The search bar doubles as a quick-check-in: type a ticket ID and
  // if it matches an existing check-in, show it; otherwise offer to
  // create a new entry.

  const filteredEntries = useMemo(() => {
    let entries = checkedInList;

    // Sort by most recently checked in
    entries = [...entries].sort(
      (a, b) =>
        new Date(b.checkedInAt).getTime() - new Date(a.checkedInAt).getTime()
    );

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
  }, [checkedInList, search]);

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
          <div className="flex items-center justify-between">
            <h1 className="font-display font-bold text-base flex items-center gap-2">
              <span className="text-xl">🎬</span> Check-In
            </h1>
            <div className="font-display font-bold text-sm bg-white/15 px-3 py-1.5 rounded-full">
              {checkedInCount} checked in
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-5 space-y-4">
        {/* Search */}
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/30 text-base pointer-events-none">
            🔍
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search ticket ID or child name..."
            className="input-styled !pl-12"
            autoComplete="off"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-navy/40 hover:text-navy text-lg font-bold w-8 h-8 flex items-center justify-center"
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
              { key: "all", label: "All" },
              { key: "checked-in", label: "Checked In" },
              { key: "not-yet", label: "Not Yet" },
            ] as { key: FilterMode; label: string }[]
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`flex-1 py-2.5 rounded-xl font-display font-bold text-sm transition-all active:scale-[0.97] ${
                filter === tab.key
                  ? "bg-navy text-white shadow-md shadow-navy/20"
                  : "bg-white/70 text-navy/60 border border-peach-dark/40"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Info banner */}
        <div className="bg-gold-light border-2 border-gold/40 rounded-2xl p-4 text-sm text-navy/80 font-semibold">
          <p>
            <span className="text-base mr-1">💡</span>
            Use <strong>+ Add Walk-In</strong> below to check in children.
            Search above to find and undo check-ins. All data is stored
            locally on this device.
          </p>
        </div>

        {/* Results */}
        <div className="space-y-3">
          {filter !== "not-yet" &&
            filteredEntries.map((entry) => (
              <CheckInCard
                key={entry.ticketId}
                entry={entry}
                isCheckedIn={!!checkins[entry.ticketId]}
                onToggle={() => toggleCheckIn(entry)}
              />
            ))}

          {filter === "not-yet" && (
            <div className="bg-white/60 rounded-2xl p-6 text-center text-navy/50 font-semibold text-sm">
              <p className="text-2xl mb-2">📋</p>
              <p>
                &ldquo;Not Yet&rdquo; tracking requires the full registration
                list. Use this view after importing data, or check the Google
                Sheet directly.
              </p>
            </div>
          )}

          {filter !== "not-yet" && filteredEntries.length === 0 && (
            <div className="bg-white/60 rounded-2xl p-6 text-center text-navy/50 font-semibold text-sm">
              <p className="text-2xl mb-2">
                {search ? "🔎" : "✨"}
              </p>
              <p>
                {search
                  ? "No matching check-ins found."
                  : "No one checked in yet. Use the form below to start!"}
              </p>
            </div>
          )}
        </div>

        {/* Manual entry */}
        <ManualEntryForm onAdd={addManualEntry} />

        {/* Footer actions */}
        {checkedInCount > 0 && (
          <div className="pt-4 pb-8">
            <button
              onClick={clearAll}
              className="w-full py-3 border-2 border-crimson/30 rounded-xl text-crimson/70 font-display font-bold text-sm hover:bg-crimson/5 transition-all active:scale-[0.97]"
            >
              Clear All Check-Ins ({checkedInCount})
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
