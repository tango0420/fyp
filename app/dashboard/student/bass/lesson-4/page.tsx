"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";

export default function BassLesson4() {
  const { data: session, status } = useSession();
  const [progressPercent, setProgressPercent] = useState(0);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      fetch(`/api/progress?userId=${encodeURIComponent(session.user.email)}`)
        .then((res) => res.json())
        .then((data) => {
          const completed = Array.isArray(data)
            ? data.filter((p) => p.completed && typeof p.lessonId === "string" && p.lessonId.startsWith("bass-")).length
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
        body: JSON.stringify({ userId: session.user.email, lessonId: "bass-4" }),
      });
    }
  };

  return (
    <div className="bg-[#0d0d0d] text-slate-300 font-sans antialiased min-h-screen">
      <div className="fixed top-8 left-4 md:left-8 z-20">
        <Link href="/dashboard/student/bass" className="flex items-center gap-2 text-slate-400 hover:text-white bg-black/40 px-4 py-2 rounded-full border border-white/10 shadow-lg transition-all">
          <ArrowLeft size={18} />
          <span className="text-xs font-semibold uppercase tracking-widest">Back</span>
        </Link>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-32 pb-24">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Lesson 4: Tab & Notation</h1>
          <p className="text-xl text-slate-400 leading-relaxed max-w-3xl">
            Master bass tablature and standard notation to read and learn songs efficiently.
          </p>
        </header>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">1. Understanding Bass Tab</h2>
          <p className="text-slate-400 mb-4 leading-relaxed">
            Bass tab is simpler than standard notation and shows exactly where to play each note.
          </p>
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10 text-slate-400 space-y-3">
            <p><strong className="text-white">Four Lines:</strong> Represent the 4 bass strings (G, D, A, E from top to bottom)</p>
            <p><strong className="text-white">Numbers:</strong> Show which fret to play</p>
            <p><strong className="text-white">Horizontal Order:</strong> Read left to right, just like reading</p>
            <p><strong className="text-white">Vertical Alignment:</strong> Numbers on same vertical position = play together</p>
          </div>
        </section>

        <section className="mb-12 p-8 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-2xl font-semibold text-white mb-4">2. Tab Reading Example</h2>
          <p className="text-slate-400 mb-4">Here's a simple 8-bar exercise in tab format:</p>
          <div className="bg-black/40 p-4 rounded-lg text-mono text-[#ff5a00] text-sm leading-relaxed font-mono overflow-x-auto">
            {`G|---2---2---0---0---
D|---2---2---0---0---
A|-0---0---3---3-----
E|-3---3---5---5-----`}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">3. Standard Notation Basics</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <p className="text-white font-semibold mb-2">Note Values</p>
              <ul className="text-slate-400 space-y-1 text-sm">
                <li>• Whole Note = 4 beats</li>
                <li>• Half Note = 2 beats</li>
                <li>• Quarter Note = 1 beat</li>
                <li>• Eighth Note = 1/2 beat</li>
              </ul>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <p className="text-white font-semibold mb-2">Staff Position</p>
              <ul className="text-slate-400 space-y-1 text-sm">
                <li>• Bass clef = deeper notes</li>
                <li>• 5 lines + spaces</li>
                <li>• Ledger lines extend range</li>
                <li>• Treble clef = higher notes</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-white mb-4">4. Reference Video</h2>
          <div className="flex justify-center">
            <div className="w-full max-w-3xl aspect-video rounded-xl border border-white/10 overflow-hidden">
              <iframe
                src="https://www.youtube.com/embed/6L1mZW7ynqg"
                title="Bass Tab and Notation"
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
          <Link href="/dashboard/student/bass/lesson-5" className="px-8 py-3 bg-[#ff5a00] text-white rounded-full hover:bg-white hover:text-black" onClick={markLessonComplete}>
            Continue to Lesson 5
          </Link>
        </div>
      </main>
    </div>
  );
}