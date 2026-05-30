"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";

export default function Lesson1() {
  const { data: session, status } = useSession();
  const [progressPercent, setProgressPercent] = useState(0);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      fetch(`/api/progress?userId=${encodeURIComponent(session.user.email)}`)
        .then(res => res.json())
        .then(data => {
          const completed = Array.isArray(data) ? data.filter(p => p.completed).length : 0;
          setProgressPercent(Math.round((completed / 6) * 100));
        });
    }
  }, [status, session]);

  const markLessonComplete = async () => {
    if (status === "authenticated" && session?.user?.email) {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.email, lessonId: "trumpet-1" })
      });
    }
  };

  return (
    <div className="bg-[#0d0d0d] text-slate-300 font-sans antialiased">
      <div className="fixed top-8 left-4 md:left-8 z-20">
        <Link 
          href="/dashboard/student/trumpet" 
          className="flex items-center gap-2 text-slate-400 hover:text-white bg-black/40 px-4 py-2 rounded-full border border-white/10 shadow-lg transition-all"
        >
          <ArrowLeft size={18} />
          <span className="text-xs font-semibold uppercase tracking-widest">Back</span>
        </Link>
      </div>

      <main className="max-w-4xl mx-auto px-6 pt-32 pb-24">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-6">Introduction to Trumpet</h1>
          <p className="text-xl text-slate-400">
            Welcome to your first trumpet lesson! Let's explore the instrument, understand its mechanics, and prepare you for your first sounds.
          </p>
        </header>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">1.1 The Anatomy of the Trumpet</h2>
          <div className="space-y-4 text-slate-400 leading-relaxed">
            <p>
              The trumpet is a brass instrument consisting of three main parts:
            </p>
            <ul className="space-y-3 ml-4">
              <li className="flex gap-3"><span className="text-[#ff5a00] font-bold">•</span> <span><strong>The Mouthpiece:</strong> Where your lips vibrate to create sound</span></li>
              <li className="flex gap-3"><span className="text-[#ff5a00] font-bold">•</span> <span><strong>The Valves:</strong> Three pistons that change the pitch of the sound</span></li>
              <li className="flex gap-3"><span className="text-[#ff5a00] font-bold">•</span> <span><strong>The Bell:</strong> The flared end that projects the sound</span></li>
            </ul>
          </div>
        </section>

        <section className="mb-12 p-8 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-2xl font-semibold text-white mb-4">1.2 How Sound Is Produced</h2>
          <p className="mb-6 text-slate-400 leading-relaxed">
            Unlike woodwind instruments, the trumpet produces sound through vibrating lips:
          </p>
          <ol className="space-y-3 text-slate-400">
            <li className="flex gap-3"><span className="text-[#ff5a00] font-bold">1.</span> <span>Air passes through your closed lips at high speed</span></li>
            <li className="flex gap-3"><span className="text-[#ff5a00] font-bold">2.</span> <span>Your lips vibrate, creating a buzzing sound</span></li>
            <li className="flex gap-3"><span className="text-[#ff5a00] font-bold">3.</span> <span>This buzzing is amplified through the instrument</span></li>
            <li className="flex gap-3"><span className="text-[#ff5a00] font-bold">4.</span> <span>The valves direct air through different tubing lengths for pitch control</span></li>
          </ol>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">1.3 Holding the Trumpet</h2>
          <div className="space-y-4 text-slate-400 leading-relaxed">
            <p>
              Proper posture and grip are essential for sound production and comfort:
            </p>
            <ul className="space-y-3 ml-4">
              <li className="flex gap-3"><span className="text-[#ff5a00] font-bold">•</span> <span>Hold the trumpet at a slight angle upward</span></li>
              <li className="flex gap-3"><span className="text-[#ff5a00] font-bold">•</span> <span>Keep your right hand relaxed on the valves</span></li>
              <li className="flex gap-3"><span className="text-[#ff5a00] font-bold">•</span> <span>Rest the bell on your left hand for support</span></li>
              <li className="flex gap-3"><span className="text-[#ff5a00] font-bold">•</span> <span>Keep your shoulders relaxed and your posture straight</span></li>
            </ul>
          </div>
        </section>

        <section className="mb-12 p-8 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-2xl font-semibold text-white mb-4">1.4 First Steps: Producing Your First Buzz</h2>
          <p className="mb-4 text-slate-400 leading-relaxed">
            Before playing notes, we focus on the fundamental buzz:
          </p>
          <p className="text-slate-400 leading-relaxed">
            Purse your lips together and blow air while making them vibrate, similar to a motorboat sound. This is your first trumpet "buzz." Practice this without the mouthpiece until you can produce a steady tone.
          </p>
        </section>

        <div className="flex items-center justify-between pt-6 border-t border-white/10 mb-4">
          <span className="text-sm text-slate-400">Progress: <span className="text-[#ff5a00] font-bold">{progressPercent}%</span></span>
        </div>

        <div className="flex justify-end">
          <Link
            href="/dashboard/student/trumpet/lesson-2"
            className="px-8 py-3 bg-[#ff5a00] text-white rounded-full hover:bg-[#ff7a2a] font-semibold transition-colors"
            onClick={markLessonComplete}
          >
            Continue to Lesson 2
          </Link>
        </div>
      </main>
    </div>
  );
}
