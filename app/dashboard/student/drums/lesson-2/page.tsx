"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";

interface ProgressRecord {
  lessonId?: string;
  completed?: boolean;
}

export default function DrumLesson2() {
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
        body: JSON.stringify({ userId: session.user.email, lessonId: "drums-2" }),
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
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Lesson 2: The Basic 4/4 Groove</h1>
          <p className="text-xl text-slate-400 leading-relaxed max-w-3xl">
            This is the first real groove every drummer should master. It teaches time, coordination, and control.
          </p>
        </header>

        <section className="mb-12">
          <h2 className="text-2xl text-white mb-4">1. Count the Beat</h2>
          <div className="bg-black/40 p-6 rounded-xl text-center text-[#ff5a00] font-mono text-xl tracking-[0.35em] mb-4">
            1 &nbsp; 2 &nbsp; 3 &nbsp; 4
          </div>
          <p className="text-slate-400">Always count out loud at first. Strong drummers develop their internal clock before they develop speed.</p>
        </section>

        <section className="mb-12 p-8 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-2xl text-white mb-4">2. Build the Groove Layer by Layer</h2>
          <ul className="list-disc list-inside text-slate-400 space-y-2">
            <li><strong className="text-white">Hi-hat:</strong> play steady eighth notes</li>
            <li><strong className="text-white">Snare:</strong> strike on beats 2 and 4</li>
            <li><strong className="text-white">Kick:</strong> play on beats 1 and 3</li>
          </ul>
          <div className="mt-6 bg-black/40 p-6 rounded-xl font-mono text-[#ff5a00] text-center">
            HH: 1 & 2 & 3 & 4 &nbsp; | &nbsp; SN: 2, 4 &nbsp; | &nbsp; K: 1, 3
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl text-white mb-4">3. Common Problems</h2>
          <div className="grid md:grid-cols-2 gap-4 text-slate-400">
            <div className="bg-white/5 rounded-xl p-4">Rushing the hi-hat when the kick enters</div>
            <div className="bg-white/5 rounded-xl p-4">Hitting the snare too hard and losing balance</div>
            <div className="bg-white/5 rounded-xl p-4">Forgetting to count aloud</div>
            <div className="bg-white/5 rounded-xl p-4">Trying to go fast before the groove is steady</div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl text-white mb-4">4. Practice Routine</h2>
          <ul className="list-disc list-inside text-slate-400 space-y-2 mb-6">
            <li>Set a metronome to 60 BPM.</li>
            <li>Play the groove for 2 minutes without stopping.</li>
            <li>Only raise the tempo when the beat feels relaxed and even.</li>
          </ul>
          <div className="flex justify-center">
            <div className="w-full max-w-3xl aspect-video rounded-xl border border-white/10 overflow-hidden">
              <iframe
                src="https://www.youtube.com/embed/wI5hf6vJVEs"
                title="Basic 4/4 Drum Beat"
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
          <Link href="/dashboard/student/drums/lesson-3" className="px-8 py-3 bg-[#ff5a00] text-white rounded-full hover:bg-white hover:text-black" onClick={markLessonComplete}>
            Continue to Lesson 3
          </Link>
        </div>
      </main>
    </div>
  );
}
