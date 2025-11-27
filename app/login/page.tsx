"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("judge@apititan.dev"); // prefilled for demo
  const [password, setPassword] = useState("apititan123");   // same as you set in Supabase
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      console.error(error);
      setError(error.message || "Login failed");
      return;
    }

    // success → go to main dashboard
    router.push("/");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950">
      <Card className="w-full max-w-md bg-slate-900 border-slate-800 text-slate-50">
        <CardHeader>
          <CardTitle className="text-xl">Login to API TITAN</CardTitle>
          <CardDescription className="text-slate-400">
            Use the demo judge account to explore the dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs mb-1 text-slate-300">Email</label>
              <input
                type="email"
                value={email}
                className="w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-sm outline-none focus:ring focus:ring-blue-500/40"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs mb-1 text-slate-300">Password</label>
              <input
                type="password"
                value={password}
                className="w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-sm outline-none focus:ring focus:ring-blue-500/40"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-xs text-red-400">{error}</p>}

            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-blue-600 hover:bg-blue-700"
            >
              {loading ? "Logging in..." : "Login"}
            </Button>

            <p className="text-[11px] text-slate-400 mt-3">
              Demo creds (you can tell judges): <br />
              <span className="font-mono">judge@apititan.dev / apititan123</span>
            </p>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
