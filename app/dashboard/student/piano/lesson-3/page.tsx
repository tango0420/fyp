"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";

export default function PianoLesson3() {
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
        body: JSON.stringify({ userId: session.user.email, lessonId: "piano-3" }),
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
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Lesson 3: The C Major Scale</h1>
          <p className="text-xl text-slate-400 leading-relaxed max-w-3xl">
            The C major scale is the cleanest first scale because it uses only white keys. This is where coordination and smooth thumb movement begin.
          </p>
        </header>

        <section className="mb-12">
          <h2 className="text-2xl text-white mb-4">1. Notes of the Scale</h2>
          <div className="bg-black/40 p-6 rounded-xl border border-white/5 font-mono text-[#ff5a00] text-center text-xl tracking-[0.5em]">
            C - D - E - F - G - A - B - C
          </div>
          <p className="mt-4 text-slate-400 leading-relaxed">
            Play ascending and descending with steady rhythm. Focus on even volume from every finger.
          </p>
        </section>

        <section className="mb-12 p-8 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-2xl text-white mb-4">2. Right-Hand Fingering</h2>
          <p className="text-slate-400 mb-4">Use this classic fingering pattern:</p>
          <div className="bg-black/40 p-6 rounded-xl text-center text-[#ff5a00] font-mono tracking-[0.35em]">
            1 - 2 - 3, 1 - 2 - 3 - 4 - 5
          </div>
          <p className="mt-4 text-slate-400">
            After E, tuck your thumb under to F. This movement is the key to smooth scale playing.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl text-white mb-4">3. Left-Hand Fingering</h2>
          <div className="bg-white/5 p-6 rounded-xl text-slate-400 space-y-2">
            <p>Ascending: 5 - 4 - 3 - 2 - 1 - 3 - 2 - 1</p>
            <p>Descending: reverse the motion slowly and evenly.</p>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl text-white mb-4">4. Practice Routine</h2>
          <ul className="list-disc list-inside text-slate-400 space-y-2 mb-6">
            <li>Start one hand at a time.</li>
            <li>Use a metronome at a comfortable slow speed.</li>
            <li>Only increase tempo when every note sounds clean.</li>
          </ul>
          <div className="flex justify-center">
            <div className="w-full max-w-3xl aspect-video rounded-xl border border-white/10 overflow-hidden">
              <iframe
                src="https://www.youtube.com/embed/83S8WfS_P_Y"
                title="C Major Scale for Beginners"
                allowFullScreen
                className="w-full h-full rounded-xl"
                style={{ minHeight: 315 }}
              />
            </div>
          </div>
        </section>

        <div className="flex items-center justify-between pt-6 border-t border-white/10 mb-4">
          <span className="text-sm text-slate-400">
            Progress: <span className="text-[#ff5a00] font-bold">{progressPercent}%</span>
          </span>
        </div>

        <div className="flex justify-end">
          <Link
            href="/dashboard/student/piano/lesson-4"
            className="px-8 py-3 bg-[#ff5a00] text-white rounded-full hover:bg-white hover:text-black"
            onClick={markLessonComplete}
          >
            Continue to Lesson 4
          </Link>
        </div>
      </main>
    </div>
  );
}
