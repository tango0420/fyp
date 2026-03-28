"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Lesson2() {
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
        body: JSON.stringify({ userId: session.user.email, lessonId: "2" })
      });
    }
  };

  return (
    <div className=" bg-[#0d0d0d] text-slate-300 font-sans antialiased">
      {/* Back Button */}
      <div className="fixed top-8 left-4 md:left-8 z-20">
        <Link
          href="/dashboard/student/guitar"
          className="flex items-center gap-2 text-slate-400 hover:text-white bg-black/40 px-4 py-2 rounded-full border border-white/10 shadow-lg transition-all"
        >
          <ArrowLeft size={18} />
          <span className="text-xs font-semibold uppercase tracking-widest">
            Back
          </span>
        </Link>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-32 pb-24">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Basic Chords & Strumming
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed">
            In this lesson, you’ll learn how chords work, how to play essential
            open chords, and how to develop a solid strumming rhythm.
          </p>
        </header>

        {/* Guitar Anatomy */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">
            1. Guitar Anatomy
          </h2>

          <p className="text-slate-400 mb-4">
            Before playing chords, it’s important to understand the basic parts
            of the guitar. This helps you follow instructions and communicate
            with other musicians.
          </p>

          <div className="flex justify-center bg-white/5 rounded-xl p-4 mb-6">
            <img
              src="/guitar.png"
              alt="Guitar Anatomy"
              className="max-h-[350px] object-contain"
            />
          </div>

          <ul className="list-disc list-inside space-y-2 text-slate-400">
            <li>
              <b>Headstock:</b> Holds the tuning pegs used to tune each string.
            </li>
            <li>
              <b>Neck:</b> The long part of the guitar where you press notes.
            </li>
            <li>
              <b>Frets:</b> Metal strips that divide notes on the neck.
            </li>
            <li>
              <b>Body:</b> The large part that amplifies sound (acoustic guitar).
            </li>
            <li>
              <b>Strings:</b> Usually six strings, each producing a different
              pitch.
            </li>
          </ul>
        </section>

        {/* Chords Theory */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">
            2. What is a Chord?
          </h2>

          <p className="text-slate-400 mb-4 leading-relaxed">
            A chord is a group of notes played together. In guitar playing,
            chords are formed by pressing different strings on the fretboard and
            strumming them at the same time.
          </p>

          <p className="text-slate-400 mb-4">
            Most beginner songs use <b>open chords</b>, which include some open
            (unpressed) strings. These chords are easier to play and sound full
            and rich.
          </p>
        </section>

        {/* Chords */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">
            3. Essential Open Chords
          </h2>

          <p className="text-slate-400 mb-6">
            Practice these chords slowly. Focus on clarity — every string should
            ring out cleanly.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[
              { name: "C Major", img: "/c.png" },
              { name: "G Major", img: "/g.png" },
              { name: "D Major", img: "/d.png" },
              { name: "E Minor", img: "/e.png" },
              { name: "A Minor", img: "/a.png" },
            ].map((chord) => (
              <div key={chord.name} className="text-center">
                <div className="w-40 h-56 flex items-center justify-center bg-white rounded-lg p-2">
                  <img
                    src={chord.img}
                    alt={chord.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <p className="mt-2 text-sm text-slate-400">{chord.name}</p>
              </div>
            ))}
          </div>

          <ul className="list-disc list-inside text-slate-400 mt-6 space-y-2">
            <li>Press strings with your fingertips, not flat fingers.</li>
            <li>Keep your thumb behind the neck for support.</li>
            <li>If a string sounds muted, adjust finger position.</li>
            <li>Practice switching between chords slowly.</li>
          </ul>
        </section>

        {/* Strumming */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-white mb-4">
            4. Basic Strumming
          </h2>

          <p className="text-slate-400 mb-4">
            Strumming creates rhythm. Think of it as the “heartbeat” of your
            playing.
          </p>

          <div className="bg-black/40 p-6 rounded-xl text-center text-orange-500 font-mono mb-6">
            Down – Down-Up – Up-Down-Up
          </div>

          <p className="text-slate-400 mb-4">
            Count it like this:
          </p>

          <div className="bg-white/5 p-4 rounded-lg text-center text-slate-300 mb-6">
            1 &nbsp; 2 &nbsp; 3 &nbsp; 4
          </div>

          <ul className="list-disc list-inside text-slate-400 space-y-2 mb-6">
            <li>Keep your wrist relaxed — don’t strum stiffly.</li>
            <li>Use small, controlled movements.</li>
            <li>Start slow, then increase speed gradually.</li>
          </ul>

          <div className="flex justify-center">
            <div className="w-full max-w-3xl aspect-video rounded-xl border border-white/10 overflow-hidden">
              <iframe
                src="https://www.youtube.com/embed/8xUjq2KRdFE"
                title="Guitar Strumming Lesson"
                allowFullScreen
                className="w-full h-full rounded-xl"
                style={{ minHeight: 315 }}
              />
            </div>
          </div>
          <div className="flex justify-center mt-10">
  <p className="text-sm text-slate-400 text-center max-w-xl leading-relaxed">
    This is a reference video from YouTube to help you understand the concept.
    If you’d like to go deeper and get personalized guidance, you can book a
    session with one of our expert tutors.
  </p>
</div>
        </section>

        {/* Progress UI */}
        <div className="flex items-center justify-between pt-6 border-t border-white/10 mb-4">
          <span className="text-sm text-slate-400">Progress: <span className="text-[#ff5a00] font-bold">{progressPercent}%</span></span>
        </div>
        {/* Footer */}
        <div className="flex justify-end">
          <Link
            href="/dashboard/student/guitar/lesson-3"
            className="px-8 py-3 bg-orange-500 text-white rounded-full hover:bg-white hover:text-black"
            onClick={markLessonComplete}
          >
            Continue to Lesson 3
          </Link>
        </div>
      </main>
    </div>
  );
}