// app/auth/signin/page.js
"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignInPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const res = await signIn("credentials", {
      redirect: false,
      email: form.email,
      password: form.password,
    });
    if (res?.error) {
      setError(res.error || "Failed to sign in");
    } else {
      router.push("/"); // or /dashboard
    }
  }

  async function handleGoogle() {
    // redirect to Google provider
    await signIn("google", { callbackUrl: "/" });
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="max-w-md w-full bg-white p-6 rounded shadow"
      >
        <h2 className="text-2xl mb-4">Sign in</h2>

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
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded mb-2"
        >
          Sign in
        </button>

        <button
          type="button"
          onClick={handleGoogle}
          className="w-full py-2 border rounded"
        >
          Sign in with Google
        </button>
      </form>
    </div>
  );
}
