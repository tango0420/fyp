"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";

export default function Lesson1() {
  const [progress, setProgress] = useState(0);
  const { data: session, status } = useSession();
  const [progressPercent, setProgressPercent] = useState(0);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      fetch(`/api/progress?userId=${encodeURIComponent(session.user.email)}`)
        .then(res => res.json())
        .then(data => {
          const completed = Array.isArray(data) ? data.filter(p => p.completed).length : 0;
          setProgressPercent(Math.round((completed / 4) * 100));
        });
    }
  }, [status, session]);

  const markLessonComplete = async () => {
    if (status === "authenticated" && session?.user?.email) {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.email, lessonId: "1" })
      });
    }
  };

  return (
    <div className=" bg-[#0d0d0d] text-slate-300 font-sans antialiased">
      {/* Back Button - Positioned consistently */}
      <div className="fixed top-8 left-4 md:left-8 z-20">
        <Link 
          href="/dashboard/student/guitar" 
          className="flex items-center gap-2 text-slate-400 hover:text-white bg-black/40 px-4 py-2 rounded-full border border-white/10 shadow-lg transition-all"
        >
          <ArrowLeft size={18} />
          <span className="text-xs font-semibold uppercase tracking-widest">Back</span>
        </Link>
      </div>

      <main className="max-w-7xl mx-auto px-2 md:px-6 pt-32 pb-24">
        {/* Header Section */}
        <header className="mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            Introduction to Guitar
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed">
            Welcome to your first guitar lesson! In this module, we will explore the mechanics of vibration, posture, and the logic of the musical grid.
          </p>
        </header>

        {/* 1.1 Anatomy & Physics */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">1.1 The Anatomy of Vibration</h2>
          <div className="space-y-4 text-slate-400 leading-relaxed">
            <p>
              The guitar is a system of <strong>tension and resonance</strong>. Sound begins at the <span className="text-white">Bridge</span> and ends at the <span className="text-white">Nut</span>. The distance between them is the &quot;Scale Length.&quot;
            </p>
            <p>
              When you press a string against a metal Fret, you are mathematically shortening the string. A shorter string vibrates faster, creating a higher pitch.
            </p>
          </div>
        </section>

        {/* 1.2 Ergonomics */}
        <section className="mb-12 p-8 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-2xl font-semibold text-white mb-4">1.2 The &quot;C-Shape&quot; Ergonomics</h2>
          <p className="mb-6 text-slate-400 leading-relaxed">
            Posture is the difference between a hobby and a chronic injury. We utilize the <strong>Tripod Method</strong>:
          </p>
          <ul className="space-y-3 text-slate-400">
            <li className="flex gap-3"><span className="text-[#ff5a00] font-bold">01.</span> The curve sits on your right thigh.</li>
            <li className="flex gap-3"><span className="text-[#ff5a00] font-bold">02.</span> The back rests against your chest.</li>
            <li className="flex gap-3"><span className="text-[#ff5a00] font-bold">03.</span> Your forearm stabilizes the upper body curve.</li>
          </ul>
        </section>

        {/* 1.3 The Grid Logic */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">1.3 The Logic of the Grid</h2>
          <p className="text-slate-400 leading-relaxed mb-4">
            The guitar is tuned to <strong>Perfect Fourths</strong>, with one critical &quot;glitch&quot; that makes chords possible:
          </p>
          <div className="bg-black/40 p-6 rounded-xl border border-white/5 font-mono text-[#ff5a00] text-center text-xl tracking-[0.5em]">
            E - A - D - G - B - E
          </div>
          <p className="mt-4 text-sm text-slate-500 italic">
            Note: The G to B strings are only 4 half-steps apart (a Major Third), allowing your fingers to reach full 6-string chords.
          </p>
        </section>

        {/* 1.4 The 12-Note Alphabet */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-white mb-4">1.4 The Universal Alphabet</h2>
          <p className="text-slate-400 leading-relaxed">
            At the <strong>12th fret</strong> (marked by two dots), the string is exactly half its length, creating a perfect Octave where the alphabet starts over.
          </p>
        </section>

        {/* Progress UI */}
        <div className="flex items-center justify-between pt-6 border-t border-white/10 mb-4">
          <span className="text-sm text-slate-400">Progress: <span className="text-[#ff5a00] font-bold">{progressPercent}%</span></span>
        </div>
        {/* Footer Navigation */}
        <div className="flex justify-end">
          <Link
            href="/dashboard/student/guitar/lesson-2"
            className="px-8 py-3 bg-[#ff5a00] text-white rounded-full hover:bg-white hover:text-black"
            onClick={markLessonComplete}
          >
            Continue to Lesson 2
          </Link>
        </div>
      </main>
    </div>
  );
}