"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";
interface ProgressRecord { lessonId?: string; completed?: boolean; }

export default function GuitarLesson5() {
  const { data: session, status } = useSession();
  const [progressPercent, setProgressPercent] = useState(0);
  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      fetch(`/api/progress?userId=${encodeURIComponent(session.user.email)}`).then(r => r.json()).then((data: ProgressRecord[]) => {
        const c = Array.isArray(data) ? data.filter(p => p.completed && typeof p.lessonId === "string" && p.lessonId.startsWith("guitar-")).length : 0;
        setProgressPercent(Math.round((c / 6) * 100));
      });
    }
  }, [status, session]);
  const markLessonComplete = async () => {
    if (status === "authenticated" && session?.user?.email) {
      await fetch("/api/progress", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: session.user.email, lessonId: "guitar-5" }) });
    }
  };
  return (
    <div className="bg-[#0d0d0d] text-slate-300 font-sans antialiased min-h-screen">
      <div className="fixed top-8 left-4 md:left-8 z-20">
        <Link href="/dashboard/student/guitar" className="flex items-center gap-2 text-slate-400 hover:text-white bg-black/40 px-4 py-2 rounded-full border border-white/10 shadow-lg transition-all">
          <ArrowLeft size={18} /><span className="text-xs font-semibold uppercase tracking-widest">Back</span>
        </Link>
      </div>
      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-32 pb-24">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Lesson 5: The Pentatonic Scale</h1>
          <p className="text-xl text-slate-400 leading-relaxed max-w-3xl">The minor pentatonic scale is the most used scale in rock, blues, and pop guitar. Learn it in first position and you can start improvising immediately.</p>
        </header>
        <section className="mb-12">
          <h2 className="text-2xl text-white mb-4">1. What is the Pentatonic Scale?</h2>
          <p className="text-slate-400 leading-relaxed mb-4">A pentatonic scale has only 5 notes (penta = five). It sounds good over many chord progressions and is very forgiving for improvisation — almost any note works.</p>
          <div className="bg-black/40 p-6 rounded-xl text-[#ff5a00] font-mono text-center">A Minor Pentatonic: A – C – D – E – G</div>
        </section>
        <section className="mb-12 p-8 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-2xl text-white mb-4">2. Box 1 Pattern (Open Position)</h2>
          <div className="bg-black/40 p-6 rounded-xl text-[#ff5a00] font-mono text-sm leading-loose">
            <p>e |---0---3---|</p>
            <p>B |---0---3---|</p>
            <p>G |---0---2---|</p>
            <p>D |---0---2---|</p>
            <p>A |---0---2---|</p>
            <p>E |---0---3---|</p>
          </div>
          <p className="text-slate-400 mt-4">Play this pattern ascending and descending. Keep your fingers close to the fretboard and use alternate picking (down-up-down-up).</p>
        </section>
        <section className="mb-12">
          <h2 className="text-2xl text-white mb-4">3. Improvise Over a Backing Track</h2>
          <ul className="list-disc list-inside text-slate-400 space-y-2">
            <li>Find an "A minor blues backing track" on YouTube.</li>
            <li>Play notes from the pentatonic pattern randomly — trust your ear.</li>
            <li>Try repeating short 2–3 note phrases instead of running scales.</li>
            <li>Leave silence. Space between notes is musical too.</li>
          </ul>
        </section>
        <section className="mb-16">
          <h2 className="text-2xl text-white mb-4">4. Reference Video</h2>
          <div className="flex justify-center">
            <div className="w-full max-w-3xl aspect-video rounded-xl border border-white/10 overflow-hidden">
              <iframe src="https://www.youtube.com/embed/iE5ioxhATpk" title="Pentatonic scale guitar" allowFullScreen className="w-full h-full rounded-xl" style={{ minHeight: 315 }} />
            </div>
          </div>
        </section>
        <div className="flex items-center justify-between pt-6 border-t border-white/10 mb-4">
          <span className="text-sm text-slate-400">Progress: <span className="text-[#ff5a00] font-bold">{progressPercent}%</span></span>
        </div>
        <div className="flex justify-end">
          <Link href="/dashboard/student/guitar/lesson-6" className="px-8 py-3 bg-[#ff5a00] text-white rounded-full hover:bg-white hover:text-black" onClick={markLessonComplete}>Continue to Lesson 6</Link>
        </div>
      </main>
    </div>
  );
}