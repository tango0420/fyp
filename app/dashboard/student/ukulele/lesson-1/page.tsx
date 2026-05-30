"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";

export default function UkuleleLesson1() {
  const { data: session, status } = useSession();
  const [progressPercent, setProgressPercent] = useState(0);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      fetch(`/api/progress?userId=${encodeURIComponent(session.user.email)}`)
        .then(res => res.json())
        .then(data => {
          const completed = Array.isArray(data) ? data.filter((p: any) => p.completed).length : 0;
          setProgressPercent(Math.round((completed / 6) * 100));
        });
    }
  }, [status, session]);

  const markLessonComplete = async () => {
    if (status === "authenticated" && session?.user?.email) {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.email, lessonId: "ukulele-1" })
      });
    }
  };

  return (
    <div className=" bg-[#0d0d0d] text-slate-300 font-sans antialiased">
      <div className="fixed top-8 left-4 md:left-8 z-20">
        <Link href="/dashboard/student/ukulele" className="flex items-center gap-2 text-slate-400 hover:text-white bg-black/40 px-4 py-2 rounded-full border border-white/10 shadow-lg transition-all">
          <ArrowLeft size={18} />
          <span className="text-xs font-semibold uppercase tracking-widest">Back</span>
        </Link>
      </div>

      <main className="max-w-7xl mx-auto px-2 md:px-6 pt-32 pb-24">
        <header className="mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">Ukulele: Getting Started</h1>
          <p className="text-xl text-slate-400 leading-relaxed">In Lesson 1 you'll learn how to hold, tune and strum basic chords on a soprano/ concert ukulele.</p>
        </header>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">What you'll learn</h2>
          <ul className="list-inside space-y-2 text-slate-400">
            <li>Ukulele types and parts</li>
            <li>Standard tuning (GCEA) and tuning procedure</li>
            <li>Basic right-hand strumming pattern</li>
            <li>Three beginner chords: C, G, F</li>
          </ul>
        </section>

        <section className="mb-12 p-8 rounded-2xl bg-white/5 border border-white/10">
          <h3 className="text-xl font-semibold text-white mb-4">Step 1 — Hold & posture</h3>
          <p className="text-slate-400 mb-4">Sit upright, rest the body of the ukulele on your right thigh, keep the neck slightly angled up and support with the left hand near the headstock.</p>

          <h3 className="text-xl font-semibold text-white mb-4">Step 2 — Tune to GCEA</h3>
          <p className="text-slate-400 mb-4">Tune strings from top (closest to your face) to bottom: G (4th), C (3rd), E (2nd), A (1st). Use a tuner or the reference pitch A=440 on a piano.</p>

          <h3 className="text-xl font-semibold text-white mb-4">Step 3 — Basic strum</h3>
          <p className="text-slate-400 mb-4">Try a down-down-up-up-down pattern at a slow tempo (60 BPM). Keep the wrist loose and use the flesh of your index finger or thumb.</p>

          <h3 className="text-xl font-semibold text-white mb-4">Practice</h3>
          <ol className="list-decimal ml-5 text-slate-400 space-y-2">
            <li>5 minutes: tuning practice</li>
            <li>10 minutes: strumming with open strings</li>
            <li>10 minutes: switching between C and G</li>
          </ol>
        </section>

        <div className="flex items-center justify-between pt-6 border-t border-white/10 mb-4">
          <span className="text-sm text-slate-400">Progress: <span className="text-[#ff5a00] font-bold">{progressPercent}%</span></span>
        </div>

        <div className="flex justify-end">
          <Link href="/dashboard/student/ukulele/lesson-2" className="px-8 py-3 bg-[#ff5a00] text-white rounded-full hover:bg-white hover:text-black" onClick={markLessonComplete}>Continue to Lesson 2</Link>
        </div>
      </main>
    </div>
  );
}
