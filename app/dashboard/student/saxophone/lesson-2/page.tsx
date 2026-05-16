"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";

export default function SaxophoneLesson2() {
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
        body: JSON.stringify({ userId: session.user.email, lessonId: "saxophone-2" }),
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
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Lesson 2: Embouchure & Assembly</h1>
          <p className="text-xl text-slate-400 leading-relaxed max-w-3xl">
            Master the embouchure formation and learn proper saxophone assembly for optimal sound production.
          </p>
        </header>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">1. The Saxophone Embouchure</h2>
          <p className="text-slate-400 mb-4 leading-relaxed">
            The embouchure is how your mouth shapes around the reed and mouthpiece. Perfect embouchure is essential for good tone.
          </p>
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10 space-y-4">
            <div>
              <p className="text-white font-semibold mb-2">Lip Cushioning</p>
              <p className="text-slate-400 text-sm">Roll your bottom lip inward slightly to cushion the reed from your teeth</p>
            </div>
            <div>
              <p className="text-white font-semibold mb-2">Jaw Position</p>
              <p className="text-slate-400 text-sm">Keep your lower jaw firm but relaxed. It provides support without tension.</p>
            </div>
            <div>
              <p className="text-white font-semibold mb-2">Corners of Mouth</p>
              <p className="text-slate-400 text-sm">Firm corners prevent air leaks. Imagine smiling slightly to engage corner muscles.</p>
            </div>
            <div>
              <p className="text-white font-semibold mb-2">Pressure & Control</p>
              <p className="text-slate-400 text-sm">Balance pressure evenly across the reed. Uneven pressure causes squeaks.</p>
            </div>
          </div>
        </section>

        <section className="mb-12 p-8 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-2xl font-semibold text-white mb-4">2. Proper Assembly Steps</h2>
          <ol className="text-slate-400 space-y-3">
            <li><span className="text-[#ff5a00] font-bold">Step 1:</span> Insert the reed onto the mouthpiece (flat side against mouthpiece)</li>
            <li><span className="text-[#ff5a00] font-bold">Step 2:</span> Attach the ligature snugly but not overly tight</li>
            <li><span className="text-[#ff5a00] font-bold">Step 3:</span> Attach the mouthpiece to the neck cork with a slight twisting motion</li>
            <li><span className="text-[#ff5a00] font-bold">Step 4:</span> Attach the neck to the body with care</li>
            <li><span className="text-[#ff5a00] font-bold">Step 5:</span> Attach the bell to the body</li>
            <li><span className="text-[#ff5a00] font-bold">Step 6:</span> Test all connections are secure</li>
          </ol>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">3. Common Embouchure Issues</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <p className="text-white font-semibold mb-2">Squeaking</p>
              <p className="text-slate-400 text-sm">Caused by uneven pressure or too dry reed. Adjust embouchure firmness and add moisture.</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <p className="text-white font-semibold mb-2">Weak Tone</p>
              <p className="text-slate-400 text-sm">May indicate loose ligature or incorrect reed placement. Check assembly carefully.</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <p className="text-white font-semibold mb-2">Bird Sounds</p>
              <p className="text-slate-400 text-sm">Often from too loose embouchure. Tighten corners of mouth and increase air support.</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <p className="text-white font-semibold mb-2">Pitch Instability</p>
              <p className="text-slate-400 text-sm">Uneven embouchure pressure. Focus on consistent jaw and corner pressure.</p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-white mb-4">4. Tutorial Video</h2>
          <div className="flex justify-center">
            <div className="w-full max-w-3xl aspect-video rounded-xl border border-white/10 overflow-hidden">
              <iframe
                src="https://www.youtube.com/embed/p-lUmvWHh8Q"
                title="Saxophone Embouchure and Assembly"
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
          <Link href="/dashboard/student/saxophone/lesson-3" className="px-8 py-3 bg-[#ff5a00] text-white rounded-full hover:bg-white hover:text-black" onClick={markLessonComplete}>
            Continue to Lesson 3
          </Link>
        </div>
      </main>
    </div>
  );
}