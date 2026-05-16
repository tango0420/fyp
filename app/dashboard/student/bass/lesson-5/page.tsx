"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";

export default function BassLesson5() {
  const { data: session, status } = useSession();
  const [progressPercent, setProgressPercent] = useState(0);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      fetch(`/api/progress?userId=${encodeURIComponent(session.user.email)}`)
        .then((res) => res.json())
        .then((data) => {
          const completed = Array.isArray(data)
            ? data.filter((p) => p.completed && typeof p.lessonId === "string" && p.lessonId.startsWith("bass-")).length
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
        body: JSON.stringify({ userId: session.user.email, lessonId: "bass-5" }),
      });
    }
  };

  return (
    <div className="bg-[#0d0d0d] text-slate-300 font-sans antialiased min-h-screen">
      <div className="fixed top-8 left-4 md:left-8 z-20">
        <Link href="/dashboard/student/bass" className="flex items-center gap-2 text-slate-400 hover:text-white bg-black/40 px-4 py-2 rounded-full border border-white/10 shadow-lg transition-all">
          <ArrowLeft size={18} />
          <span className="text-xs font-semibold uppercase tracking-widest">Back</span>
        </Link>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-32 pb-24">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Lesson 5: Groove & Rhythm</h1>
          <p className="text-xl text-slate-400 leading-relaxed max-w-3xl">
            Develop your rhythmic foundation and learn classic bass grooves that drive modern music.
          </p>
        </header>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">1. Rhythm Fundamentals</h2>
          <p className="text-slate-400 mb-4 leading-relaxed">
            Bass serves as the bridge between drums and chords. Understanding rhythm is crucial.
          </p>
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10 text-slate-400 space-y-3">
            <p><strong className="text-white">Time Signatures:</strong> 4/4 is most common (4 beats per measure)</p>
            <p><strong className="text-white">Downbeat:</strong> The first beat (strongest emphasis)</p>
            <p><strong className="text-white">Syncopation:</strong> Playing between beats creates groove</p>
            <p><strong className="text-white">Pulse Connection:</strong> Feel the drums' kick drum pattern</p>
          </div>
        </section>

        <section className="mb-12 p-8 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-2xl font-semibold text-white mb-4">2. Classic Groove Pattern</h2>
          <p className="text-slate-400 mb-4">Practice this fundamental groove in E:</p>
          <div className="bg-black/40 p-4 rounded-lg text-mono text-[#ff5a00] text-sm leading-relaxed font-mono overflow-x-auto mb-4">
            {`Beat:  1  &  2  &  3  &  4  &
Tab:   0  -  2  -  0  -  2  -`}
          </div>
          <ul className="text-slate-400 space-y-2">
            <li>• Keep steady tempo with metronome</li>
            <li>• Feel the pocket (pocket = groove sweet spot)</li>
            <li>• Lock with the kick drum</li>
            <li>• Use consistent tone and attack</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">3. Groove Elements</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <p className="text-white font-semibold mb-3">Ghost Notes</p>
              <p className="text-slate-400 text-sm leading-relaxed">Soft, muted notes between main notes. Written as (x) in tab. Adds texture and pocket.</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <p className="text-white font-semibold mb-3">Rests</p>
              <p className="text-slate-400 text-sm leading-relaxed">Silence is music. Strategic rests create space and emphasis in a groove.</p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-white mb-4">4. Groove Video</h2>
          <div className="flex justify-center">
            <div className="w-full max-w-3xl aspect-video rounded-xl border border-white/10 overflow-hidden">
              <iframe
                src="https://www.youtube.com/embed/Hq-x_3KSKMM"
                title="Bass Groove and Rhythm"
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
          <Link href="/dashboard/student/bass/lesson-6" className="px-8 py-3 bg-[#ff5a00] text-white rounded-full hover:bg-white hover:text-black" onClick={markLessonComplete}>
            Continue to Lesson 6
          </Link>
        </div>
      </main>
    </div>
  );
}