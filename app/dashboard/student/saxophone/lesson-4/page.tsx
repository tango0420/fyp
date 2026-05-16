"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";

export default function SaxophoneLesson4() {
  const { data: session, status } = useSession();
  const [progressPercent, setProgressPercent] = useState(0);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      fetch(`/api/progress?userId=${encodeURIComponent(session.user.email)}`)
        .then((res) => res.json())
        .then((data) => {
          const completed = Array.isArray(data)
            ? data.filter((p) => p.completed && typeof p.lessonId === "string" && p.lessonId.startsWith("saxophone-")).length
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
        body: JSON.stringify({ userId: session.user.email, lessonId: "saxophone-4" }),
      });
    }
  };

  return (
    <div className="bg-[#0d0d0d] text-slate-300 font-sans antialiased min-h-screen">
      <div className="fixed top-8 left-4 md:left-8 z-20">
        <Link href="/dashboard/student/saxophone" className="flex items-center gap-2 text-slate-400 hover:text-white bg-black/40 px-4 py-2 rounded-full border border-white/10 shadow-lg transition-all">
          <ArrowLeft size={18} />
          <span className="text-xs font-semibold uppercase tracking-widest">Back</span>
        </Link>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-32 pb-24">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Lesson 4: Tone Production</h1>
          <p className="text-xl text-slate-400 leading-relaxed max-w-3xl">
            Develop a rich, warm saxophone tone through proper air support, embouchure control, and practice techniques.
          </p>
        </header>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">1. The Role of Air</h2>
          <p className="text-slate-400 mb-4 leading-relaxed">
            Air is the engine that drives the saxophone. Without proper air support, even perfect embouchure won't produce good tone.
          </p>
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10 space-y-4">
            <div>
              <p className="text-white font-semibold mb-2">Diaphragmatic Breathing</p>
              <p className="text-slate-400 text-sm">Breathe from your diaphragm (belly), not just your chest. This provides consistent air pressure.</p>
            </div>
            <div>
              <p className="text-white font-semibold mb-2">Air Speed</p>
              <p className="text-slate-400 text-sm">Faster air = higher notes. Slower air = lower notes. Central to pitch control.</p>
            </div>
            <div>
              <p className="text-white font-semibold mb-2">Consistent Pressure</p>
              <p className="text-slate-400 text-sm">Maintain steady air throughout the phrase. Sudden changes create tone variations.</p>
            </div>
            <div>
              <p className="text-white font-semibold mb-2">Warm Air</p>
              <p className="text-slate-400 text-sm">Think of directing warm, supported air through the reed for a full sound.</p>
            </div>
          </div>
        </section>

        <section className="mb-12 p-8 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-2xl font-semibold text-white mb-4">2. Tone Development Exercises</h2>
          <div className="space-y-4">
            <div className="bg-black/40 p-4 rounded-lg">
              <p className="text-white font-semibold mb-2">The Long Tone</p>
              <p className="text-slate-400 text-sm mb-2">Hold a single note (B or any comfortable note) for as long as possible with steady air and tone.</p>
              <p className="text-[#ff5a00] text-sm">Goal: 30+ seconds with no wavering</p>
            </div>
            <div className="bg-black/40 p-4 rounded-lg">
              <p className="text-white font-semibold mb-2">Crescendo-Decrescendo</p>
              <p className="text-slate-400 text-sm mb-2">Start soft, gradually get louder, then gradually get softer on one note.</p>
              <p className="text-[#ff5a00] text-sm">Develops control over air pressure and tone color</p>
            </div>
            <div className="bg-black/40 p-4 rounded-lg">
              <p className="text-white font-semibold mb-2">Note Bending</p>
              <p className="text-slate-400 text-sm mb-2">Slide between two notes by changing air speed and embouchure slightly.</p>
              <p className="text-[#ff5a00] text-sm">Improves tone flexibility and air control</p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">3. Common Tone Issues</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <p className="text-white font-semibold mb-2">Airy Tone</p>
              <p className="text-slate-400 text-sm">Too much air escapes. Close embouchure slightly and increase pressure on reed.</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <p className="text-white font-semibold mb-2">Honking/Brassy</p>
              <p className="text-slate-400 text-sm">Over-embouchure or improper reed. Relax slightly and check reed quality.</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <p className="text-white font-semibold mb-2">Thin Tone</p>
              <p className="text-slate-400 text-sm">Insufficient air support. Practice long tones with deeper diaphragm breathing.</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <p className="text-white font-semibold mb-2">Wavering Pitch</p>
              <p className="text-slate-400 text-sm">Unstable embouchure. Focus on firm corners and steady jaw position.</p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-white mb-4">5. Tone Production Video</h2>
          <div className="flex justify-center">
            <div className="w-full max-w-3xl aspect-video rounded-xl border border-white/10 overflow-hidden">
              <iframe
                src="https://www.youtube.com/embed/RzKl-HUlmWI"
                title="Saxophone Tone Production"
                allowFullScreen
                className="w-full h-full rounded-xl"
                style={{ minHeight: 315 }}
              />
            </div>
          </div>
        </section>

        <div className="flex items-center justify-between pt-6 border-t border-white/10 mb-4">
          <span className="text-sm text-slate-400">Progress: <span className="text-[#ff5a00] font-bold">{progressPercent}%</span></span>
        </div>

        <div className="flex justify-end">
          <Link href="/dashboard/student/saxophone/lesson-5" className="px-8 py-3 bg-[#ff5a00] text-white rounded-full hover:bg-white hover:text-black" onClick={markLessonComplete}>
            Continue to Lesson 5
          </Link>
        </div>
      </main>
    </div>
  );
}