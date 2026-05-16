"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";

interface ProgressRecord {
  lessonId?: string;
  completed?: boolean;
}

export default function DrumLesson2() {
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
        body: JSON.stringify({ userId: session.user.email, lessonId: "drums-2" }),
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
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Lesson 2: The Basic 4/4 Groove</h1>
          <p className="text-xl text-slate-400 leading-relaxed max-w-3xl">
            This is the first real groove every drummer should master. It teaches time, coordination, and control.
          </p>
        </header>

        <section className="mb-12">
          <h2 className="text-2xl text-white mb-4">1. Count the Beat</h2>
          <div className="bg-black/40 p-6 rounded-xl text-center text-[#ff5a00] font-mono text-xl tracking-[0.35em] mb-4">
            1 &nbsp; 2 &nbsp; 3 &nbsp; 4
          </div>
          <p className="text-slate-400">Always count out loud at first. Strong drummers develop their internal clock before they develop speed.</p>
        </section>

        <section className="mb-12 p-8 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-2xl text-white mb-4">2. Build the Groove Layer by Layer</h2>
          <ul className="list-disc list-inside text-slate-400 space-y-2">
            <li><strong className="text-white">Hi-hat:</strong> play steady eighth notes</li>
            <li><strong className="text-white">Snare:</strong> strike on beats 2 and 4</li>
            <li><strong className="text-white">Kick:</strong> play on beats 1 and 3</li>
          </ul>
          <div className="mt-6 bg-black/40 p-6 rounded-xl font-mono text-[#ff5a00] text-center">
            HH: 1 & 2 & 3 & 4 &nbsp; | &nbsp; SN: 2, 4 &nbsp; | &nbsp; K: 1, 3
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl text-white mb-4">3. Common Problems</h2>
          <div className="grid md:grid-cols-2 gap-4 text-slate-400">
            <div className="bg-white/5 rounded-xl p-4">Rushing the hi-hat when the kick enters</div>
            <div className="bg-white/5 rounded-xl p-4">Hitting the snare too hard and losing balance</div>
            <div className="bg-white/5 rounded-xl p-4">Forgetting to count aloud</div>
            <div className="bg-white/5 rounded-xl p-4">Trying to go fast before the groove is steady</div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl text-white mb-4">4. Groove Development Techniques</h2>
          <p className="text-slate-400 mb-6">
            Build your groove systematically to ensure solid timekeeping.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/5 p-6 rounded-xl">
              <h3 className="text-lg text-[#ff5a00] mb-3">Layer Method</h3>
              <p className="text-slate-400 text-sm mb-4">Add elements one at a time:</p>
              <ol className="text-slate-400 text-sm space-y-1 list-decimal list-inside">
                <li>Hi-hat alone</li>
                <li>Add snare on 2 & 4</li>
                <li>Add kick on 1 & 3</li>
                <li>Play all together</li>
              </ol>
            </div>
            <div className="bg-white/5 p-6 rounded-xl">
              <h3 className="text-lg text-[#ff5a00] mb-3">Subdivision Awareness</h3>
              <p className="text-slate-400 text-sm mb-4">Feel the eighth notes:</p>
              <div className="text-center text-[#ff5a00] font-mono">1 & 2 & 3 & 4 &</div>
              <p className="text-slate-400 text-sm mt-2">Hi-hat plays every &</p>
            </div>
          </div>
        </section>

        <section className="mb-12 p-8 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-2xl text-white mb-4">5. Dynamics & Feel</h2>
          <p className="text-slate-400 mb-6">
            The same notes with different emphasis create different grooves.
          </p>
          <div className="space-y-4">
            <div className="bg-black/30 p-4 rounded-lg">
              <h4 className="text-white font-medium mb-2">Ghost Notes</h4>
              <p className="text-slate-400 text-sm">Very soft snare hits between main beats add groove and feel.</p>
            </div>
            <div className="bg-black/30 p-4 rounded-lg">
              <h4 className="text-white font-medium mb-2">Accent Patterns</h4>
              <p className="text-slate-400 text-sm">Vary the volume: loud snare on 2, soft on 4, or vice versa.</p>
            </div>
            <div className="bg-black/30 p-4 rounded-lg">
              <h4 className="text-white font-medium mb-2">Hi-Hat Variations</h4>
              <p className="text-slate-400 text-sm">Open hi-hat on beat 4, closed on others. Or alternate open/closed.</p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl text-white mb-4">6. Tempo Progression</h2>
          <p className="text-slate-400 mb-6">
            Build speed gradually while maintaining groove quality.
          </p>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-black/40 p-4 rounded-lg text-center">
              <h4 className="text-[#ff5a00] font-medium mb-2">Week 1</h4>
              <p className="text-slate-400 text-sm">60 BPM</p>
              <p className="text-slate-400 text-xs">Focus on steadiness</p>
            </div>
            <div className="bg-black/40 p-4 rounded-lg text-center">
              <h4 className="text-[#ff5a00] font-medium mb-2">Week 2</h4>
              <p className="text-slate-400 text-sm">70 BPM</p>
              <p className="text-slate-400 text-xs">Add dynamics</p>
            </div>
            <div className="bg-black/40 p-4 rounded-lg text-center">
              <h4 className="text-[#ff5a00] font-medium mb-2">Week 3</h4>
              <p className="text-slate-400 text-sm">80 BPM</p>
              <p className="text-slate-400 text-xs">Refine feel</p>
            </div>
            <div className="bg-black/40 p-4 rounded-lg text-center">
              <h4 className="text-[#ff5a00] font-medium mb-2">Week 4</h4>
              <p className="text-slate-400 text-sm">90 BPM</p>
              <p className="text-slate-400 text-xs">Performance ready</p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl text-white mb-4">7. Groove Variations</h2>
          <div className="space-y-3">
            <div className="bg-white/5 p-4 rounded-lg">
              <h4 className="text-white font-medium mb-2">Half-Time Feel</h4>
              <p className="text-slate-400 text-sm">Play kick on 1 only, snare on 2 only. Creates a slower, heavier groove.</p>
            </div>
            <div className="bg-white/5 p-4 rounded-lg">
              <h4 className="text-white font-medium mb-2">Double-Time Feel</h4>
              <p className="text-slate-400 text-sm">Add kick on & of 2 and 4. Creates energy and drive.</p>
            </div>
            <div className="bg-white/5 p-4 rounded-lg">
              <h4 className="text-white font-medium mb-2">Shuffle Groove</h4>
              <p className="text-slate-400 text-sm">Triplet feel: play snare on 2 and 4, but anticipate slightly early.</p>
            </div>
          </div>
        </section>

        <div className="flex items-center justify-between pt-6 border-t border-white/10 mb-4">
          <span className="text-sm text-slate-400">Progress: <span className="text-[#ff5a00] font-bold">{progressPercent}%</span></span>
        </div>

        <div className="flex justify-end">
          <Link href="/dashboard/student/drums/lesson-3" className="px-8 py-3 bg-[#ff5a00] text-white rounded-full hover:bg-white hover:text-black" onClick={markLessonComplete}>
            Continue to Lesson 3
          </Link>
        </div>
      </main>
    </div>
  );
}
