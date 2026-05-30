"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function UkuleleLesson2() {
  return (
    <div className=" bg-[#0d0d0d] text-slate-300 font-sans antialiased">
      <div className="fixed top-8 left-4 md:left-8 z-20">
        <Link href="/dashboard/student/ukulele" className="flex items-center gap-2 text-slate-400 hover:text-white bg-black/40 px-4 py-2 rounded-full border border-white/10 shadow-lg transition-all">
          <ArrowLeft size={18} />
          <span className="text-xs font-semibold uppercase tracking-widest">Back</span>
        </Link>
      </div>

      <main className="max-w-7xl mx-auto px-2 md:px-6 pt-32 pb-24">
        <header className="mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">Ukulele: Basic Chords</h1>
          <p className="text-xl text-slate-400 leading-relaxed">Learn open-position chords and efficient left-hand fingering for C, G, Am and F.</p>
        </header>

        <section className="mb-12 p-8 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-2xl font-semibold text-white mb-4">Chord Shapes</h2>
          <ul className="text-slate-400 space-y-3">
            <li><strong>C</strong>: ring finger on 3rd fret A string</li>
            <li><strong>G</strong>: index 2nd fret C, middle 2nd fret A, ring 3rd fret E</li>
            <li><strong>Am</strong>: middle finger 2nd fret G string</li>
            <li><strong>F</strong>: index 1st fret E, middle 2nd fret G</li>
          </ul>
        </section>

        <section className="mb-12">
          <h3 className="text-xl font-semibold text-white mb-4">Practice Routine</h3>
          <ol className="list-decimal ml-5 text-slate-400 space-y-2">
            <li>2 minutes: warm-up finger stretches</li>
            <li>5 minutes: form each chord cleanly</li>
            <li>10 minutes: switch C → G → Am → F with a slow metronome</li>
          </ol>
        </section>

        <div className="flex justify-between items-center pt-6 border-t border-white/10">
          <Link href="/dashboard/student/ukulele/lesson-1" className="px-6 py-2 bg-white/5 text-slate-200 rounded-full">Back</Link>
          <Link href="/dashboard/student/ukulele/lesson-3" className="px-8 py-3 bg-[#ff5a00] text-white rounded-full hover:bg-white hover:text-black">Next: Strumming Patterns</Link>
        </div>
      </main>
    </div>
  );
}
