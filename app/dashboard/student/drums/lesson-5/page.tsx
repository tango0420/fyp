"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";

interface ProgressRecord {
  lessonId?: string;
  completed?: boolean;
}

export default function DrumLesson5() {
  const { data: session, status } = useSession();
  const [progressPercent, setProgressPercent] = useState(0);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      fetch(`/api/progress?userId=${encodeURIComponent(session.user.email)}`)
        .then((res) => res.json())
        .then((data: ProgressRecord[]) => {
          const completed = Array.isArray(data)
            ? data.filter((p: ProgressRecord) => p.completed && typeof p.lessonId === "string" && p.lessonId.startsWith("drums-")).length
            : 0;
          setProgressPercent(Math.round((completed / 6) * 100));
        });
    }
  }, [status, session]);

  const markLessonComplete = async () => {
    if (status === "authenticated" && session?.user?.email) {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.email, lessonId: "drums-5" }),
      });
    }
  };

  return (
    <div className="bg-[#0d0d0d] text-slate-300 font-sans antialiased min-h-screen">
      <div className="fixed top-8 left-4 md:left-8 z-20">
        <Link href="/dashboard/student/drums" className="flex items-center gap-2 text-slate-400 hover:text-white bg-black/40 px-4 py-2 rounded-full border border-white/10 shadow-lg transition-all">
          <ArrowLeft size={18} />
          <span className="text-xs font-semibold uppercase tracking-widest">Back</span>
        </Link>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-32 pb-24">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Lesson 5: Fills, Dynamics & Transitions</h1>
          <p className="text-xl text-slate-400 leading-relaxed max-w-3xl">
            Grooves keep the song moving, but fills create excitement. In this lesson you will learn how to move around the kit without losing time.
          </p>
        </header>

        <section className="mb-12">
          <h2 className="text-2xl text-white mb-4">1. What Makes a Good Fill?</h2>
          <p className="text-slate-400 leading-relaxed mb-4">
            A good fill connects one phrase to the next. It should feel musical, stay in time, and bring you back to the groove cleanly on beat 1.
          </p>
          <div className="bg-white/5 rounded-xl p-6 text-slate-400 space-y-2">
            <p>• Keep it short and intentional</p>
            <p>• Leave space instead of overplaying</p>
            <p>• Always land back on the groove with confidence</p>
          </div>
        </section>

        <section className="mb-12 p-8 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-2xl text-white mb-4">2. Two-Beat Fill Exercise</h2>
          <div className="bg-black/40 p-6 rounded-xl text-[#ff5a00] font-mono text-center mb-4">
            Groove for 2 bars → Fill on beats 3 and 4 → Return to beat 1
          </div>
          <p className="text-slate-400">
            Start with single strokes around the snare and toms. Prioritize timing more than complexity.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl text-white mb-4">3. Dynamics Matter</h2>
          <ul className="list-disc list-inside text-slate-400 space-y-2">
            <li>Use softer ghost notes for texture.</li>
            <li>Accent key beats to create shape.</li>
            <li>Not every fill should be loud — contrast is musical.</li>
          </ul>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl text-white mb-4">4. Guided Practice</h2>
          <div className="flex justify-center">
            <div className="w-full max-w-3xl aspect-video rounded-xl border border-white/10 overflow-hidden">
              <iframe
                src="https://www.youtube.com/embed/FqJdzYY_Fas"
                title="Drum Fills for Beginners"
                allowFullScreen
                className="w-full h-full rounded-xl"
                style={{ minHeight: 315 }}
              />
            </div>
          </div>
          <p className="text-sm text-slate-400 text-center mt-6 max-w-2xl mx-auto">
            Practice one fill at a time and loop it slowly with a metronome before adding more notes.
          </p>
        </section>

        <div className="flex items-center justify-between pt-6 border-t border-white/10 mb-4">
          <span className="text-sm text-slate-400">Progress: <span className="text-[#ff5a00] font-bold">{progressPercent}%</span></span>
        </div>

        <div className="flex justify-end">
          <Link href="/dashboard/student/drums/lesson-6" className="px-8 py-3 bg-[#ff5a00] text-white rounded-full hover:bg-white hover:text-black" onClick={markLessonComplete}>
            Continue to Lesson 6
          </Link>
        </div>
      </main>
    </div>
  );
}
