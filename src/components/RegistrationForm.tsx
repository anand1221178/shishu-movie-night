"use client";

import { useState } from "react";

export interface ChildData {
  name: string;
  dob: string;
  gender: "Boy" | "Girl" | "";
  allergies: string;
  medical: string;
}

export interface RegistrationData {
  mumName: string;
  mumPhone: string;
  mumEmail: string;
  dadName: string;
  dadPhone: string;
  dadEmail: string;
  parentStaying: string;
  children: ChildData[];
  notes: string;
  registrationId: string;
}

interface Props {
  onSubmit: (data: RegistrationData) => void;
}

function generateId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let id = "SMN-";
  for (let i = 0; i < 6; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

export function getAge(dob: string): number {
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

export function formatDob(dob: string): string {
  const d = new Date(dob);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function RegistrationForm({ onSubmit }: Props) {
  const [mumName, setMumName] = useState("");
  const [mumPhone, setMumPhone] = useState("");
  const [mumEmail, setMumEmail] = useState("");
  const [dadName, setDadName] = useState("");
  const [dadPhone, setDadPhone] = useState("");
  const [dadEmail, setDadEmail] = useState("");
  const [parentStaying, setParentStaying] = useState("");
  const [notes, setNotes] = useState("");
  const [children, setChildren] = useState<ChildData[]>([
    { name: "", dob: "", gender: "", allergies: "", medical: "" },
  ]);
  const [submitting, setSubmitting] = useState(false);

  const addChild = () => {
    setChildren([...children, { name: "", dob: "", gender: "", allergies: "", medical: "" }]);
  };

  const removeChild = (index: number) => {
    if (children.length > 1) {
      setChildren(children.filter((_, i) => i !== index));
    }
  };

  const updateChild = (index: number, field: keyof ChildData, value: string) => {
    const updated = [...children];
    updated[index] = { ...updated[index], [field]: value };
    setChildren(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const data: RegistrationData = {
      mumName,
      mumPhone,
      mumEmail,
      dadName,
      dadPhone,
      dadEmail,
      parentStaying,
      children,
      notes,
      registrationId: generateId(),
    };

    try {
      const GOOGLE_SCRIPT_URL = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;
      if (GOOGLE_SCRIPT_URL) {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      }
    } catch {
      console.warn("Google Sheets submission failed, but ticket will still be generated.");
    }

    onSubmit(data);
    setSubmitting(false);
  };

  const labelCls = "block font-bold text-xs mb-2 text-navy/70 uppercase tracking-wider";

  return (
    <section className="no-print py-12 px-5 bg-gradient-peach" id="register">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="inline-block text-4xl mb-2">📝</span>
          <h2 className="font-display text-2xl sm:text-3xl text-navy font-bold mb-1">
            Register Now
          </h2>
          <p className="text-navy-light/70 font-semibold text-sm">
            Fill in your family details and add each child attending.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* ====== MUM'S DETAILS ====== */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 card-glow">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-crimson/5 flex items-center justify-center text-xl">
                👩
              </div>
              <h3 className="font-display text-navy font-bold text-lg">
                Mum&apos;s Details
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className={labelCls}>
                  Full Name <span className="text-crimson">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Mum's full name"
                  className="input-styled"
                  value={mumName}
                  onChange={(e) => setMumName(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>
                    Phone <span className="text-crimson">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="07123 456789"
                    className="input-styled"
                    value={mumPhone}
                    onChange={(e) => setMumPhone(e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelCls}>
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="mum@example.com (optional)"
                    className="input-styled"
                    value={mumEmail}
                    onChange={(e) => setMumEmail(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ====== DAD'S DETAILS ====== */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 card-glow">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-navy/5 flex items-center justify-center text-xl">
                👨
              </div>
              <h3 className="font-display text-navy font-bold text-lg">
                Dad&apos;s Details
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className={labelCls}>
                  Full Name <span className="text-crimson">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Dad's full name"
                  className="input-styled"
                  value={dadName}
                  onChange={(e) => setDadName(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>
                    Phone <span className="text-crimson">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="07123 456789"
                    className="input-styled"
                    value={dadPhone}
                    onChange={(e) => setDadPhone(e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelCls}>
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="dad@example.com (optional)"
                    className="input-styled"
                    value={dadEmail}
                    onChange={(e) => setDadEmail(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ====== STAYING QUESTION ====== */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 card-glow">
            <label className={labelCls}>
              Will a parent be staying during the event? <span className="text-crimson">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
              {[
                { value: "Yes, staying", icon: "🙋", label: "Yes, we'll stay" },
                { value: "Drop off & pick up", icon: "🚗", label: "Drop off & pick up" },
              ].map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center gap-3 cursor-pointer font-bold text-sm px-5 py-4 border-2 rounded-2xl transition-all active:scale-[0.98] ${
                    parentStaying === option.value
                      ? "border-navy bg-navy text-white shadow-lg shadow-navy/20"
                      : "border-peach-dark bg-peach-light text-navy hover:border-navy/30"
                  }`}
                >
                  <input
                    type="radio"
                    name="staying"
                    value={option.value}
                    required
                    className="sr-only"
                    checked={parentStaying === option.value}
                    onChange={(e) => setParentStaying(e.target.value)}
                  />
                  <span className="text-xl">{option.icon}</span>
                  {option.label}
                </label>
              ))}
            </div>
          </div>

          {/* ====== CHILDREN CARD ====== */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 card-glow">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-xl">
                🧒
              </div>
              <h3 className="font-display text-navy font-bold text-lg">
                Children
              </h3>
              <span className="ml-auto text-xs font-bold text-navy/40 bg-navy/5 px-3 py-1 rounded-full">
                {children.length} {children.length === 1 ? "child" : "children"}
              </span>
            </div>

            <div className="space-y-4">
              {children.map((child, index) => (
                <div
                  key={index}
                  className="relative bg-gradient-to-br from-peach-light to-peach/30 border-2 border-peach-dark/60 rounded-2xl p-5 transition-all"
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className="inline-flex items-center gap-2 font-display text-navy font-bold text-sm bg-white px-3 py-1.5 rounded-full shadow-sm">
                      <span className="w-5 h-5 rounded-full bg-crimson text-white text-xs flex items-center justify-center font-bold">
                        {index + 1}
                      </span>
                      Child {index + 1}
                    </span>
                    {children.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeChild(index)}
                        className="text-crimson/70 hover:text-crimson font-bold text-xs px-3 py-1.5 rounded-lg hover:bg-crimson/10 transition-colors active:scale-95"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-xs mb-1.5 text-navy/60 uppercase tracking-wider">
                          Full Name <span className="text-crimson">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Child's full name"
                          className="input-styled"
                          value={child.name}
                          onChange={(e) => updateChild(index, "name", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-xs mb-1.5 text-navy/60 uppercase tracking-wider">
                          Date of Birth <span className="text-crimson">*</span>
                        </label>
                        <input
                          type="date"
                          required
                          className="input-styled"
                          value={child.dob}
                          onChange={(e) => updateChild(index, "dob", e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block font-bold text-xs mb-1.5 text-navy/60 uppercase tracking-wider">
                        Boy or Girl <span className="text-crimson">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { value: "Boy" as const, icon: "👦", color: "border-blue-400 bg-blue-50 text-blue-700", active: "border-blue-500 bg-blue-500 text-white shadow-lg shadow-blue-300/40" },
                          { value: "Girl" as const, icon: "👧", color: "border-pink-300 bg-pink-50 text-pink-700", active: "border-pink-500 bg-pink-500 text-white shadow-lg shadow-pink-300/40" },
                        ].map((option) => (
                          <label
                            key={option.value}
                            className={`flex items-center justify-center gap-2 cursor-pointer font-bold text-sm px-4 py-3 border-2 rounded-2xl transition-all active:scale-[0.98] ${
                              child.gender === option.value ? option.active : option.color
                            }`}
                          >
                            <input
                              type="radio"
                              name={`gender_${index}`}
                              value={option.value}
                              required
                              className="sr-only"
                              checked={child.gender === option.value}
                              onChange={(e) => updateChild(index, "gender", e.target.value)}
                            />
                            <span className="text-lg">{option.icon}</span>
                            {option.value}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block font-bold text-xs mb-1.5 text-navy/60 uppercase tracking-wider">
                        Allergies / Dietary
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Nut allergy, vegetarian"
                        className="input-styled"
                        value={child.allergies}
                        onChange={(e) => updateChild(index, "allergies", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-xs mb-1.5 text-navy/60 uppercase tracking-wider">
                        Medical Conditions
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Asthma, uses inhaler"
                        className="input-styled"
                        value={child.medical}
                        onChange={(e) => updateChild(index, "medical", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addChild}
              className="w-full mt-4 py-4 border-2 border-dashed border-navy/20 rounded-2xl bg-transparent text-navy font-display font-bold text-sm hover:border-navy/40 hover:bg-peach-light/50 transition-all active:scale-[0.98]"
            >
              + Add Another Child
            </button>
          </div>

          {/* ====== NOTES + SUBMIT ====== */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 card-glow">
            <div className="mb-6">
              <label className={labelCls}>Additional Notes</label>
              <textarea
                rows={3}
                placeholder="Anything else you'd like us to know..."
                className="input-styled resize-y"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-5 text-white border-none rounded-2xl font-display font-bold text-lg sm:text-xl cursor-pointer transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed ${
                submitting ? "bg-navy" : "btn-shimmer btn-pulse hover:-translate-y-1"
              }`}
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Registering...
                </span>
              ) : (
                "🎬 Register & Get Tickets"
              )}
            </button>

            <p className="text-center text-navy/40 text-xs font-semibold mt-3">
              Your ticket will be generated instantly after registration
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
