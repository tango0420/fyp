"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";

export default function SaxophoneLesson5() {
  const { data: session, status } = useSession();
  const [progressPercent, setProgressPercent] = useState(0);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      fetch(`/api/progress?userId=${encodeURIComponent(session.user.email)}`)
        .then((res) => res.json())
        .then((data) => {
          const completed = Array.isArray(data)
            ? data.filter((p) => p.completed && typeof p.lessonId === "string" && p.lessonId.startsWith("saxophone-")).length
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
        body: JSON.stringify({ userId: session.user.email, lessonId: "saxophone-5" }),
      });
    }
  };

  return (
    <div className="bg-[#0d0d0d] text-slate-300 font-sans antialiased min-h-screen">
      <div className="fixed top-8 left-4 md:left-8 z-20">
        <Link href="/dashboard/student/saxophone" className="flex items-center gap-2 text-slate-400 hover:text-white bg-black/40 px-4 py-2 rounded-full border border-white/10 shadow-lg transition-all">
          <ArrowLeft size={18} />
          <span className="text-xs font-semibold uppercase tracking-widest">Back</span>
        </Link>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-32 pb-24">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Lesson 5: Scales & Articulation</h1>
          <p className="text-xl text-slate-400 leading-relaxed max-w-3xl">
            Learn major scales and develop clear articulation techniques using proper tongue control and attack.
          </p>
        </header>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">1. The Major Scale</h2>
          <p className="text-slate-400 mb-4 leading-relaxed">
            The major scale is the foundation of most Western music. It consists of 8 notes in a specific interval pattern.
          </p>
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <p className="text-center text-[#ff5a00] font-mono text-lg mb-4 tracking-widest">B C# D# E F# G# A# B</p>
            <p className="text-slate-400 mb-4">This is the B major scale (one of the most common starting scales for saxophone)</p>
            <div className="bg-black/40 p-4 rounded-lg text-slate-400 space-y-2 text-sm">
              <p><strong className="text-white">Whole-Half Pattern:</strong> W-W-H-W-W-W-H</p>
              <p>(W = Whole step / 2 frets, H = Half step / 1 fret)</p>
            </div>
          </div>
        </section>

        <section className="mb-12 p-8 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-2xl font-semibold text-white mb-4">2. Articulation & Tonguing</h2>
          <p className="text-slate-400 mb-4">Articulation is how you begin and separate notes. The tongue is your primary articulation tool.</p>
          <div className="space-y-4">
            <div className="bg-black/40 p-4 rounded-lg">
              <p className="text-white font-semibold mb-2">Standard Tonguing (Ta or Tu)</p>
              <p className="text-slate-400 text-sm">Most common articulation. Tongue touches the roof of your mouth to stop and start airflow.</p>
              <p className="text-[#ff5a00] text-sm mt-2">Practice: Ta-ta-ta-ta at different speeds</p>
            </div>
            <div className="bg-black/40 p-4 rounded-lg">
              <p className="text-white font-semibold mb-2">Hard Tonguing (Tu with back of tongue)</p>
              <p className="text-slate-400 text-sm">For a sharper, more defined attack. Useful in jazz and contemporary styles.</p>
              <p className="text-[#ff5a00] text-sm mt-2">Creates clear note separation</p>
            </div>
            <div className="bg-black/40 p-4 rounded-lg">
              <p className="text-white font-semibold mb-2">Soft Tonguing (Da or Du)</p>
              <p className="text-slate-400 text-sm">Gentle articulation for lyrical passages. Less tongue pressure for smoother sound.</p>
              <p className="text-[#ff5a00] text-sm mt-2">Use for expressive, singing passages</p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">3. Scale Exercise with Articulation</h2>
          <div className="bg-white/5 rounded-lg p-6 border border-white/10 space-y-4">
            <p className="text-slate-400"><span className="text-white font-semibold">Basic Scale Practice:</span></p>
            <div className="bg-black/40 p-3 rounded text-center text-[#ff5a00] font-mono">B C# D# E | E D# C# B</div>
            <ul className="text-slate-400 space-y-2">
              <li>• Play ascending, then descending</li>
              <li>• Use consistent articulation throughout</li>
              <li>• Maintain steady tempo</li>
              <li>• Focus on even tone quality</li>
              <li>• Extend to full octave once comfortable</li>
            </ul>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-white mb-4">4. Scales & Articulation Video</h2>
          <div className="flex justify-center">
            <div className="w-full max-w-3xl aspect-video rounded-xl border border-white/10 overflow-hidden">
              <iframe
                src="https://www.youtube.com/embed/UTXhfqEVnH4"
                title="Saxophone Scales and Articulation"
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
          <Link href="/dashboard/student/saxophone/lesson-6" className="px-8 py-3 bg-[#ff5a00] text-white rounded-full hover:bg-white hover:text-black" onClick={markLessonComplete}>
            Continue to Lesson 6
          </Link>
        </div>
      </main>
    </div>
  );
}