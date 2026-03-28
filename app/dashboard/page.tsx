"use client";

import React, { useEffect } from "react";
import { Disc } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";


export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      fetch("/api/get-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session.user.email }),
      })
        .then(res => res.json())
        .then(data => {
          if (!data.role) {
            router.push("/choose-role");
          } else if (data.role === "student") {
            router.push("/dashboard/student");
          } else if (data.role === "teacher") {
            router.push("/dashboard/teacher");
          }
        });
    }
  }, [status, session, router]);

  return (
    <main className="relative min-h-screen w-full grain selection:bg-orange-500/30 flex flex-col items-center justify-center">
      {/* Background Video/Image Layer */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#121214]" />
        <img 
          src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=2070&auto=format&fit=crop" 
          alt="Studio Background"
          className="w-full h-full object-cover scale-105 blur-[2px] opacity-40"
        />
      </div>
      <div className="bg-zinc-900/80 p-10 rounded-3xl shadow-2xl w-full max-w-xl flex flex-col items-center z-10 mx-auto mt-24">
        <div className="flex items-center gap-2 mb-8">
          <div className="bg-orange-600 p-2 rounded-lg">
            <Disc size={22} className="text-black" strokeWidth={3} />
          </div>
          <span className="text-lg font-semibold tracking-tight uppercase italic text-white">Virtuoso.</span>
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">Welcome to your Dashboard!</h1>
        <p className="text-white/70 text-lg">You have successfully logged in.</p>
      </div>
    </main>
  );
}
