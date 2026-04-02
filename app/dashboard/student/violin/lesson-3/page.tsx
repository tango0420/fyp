"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";

interface ProgressRecord {
  lessonId?: string;
  completed?: boolean;
}

export default function ViolinLesson3() {
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
        body: JSON.stringify({ userId: session.user.email, lessonId: "violin-3" }),
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
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Lesson 3: First Finger Notes</h1>
          <p className="text-xl text-slate-400 leading-relaxed max-w-3xl">
            Start placing your fingers on the A and D strings and learn how tiny changes in placement affect pitch.
          </p>
        </header>

        <section className="mb-12">
          <h2 className="text-2xl text-white mb-4">1. Finger Pattern</h2>
          <div className="bg-black/40 p-6 rounded-xl text-[#ff5a00] font-mono text-center text-lg tracking-[0.3em] mb-4">
            Open - 1 - 2 - 3
          </div>
          <p className="text-slate-400">This pattern helps you understand how notes climb one step at a time on the same string.</p>
        </section>

        <section className="mb-12 p-8 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-2xl text-white mb-4">2. Left Hand Shape</h2>
          <ul className="list-disc list-inside text-slate-400 space-y-2">
            <li>Keep the wrist straight and relaxed.</li>
            <li>Drop the fingers from above instead of squeezing sideways.</li>
            <li>Use the fingertip, not the flat pad.</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl text-white mb-4">3. Practice on A String</h2>
          <div className="bg-white/5 rounded-xl p-6 text-slate-400 space-y-2">
            <p>Open A</p>
            <p>1st finger = B</p>
            <p>2nd finger = C♯ or C natural depending on pattern</p>
            <p>3rd finger = D</p>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl text-white mb-4">4. Video Reference</h2>
          <div className="flex justify-center">
            <div className="w-full max-w-3xl aspect-video rounded-xl border border-white/10 overflow-hidden">
              <iframe src="https://www.youtube.com/embed/U8BfYQxSx6Q" title="First finger notes violin" allowFullScreen className="w-full h-full rounded-xl" style={{ minHeight: 315 }} />
            </div>
          </div>
        </section>

        <div className="flex items-center justify-between pt-6 border-t border-white/10 mb-4">
          <span className="text-sm text-slate-400">Progress: <span className="text-[#ff5a00] font-bold">{progressPercent}%</span></span>
        </div>
        <div className="flex justify-end">
          <Link href="/dashboard/student/violin/lesson-4" className="px-8 py-3 bg-[#ff5a00] text-white rounded-full hover:bg-white hover:text-black" onClick={markLessonComplete}>
            Continue to Lesson 4
          </Link>
        </div>
      </main>
    </div>
  );
}
