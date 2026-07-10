"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login } from "@/lib/api";
import { TOKEN_KEY } from "@/lib/auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@portfolio.com");
  const [password, setPassword] = useState("Admin@123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await login(email, password);
      localStorage.setItem(TOKEN_KEY, result.accessToken);
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-6">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900 p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-blue-400">Portfolio CMS</p>
          <h1 className="mt-2 text-2xl font-bold text-white">Admin Login</h1>
          <p className="mt-2 text-sm text-zinc-400">Sign in to manage your portfolio content</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm text-zinc-300">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-2 block text-sm text-zinc-300">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-blue-500"
              required
            />
          </div>

          {error && <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-3 font-medium text-white hover:bg-blue-500 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-400">
          <p className="font-medium text-zinc-300">Default credentials</p>
          <p className="mt-2">Email: <span className="text-white">admin@portfolio.com</span></p>
          <p>Password: <span className="text-white">Admin@123</span></p>
        </div>

        <p className="mt-6 text-center text-sm text-zinc-500">
          <Link href="/" className="hover:text-zinc-300">← Back to website</Link>
        </p>
      </div>
    </div>
  );
}
