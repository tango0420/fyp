"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";

export default function FluteLesson5() {
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
        body: JSON.stringify({ userId: session.user.email, lessonId: "flute-5" }),
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
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Lesson 5: Articulation & Dynamics</h1>
          <p className="text-xl text-slate-400 leading-relaxed max-w-3xl">
            Master tonguing techniques and dynamic control to play expressively and professionally.
          </p>
        </header>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">1. Tonguing Techniques</h2>
          <p className="text-slate-400 mb-4 leading-relaxed">
            Tonguing attacks the note cleanly, separating it from the previous note.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/5 p-6 rounded-xl">
              <h3 className="text-lg text-[#ff5a00] mb-3">Single Tonguing</h3>
              <p className="text-slate-400 text-sm mb-4">Use "T" or "D" syllables: "ta-ta-ta-ta"</p>
              <ul className="text-slate-400 text-sm space-y-1">
                <li>• Tongue tip touches roof of mouth</li>
                <li>• Release to allow air through</li>
                <li>• Maintain steady air flow</li>
              </ul>
            </div>
            <div className="bg-white/5 p-6 rounded-xl">
              <h3 className="text-lg text-[#ff5a00] mb-3">Double Tonguing</h3>
              <p className="text-slate-400 text-sm mb-4">Alternate "ta-ka-ta-ka" for faster passages</p>
              <ul className="text-slate-400 text-sm space-y-1">
                <li>• T with tongue tip forward</li>
                <li>• K with tongue back</li>
                <li>• Maintain even pressure</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-12 p-8 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-2xl font-semibold text-white mb-4">2. Dynamic Control</h2>
          <p className="text-slate-400 mb-6">
            Control volume by adjusting air speed and embouchure tension, not by digging into the flute.
          </p>
          <div className="space-y-4">
            <div className="bg-black/30 p-4 rounded-lg">
              <h4 className="text-white font-medium mb-2">Piano (Soft)</h4>
              <p className="text-slate-400 text-sm">Use relaxed embouchure and controlled air. Should still be clear, not breathy.</p>
            </div>
            <div className="bg-black/30 p-4 rounded-lg">
              <h4 className="text-white font-medium mb-2">Forte (Loud)</h4>
              <p className="text-slate-400 text-sm">Increase air speed and embouchure firmness. Watch for sharp, harsh tone.</p>
            </div>
            <div className="bg-black/30 p-4 rounded-lg">
              <h4 className="text-white font-medium mb-2">Crescendo & Diminuendo</h4>
              <p className="text-slate-400 text-sm">Gradually increase then decrease volume over several notes for smooth transitions.</p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-white mb-4">3. Reference Video</h2>
          <div className="flex justify-center">
            <div className="w-full max-w-3xl aspect-video rounded-xl border border-white/10 overflow-hidden">
              <iframe
                src="https://www.youtube.com/embed/CPXZHj8d_Xk"
                title="Flute Articulation"
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
          <Link href="/dashboard/student/flute/lesson-6" className="px-8 py-3 bg-[#ff5a00] text-white rounded-full hover:bg-white hover:text-black" onClick={markLessonComplete}>
            Continue to Lesson 6
          </Link>
        </div>
      </main>
    </div>
  );
}