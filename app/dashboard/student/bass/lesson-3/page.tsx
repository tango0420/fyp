"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";

export default function BassLesson3() {
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
        body: JSON.stringify({ userId: session.user.email, lessonId: "bass-3" }),
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
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Lesson 3: Basic Notes & Scales</h1>
          <p className="text-xl text-slate-400 leading-relaxed max-w-3xl">
            Learn the bass fretboard layout and practice fundamental scales that form the basis of bass playing.
          </p>
        </header>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">1. Fretboard Navigation</h2>
          <p className="text-slate-400 mb-4 leading-relaxed">
            The bass fretboard follows a logical pattern. Learn to find any note quickly.
          </p>
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10 text-slate-400 space-y-2">
            <p><strong className="text-white">String Tuning (Standard):</strong> E (thickest), A, D, G (thinnest)</p>
            <p><strong className="text-white">Fret Markers:</strong> Usually dots at 3, 5, 7, 9, 12 frets</p>
            <p><strong className="text-white">Fret 12:</strong> Octave above open string</p>
            <p><strong className="text-white">Pattern Repetition:</strong> Notes repeat every 12 frets</p>
          </div>
        </section>

        <section className="mb-12 p-8 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-2xl font-semibold text-white mb-4">2. Major Scale Exercise</h2>
          <p className="text-slate-400 mb-4">Practice the E major scale on a single string to develop finger strength and accuracy.</p>
          <div className="bg-black/40 p-4 rounded-lg text-center text-[#ff5a00] font-mono tracking-wider mb-4">
            E F# G# A B C# D# E
          </div>
          <ul className="text-slate-400 space-y-2">
            <li>• Start on open E string</li>
            <li>• Play each note with even tone</li>
            <li>• Practice slowly with metronome at 60 BPM</li>
            <li>• Gradually increase tempo</li>
          </ul>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-white mb-4">3. Reference Video</h2>
          <div className="flex justify-center">
            <div className="w-full max-w-3xl aspect-video rounded-xl border border-white/10 overflow-hidden">
              <iframe
                src="https://www.youtube.com/embed/n4Rse0p6jAM"
                title="Bass Scales and Notes"
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
          <Link href="/dashboard/student/bass/lesson-4" className="px-8 py-3 bg-[#ff5a00] text-white rounded-full hover:bg-white hover:text-black" onClick={markLessonComplete}>
            Continue to Lesson 4
          </Link>
        </div>
      </main>
    </div>
  );
}