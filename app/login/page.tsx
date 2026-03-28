"use client";
import React, { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { Disc } from "lucide-react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
const { data: session, status } = useSession();
  const router = useRouter();

  React.useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    if (res?.ok) {
      router.push("/dashboard");
    } else {
      setMessage("Invalid email or password.");
    }
  }

  return (
    <main className="relative min-h-screen w-full grain selection:bg-orange-500/30">
      {/* Background Video/Image Layer */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#121214]" />
        <img 
          src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=2070&auto=format&fit=crop" 
          alt="Studio Background"
          className="w-full h-full object-cover scale-105 blur-[2px] opacity-40"
        />
      </div>
      <div className="bg-zinc-900/80 p-10 rounded-3xl shadow-2xl w-full max-w-md flex flex-col items-center z-10 mx-auto mt-24">
        <div className="flex items-center gap-2 mb-8">
          <div className="bg-orange-600 p-2 rounded-lg">
            <Disc size={22} className="text-black" strokeWidth={3} />
          </div>
          <span className="text-lg font-semibold tracking-tight uppercase italic text-white">Virtuoso.</span>
        </div>
        <h2 className="text-2xl font-bold mb-4 text-white">Log In</h2>
        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            className="bg-zinc-800/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500"
            required
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            className="bg-zinc-800/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500"
            required
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest shadow-lg hover:from-orange-600 hover:to-orange-500 transition-all"
          >
            Log In
          </button>
        </form>
        <button
          onClick={() => signIn('google')}
          className="mt-6 flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-lg hover:bg-orange-100 transition-all"
          title="Sign in with Google"
        >
          <FcGoogle size={28} />
        </button>
        {message && <p className="mt-4 text-orange-500 text-sm font-semibold">{message}</p>}
        <div className="mt-6 text-white/60 text-xs">
          Don't have an account? <a href="/signup" className="text-orange-500 hover:underline">Sign Up</a>
        </div>
      </div>
    </main>
  );
}
