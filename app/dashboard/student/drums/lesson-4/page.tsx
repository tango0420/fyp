"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";

interface ProgressRecord {
  lessonId?: string;
  completed?: boolean;
}

export default function DrumLesson4() {
  const { data: session, status } = useSession();
  const [progressPercent, setProgressPercent] = useState(0);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      fetch(`/api/progress?userId=${encodeURIComponent(session.user.email)}`)
        .then((res) => res.json())
        .then((data: ProgressRecord[]) => {
          const completed = Array.isArray(data)
            ? data.filter((p: ProgressRecord) => p.completed && typeof p.lessonId === "string" && p.lessonId.startsWith("drums-")).length
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
        body: JSON.stringify({ userId: session.user.email, lessonId: "drums-4" }),
      });
    }
  };

  return (
    <div className="bg-[#0d0d0d] text-slate-300 font-sans antialiased min-h-screen">
      <div className="fixed top-8 left-4 md:left-8 z-20">
        <Link href="/dashboard/student/drums" className="flex items-center gap-2 text-slate-400 hover:text-white bg-black/40 px-4 py-2 rounded-full border border-white/10 shadow-lg transition-all">
          <ArrowLeft size={18} />
          <span className="text-xs font-semibold uppercase tracking-widest">Back</span>
        </Link>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-32 pb-24">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Lesson 4: Limb Independence</h1>
          <p className="text-xl text-slate-400 leading-relaxed max-w-3xl">
            Independence means one limb can keep time while another adds accents or syncopation. This is where drumming starts to feel musical.
          </p>
        </header>

        <section className="mb-12">
          <h2 className="text-2xl text-white mb-4">1. Assign Roles to Each Limb</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10 text-slate-400 space-y-2">
            <p>• <strong className="text-white">Right hand:</strong> keeps hi-hat time</p>
            <p>• <strong className="text-white">Left hand:</strong> handles the snare backbeat</p>
            <p>• <strong className="text-white">Right foot:</strong> drives the kick pattern</p>
            <p>• <strong className="text-white">Left foot:</strong> controls hi-hat opening and closing</p>
          </div>
        </section>

        <section className="mb-12 p-8 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-2xl text-white mb-4">2. Coordination Exercise</h2>
          <p className="text-slate-400 mb-4">Keep the hi-hat steady while changing the kick pattern:</p>
          <div className="bg-black/40 p-6 rounded-xl text-[#ff5a00] font-mono text-center mb-4">
            Hi-Hat: 1 & 2 & 3 & 4 &nbsp; | &nbsp; Snare: 2,4 &nbsp; | &nbsp; Kick: 1, 1&, 3
          </div>
          <p className="text-slate-400">Start slowly. The goal is independence, not speed.</p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl text-white mb-4">3. Tips for Staying Relaxed</h2>
          <ul className="list-disc list-inside text-slate-400 space-y-2">
            <li>Keep breathing while you play.</li>
            <li>Let your wrists do the work, not your shoulders.</li>
            <li>Repeat the same groove until it feels automatic.</li>
            <li>If one limb keeps failing, isolate it and rebuild slowly.</li>
          </ul>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl text-white mb-4">4. Video Walkthrough</h2>
          <div className="flex justify-center">
            <div className="w-full max-w-3xl aspect-video rounded-xl border border-white/10 overflow-hidden">
              <iframe
                src="https://www.youtube.com/embed/qG-ka9KoUG8"
                title="Drum Independence Exercise"
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
          <Link href="/dashboard/student/drums/lesson-5" className="px-8 py-3 bg-[#ff5a00] text-white rounded-full hover:bg-white hover:text-black" onClick={markLessonComplete}>
            Continue to Lesson 5
          </Link>
        </div>
      </main>
    </div>
  );
}
