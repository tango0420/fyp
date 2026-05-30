"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function UkuleleLesson5() {
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
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">Ukulele: Rhythm & Dynamics</h1>
          <p className="text-xl text-slate-400 leading-relaxed">Learn how accents, rests and dynamics change the feel of a chord progression.</p>
        </header>

        <section className="mb-12 p-8 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-2xl font-semibold text-white mb-4">Practice</h2>
          <ul className="text-slate-400 space-y-3">
            <li>Play the chord progression softly, then accent the 2 and 4 beats.</li>
            <li>Use palm muting lightly near the bridge for a staccato effect.</li>
          </ul>
        </section>

        <div className="flex justify-between items-center pt-6 border-t border-white/10">
          <Link href="/dashboard/student/ukulele/lesson-4" className="px-6 py-2 bg-white/5 text-slate-200 rounded-full">Back</Link>
          <Link href="/dashboard/student/ukulele/lesson-6" className="px-8 py-3 bg-[#ff5a00] text-white rounded-full hover:bg-white hover:text-black">Next: Fingerpicking Basics</Link>
        </div>
      </main>
    </div>
  );
}
