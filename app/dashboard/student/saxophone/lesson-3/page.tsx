"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";

export default function SaxophoneLesson3() {
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
        body: JSON.stringify({ userId: session.user.email, lessonId: "saxophone-3" }),
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
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Lesson 3: Fingerings & First Notes</h1>
          <p className="text-xl text-slate-400 leading-relaxed max-w-3xl">
            Learn saxophone fingerings to produce your first clear notes and build foundational pitch control.
          </p>
        </header>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">1. Saxophone Key Layout</h2>
          <p className="text-slate-400 mb-4 leading-relaxed">
            The saxophone has 25+ keys that work together to produce different pitches. Here's the basic key organization:
          </p>
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10 space-y-3">
            <p><strong className="text-white">Left Hand:</strong> Controls palm keys and lower stack (E, F#, G keys)</p>
            <p><strong className="text-white">Right Hand:</strong> Controls lower keys and pinky keys</p>
            <p><strong className="text-white">Palm Keys:</strong> Adjust pitch for same fingering pattern</p>
            <p><strong className="text-white">Side Keys:</strong> Fill in chromatically between main fingerings</p>
          </div>
        </section>

        <section className="mb-12 p-8 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-2xl font-semibold text-white mb-4">2. First Notes to Learn</h2>
          <div className="space-y-4">
            <div className="bg-black/40 p-4 rounded-lg">
              <p className="text-white font-semibold mb-2">Note B</p>
              <p className="text-[#ff5a00] font-mono text-sm">Left Index: First three keys | Right hand: relaxed</p>
              <p className="text-slate-400 text-sm mt-2">Your first note! Practice getting a clean tone.</p>
            </div>
            <div className="bg-black/40 p-4 rounded-lg">
              <p className="text-white font-semibold mb-2">Note A</p>
              <p className="text-[#ff5a00] font-mono text-sm">Left Index & Middle: First 4-5 keys</p>
              <p className="text-slate-400 text-sm mt-2">Add middle finger while maintaining embouchure.</p>
            </div>
            <div className="bg-black/40 p-4 rounded-lg">
              <p className="text-white font-semibold mb-2">Note G</p>
              <p className="text-[#ff5a00] font-mono text-sm">Left Index, Middle & Ring: First 6 keys</p>
              <p className="text-slate-400 text-sm mt-2">Continue the pattern downward.</p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">3. Fingering Exercise</h2>
          <p className="text-slate-400 mb-4">Practice this simple note sequence to develop finger coordination:</p>
          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <p className="text-center text-2xl text-white font-mono mb-4">B - A - G - A - B</p>
            <ul className="text-slate-400 space-y-2">
              <li>• Play each note for 4 beats</li>
              <li>• Keep tone steady and even</li>
              <li>• Articulate clearly with tongue</li>
              <li>• Repeat 5 times slowly</li>
              <li>• Gradually increase tempo</li>
            </ul>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-white mb-4">4. Fingering Guide Video</h2>
          <div className="flex justify-center">
            <div className="w-full max-w-3xl aspect-video rounded-xl border border-white/10 overflow-hidden">
              <iframe
                src="https://www.youtube.com/embed/0VUGmYQzxqk"
                title="Saxophone Fingerings"
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
          <Link href="/dashboard/student/saxophone/lesson-4" className="px-8 py-3 bg-[#ff5a00] text-white rounded-full hover:bg-white hover:text-black" onClick={markLessonComplete}>
            Continue to Lesson 4
          </Link>
        </div>
      </main>
    </div>
  );
}