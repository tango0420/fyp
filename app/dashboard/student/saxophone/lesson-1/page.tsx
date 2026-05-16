"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";

interface ProgressRecord {
  lessonId?: string;
  completed?: boolean;
}

export default function SaxophoneLesson1() {
  const { data: session, status } = useSession();
  const [progressPercent, setProgressPercent] = useState(0);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      fetch(`/api/progress?userId=${encodeURIComponent(session.user.email)}`)
        .then((res) => res.json())
        .then((data: ProgressRecord[]) => {
          const completed = Array.isArray(data)
            ? data.filter((p: ProgressRecord) => p.completed && typeof p.lessonId === "string" && p.lessonId.startsWith("saxophone-")).length
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
        body: JSON.stringify({ userId: session.user.email, lessonId: "saxophone-1" }),
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
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Lesson 1: Saxophone Anatomy & Reeds</h1>
          <p className="text-xl text-slate-400 leading-relaxed max-w-3xl">
            Learn the saxophone's construction and discover the critical importance of reed selection and care for your sound quality.
          </p>
        </header>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">1. Saxophone Parts</h2>
          <p className="text-slate-400 mb-4 leading-relaxed">
            The saxophone consists of several key components, each essential to sound production.
          </p>
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10 text-slate-400 space-y-2">
            <p><strong className="text-white">Mouthpiece:</strong> where the reed sits, critical for tone quality.</p>
            <p><strong className="text-white">Reed:</strong> vibrates to create sound - must be chosen carefully.</p>
            <p><strong className="text-white">Neck:</strong> connects mouthpiece to body, affects tone.</p>
            <p><strong className="text-white">Body:</strong> large conical tube that resonates the sound.</p>
            <p><strong className="text-white">Keys:</strong> allow you to play all notes efficiently.</p>
            <p><strong className="text-white">Bell:</strong> the flared end that projects the sound.</p>
          </div>
        </section>

        <section className="mb-12 p-8 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-2xl font-semibold text-white mb-4">2. Understanding Reeds</h2>
          <p className="text-slate-400 mb-4">The reed is the most critical factor in saxophone sound quality.</p>
          <div className="space-y-4">
            <div className="bg-black/30 p-4 rounded-lg">
              <h4 className="text-white font-medium mb-2">Reed Strength/Size</h4>
              <p className="text-slate-400 text-sm">Reeds are numbered (1.5, 2.0, 2.5, 3.0, etc.). Higher = stiffer. Beginners often use 2.0-2.5.</p>
            </div>
            <div className="bg-black/30 p-4 rounded-lg">
              <h4 className="text-white font-medium mb-2">Cane Quality</h4>
              <p className="text-slate-400 text-sm">Professional reeds are made of cane and are expensive but necessary for good tone.</p>
            </div>
            <div className="bg-black/30 p-4 rounded-lg">
              <h4 className="text-white font-medium mb-2">Reed Lifespan</h4>
              <p className="text-slate-400 text-sm">Reeds don't last forever. They dry out, warp, or split. Budget for replacing them regularly.</p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">3. Reed Care & Storage</h2>
          <div className="grid md:grid-cols-2 gap-4 text-slate-400">
            <div className="bg-white/5 rounded-xl p-4">Always soak reed in water before playing</div>
            <div className="bg-white/5 rounded-xl p-4">Store in a reed case or clip when not in use</div>
            <div className="bg-white/5 rounded-xl p=4">Clean reed by gently wiping with soft cloth</div>
            <div className="bg-white/5 rounded-xl p-4">Rotate between reeds to extend their life</div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">4. Mouthpiece Selection</h2>
          <p className="text-slate-400 mb-4 leading-relaxed">
            Mouthpieces vary in opening size and material, affecting tone and playability.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/5 p-6 rounded-xl">
              <h3 className="text-lg text-[#ff5a00] mb-3">Metal Mouthpieces</h3>
              <p className="text-slate-400 text-sm">Brighter, more modern tone. Popular for jazz and contemporary music.</p>
            </div>
            <div className="bg-white/5 p-6 rounded-xl">
              <h3 className="text-lg text-[#ff5a00] mb-3">Hard Rubber Mouthpieces</h3>
              <p className="text-slate-400 text-sm">Warmer, mellower tone. Better for classical and beginner players.</p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-white mb-4">5. Reference Video</h2>
          <div className="flex justify-center">
            <div className="w-full max-w-3xl aspect-video rounded-xl border border-white/10 overflow-hidden">
              <iframe
                src="https://www.youtube.com/embed/NMWzUfW8Qgo"
                title="Saxophone Basics and Parts"
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
          <Link href="/dashboard/student/saxophone/lesson-2" className="px-8 py-3 bg-[#ff5a00] text-white rounded-full hover:bg-white hover:text-black" onClick={markLessonComplete}>
            Continue to Lesson 2
          </Link>
        </div>
      </main>
    </div>
  );
}