"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";

interface ProgressRecord {
  lessonId?: string;
  completed?: boolean;
}

export default function ViolinLesson1() {
  const { data: session, status } = useSession();
  const [progressPercent, setProgressPercent] = useState(0);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      fetch(`/api/progress?userId=${encodeURIComponent(session.user.email)}`)
        .then((res) => res.json())
        .then((data: ProgressRecord[]) => {
          const completed = Array.isArray(data)
            ? data.filter((p: ProgressRecord) => p.completed && typeof p.lessonId === "string" && p.lessonId.startsWith("violin-")).length
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
        body: JSON.stringify({ userId: session.user.email, lessonId: "violin-1" }),
      });
    }
  };

  return (
    <div className="bg-[#0d0d0d] text-slate-300 font-sans antialiased min-h-screen">
      <div className="fixed top-8 left-4 md:left-8 z-20">
        <Link href="/dashboard/student/violin" className="flex items-center gap-2 text-slate-400 hover:text-white bg-black/40 px-4 py-2 rounded-full border border-white/10 shadow-lg transition-all">
          <ArrowLeft size={18} />
          <span className="text-xs font-semibold uppercase tracking-widest">Back</span>
        </Link>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-32 pb-24">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Lesson 1: Violin Anatomy & Posture</h1>
          <p className="text-xl text-slate-400 leading-relaxed max-w-3xl">
            Learn the parts of the instrument, how to hold it naturally, and how posture shapes your tone from the very first note.
          </p>
        </header>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">1. Parts of the Violin</h2>
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10 text-slate-400 space-y-2">
            <p><strong className="text-white">Scroll & Pegs:</strong> used for tuning.</p>
            <p><strong className="text-white">Fingerboard:</strong> where your left hand places notes.</p>
            <p><strong className="text-white">Bridge:</strong> transfers the string vibration to the body.</p>
            <p><strong className="text-white">Chin Rest:</strong> helps support the violin comfortably.</p>
          </div>
        </section>

        <section className="mb-12 p-8 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-2xl font-semibold text-white mb-4">2. Standing and Holding Position</h2>
          <ul className="list-disc list-inside text-slate-400 space-y-2">
            <li>Stand or sit tall with relaxed shoulders.</li>
            <li>Rest the violin between your jaw and collarbone.</li>
            <li>Keep the instrument level, not dropping toward the floor.</li>
            <li>Let the left hand guide, but not squeeze, the neck.</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">3. First Comfort Check</h2>
          <p className="text-slate-400 leading-relaxed mb-4">
            Good violin playing begins with ease. If your neck, shoulders, or wrist feel tense, reset your posture before continuing.
          </p>
          <div className="bg-black/40 p-6 rounded-xl text-[#ff5a00] font-mono text-center">Tall posture • relaxed shoulders • level violin</div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">4. Bow Hold Technique</h2>
          <p className="text-slate-400 mb-6">
            The bow hold is the foundation of all violin technique. Master it before playing.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/5 p-6 rounded-xl">
              <h3 className="text-lg text-[#ff5a00] mb-3">Frog Position</h3>
              <p className="text-slate-400 text-sm mb-4">Hold the frog (end) of the bow:</p>
              <ul className="text-slate-400 text-sm space-y-1">
                <li>• Thumb on underside</li>
                <li>• Index finger on top</li>
                <li>• Middle finger curved</li>
                <li>• Ring and pinky relaxed</li>
              </ul>
            </div>
            <div className="bg-white/5 p-6 rounded-xl">
              <h3 className="text-lg text-[#ff5a00] mb-3">Stick Position</h3>
              <p className="text-slate-400 text-sm mb-4">Bow parallel to bridge:</p>
              <ul className="text-slate-400 text-sm space-y-1">
                <li>• 45-degree angle to strings</li>
                <li>• Weight distributed evenly</li>
                <li>• Loose but controlled grip</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-12 p-8 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-2xl font-semibold text-white mb-4">5. First Sound Production</h2>
          <p className="text-slate-400 mb-6">
            Start with open strings to focus on bow technique before left-hand notes.
          </p>
          <div className="space-y-4">
            <div className="bg-black/30 p-4 rounded-lg">
              <h4 className="text-white font-medium mb-2">Bow Speed</h4>
              <p className="text-slate-400 text-sm">Slow, steady bow strokes. Speed creates volume, not sound quality.</p>
            </div>
            <div className="bg-black/30 p-4 rounded-lg">
              <h4 className="text-white font-medium mb-2">Contact Point</h4>
              <p className="text-slate-400 text-sm">Bow hair should touch strings halfway between bridge and fingerboard.</p>
            </div>
            <div className="bg-black/30 p-4 rounded-lg">
              <h4 className="text-white font-medium mb-2">Pressure</h4>
              <p className="text-slate-400 text-sm">Light pressure creates clear tone. Heavy pressure creates scratchy sound.</p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">6. String Names & Tuning</h2>
          <p className="text-slate-400 mb-6">
            Learn the strings from lowest to highest pitch.
          </p>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-black/40 p-4 rounded-lg text-center">
              <h4 className="text-[#ff5a00] font-medium mb-2">G String</h4>
              <p className="text-slate-400 text-sm">Lowest pitch</p>
              <p className="text-slate-400 text-sm">Thickest string</p>
            </div>
            <div className="bg-black/40 p-4 rounded-lg text-center">
              <h4 className="text-[#ff5a00] font-medium mb-2">D String</h4>
              <p className="text-slate-400 text-sm">Second lowest</p>
              <p className="text-slate-400 text-sm">Medium thickness</p>
            </div>
            <div className="bg-black/40 p-4 rounded-lg text-center">
              <h4 className="text-[#ff5a00] font-medium mb-2">A String</h4>
              <p className="text-slate-400 text-sm">Third highest</p>
              <p className="text-slate-400 text-sm">Medium thin</p>
            </div>
            <div className="bg-black/40 p-4 rounded-lg text-center">
              <h4 className="text-[#ff5a00] font-medium mb-2">E String</h4>
              <p className="text-slate-400 text-sm">Highest pitch</p>
              <p className="text-slate-400 text-sm">Thinnest string</p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">7. Common Setup Mistakes</h2>
          <div className="space-y-3">
            <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-lg">
              <h4 className="text-red-400 font-medium mb-1">Chin Rest Too High</h4>
              <p className="text-slate-400 text-sm">Violin should be level. High chin rest causes neck strain and poor tone.</p>
            </div>
            <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-lg">
              <h4 className="text-red-400 font-medium mb-1">Shoulder Rest Issues</h4>
              <p className="text-slate-400 text-sm">Shoulder rest should fill the gap naturally. Wrong height causes tension.</p>
            </div>
            <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-lg">
              <h4 className="text-red-400 font-medium mb-1">Bow Angle Wrong</h4>
              <p className="text-slate-400 text-sm">Bow should be parallel to bridge. Wrong angle creates uneven sound.</p>
            </div>
          </div>
        </section>

        <div className="flex items-center justify-between pt-6 border-t border-white/10 mb-4">
          <span className="text-sm text-slate-400">Progress: <span className="text-[#ff5a00] font-bold">{progressPercent}%</span></span>
        </div>
        <div className="flex justify-end">
          <Link href="/dashboard/student/violin/lesson-2" className="px-8 py-3 bg-[#ff5a00] text-white rounded-full hover:bg-white hover:text-black" onClick={markLessonComplete}>
            Continue to Lesson 2
          </Link>
        </div>
      </main>
    </div>
  );
}
