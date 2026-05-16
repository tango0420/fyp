"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";

interface ProgressRecord {
  lessonId?: string;
  completed?: boolean;
}

export default function FluteLesson1() {
  const { data: session, status } = useSession();
  const [progressPercent, setProgressPercent] = useState(0);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      fetch(`/api/progress?userId=${encodeURIComponent(session.user.email)}`)
        .then((res) => res.json())
        .then((data: ProgressRecord[]) => {
          const completed = Array.isArray(data)
            ? data.filter((p: ProgressRecord) => p.completed && typeof p.lessonId === "string" && p.lessonId.startsWith("flute-")).length
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
        body: JSON.stringify({ userId: session.user.email, lessonId: "flute-1" }),
      });
    }
  };

  return (
    <div className="bg-[#0d0d0d] text-slate-300 font-sans antialiased min-h-screen">
      <div className="fixed top-8 left-4 md:left-8 z-20">
        <Link href="/dashboard/student/flute" className="flex items-center gap-2 text-slate-400 hover:text-white bg-black/40 px-4 py-2 rounded-full border border-white/10 shadow-lg transition-all">
          <ArrowLeft size={18} />
          <span className="text-xs font-semibold uppercase tracking-widest">Back</span>
        </Link>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-32 pb-24">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Lesson 1: Breathing & Posture</h1>
          <p className="text-xl text-slate-400 leading-relaxed max-w-3xl">
            The foundation of flute playing begins with breath control and proper body alignment. Master these fundamentals for beautiful, sustained tone.
          </p>
        </header>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">1. Diaphragmatic Breathing</h2>
          <p className="text-slate-400 mb-4 leading-relaxed">
            Flute playing requires controlled, steady air flow. Learn to breathe from your diaphragm rather than your chest.
          </p>
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10 text-slate-400 space-y-2">
            <p><strong className="text-white">How to breathe properly:</strong></p>
            <p>• Place one hand on your stomach, one on your chest</p>
            <p>• Inhale slowly through your nose</p>
            <p>• Feel your stomach expand while chest stays relatively still</p>
            <p>• Exhale slowly and controlled through pursed lips</p>
          </div>
        </section>

        <section className="mb-12 p-8 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-2xl font-semibold text-white mb-4">2. Flute Holding Position</h2>
          <p className="text-slate-400 mb-4">Hold the flute at a 45-degree angle with both hands supporting it evenly.</p>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg text-[#ff5a00] mb-3">Left Hand Position</h3>
              <ul className="text-slate-400 space-y-2">
                <li>• Thumb supports from below</li>
                <li>• Index, middle, ring fingers on keys</li>
                <li>• Pinky rests naturally</li>
                <li>• Elbow slightly bent and away from body</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg text-[#ff5a00] mb-3">Right Hand Position</h3>
              <ul className="text-slate-400 space-y-2">
                <li>• Thumb supports from below</li>
                <li>• Index, middle fingers on keys</li>
                <li>• Ring and pinky fingers curved</li>
                <li>• Elbow bent at comfortable angle</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">3. Embouchure Formation</h2>
          <div className="bg-black/40 p-6 rounded-xl text-center text-[#ff5a00] font-mono text-lg mb-4">
            Relaxed Lips • Firm Corners • Steady Air
          </div>
          <p className="text-slate-400 leading-relaxed mb-4">
            The embouchure (mouth position) directs air across the embouchure hole to create sound.
          </p>
          <ul className="list-disc list-inside text-slate-400 space-y-2">
            <li>Lips should be relaxed but firm at the corners</li>
            <li>Lower lip covers about half of the embouchure hole</li>
            <li>Jaw should be level, not dropped</li>
            <li>Air flows straight across the hole, not down into it</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">4. Posture Fundamentals</h2>
          <div className="grid md:grid-cols-2 gap-4 text-slate-400">
            <div className="bg-white/5 rounded-xl p-4">Stand or sit tall with relaxed shoulders</div>
            <div className="bg-white/5 rounded-xl p-4">Keep feet shoulder-width apart</div>
            <div className="bg-white/5 rounded-xl p-4">Flute at 45-degree angle to the floor</div>
            <div className="bg-white/5 rounded-xl p-4">Head level, looking forward</div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">5. Air Support Exercises</h2>
          <p className="text-slate-400 mb-6">
            Practice these exercises to develop breath control and steady air flow.
          </p>
          <div className="space-y-4">
            <div className="bg-black/30 p-4 rounded-lg">
              <h4 className="text-white font-medium mb-2">Breath Capacity Test</h4>
              <p className="text-slate-400 text-sm">Inhale fully, then exhale slowly while counting. Goal: 20-30 seconds of steady breath.</p>
            </div>
            <div className="bg-black/30 p-4 rounded-lg">
              <h4 className="text-white font-medium mb-2">Lip Buzz</h4>
              <p className="text-slate-400 text-sm">Buzz your lips like a horse while maintaining steady air flow. Practice different pitches.</p>
            </div>
            <div className="bg-black/30 p-4 rounded-lg">
              <h4 className="text-white font-medium mb-2">Air Stream Practice</h4>
              <p className="text-slate-400 text-sm">Hold a piece of paper 6 inches from your mouth. Blow steady air to keep it floating.</p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">6. Common Beginner Mistakes</h2>
          <div className="space-y-3">
            <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-lg">
              <h4 className="text-red-400 font-medium mb-1">Chest Breathing</h4>
              <p className="text-slate-400 text-sm">Shallow chest breathing limits air capacity. Focus on diaphragmatic breathing for better control.</p>
            </div>
            <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-lg">
              <h4 className="text-red-400 font-medium mb-1">Tight Jaw</h4>
              <p className="text-slate-400 text-sm">A tense jaw prevents proper embouchure. Keep your jaw relaxed and flexible.</p>
            </div>
            <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-lg">
              <h4 className="text-red-400 font-medium mb-1">Incorrect Angle</h4>
              <p className="text-slate-400 text-sm">Flute too vertical or horizontal affects tone. 45-degree angle is optimal.</p>
            </div>
          </div>
        </section>

        <div className="flex items-center justify-between pt-6 border-t border-white/10 mb-4">
          <span className="text-sm text-slate-400">Progress: <span className="text-[#ff5a00] font-bold">{progressPercent}%</span></span>
        </div>

        <div className="flex justify-end">
          <Link href="/dashboard/student/flute/lesson-2" className="px-8 py-3 bg-[#ff5a00] text-white rounded-full hover:bg-white hover:text-black" onClick={markLessonComplete}>
            Continue to Lesson 2
          </Link>
        </div>
      </main>
    </div>
  );
}