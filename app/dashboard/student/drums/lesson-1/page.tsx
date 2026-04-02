"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";

interface ProgressRecord {
  lessonId?: string;
  completed?: boolean;
}

export default function DrumLesson1() {
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
        body: JSON.stringify({ userId: session.user.email, lessonId: "drums-1" }),
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
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Lesson 1: Drum Kit Anatomy & Grip</h1>
          <p className="text-xl text-slate-400 leading-relaxed max-w-3xl">
            Before playing grooves, you need to understand the kit layout, how to hold the sticks, and how rebound works.
          </p>
        </header>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">1. Know the Drum Kit</h2>
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10 text-slate-400 space-y-2">
            <p><strong className="text-white">Kick Drum:</strong> your low-end pulse, played with the foot.</p>
            <p><strong className="text-white">Snare:</strong> the sharp backbeat, usually on counts 2 and 4.</p>
            <p><strong className="text-white">Hi-Hat:</strong> controls time and subdivision.</p>
            <p><strong className="text-white">Toms & Cymbals:</strong> add color, movement, and fills.</p>
          </div>
        </section>

        <section className="mb-12 p-8 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-2xl font-semibold text-white mb-4">2. Matched Grip Basics</h2>
          <p className="text-slate-400 mb-4 leading-relaxed">
            Hold both sticks the same way. Let the thumb and index finger form the main pivot, while the other fingers stay relaxed and guide the rebound.
          </p>
          <ul className="list-disc list-inside text-slate-400 space-y-2">
            <li>Do not squeeze the sticks too tightly.</li>
            <li>Let the stick bounce naturally after each stroke.</li>
            <li>Keep wrists loose and shoulders relaxed.</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">3. First Stroke Exercise</h2>
          <div className="bg-black/40 p-6 rounded-xl text-center text-[#ff5a00] font-mono text-lg tracking-[0.35em] mb-4">
            R L R L &nbsp; • &nbsp; 1 2 3 4
          </div>
          <p className="text-slate-400 leading-relaxed">
            Alternate right and left hands on a practice pad or snare. Focus on equal sound, even timing, and smooth rebound.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">4. Posture Checklist</h2>
          <div className="grid md:grid-cols-2 gap-4 text-slate-400">
            <div className="bg-white/5 rounded-xl p-4">Sit tall with both feet grounded.</div>
            <div className="bg-white/5 rounded-xl p-4">Keep the snare at a comfortable waist height.</div>
            <div className="bg-white/5 rounded-xl p-4">Elbows stay relaxed, not pinned to the body.</div>
            <div className="bg-white/5 rounded-xl p-4">Aim for control, not force.</div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-white mb-4">5. Reference Video</h2>
          <div className="flex justify-center">
            <div className="w-full max-w-3xl aspect-video rounded-xl border border-white/10 overflow-hidden">
              <iframe
                src="https://www.youtube.com/embed/et9hU7QMDYU"
                title="Drum Grip Basics"
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
          <Link href="/dashboard/student/drums/lesson-2" className="px-8 py-3 bg-[#ff5a00] text-white rounded-full hover:bg-white hover:text-black" onClick={markLessonComplete}>
            Continue to Lesson 2
          </Link>
        </div>
      </main>
    </div>
  );
}
