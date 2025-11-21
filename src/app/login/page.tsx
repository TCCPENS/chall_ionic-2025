"use client";
import { useState } from "react";

export default function LoginPage() {
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState("");

  const submit = async (e: any) => {
    e.preventDefault();
    setErr("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: u, password: p }),
    });
    if (res.ok) {
      window.location.href = "/admin";
    } else {
      const data = await res.json();
      setErr(data?.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <form onSubmit={submit} className="bg-white/5 p-8 rounded-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Sign in to your account</h2>
        <input className="w-full p-2 mb-3 rounded" placeholder="username" value={u} onChange={(e)=>setU(e.target.value)} required />
        <input className="w-full p-2 mb-3 rounded" placeholder="password" type="password" value={p} onChange={(e)=>setP(e.target.value)} required />
        <button className="w-full py-2 rounded bg-indigo-600">Login</button>
        {err && <p className="mt-3 text-red-300">{err}</p>}
      </form>
    </div>
  );
}
