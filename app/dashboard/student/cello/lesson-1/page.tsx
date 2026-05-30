"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";

export default function CelloLesson1() {
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
        body: JSON.stringify({ userId: session.user.email, lessonId: "cello-1" })
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
          <h1 className="text-4xl font-bold text-white mb-6">Cello Anatomy & Posture</h1>
          <p className="text-xl text-slate-400">
            Discover the essential parts of the cello, how to sit with balance, and how to hold the instrument so your body stays relaxed throughout practice.
          </p>
        </header>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">1. Understanding the Cello</h2>
          <div className="space-y-4 text-slate-400 leading-relaxed">
            <p>The cello is a string instrument with four strings tuned in fifths: C, G, D, and A. It has three main parts:</p>
            <ul className="space-y-3 ml-4 list-disc">
              <li><strong>Scroll and Pegbox:</strong> where the strings are tuned using the pegs.</li>
              <li><strong>Fingerboard and Neck:</strong> where you press the strings to change pitch.</li>
              <li><strong>Body and Bridge:</strong> which amplifies vibration and projects sound.</li>
            </ul>
          </div>
        </section>

        <section className="mb-12 p-8 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-2xl font-semibold text-white mb-4">2. Sitting Position</h2>
          <p className="text-slate-400 leading-relaxed mb-4">
            Sit on the front half of the chair with both feet flat on the floor. Keep your spine tall and avoid slumping. The cello should rest against your chest with the endpin anchored securely on the floor.
          </p>
          <p className="text-slate-400 leading-relaxed">
            Your knees should be slightly apart so the cello can sit comfortably between them. The instrument should lean naturally against your sternum and not force your shoulders to rise.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">3. Holding the Cello</h2>
          <div className="space-y-4 text-slate-400 leading-relaxed">
            <p>Use a relaxed grip with your left hand on the neck. Your thumb should rest gently behind the neck, and the fingers should hover above the strings in a curved shape.</p>
            <ul className="space-y-3 ml-4 list-disc">
              <li><strong>Keep your wrist straight:</strong> avoid collapsing the wrist inward.</li>
              <li><strong>Lift the fingers:</strong> let them move independently and stay curved.</li>
              <li><strong>Keep shoulders down:</strong> tension in the neck or shoulders will affect tone.</li>
            </ul>
          </div>
        </section>

        <div className="flex items-center justify-between pt-6 border-t border-white/10 mb-4">
          <span className="text-sm text-slate-400">Progress: <span className="text-[#ff5a00] font-bold">{progressPercent}%</span></span>
        </div>

        <div className="flex justify-end">
          <Link
            href="/dashboard/student/cello/lesson-2"
            className="px-8 py-3 bg-[#ff5a00] text-white rounded-full hover:bg-[#ff7a2a] font-semibold transition-colors"
            onClick={markLessonComplete}
          >
            Continue to Lesson 2
          </Link>
        </div>
      </main>
    </div>
  );
}
