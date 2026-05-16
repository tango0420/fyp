"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";

interface ProgressRecord {
  lessonId?: string;
  completed?: boolean;
}

export default function BassLesson1() {
  const { data: session, status } = useSession();
  const [progressPercent, setProgressPercent] = useState(0);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      fetch(`/api/progress?userId=${encodeURIComponent(session.user.email)}`)
        .then((res) => res.json())
        .then((data: ProgressRecord[]) => {
          const completed = Array.isArray(data)
            ? data.filter((p: ProgressRecord) => p.completed && typeof p.lessonId === "string" && p.lessonId.startsWith("bass-")).length
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
        body: JSON.stringify({ userId: session.user.email, lessonId: "bass-1" }),
      });
    }
  };

  return (
    <div className="bg-[#0d0d0d] text-slate-300 font-sans antialiased min-h-screen">
      <div className="fixed top-8 left-4 md:left-8 z-20">
        <Link href="/dashboard/student/bass" className="flex items-center gap-2 text-slate-400 hover:text-white bg-black/40 px-4 py-2 rounded-full border border-white/10 shadow-lg transition-all">
          <ArrowLeft size={18} />
          <span className="text-xs font-semibold uppercase tracking-widest">Back</span>
        </Link>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-32 pb-24">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Lesson 1: Bass Anatomy & Setup</h1>
          <p className="text-xl text-slate-400 leading-relaxed max-w-3xl">
            Learn the parts of the electric bass and how to set it up properly for comfortable, confident playing.
          </p>
        </header>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">1. Bass Guitar Parts</h2>
          <p className="text-slate-400 mb-4 leading-relaxed">
            Understanding each component of your bass helps you maintain it and play better.
          </p>
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10 text-slate-400 space-y-2">
            <p><strong className="text-white">Headstock:</strong> holds tuning machines and connects to the neck.</p>
            <p><strong className="text-white">Neck:</strong> the long wooden part with frets where you place your fingers.</p>
            <p><strong className="text-white">Frets:</strong> metal strips that help you play in tune.</p>
            <p><strong className="text-white">Body:</strong> the larger section that vibrates and produces sound.</p>
            <p><strong className="text-white">Strings:</strong> typically E, A, D, G (from thickest to thinnest).</p>
            <p><strong className="text-white">Pickups:</strong> magnetic devices that capture string vibration.</p>
          </div>
        </section>

        <section className="mb-12 p-8 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-2xl font-semibold text-white mb-4">2. Proper Bass Setup</h2>
          <p className="text-slate-400 mb-4">A well-set-up bass is easier to play and sounds better.</p>
          <div className="space-y-4">
            <div className="bg-black/30 p-4 rounded-lg">
              <h4 className="text-white font-medium mb-2">Bridge Height</h4>
              <p className="text-slate-400 text-sm">Action (string height) should be comfortable but not too high. 1-2mm on treble side is typical.</p>
            </div>
            <div className="bg-black/30 p-4 rounded-lg">
              <h4 className="text-white font-medium mb-2">Neck Adjustment</h4>
              <p className="text-slate-400 text-sm">The neck should have a slight curve, not completely straight or bowed.</p>
            </div>
            <div className="bg-black/30 p-4 rounded-lg">
              <h4 className="text-white font-medium mb-2">String Tuning</h4>
              <p className="text-slate-400 text-sm">Keep your bass in tune. Use an electronic tuner for accuracy.</p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">3. Holding the Bass</h2>
          <div className="grid md:grid-cols-2 gap-4 text-slate-400">
            <div className="bg-white/5 rounded-xl p-4">Sit with bass resting on your left thigh at a comfortable angle</div>
            <div className="bg-white/5 rounded-xl p-4">Keep shoulders relaxed and level, not raised toward ears</div>
            <div className="bg-white/5 rounded-xl p-4">Neck should angle upward slightly, not droop down</div>
            <div className="bg-white/5 rounded-xl p-4">Your back should be straight, not hunched over</div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">4. Hand Positioning</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/5 p-6 rounded-xl">
              <h3 className="text-lg text-[#ff5a00] mb-3">Left Hand (Fretting)</h3>
              <ul className="text-slate-400 text-sm space-y-1">
                <li>• Thumb rests behind neck</li>
                <li>• Fingers curved over fretboard</li>
                <li>• Press with fingertips, not flats</li>
                <li>• Wrist should be relaxed</li>
              </ul>
            </div>
            <div className="bg-white/5 p-6 rounded-xl">
              <h3 className="text-lg text-[#ff5a00] mb-3">Right Hand (Plucking)</h3>
              <ul className="text-slate-400 text-sm space-y-1">
                <li>• Thumb rests on pickup</li>
                <li>• Index and middle fingers pluck</li>
                <li>• Keep wrist neutral and relaxed</li>
                <li>• Generate tone from larger muscles</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-white mb-4">5. Reference Video</h2>
          <div className="flex justify-center">
            <div className="w-full max-w-3xl aspect-video rounded-xl border border-white/10 overflow-hidden">
              <iframe
                src="https://www.youtube.com/embed/C1HMeJ_h0AU"
                title="Bass Guitar Setup and Anatomy"
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
          <Link href="/dashboard/student/bass/lesson-2" className="px-8 py-3 bg-[#ff5a00] text-white rounded-full hover:bg-white hover:text-black" onClick={markLessonComplete}>
            Continue to Lesson 2
          </Link>
        </div>
      </main>
    </div>
  );
}