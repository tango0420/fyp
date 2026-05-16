"use client";

import React, { useState, Suspense } from "react";
import { signIn, useSession } from "next-auth/react";
import { Disc } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { FcGoogle } from "react-icons/fc";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Picks up ?callbackUrl= if sent from the landing page buttons
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

  React.useEffect(() => {
    if (status === "authenticated") {
      router.push(callbackUrl);
    }
  }, [status, router, callbackUrl]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    if (res?.ok) {
      router.push(callbackUrl);
    } else {
      setMessage("Invalid email or password.");
    }
  }

  return (
    <div className="bg-zinc-900/80 p-10 rounded-3xl shadow-2xl w-full max-w-md flex flex-col items-center z-10 mx-auto mt-24">

      {/* Logo */}
      <div className="flex items-center gap-2 mb-8">
        <div className="bg-orange-600 p-2 rounded-lg">
          <Disc size={22} className="text-black" strokeWidth={3} />
        </div>
        <span className="text-lg font-semibold tracking-tight uppercase italic text-white">Virtuoso.</span>
      </div>

      <h2 className="text-2xl font-bold mb-2 text-white">Log In</h2>
      <p className="text-white/40 text-xs text-center mb-6 leading-relaxed">
        Welcome back. Continue your musical journey.
      </p>

      {/* Email / Password */}
      <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          className="bg-zinc-800/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500 transition-colors"
          required
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          className="bg-zinc-800/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500 transition-colors"
          required
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest shadow-lg hover:from-orange-600 hover:to-orange-500 transition-all"
        >
          Log In
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 w-full my-5">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-white/20 text-xs uppercase tracking-widest">or</span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      {/* Google — passes callbackUrl so OAuth also lands on the right page */}
      <button
        onClick={() => signIn("google", { callbackUrl })}
        className="w-full flex items-center justify-center gap-3 bg-white text-black font-bold uppercase tracking-widest text-xs py-3 rounded-xl hover:bg-orange-100 transition-all shadow-sm"
      >
        <FcGoogle size={22} />
        Continue with Google
      </button>

      {message && (
        <p className="mt-4 text-orange-500 text-sm font-semibold text-center">{message}</p>
      )}

      <div className="mt-6 text-white/40 text-xs text-center space-y-2">
        <p>
          Don't have an account?{" "}
          <a
            href={`/signup?callbackUrl=${encodeURIComponent(callbackUrl)}`}
            className="text-orange-500 hover:underline"
          >
            Sign up free
          </a>
        </p>
        <p>
          <a href="/" className="text-white/30 hover:text-white/60 transition">
            ← Back to Home
          </a>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="relative min-h-screen w-full grain selection:bg-orange-500/30">
      {/* Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#121214]" />
        <img
          src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=2070&auto=format&fit=crop"
          alt="Studio Background"
          className="w-full h-full object-cover scale-105 blur-[2px] opacity-40"
        />
      </div>

      {/* Suspense is required by Next.js App Router when using useSearchParams */}
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </main>
  );
}