"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";

interface ProgressRecord {
  lessonId?: string;
  completed?: boolean;
}

export default function ViolinLesson1() {
  const { data: session, status } = useSession();
  const [progressPercent, setProgressPercent] = useState(0);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      fetch(`/api/progress?userId=${encodeURIComponent(session.user.email)}`)
        .then((res) => res.json())
        .then((data: ProgressRecord[]) => {
          const completed = Array.isArray(data)
            ? data.filter((p: ProgressRecord) => p.completed && typeof p.lessonId === "string" && p.lessonId.startsWith("violin-")).length
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
        body: JSON.stringify({ userId: session.user.email, lessonId: "violin-1" }),
      });
    }
  };

  return (
    <div className="bg-[#0d0d0d] text-slate-300 font-sans antialiased min-h-screen">
      <div className="fixed top-8 left-4 md:left-8 z-20">
        <Link href="/dashboard/student/violin" className="flex items-center gap-2 text-slate-400 hover:text-white bg-black/40 px-4 py-2 rounded-full border border-white/10 shadow-lg transition-all">
          <ArrowLeft size={18} />
          <span className="text-xs font-semibold uppercase tracking-widest">Back</span>
        </Link>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-32 pb-24">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Lesson 1: Violin Anatomy & Posture</h1>
          <p className="text-xl text-slate-400 leading-relaxed max-w-3xl">
            Learn the parts of the instrument, how to hold it naturally, and how posture shapes your tone from the very first note.
          </p>
        </header>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">1. Parts of the Violin</h2>
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10 text-slate-400 space-y-2">
            <p><strong className="text-white">Scroll & Pegs:</strong> used for tuning.</p>
            <p><strong className="text-white">Fingerboard:</strong> where your left hand places notes.</p>
            <p><strong className="text-white">Bridge:</strong> transfers the string vibration to the body.</p>
            <p><strong className="text-white">Chin Rest:</strong> helps support the violin comfortably.</p>
          </div>
        </section>

        <section className="mb-12 p-8 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-2xl font-semibold text-white mb-4">2. Standing and Holding Position</h2>
          <ul className="list-disc list-inside text-slate-400 space-y-2">
            <li>Stand or sit tall with relaxed shoulders.</li>
            <li>Rest the violin between your jaw and collarbone.</li>
            <li>Keep the instrument level, not dropping toward the floor.</li>
            <li>Let the left hand guide, but not squeeze, the neck.</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">3. First Comfort Check</h2>
          <p className="text-slate-400 leading-relaxed mb-4">
            Good violin playing begins with ease. If your neck, shoulders, or wrist feel tense, reset your posture before continuing.
          </p>
          <div className="bg-black/40 p-6 rounded-xl text-[#ff5a00] font-mono text-center">Tall posture • relaxed shoulders • level violin</div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-white mb-4">4. Reference Video</h2>
          <div className="flex justify-center">
            <div className="w-full max-w-3xl aspect-video rounded-xl border border-white/10 overflow-hidden">
              <iframe src="https://www.youtube.com/embed/Tnkhp6jLkMw" title="Violin posture lesson" allowFullScreen className="w-full h-full rounded-xl" style={{ minHeight: 315 }} />
            </div>
          </div>
        </section>

        <div className="flex items-center justify-between pt-6 border-t border-white/10 mb-4">
          <span className="text-sm text-slate-400">Progress: <span className="text-[#ff5a00] font-bold">{progressPercent}%</span></span>
        </div>
        <div className="flex justify-end">
          <Link href="/dashboard/student/violin/lesson-2" className="px-8 py-3 bg-[#ff5a00] text-white rounded-full hover:bg-white hover:text-black" onClick={markLessonComplete}>
            Continue to Lesson 2
          </Link>
        </div>
      </main>
    </div>
  );
}
