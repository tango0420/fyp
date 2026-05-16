"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";

interface ProgressRecord {
  lessonId?: string;
  completed?: boolean;
}

export default function DrumLesson1() {
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
        body: JSON.stringify({ userId: session.user.email, lessonId: "drums-1" }),
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
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Lesson 1: Drum Kit Anatomy & Grip</h1>
          <p className="text-xl text-slate-400 leading-relaxed max-w-3xl">
            Before playing grooves, you need to understand the kit layout, how to hold the sticks, and how rebound works.
          </p>
        </header>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">1. Know the Drum Kit</h2>
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10 text-slate-400 space-y-2">
            <p><strong className="text-white">Kick Drum:</strong> your low-end pulse, played with the foot.</p>
            <p><strong className="text-white">Snare:</strong> the sharp backbeat, usually on counts 2 and 4.</p>
            <p><strong className="text-white">Hi-Hat:</strong> controls time and subdivision.</p>
            <p><strong className="text-white">Toms & Cymbals:</strong> add color, movement, and fills.</p>
          </div>
        </section>

        <section className="mb-12 p-8 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-2xl font-semibold text-white mb-4">2. Matched Grip Basics</h2>
          <p className="text-slate-400 mb-4 leading-relaxed">
            Hold both sticks the same way. Let the thumb and index finger form the main pivot, while the other fingers stay relaxed and guide the rebound.
          </p>
          <ul className="list-disc list-inside text-slate-400 space-y-2">
            <li>Do not squeeze the sticks too tightly.</li>
            <li>Let the stick bounce naturally after each stroke.</li>
            <li>Keep wrists loose and shoulders relaxed.</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">3. First Stroke Exercise</h2>
          <div className="bg-black/40 p-6 rounded-xl text-center text-[#ff5a00] font-mono text-lg tracking-[0.35em] mb-4">
            R L R L &nbsp; • &nbsp; 1 2 3 4
          </div>
          <p className="text-slate-400 leading-relaxed">
            Alternate right and left hands on a practice pad or snare. Focus on equal sound, even timing, and smooth rebound.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">4. Posture Checklist</h2>
          <div className="grid md:grid-cols-2 gap-4 text-slate-400">
            <div className="bg-white/5 rounded-xl p-4">Sit tall with both feet grounded.</div>
            <div className="bg-white/5 rounded-xl p-4">Keep the snare at a comfortable waist height.</div>
            <div className="bg-white/5 rounded-xl p-4">Elbows stay relaxed, not pinned to the body.</div>
            <div className="bg-white/5 rounded-xl p-4">Aim for control, not force.</div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">5. Grip Variations & When to Use Them</h2>
          <p className="text-slate-400 mb-6">
            Different techniques serve different musical purposes.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/5 p-6 rounded-xl">
              <h3 className="text-lg text-[#ff5a00] mb-3">Matched Grip</h3>
              <p className="text-slate-400 text-sm mb-4">Both hands hold sticks identically. Best for:</p>
              <ul className="text-slate-400 text-sm space-y-1">
                <li>• Rock and pop drumming</li>
                <li>• Fast single strokes</li>
                <li>• Consistent sound</li>
              </ul>
            </div>
            <div className="bg-white/5 p-6 rounded-xl">
              <h3 className="text-lg text-[#ff5a00] mb-3">Traditional Grip</h3>
              <p className="text-slate-400 text-sm mb-4">Left hand palm-up. Best for:</p>
              <ul className="text-slate-400 text-sm space-y-1">
                <li>• Jazz and orchestral</li>
                <li>• Snare drum focus</li>
                <li>• Vintage techniques</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-12 p-8 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-2xl font-semibold text-white mb-4">6. Rebound Control Exercises</h2>
          <p className="text-slate-400 mb-6">
            Master the bounce to play faster and more efficiently.
          </p>
          <div className="space-y-4">
            <div className="bg-black/30 p-4 rounded-lg">
              <h4 className="text-white font-medium mb-2">Height Control</h4>
              <p className="text-slate-400 text-sm">Practice playing at different heights: high (loud), medium (normal), low (soft).</p>
            </div>
            <div className="bg-black/30 p-4 rounded-lg">
              <h4 className="text-white font-medium mb-2">Stick Positioning</h4>
              <p className="text-slate-400 text-sm">Keep sticks at 45-degree angle. Too flat = dead sound, too vertical = inconsistent bounce.</p>
            </div>
            <div className="bg-black/30 p-4 rounded-lg">
              <h4 className="text-white font-medium mb-2">Wrist vs Finger Control</h4>
              <p className="text-slate-400 text-sm">Use wrists for power, fingers for finesse. Combine both for optimal control.</p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">7. Practice Pad Techniques</h2>
          <p className="text-slate-400 mb-6">
            Build technique before moving to the full kit.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-black/40 p-4 rounded-lg text-center">
              <h4 className="text-[#ff5a00] font-medium mb-2">Single Strokes</h4>
              <p className="text-slate-400 text-sm">R-L-R-L alternating</p>
              <div className="text-[#ff5a00] font-mono text-sm mt-2">• • • •</div>
            </div>
            <div className="bg-black/40 p-4 rounded-lg text-center">
              <h4 className="text-[#ff5a00] font-medium mb-2">Double Strokes</h4>
              <p className="text-slate-400 text-sm">Two bounces per hand</p>
              <div className="text-[#ff5a00] font-mono text-sm mt-2">•• •• ••</div>
            </div>
            <div className="bg-black/40 p-4 rounded-lg text-center">
              <h4 className="text-[#ff5a00] font-medium mb-2">Paradiddles</h4>
              <p className="text-slate-400 text-sm">R-L-R-R L-R-L-L</p>
              <div className="text-[#ff5a00] font-mono text-sm mt-2">•-•• •-••</div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">8. Common Grip Mistakes</h2>
          <div className="space-y-3">
            <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-lg">
              <h4 className="text-red-400 font-medium mb-1">Death Grip</h4>
              <p className="text-slate-400 text-sm">Squeezing too hard prevents rebound and causes fatigue. Relax your hands!</p>
            </div>
            <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-lg">
              <h4 className="text-red-400 font-medium mb-1">Bent Wrists</h4>
              <p className="text-slate-400 text-sm">Keep wrists straight. Bent wrists create tension and limit speed.</p>
            </div>
            <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-lg">
              <h4 className="text-red-400 font-medium mb-1">Elbow Flapping</h4>
              <p className="text-slate-400 text-sm">Control elbow movement. Wild elbows waste energy and reduce precision.</p>
            </div>
          </div>
        </section>

        <div className="flex items-center justify-between pt-6 border-t border-white/10 mb-4">
          <span className="text-sm text-slate-400">Progress: <span className="text-[#ff5a00] font-bold">{progressPercent}%</span></span>
        </div>

        <div className="flex justify-end">
          <Link href="/dashboard/student/drums/lesson-2" className="px-8 py-3 bg-[#ff5a00] text-white rounded-full hover:bg-white hover:text-black" onClick={markLessonComplete}>
            Continue to Lesson 2
          </Link>
        </div>
      </main>
    </div>
  );
}
