"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";

export default function CelloLesson3() {
  const { data: session, status } = useSession();
  const [progressPercent, setProgressPercent] = useState(0);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      fetch(`/api/progress?userId=${encodeURIComponent(session.user.email)}`)
        .then(res => res.json())
        .then(data => {
          const completed = Array.isArray(data) ? data.filter(p => p.completed).length : 0;
          setProgressPercent(Math.round((completed / 6) * 100));
        })
        .catch(() => setProgressPercent(0));
    }
  }, [status, session]);

  const markLessonComplete = async () => {
    if (status === "authenticated" && session?.user?.email) {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.email, lessonId: "cello-3" })
      });
    }
  };

  return (
    <div className="bg-[#0d0d0d] text-slate-300 font-sans antialiased">
      <div className="fixed top-8 left-4 md:left-8 z-20">
        <Link
          href="/dashboard/student/cello"
          className="flex items-center gap-2 text-slate-400 hover:text-white bg-black/40 px-4 py-2 rounded-full border border-white/10 shadow-lg transition-all"
        >
          <ArrowLeft size={18} />
          <span className="text-xs font-semibold uppercase tracking-widest">Back</span>
        </Link>
      </div>

      <main className="max-w-4xl mx-auto px-6 pt-32 pb-24">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-6">First Finger Positions</h1>
          <p className="text-xl text-slate-400">
            Learn where to place your fingers on the cello fingerboard and begin playing your first notes with accurate intonation.
          </p>
        </header>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">1. Left Hand Placement</h2>
          <div className="space-y-4 text-slate-400 leading-relaxed">
            <p>The left hand controls the pitch by pressing down the strings. Keep your wrist straight and your fingers curved.</p>
            <ul className="space-y-3 ml-4 list-disc">
              <li><strong>First finger:</strong> place gently on the string in the first position.</li>
              <li><strong>Second and third fingers:</strong> rest close to the string ready to move.</li>
              <li><strong>Thumb:</strong> stays behind the neck for support but does not squeeze.</li>
            </ul>
          </div>
        </section>

        <section className="mb-12 p-8 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-2xl font-semibold text-white mb-4">2. First Position Notes</h2>
          <p className="text-slate-400 leading-relaxed mb-4">
            In the first position, your first finger can play D on the A string, A on the D string, E on the G string, and G on the C string.
          </p>
          <p className="text-slate-400 leading-relaxed">
            Practice each note slowly, listening for clean intonation. Compare the open string and the stopped note to hear the difference.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">3. Simple Finger Exercises</h2>
          <div className="space-y-4 text-slate-400 leading-relaxed">
            <p>Practice sliding your first finger on each string to build confidence and find the correct pitch.</p>
            <ul className="space-y-3 ml-4 list-disc">
              <li>Play open string, then first finger note on the same string.</li>
              <li>Listen closely for smooth shifts and steady tone.</li>
              <li>Use slow, deliberate movement until your fingers feel comfortable.</li>
            </ul>
          </div>
        </section>

        <div className="flex items-center justify-between pt-6 border-t border-white/10 mb-4">
          <span className="text-sm text-slate-400">Progress: <span className="text-[#ff5a00] font-bold">{progressPercent}%</span></span>
        </div>

        <div className="flex justify-end gap-4">
          <Link
            href="/dashboard/student/cello/lesson-2"
            className="px-6 py-3 bg-white/5 text-white rounded-full border border-white/10 hover:border-[#ff5a00] transition-colors"
          >
            Previous Lesson
          </Link>
          <Link
            href="/dashboard/student/cello/lesson-4"
            className="px-8 py-3 bg-[#ff5a00] text-white rounded-full hover:bg-[#ff7a2a] font-semibold transition-colors"
            onClick={markLessonComplete}
          >
            Continue to Lesson 4
          </Link>
        </div>
      </main>
    </div>
  );
}
