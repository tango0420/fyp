"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";

export default function CelloLesson2() {
  const { data: session, status } = useSession();
  const [progressPercent, setProgressPercent] = useState(0);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      fetch(`/api/progress?userId=${encodeURIComponent(session.user.email)}`)
        .then(res => res.json())
        .then(data => {
          const completed = Array.isArray(data) ? data.filter(p => p.completed).length : 0;
          setProgressPercent(Math.round((completed / 6) * 100));
        })
        .catch(() => setProgressPercent(0));
    }
  }, [status, session]);

  const markLessonComplete = async () => {
    if (status === "authenticated" && session?.user?.email) {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.email, lessonId: "cello-2" })
      });
    }
  };

  return (
    <div className="bg-[#0d0d0d] text-slate-300 font-sans antialiased">
      <div className="fixed top-8 left-4 md:left-8 z-20">
        <Link
          href="/dashboard/student/cello"
          className="flex items-center gap-2 text-slate-400 hover:text-white bg-black/40 px-4 py-2 rounded-full border border-white/10 shadow-lg transition-all"
        >
          <ArrowLeft size={18} />
          <span className="text-xs font-semibold uppercase tracking-widest">Back</span>
        </Link>
      </div>

      <main className="max-w-4xl mx-auto px-6 pt-32 pb-24">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-6">Bow Hold & Open Strings</h1>
          <p className="text-xl text-slate-400">
            Build a stable bow grip and learn how to draw a smooth sound across the open strings of the cello.
          </p>
        </header>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">1. The Bow Hold</h2>
          <div className="space-y-4 text-slate-400 leading-relaxed">
            <p>Hold the bow with a relaxed but secure hand. Your thumb should rest gently on the frog, and the fingers should curve naturally around the stick.</p>
            <ul className="space-y-3 ml-4 list-disc">
              <li><strong>Thumb position:</strong> place the thumb in the groove, slightly bent.</li>
              <li><strong>Index finger:</strong> applies gentle pressure to control the bow.</li>
              <li><strong>Ring finger:</strong> helps balance the bow weight.</li>
              <li><strong>Pinky:</strong> rests on the top or side of the bow to stabilize it.</li>
            </ul>
          </div>
        </section>

        <section className="mb-12 p-8 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-2xl font-semibold text-white mb-4">2. Drawing the Bow</h2>
          <p className="text-slate-400 leading-relaxed mb-4">
            Practice drawing the bow straight across the string from frog to tip. Keep your wrist and elbow flexible so the bow moves in a smooth, even line.</p>
            
          <p className="text-slate-400 leading-relaxed">Listen for a steady tone. If the sound is scratchy, slow down and focus on maintaining constant contact between the bow hair and the string.</p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">3. Open String Exercises</h2>
          <div className="space-y-4 text-slate-400 leading-relaxed">
            <p>Start with open strings: C, G, D, and A. Play each string with a full bow stroke, focusing on a clear, even sound.</p>
            <ul className="space-y-3 ml-4 list-disc">
              <li>Use the entire length of the bow for a long, sustained tone.</li>
              <li>Keep the speed even and the pressure balanced.</li>
              <li>Repeat each string several times until you can keep the sound steady.</li>
            </ul>
          </div>
        </section>

        <div className="flex items-center justify-between pt-6 border-t border-white/10 mb-4">
          <span className="text-sm text-slate-400">Progress: <span className="text-[#ff5a00] font-bold">{progressPercent}%</span></span>
        </div>

        <div className="flex justify-end gap-4">
          <Link
            href="/dashboard/student/cello/lesson-1"
            className="px-6 py-3 bg-white/5 text-white rounded-full border border-white/10 hover:border-[#ff5a00] transition-colors"
          >
            Previous Lesson
          </Link>
          <Link
            href="/dashboard/student/cello/lesson-3"
            className="px-8 py-3 bg-[#ff5a00] text-white rounded-full hover:bg-[#ff7a2a] font-semibold transition-colors"
            onClick={markLessonComplete}
          >
            Continue to Lesson 3
          </Link>
        </div>
      </main>
    </div>
  );
}
