"use client";

import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [name, setName] = useState("Harshit Raj");
  const [email, setEmail] = useState("you@example.com");
  const [role, setRole] = useState("Full-stack Developer");
  const [team, setTeam] = useState("API TITANS");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // 🔹 Load existing profile from /api/profile (Supabase)
  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/profile");
        if (!res.ok) return;

        const data = await res.json();
        if (!data) {
          setLoadingProfile(false);
          return; // no profile yet
        }

        setName(data.name ?? "");
        setEmail(data.email ?? "");
        setRole(data.role ?? "");
        setTeam(data.team ?? "");
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingProfile(false);
      }
    }

    loadProfile();
  }, []);

  // 🔹 Save profile to /api/profile → Supabase
  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, role, team }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(`Error: ${data.error || "Failed to save profile"}`);
      } else {
        setMessage("Profile saved to database");
      }
    } catch (err) {
      console.error(err);
      setMessage("Unexpected error while saving profile");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex justify-center">
      <div className="w-full max-w-3xl px-4 py-10">
        <h1 className="text-3xl font-semibold mb-6">Profile</h1>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
          {loadingProfile ? (
            <p className="text-sm text-slate-400">Loading profile…</p>
          ) : (
            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm text-slate-300 mb-1">
                    Full Name
                  </label>
                  <input
                    className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 outline-none focus:ring focus:ring-blue-500/40"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 outline-none focus:ring focus:ring-blue-500/40"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm text-slate-300 mb-1">
                    Role
                  </label>
                  <input
                    className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 outline-none focus:ring focus:ring-blue-500/40"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="Backend / QA / Frontend"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">
                    Team / Company
                  </label>
                  <input
                    className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 outline-none focus:ring focus:ring-blue-500/40"
                    value={team}
                    onChange={(e) => setTeam(e.target.value)}
                    placeholder="Hackathon team"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="mt-2 inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold hover:bg-blue-500 disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save Profile"}
              </button>

              {message && (
                <p className="text-xs text-emerald-400 mt-2">{message}</p>
              )}
            </form>
          )}
        </div>
      </div>
    </main>
  );
}