"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";

export default function CelloLesson4() {
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
        body: JSON.stringify({ userId: session.user.email, lessonId: "cello-4" })
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
          <h1 className="text-4xl font-bold text-white mb-6">Vibrato Techniques</h1>
          <p className="text-xl text-slate-400">
            Add warmth and expression to your tone by learning the fundamentals of cello vibrato.
          </p>
        </header>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">1. What Is Vibrato?</h2>
          <div className="space-y-4 text-slate-400 leading-relaxed">
            <p>Vibrato is a gentle oscillation in pitch that adds color and emotion to your sound. On the cello it is created by a controlled movement in the left hand and arm.</p>
            <p>It is not a finger shake; it is a smooth motion that expands and contracts the pitch slightly around the target note.</p>
          </div>
        </section>

        <section className="mb-12 p-8 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-2xl font-semibold text-white mb-4">2. Preparing the Left Hand</h2>
          <p className="text-slate-400 leading-relaxed mb-4">
            Keep your left hand flexible and your thumb relaxed. Place the finger firmly on the string while allowing the hand to rock slightly from the knuckle.
          </p>
          <p className="text-slate-400 leading-relaxed">
            Practice a small backward-forward motion with the first finger to feel the pulley-like movement in your hand.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">3. Vibrato Practice Exercises</h2>
          <div className="space-y-4 text-slate-400 leading-relaxed">
            <p>Start slowly on a single note. Use a metronome and count the beat as your hand oscillates, keeping the motion smooth.</p>
            <ul className="space-y-3 ml-4 list-disc">
              <li>Practice pulses: three slow waves, then four, then five.</li>
              <li>Keep the pressure consistent so the tone remains strong.</li>
              <li>Move to different strings once the motion feels comfortable.</li>
            </ul>
          </div>
        </section>

        <div className="flex items-center justify-between pt-6 border-t border-white/10 mb-4">
          <span className="text-sm text-slate-400">Progress: <span className="text-[#ff5a00] font-bold">{progressPercent}%</span></span>
        </div>

        <div className="flex justify-end gap-4">
          <Link
            href="/dashboard/student/cello/lesson-3"
            className="px-6 py-3 bg-white/5 text-white rounded-full border border-white/10 hover:border-[#ff5a00] transition-colors"
          >
            Previous Lesson
          </Link>
          <Link
            href="/dashboard/student/cello/lesson-5"
            className="px-8 py-3 bg-[#ff5a00] text-white rounded-full hover:bg-[#ff7a2a] font-semibold transition-colors"
            onClick={markLessonComplete}
          >
            Continue to Lesson 5
          </Link>
        </div>
      </main>
    </div>
  );
}
