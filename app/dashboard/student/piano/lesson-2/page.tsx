"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";

export default function PianoLesson2() {
  const { data: session, status } = useSession();
  const [progressPercent, setProgressPercent] = useState(0);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      fetch(`/api/progress?userId=${encodeURIComponent(session.user.email)}`)
        .then((res) => res.json())
        .then((data) => {
          const completed = Array.isArray(data)
            ? data.filter(
                (p: { lessonId?: string; completed?: boolean }) =>
                  p.completed && typeof p.lessonId === "string" && p.lessonId.startsWith("piano-")
              ).length
            : 0;
          setProgressPercent(Math.round((completed / 4) * 100));
        });
    }
  }, [status, session]);

  const markLessonComplete = async () => {
    if (status === "authenticated" && session?.user?.email) {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.email, lessonId: "piano-2" }),
      });
    }
  };

  return (
    <div className="bg-[#0d0d0d] text-slate-300 font-sans antialiased min-h-screen">
      <div className="fixed top-8 left-4 md:left-8 z-20">
        <Link
          href="/dashboard/student/piano"
          className="flex items-center gap-2 text-slate-400 hover:text-white bg-black/40 px-4 py-2 rounded-full border border-white/10 shadow-lg transition-all"
        >
          <ArrowLeft size={18} />
          <span className="text-xs font-semibold uppercase tracking-widest">Back</span>
        </Link>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-32 pb-24">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Lesson 2: Hand Posture & Fingering</h1>
          <p className="text-xl text-slate-400 leading-relaxed max-w-3xl">
            Learn how to shape your hands correctly, number your fingers, and play with relaxed control instead of tension.
          </p>
        </header>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">1. Curved Hand Shape</h2>
          <p className="text-slate-400 mb-4 leading-relaxed">
            Imagine you are gently holding a small ball. That rounded shape is ideal for piano. Your knuckles stay lifted and your fingertips contact the keys naturally.
          </p>
          <div className="bg-white/5 p-6 rounded-xl text-slate-400 space-y-2">
            <p>• Keep wrists level</p>
            <p>• Relax shoulders and elbows</p>
            <p>• Avoid collapsing the finger joints</p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">2. Finger Numbers</h2>
          <div className="grid md:grid-cols-5 gap-4">
            {[
              "1 = Thumb",
              "2 = Index",
              "3 = Middle",
              "4 = Ring",
              "5 = Pinky",
            ].map((item) => (
              <div key={item} className="rounded-xl border border-white/10 bg-black/30 px-4 py-5 text-center text-slate-300">
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12 p-8 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-2xl font-semibold text-white mb-4">3. Finger Placement Drill</h2>
          <p className="text-slate-400 mb-6">
            Place your right-hand thumb on Middle C and rest the other fingers on D, E, F, and G.
          </p>
          <div className="bg-black/40 p-6 rounded-xl border border-white/5 font-mono text-[#ff5a00] text-center text-lg tracking-[0.35em]">
            1:C &nbsp; 2:D &nbsp; 3:E &nbsp; 4:F &nbsp; 5:G
          </div>
          <ul className="list-disc list-inside text-slate-400 mt-6 space-y-2">
            <li>Play one note at a time with even tone.</li>
            <li>Keep each fingertip firm but relaxed.</li>
            <li>Let the wrist stay loose, never rigid.</li>
          </ul>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-white mb-4">4. Reference Video</h2>
          <div className="flex justify-center">
            <div className="w-full max-w-3xl aspect-video rounded-xl border border-white/10 overflow-hidden">
              <iframe
                src="https://www.youtube.com/embed/3uun_S_vXvE"
                title="Piano Hand Posture"
                allowFullScreen
                className="w-full h-full rounded-xl"
                style={{ minHeight: 315 }}
              />
            </div>
          </div>
          <p className="text-sm text-slate-400 text-center max-w-2xl mx-auto mt-6">
            Watch how the hand stays rounded and balanced even while each finger moves independently.
          </p>
        </section>

        <div className="flex items-center justify-between pt-6 border-t border-white/10 mb-4">
          <span className="text-sm text-slate-400">
            Progress: <span className="text-[#ff5a00] font-bold">{progressPercent}%</span>
          </span>
        </div>

        <div className="flex justify-end">
          <Link
            href="/dashboard/student/piano/lesson-3"
            className="px-8 py-3 bg-[#ff5a00] text-white rounded-full hover:bg-white hover:text-black"
            onClick={markLessonComplete}
          >
            Continue to Lesson 3
          </Link>
        </div>
      </main>
    </div>
  );
}
