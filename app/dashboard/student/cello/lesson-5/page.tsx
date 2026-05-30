"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";

export default function CelloLesson5() {
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
        body: JSON.stringify({ userId: session.user.email, lessonId: "cello-5" })
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
          <h1 className="text-4xl font-bold text-white mb-6">Classical Repertoire</h1>
          <p className="text-xl text-slate-400">
            Explore beginner-friendly classical cello pieces and learn how to practice musical phrasing with intention.
          </p>
        </header>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">1. Piece Selection</h2>
          <div className="space-y-4 text-slate-400 leading-relaxed">
            <p>Choose simple classical pieces that focus on open strings and first-position fingerings. Good options include easy Bach melodies, folk tunes, and beginner etudes.</p>
            <p>Start with short phrases and gradually connect them into longer lines as you gain confidence.</p>
          </div>
        </section>

        <section className="mb-12 p-8 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-2xl font-semibold text-white mb-4">2. Practicing with Expression</h2>
          <p className="text-slate-400 leading-relaxed mb-4">
            Pay attention to dynamics, bow speed, and phrasing. Use slight changes in bow pressure and speed to make each phrase sing.
          </p>
          <p className="text-slate-400 leading-relaxed">
            Mark the score with crescendos, decrescendos, and breathing points. This will help you shape the music like a real performer.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">3. Practice Strategies</h2>
          <div className="space-y-4 text-slate-400 leading-relaxed">
            <ul className="space-y-3 ml-4 list-disc">
              <li><strong>Slow practice:</strong> play each phrase slowly and accurately before increasing speed.</li>
              <li><strong>Hands separately:</strong> practice left-hand fingerings without bowing, then bowing open strings.</li>
              <li><strong>Small sections:</strong> break the piece into manageable parts and master each one.</li>
            </ul>
            <p>These methods help you build a solid musical foundation and reduce tension.</p>
          </div>
        </section>

        <div className="flex items-center justify-between pt-6 border-t border-white/10 mb-4">
          <span className="text-sm text-slate-400">Progress: <span className="text-[#ff5a00] font-bold">{progressPercent}%</span></span>
        </div>

        <div className="flex justify-end gap-4">
          <Link
            href="/dashboard/student/cello/lesson-4"
            className="px-6 py-3 bg-white/5 text-white rounded-full border border-white/10 hover:border-[#ff5a00] transition-colors"
          >
            Previous Lesson
          </Link>
          <Link
            href="/dashboard/student/cello/lesson-6"
            className="px-8 py-3 bg-[#ff5a00] text-white rounded-full hover:bg-[#ff7a2a] font-semibold transition-colors"
            onClick={markLessonComplete}
          >
            Continue to Lesson 6
          </Link>
        </div>
      </main>
    </div>
  );
}
