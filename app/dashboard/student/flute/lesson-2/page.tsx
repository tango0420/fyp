"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";

export default function FluteLesson2() {
  const { data: session, status } = useSession();
  const [progressPercent, setProgressPercent] = useState(0);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      fetch(`/api/progress?userId=${encodeURIComponent(session.user.email)}`)
        .then((res) => res.json())
        .then((data) => {
          const completed = Array.isArray(data)
            ? data.filter((p) => p.completed && typeof p.lessonId === "string" && p.lessonId.startsWith("flute-")).length
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
        body: JSON.stringify({ userId: session.user.email, lessonId: "flute-2" }),
      });
    }
  };

  return (
    <div className="bg-[#0d0d0d] text-slate-300 font-sans antialiased min-h-screen">
      <div className="fixed top-8 left-4 md:left-8 z-20">
        <Link href="/dashboard/student/flute" className="flex items-center gap-2 text-slate-400 hover:text-white bg-black/40 px-4 py-2 rounded-full border border-white/10 shadow-lg transition-all">
          <ArrowLeft size={18} />
          <span className="text-xs font-semibold uppercase tracking-widest">Back</span>
        </Link>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-32 pb-24">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Lesson 2: First Notes & Fingerings</h1>
          <p className="text-xl text-slate-400 leading-relaxed max-w-3xl">
            Learn the basic fingerings and produce your first clear flute notes. Understanding the flute's key system is essential for all future playing.
          </p>
        </header>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">1. Flute Key Layout</h2>
          <p className="text-slate-400 mb-4 leading-relaxed">
            The flute has 16 keys arranged in a logical pattern. Learn the names and positions of each key.
          </p>
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <div className="grid md:grid-cols-2 gap-6 text-slate-400">
              <div>
                <h3 className="text-white font-medium mb-2">Left Hand Keys</h3>
                <ul className="space-y-1">
                  <li>• Index finger (B key)</li>
                  <li>• Middle finger (Bb key)</li>
                  <li>• Ring finger (A key)</li>
                  <li>• Pinky (G# key)</li>
                  <li>• Pinky lever (G key)</li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-medium mb-2">Right Hand Keys</h3>
                <ul className="space-y-1">
                  <li>• Index finger (F key)</li>
                  <li>• Middle finger (E key)</li>
                  <li>• Ring finger (D key)</li>
                  <li>• Pinky (C key)</li>
                  <li>• Thumb key (B/C# key)</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12 p-8 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-2xl font-semibold text-white mb-4">2. Basic Fingerings</h2>
          <p className="text-slate-400 mb-4">Start with the fundamental notes that form the basis of all flute playing.</p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-black/30 p-4 rounded-lg text-center">
              <h4 className="text-[#ff5a00] font-medium mb-2">B (Concert)</h4>
              <p className="text-slate-400 text-sm">All keys open</p>
              <div className="text-[#ff5a00] font-mono text-sm mt-2">O O O O</div>
            </div>
            <div className="bg-black/40 p-4 rounded-lg text-center">
              <h4 className="text-[#ff5a00] font-medium mb-2">A</h4>
              <p className="text-slate-400 text-sm">Right ring finger</p>
              <div className="text-[#ff5a00] font-mono text-sm mt-2">O O O ●</div>
            </div>
            <div className="bg-black/40 p-4 rounded-lg text-center">
              <h4 className="text-[#ff5a00] font-medium mb-2">G</h4>
              <p className="text-slate-400 text-sm">Right pinky</p>
              <div className="text-[#ff5a00] font-mono text-sm mt-2">O O ● ●</div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">3. Fingering Practice Method</h2>
          <p className="text-slate-400 mb-6">
            Use this systematic approach to learn fingerings efficiently.
          </p>
          <div className="space-y-4">
            <div className="bg-black/30 p-4 rounded-lg border-l-4 border-[#ff5a00]">
              <h4 className="text-white font-medium mb-2">Step 1: Visual Learning</h4>
              <p className="text-slate-400 text-sm">Look at the fingering chart and memorize the key pattern without playing.</p>
            </div>
            <div className="bg-black/30 p-4 rounded-lg border-l-4 border-[#ff5a00]">
              <h4 className="text-white font-medium mb-2">Step 2: Slow Practice</h4>
              <p className="text-slate-400 text-sm">Place fingers on keys slowly, feeling each key's position and resistance.</p>
            </div>
            <div className="bg-black/30 p-4 rounded-lg border-l-4 border-[#ff5a00]">
              <h4 className="text-white font-medium mb-2">Step 3: Sound Connection</h4>
              <p className="text-slate-400 text-sm">Blow air while pressing keys. Adjust embouchure until you get a clear tone.</p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">4. Troubleshooting Tone Issues</h2>
          <div className="space-y-3">
            <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-lg">
              <h4 className="text-red-400 font-medium mb-1">No Sound</h4>
              <p className="text-slate-400 text-sm">Check embouchure - lower lip should cover half the hole. Increase air speed.</p>
            </div>
            <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-lg">
              <h4 className="text-red-400 font-medium mb-1">Squeaky Sound</h4>
              <p className="text-slate-400 text-sm">Too much lip tension or air angle wrong. Relax lips and aim air straight across hole.</p>
            </div>
            <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-lg">
              <h4 className="text-red-400 font-medium mb-1">Flat Sound</h4>
              <p className="text-slate-400 text-sm">Not enough air speed or wrong fingering. Check that all required keys are pressed.</p>
            </div>
          </div>
        </section>

        <div className="flex items-center justify-between pt-6 border-t border-white/10 mb-4">
          <span className="text-sm text-slate-400">Progress: <span className="text-[#ff5a00] font-bold">{progressPercent}%</span></span>
        </div>

        <div className="flex justify-end">
          <Link href="/dashboard/student/flute/lesson-3" className="px-8 py-3 bg-[#ff5a00] text-white rounded-full hover:bg-white hover:text-black" onClick={markLessonComplete}>
            Continue to Lesson 3
          </Link>
        </div>
      </main>
    </div>
  );
}