"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";

export default function PianoLesson3() {
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
        body: JSON.stringify({ userId: session.user.email, lessonId: "piano-3" }),
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
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Lesson 3: The C Major Scale</h1>
          <p className="text-xl text-slate-400 leading-relaxed max-w-3xl">
            The C major scale is the cleanest first scale because it uses only white keys. This is where coordination and smooth thumb movement begin.
          </p>
        </header>

        <section className="mb-12">
          <h2 className="text-2xl text-white mb-4">1. Notes of the Scale</h2>
          <div className="bg-black/40 p-6 rounded-xl border border-white/5 font-mono text-[#ff5a00] text-center text-xl tracking-[0.5em]">
            C - D - E - F - G - A - B - C
          </div>
          <p className="mt-4 text-slate-400 leading-relaxed">
            Play ascending and descending with steady rhythm. Focus on even volume from every finger.
          </p>
        </section>

        <section className="mb-12 p-8 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-2xl text-white mb-4">2. Right-Hand Fingering</h2>
          <p className="text-slate-400 mb-4">Use this classic fingering pattern:</p>
          <div className="bg-black/40 p-6 rounded-xl text-center text-[#ff5a00] font-mono tracking-[0.35em]">
            1 - 2 - 3, 1 - 2 - 3 - 4 - 5
          </div>
          <p className="mt-4 text-slate-400">
            After E, tuck your thumb under to F. This movement is the key to smooth scale playing.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl text-white mb-4">3. Left-Hand Fingering</h2>
          <div className="bg-white/5 p-6 rounded-xl text-slate-400 space-y-2">
            <p>Ascending: 5 - 4 - 3 - 2 - 1 - 3 - 2 - 1</p>
            <p>Descending: reverse the motion slowly and evenly.</p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl text-white mb-4">4. Scale Theory & Patterns</h2>
          <p className="text-slate-400 mb-6">
            Understanding why scales work helps you learn them faster and adapt them to other keys.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/5 p-6 rounded-xl">
              <h3 className="text-lg text-[#ff5a00] mb-3">Whole Steps & Half Steps</h3>
              <p className="text-slate-400 text-sm mb-4">The C major scale uses this pattern:</p>
              <div className="text-center text-[#ff5a00] font-mono">W-W-H-W-W-W-H</div>
              <p className="text-slate-400 text-sm mt-2">W=Whole step, H=Half step</p>
            </div>
            <div className="bg-white/5 p-6 rounded-xl">
              <h3 className="text-lg text-[#ff5a00] mb-3">Why C Major is Easiest</h3>
              <p className="text-slate-400 text-sm">No black keys needed! This makes it perfect for beginners to focus on technique rather than note-finding.</p>
            </div>
          </div>
        </section>

        <section className="mb-12 p-8 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-2xl text-white mb-4">5. Thumb Tuck Technique</h2>
          <p className="text-slate-400 mb-6">
            The thumb tuck is the most important technical skill in scale playing. Here's how to master it:
          </p>
          <div className="space-y-4">
            <div className="bg-black/30 p-4 rounded-lg">
              <h4 className="text-white font-medium mb-2">Step 1: Position</h4>
              <p className="text-slate-400 text-sm">Place thumb on F, fingers 2-3-4 on G-A-B. Keep hand curved.</p>
            </div>
            <div className="bg-black/30 p-4 rounded-lg">
              <h4 className="text-white font-medium mb-2">Step 2: Tuck</h4>
              <p className="text-slate-400 text-sm">Quickly slide thumb under fingers to reach next C. Don't lift hand.</p>
            </div>
            <div className="bg-black/30 p-4 rounded-lg">
              <h4 className="text-white font-medium mb-2">Step 3: Continue</h4>
              <p className="text-slate-400 text-sm">Resume normal fingering pattern. Practice slowly until smooth.</p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl text-white mb-4">6. Hands-Together Practice</h2>
          <p className="text-slate-400 mb-6">
            Once each hand is comfortable alone, practice both hands together with these coordination tips.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-black/40 p-4 rounded-lg text-center">
              <div className="text-[#ff5a00] font-mono text-lg mb-2">RH: 1-2-3</div>
              <div className="text-slate-400 text-sm">Right hand plays C-D-E</div>
            </div>
            <div className="bg-black/40 p-4 rounded-lg text-center">
              <div className="text-[#ff5a00] font-mono text-lg mb-2">LH: 5-4-3</div>
              <div className="text-slate-400 text-sm">Left hand plays C-B-A</div>
            </div>
            <div className="bg-black/40 p-4 rounded-lg text-center">
              <div className="text-[#ff5a00] font-mono text-lg mb-2">Together</div>
              <div className="text-slate-400 text-sm">Both hands play simultaneously</div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl text-white mb-4">7. Common Scale Problems</h2>
          <div className="space-y-3">
            <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-lg">
              <h4 className="text-red-400 font-medium mb-1">Thumb Tuck Hesitation</h4>
              <p className="text-slate-400 text-sm">Practice the tuck motion slowly. Speed comes from confidence, not rushing.</p>
            </div>
            <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-lg">
              <h4 className="text-red-400 font-medium mb-1">Uneven Rhythm</h4>
              <p className="text-slate-400 text-sm">Use a metronome. Every note should be exactly the same duration.</p>
            </div>
            <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-lg">
              <h4 className="text-red-400 font-medium mb-1">Tension Buildup</h4>
              <p className="text-slate-400 text-sm">Stop and shake out hands if you feel tension. Better to practice relaxed than fast.</p>
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
            href="/dashboard/student/piano/lesson-4"
            className="px-8 py-3 bg-[#ff5a00] text-white rounded-full hover:bg-white hover:text-black"
            onClick={markLessonComplete}
          >
            Continue to Lesson 4
          </Link>
        </div>
      </main>
    </div>
  );
}
