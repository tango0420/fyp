"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Lesson3() {
  const { data: session, status } = useSession();
  const [progressPercent, setProgressPercent] = useState(0);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      fetch(`/api/progress?userId=${encodeURIComponent(session.user.email)}`)
        .then(res => res.json())
        .then(data => {
          const completed = Array.isArray(data) ? data.filter(p => p.completed).length : 0;
          setProgressPercent(Math.round((completed / 4) * 100));
        });
    }
  }, [status, session]);

  const markLessonComplete = async () => {
    if (status === "authenticated" && session?.user?.email) {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.email, lessonId: "3" })
      });
    }
  };

  return (
    <div className="bg-[#0d0d0d] text-slate-300 font-sans antialiased">
      {/* Back Button */}
      <div className="fixed top-8 left-4 md:left-8 z-20">
        <Link
          href="/dashboard/student/guitar"
          className="flex items-center gap-2 text-slate-400 hover:text-white bg-black/40 px-4 py-2 rounded-full border border-white/10"
        >
          <ArrowLeft size={18} />
          <span className="text-xs uppercase">Back</span>
        </Link>
      </div>

      <main className="max-w-7xl mx-auto px-4 pt-32 pb-24">
        {/* Header */}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Finger Dexterity Exercises
        </h1>
        <p className="text-lg text-slate-400 mb-12">
          Develop finger independence, precision, and control. These exercises
          will directly improve your chord transitions and overall playing.
        </p>

        {/* THEORY */}
        <section className="mb-12">
          <h2 className="text-2xl text-white mb-4">1. What is Finger Dexterity?</h2>
          <p className="text-slate-400 leading-relaxed mb-4">
            Finger dexterity is your ability to move each finger independently
            with control and accuracy. On guitar, this is essential because each
            finger must press different strings at different times.
          </p>

          <p className="text-slate-400">
            Without proper dexterity, chords will sound muted, transitions will
            feel slow, and playing will require more effort than necessary.
          </p>
        </section>

        {/* FINGER NUMBERING */}
        <section className="mb-12">
          <h2 className="text-2xl text-white mb-4">2. Finger Numbering</h2>

          <div className="flex justify-center mb-6">
            <img
              src="/f1.png"
              className="rounded-xl max-h-[300px]"
            />
          </div>

          <ul className="list-disc list-inside text-slate-400 space-y-2">
            <li>1 = Index finger</li>
            <li>2 = Middle finger</li>
            <li>3 = Ring finger</li>
            <li>4 = Pinky finger</li>
          </ul>
        </section>

        {/* PROPER TECHNIQUE */}
        <section className="mb-12">
          <h2 className="text-2xl text-white mb-4">3. Proper Finger Placement</h2>

          <p className="text-slate-400 mb-6">
            Good technique is more important than speed. Always place your
            fingers just behind the fret, not on top of it.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <img
              src="/f2.png"
              className="rounded-xl"
            />
            <img
              src="/f3.png"
              className="rounded-xl"
            />
          </div>

          <ul className="list-disc list-inside text-slate-400 space-y-2">
            <li>Keep fingers curved (not flat)</li>
            <li>Use fingertips, not finger pads</li>
            <li>Press close to the fret</li>
            <li>Keep your thumb behind the neck</li>
          </ul>
        </section>

        {/* SPIDER */}
        <section className="mb-12">
          <h2 className="text-2xl text-white mb-4">4. Spider Walk Exercise</h2>

          <p className="text-slate-400 mb-4">
            This exercise builds coordination and trains each finger to move
            independently.
          </p>

          <div className="bg-black/40 p-4 rounded-lg font-mono text-orange-500 mb-6 text-sm overflow-x-auto">
{`e|-------------------------1-2-3-4-|
B|-------------------1-2-3-4-------|
G|-------------1-2-3-4-------------|
D|-------1-2-3-4-------------------|
A|-1-2-3-4-------------------------|
E|---------------------------------`}
          </div>

          <p className="text-slate-400">
            Move slowly from the lowest string to the highest. Focus on accuracy,
            not speed.
          </p>
        </section>

        {/* INDEPENDENCE */}
        <section className="mb-12">
          <h2 className="text-2xl text-white mb-4">5. Finger Independence Exercise</h2>

          <div className="bg-black/40 p-4 rounded-lg font-mono text-orange-500 mb-6 text-sm">
{`e|-------------------------1-3-2-4-|
B|-------------------1-3-2-4-------|
G|-------------1-3-2-4-------------|
D|-------1-3-2-4-------------------|
A|-1-3-2-4-------------------------|
E|---------------------------------`}
          </div>

          <p className="text-slate-400">
            This breaks natural finger habits and forces your fingers to move
            independently — critical for advanced playing.
          </p>
        </section>

        {/* PRACTICE */}
        <section className="mb-12">
          <h2 className="text-2xl text-white mb-4">6. Practice Routine</h2>

          <div className="bg-white/5 p-6 rounded-xl space-y-3 text-slate-400">
            <p>• Start at 60 BPM</p>
            <p>• Use a metronome</p>
            <p>• Play slowly and cleanly</p>
            <p>• Practice daily for 5–10 minutes</p>
          </div>
        </section>

        {/* FEEL */}
        <section className="mb-12">
          <h2 className="text-2xl text-white mb-4">7. What You Should Feel</h2>

          <p className="text-slate-400">
            Your fingers should feel controlled, not tense. If your hand feels
            tight or painful, slow down and relax.
          </p>
        </section>

        {/* MISTAKES */}
        <section className="mb-12">
          <h2 className="text-2xl text-white mb-4">8. Common Mistakes</h2>

          <ul className="list-disc list-inside text-slate-400 space-y-2">
            <li>Playing too fast</li>
            <li>Lifting fingers too high</li>
            <li>Ignoring the pinky</li>
            <li>Using too much force</li>
          </ul>
        </section>

        {/* VIDEO */}
        <section className="mb-16">
          <h2 className="text-2xl text-white mb-4">9. Video Reference</h2>

          <div className="flex justify-center mb-6">
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/B0vE6WJQzDQ"
              allowFullScreen
              className="rounded-xl border border-white/10"
            />
          </div>

          <p className="text-sm text-slate-400 text-center max-w-xl mx-auto">
            This is a reference video from YouTube to help you understand the concept.
            If you’d like to go deeper and get personalized guidance, you can book a
            session with one of our expert tutors.
          </p>

          
        </section>

        {/* Progress UI */}
        <div className="flex items-center justify-between pt-6 border-t border-white/10 mb-4">
          <span className="text-sm text-slate-400">Progress: <span className="text-[#ff5a00] font-bold">{progressPercent}%</span></span>
        </div>
        {/* Footer */}
        <div className="flex justify-end">
          <Link
            href="/dashboard/student/guitar/lesson-4"
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