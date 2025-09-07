// app/auth/signup/page.js
"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUpPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }
      // automatically sign in the user
      const signin = await signIn("credentials", {
        redirect: false,
        email: form.email,
        password: form.password,
      });
      if (signin?.ok) {
        router.push("/"); // or /dashboard
      } else {
        setError("Registration succeeded but auto-login failed");
      }
    } catch (err) {
      setError("Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="max-w-md w-full bg-white p-6 rounded shadow"
      >
        <h2 className="text-2xl mb-4">Create an account</h2>

        <label className="block mb-2">
          <span className="text-sm">Full name</span>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="mt-1 block w-full rounded border p-2"
          />
        </label>

        <label className="block mb-2">
          <span className="text-sm">Email</span>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="mt-1 block w-full rounded border p-2"
          />
        </label>

        <label className="block mb-4">
          <span className="text-sm">Password</span>
          <input
            required
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="mt-1 block w-full rounded border p-2"
          />
        </label>

        {error && <p className="text-red-600 mb-2">{error}</p>}

        <button
          disabled={loading}
          className="w-full py-2 bg-blue-600 text-white rounded"
        >
          {loading ? "Working..." : "Create account"}
        </button>
      </form>
    </div>
  );
}
