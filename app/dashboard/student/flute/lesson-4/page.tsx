"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";

export default function FluteLesson4() {
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
        body: JSON.stringify({ userId: session.user.email, lessonId: "flute-4" }),
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
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Lesson 4: Simple Melodies</h1>
          <p className="text-xl text-slate-400 leading-relaxed max-w-3xl">
            Combine your breathing, fingerings, and tone production to play your first complete pieces. Build confidence and musicality.
          </p>
        </header>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">1. Basic Note Reading</h2>
          <p className="text-slate-400 mb-4 leading-relaxed">
            Learn to read simple musical notation and understand rhythm values.
          </p>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-white/5 p-4 rounded-lg text-center">
              <h4 className="text-[#ff5a00] font-medium mb-2">Whole Note</h4>
              <p className="text-slate-400 text-sm">4 beats</p>
              <div className="text-white font-bold text-2xl mt-2">𝅗𝅥</div>
            </div>
            <div className="bg-white/5 p-4 rounded-lg text-center">
              <h4 className="text-[#ff5a00] font-medium mb-2">Half Note</h4>
              <p className="text-slate-400 text-sm">2 beats</p>
              <div className="text-white font-bold text-2xl mt-2">𝅗𝅥</div>
            </div>
            <div className="bg-white/5 p-4 rounded-lg text-center">
              <h4 className="text-[#ff5a00] font-medium mb-2">Quarter Note</h4>
              <p className="text-slate-400 text-sm">1 beat</p>
              <div className="text-white font-bold text-2xl mt-2">♩</div>
            </div>
            <div className="bg-white/5 p-4 rounded-lg text-center">
              <h4 className="text-[#ff5a00] font-medium mb-2">Eighth Note</h4>
              <p className="text-slate-400 text-sm">1/2 beat</p>
              <div className="text-white font-bold text-2xl mt-2">♪</div>
            </div>
          </div>
        </section>

        <section className="mb-12 p-8 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-2xl font-semibold text-white mb-4">2. First Melodies</h2>
          <p className="text-slate-400 mb-6">Start with simple, familiar tunes using basic notes.</p>
          <div className="space-y-4">
            <div className="bg-black/30 p-4 rounded-lg">
              <h4 className="text-white font-medium mb-2">Mary Had a Little Lamb</h4>
              <p className="text-slate-400 text-sm">Uses only G, A, B notes in treble clef.</p>
            </div>
            <div className="bg-black/30 p-4 rounded-lg">
              <h4 className="text-white font-medium mb-2">Twinkle Twinkle Little Star</h4>
              <p className="text-slate-400 text-sm">Perfect for rhythm practice with consistent beat.</p>
            </div>
            <div className="bg-black/30 p-4 rounded-lg">
              <h4 className="text-white font-medium mb-2">Hot Cross Buns</h4>
              <p className="text-slate-400 text-sm">Great for practicing steady air and smooth transitions.</p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">3. Practice Tips for Success</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white/5 p-6 rounded-xl">
              <h3 className="text-lg text-[#ff5a00] mb-3">Slow & Steady</h3>
              <p className="text-slate-400 text-sm">Always start melodies slowly. Speed comes naturally with practice.</p>
            </div>
            <div className="bg-white/5 p-6 rounded-xl">
              <h3 className="text-lg text-[#ff5a00] mb-3">Section by Section</h3>
              <p className="text-slate-400 text-sm">Break songs into small phrases. Master each before connecting them.</p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-white mb-4">4. Reference Video</h2>
          <div className="flex justify-center">
            <div className="w-full max-w-3xl aspect-video rounded-xl border border-white/10 overflow-hidden">
              <iframe
                src="https://www.youtube.com/embed/jZ4NV7PL_ug"
                title="Flute Simple Melodies"
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
          <Link href="/dashboard/student/flute/lesson-5" className="px-8 py-3 bg-[#ff5a00] text-white rounded-full hover:bg-white hover:text-black" onClick={markLessonComplete}>
            Continue to Lesson 5
          </Link>
        </div>
      </main>
    </div>
  );
}