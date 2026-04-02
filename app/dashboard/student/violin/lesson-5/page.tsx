"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";

interface ProgressRecord {
  lessonId?: string;
  completed?: boolean;
}

export default function ViolinLesson5() {
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
        body: JSON.stringify({ userId: session.user.email, lessonId: "violin-5" }),
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
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Lesson 5: Intonation & Ear Training</h1>
          <p className="text-xl text-slate-400 leading-relaxed max-w-3xl">
            Violinists must constantly adjust pitch by ear. This lesson helps you hear when a note is too high or too low and fix it smoothly.
          </p>
        </header>

        <section className="mb-12 p-8 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-2xl text-white mb-4">1. What Is Intonation?</h2>
          <p className="text-slate-400 leading-relaxed">
            Intonation is the accuracy of your pitch. Because the violin has no frets, your ear must guide your finger placement precisely.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl text-white mb-4">2. Ways to Train Your Ear</h2>
          <ul className="list-disc list-inside text-slate-400 space-y-2">
            <li>Match open strings against fingered notes.</li>
            <li>Use a drone note or tuner for reference.</li>
            <li>Sing the pitch before you play it.</li>
            <li>Move slowly and listen actively to every note.</li>
          </ul>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl text-white mb-4">3. Listening Practice</h2>
          <div className="bg-black/40 p-6 rounded-xl text-[#ff5a00] font-mono text-center mb-4">
            Play → Listen → Adjust → Repeat
          </div>
          <p className="text-slate-400 mb-6">
            Hold each note long enough to hear whether it settles into tune. Tiny finger movements make a big difference.
          </p>
          <div className="flex justify-center">
            <div className="w-full max-w-3xl aspect-video rounded-xl border border-white/10 overflow-hidden">
              <iframe src="https://www.youtube.com/embed/4X5wQYV9t8Y" title="Violin intonation lesson" allowFullScreen className="w-full h-full rounded-xl" style={{ minHeight: 315 }} />
            </div>
          </div>
        </section>

        <div className="flex items-center justify-between pt-6 border-t border-white/10 mb-4">
          <span className="text-sm text-slate-400">Progress: <span className="text-[#ff5a00] font-bold">{progressPercent}%</span></span>
        </div>
        <div className="flex justify-end">
          <Link href="/dashboard/student/violin/lesson-6" className="px-8 py-3 bg-[#ff5a00] text-white rounded-full hover:bg-white hover:text-black" onClick={markLessonComplete}>
            Continue to Lesson 6
          </Link>
        </div>
      </main>
    </div>
  );
}
