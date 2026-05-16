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

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">4. Finger Independence Drills</h2>
          <p className="text-slate-400 mb-6">
            Practice these exercises to develop control over each finger individually.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/5 p-6 rounded-xl">
              <h3 className="text-lg text-[#ff5a00] mb-3">Finger Lifts</h3>
              <p className="text-slate-400 text-sm mb-4">Place all fingers on the keys. Lift each finger one by one while keeping others down.</p>
              <div className="text-center text-[#ff5a00] font-mono">1→2→3→4→5 → 5→4→3→2→1</div>
            </div>
            <div className="bg-white/5 p-6 rounded-xl">
              <h3 className="text-lg text-[#ff5a00] mb-3">Strength Building</h3>
              <p className="text-slate-400 text-sm mb-4">Press each key firmly but smoothly. Feel the resistance and release.</p>
              <div className="text-center text-[#ff5a00] font-mono">Slow & Controlled</div>
            </div>
          </div>
        </section>

        <section className="mb-12 p-8 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-2xl font-semibold text-white mb-4">5. Common Mistakes to Avoid</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h4 className="text-white font-medium">Flat Fingers</h4>
                <p className="text-slate-400 text-sm">Keep fingers curved like holding grapes. Flat fingers create tension and poor tone.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h4 className="text-white font-medium">Wrist Tension</h4>
                <p className="text-slate-400 text-sm">Let wrists float naturally. Rigid wrists prevent smooth finger movement.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h4 className="text-white font-medium">Thumb Problems</h4>
                <p className="text-slate-400 text-sm">Don't let the thumb collapse inward. Keep it strong and aligned with other fingers.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">6. Progressive Practice Method</h2>
          <p className="text-slate-400 mb-6">
            Use this systematic approach to build technique gradually.
          </p>
          <div className="space-y-4">
            <div className="bg-black/30 p-4 rounded-lg border-l-4 border-[#ff5a00]">
              <h4 className="text-white font-medium mb-2">Week 1: Foundation</h4>
              <p className="text-slate-400 text-sm">Practice hand shape and finger numbers. Play slowly with perfect form.</p>
            </div>
            <div className="bg-black/30 p-4 rounded-lg border-l-4 border-[#ff5a00]">
              <h4 className="text-white font-medium mb-2">Week 2: Control</h4>
              <p className="text-slate-400 text-sm">Add finger independence exercises. Focus on even tone and smooth motion.</p>
            </div>
            <div className="bg-black/30 p-4 rounded-lg border-l-4 border-[#ff5a00]">
              <h4 className="text-white font-medium mb-2">Week 3: Speed</h4>
              <p className="text-slate-400 text-sm">Gradually increase tempo while maintaining relaxation and accuracy.</p>
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
