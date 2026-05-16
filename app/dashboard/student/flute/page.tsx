"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, ChevronDown, Play, Clock, BarChart, Music, ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";

interface ProgressItem {
  lessonId: string;
  completed?: boolean;
}

const fluteLessons = [
  {
    title: "Breathing & Posture",
    description: "Master diaphragmatic breathing and proper flute holding technique for clear, sustained tones.",
    difficulty: "Beginner",
    duration: "15 min",
    thumbnail: "https://i.pinimg.com/736x/46/d0/ce/46d0ced5f167e258fecdae0bed71bd39.jpg"
  },
  {
    title: "First Notes & Fingerings",
    description: "Learn basic finger placements and produce your first clear flute notes.",
    difficulty: "Beginner",
    duration: "18 min",
    thumbnail: "https://i.pinimg.com/736x/11/91/ff/1191ff7cc34b2e50e4173ead88ed86e8.jpg"
  },
  {
    title: "Tone Production",
    description: "Develop embouchure control and consistent tone quality across all registers.",
    difficulty: "Beginner",
    duration: "20 min",
    thumbnail: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=800"
  },
  {
    title: "Simple Melodies",
    description: "Combine technique with rhythm to play your first complete flute pieces.",
    difficulty: "Beginner",
    duration: "25 min",
    thumbnail: "https://images.unsplash.com/photo-1515552726023-7125c8d07fb3?q=80&w=800"
  },
  {
    title: "Articulation & Dynamics",
    description: "Master tonguing techniques and dynamic control for expressive playing.",
    difficulty: "Intermediate",
    duration: "22 min",
    thumbnail: "https://i.pinimg.com/736x/df/b8/2b/dfb82b977ee9d50a72c1607b1138f24d.jpg"
  },
  {
    title: "Performance Preparation",
    description: "Record and refine your playing, preparing for confident musical performance.",
    difficulty: "Intermediate",
    duration: "20 min",
    thumbnail: "https://i.pinimg.com/1200x/e0/56/cc/e056cccf9b2a195f4937c53f80eaf8b2.jpg"
  },
];

export default function FluteDashboard() {
  const curriculumRef = useRef<HTMLElement>(null);
  const { data: session, status } = useSession();
  const [progress, setProgress] = useState<ProgressItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      fetch(`/api/progress?userId=${encodeURIComponent(session.user.email)}`)
        .then(res => res.json())
        .then(data => {
          setProgress(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [status, session]);

  const scrollToCurriculum = () => {
    curriculumRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const isLessonCompleted = (idx: number) => {
    if (!progress || !Array.isArray(progress)) return false;
    return progress.some(p => p.lessonId === `flute-${idx + 1}`);
  };

  const progressPercent = progress && Array.isArray(progress)
    ? Math.round((progress.filter(p => p.completed && p.lessonId.startsWith("flute-")).length / fluteLessons.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-slate-300 font-sans antialiased">
      <div className="absolute top-8 right-8 z-20">
        <Link href="/dashboard/student" className="flex items-center gap-2 text-slate-400 hover:text-white bg-black/40 px-4 py-2 rounded-full border border-white/10 shadow-lg transition-all">
          <ArrowLeft size={18} />
          <span className="text-xs font-semibold uppercase tracking-widest">Back to Hub</span>
        </Link>
      </div>

      <main className="w-full">
        <section className="relative h-[65vh] min-h-[500px] bg-[#111] overflow-hidden group flex flex-col justify-center border-b border-white/5">
          <img 
            src="https://i.pinimg.com/1200x/aa/a9/d5/aaa9d58bbe934f68f3d232ae107796d3.jpg" 
            className="absolute inset-0 w-full h-full object-cover opacity-25 transition-transform duration-1000 group-hover:scale-105"
            alt="Flute"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-transparent" />
          
          <div className="relative z-10 px-8 md:px-16 lg:px-24 max-w-5xl">
            <div className="flex items-center gap-3 text-[#ff5a00] text-[10px] font-bold uppercase tracking-[0.5em] mb-6">
              <Music size={14} /> Flute Mastery Series
            </div>
            <h1 className="text-6xl lg:text-7xl font-medium text-white mb-8 tracking-tighter leading-none">
              Flute <br/><span className="italic font-light opacity-80 text-5xl lg:text-6xl text-slate-400">Fundamentals.</span>
            </h1>
            <p className="text-lg text-slate-400 font-medium leading-relaxed mb-10 max-w-xl">
              From breath control to beautiful melodies. Master the art of wind and wood in harmony.
            </p>
            <div className="flex items-center gap-12">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mb-1">Modules</span>
                <span className="text-2xl font-semibold text-white">06 Lessons</span>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mb-1">Estimated Time</span>
                <span className="text-2xl font-semibold text-white">120 Mins</span>
              </div>
            </div>
          </div>

          <button 
            onClick={scrollToCurriculum}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500 hover:text-white transition-all group/scroll"
          >
            <span className="text-[9px] font-bold uppercase tracking-[0.3em]">View Curriculum</span>
            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center animate-bounce group-hover/scroll:border-[#ff5a00]/50">
              <ChevronDown size={18} />
            </div>
          </button>
        </section>

        <section ref={curriculumRef} className="px-8 md:px-16 lg:px-24 py-24 bg-[#0d0d0d]">
          <div className="flex items-end justify-between mb-20 border-b border-white/5 pb-10">
            <div>
              <h2 className="text-4xl font-semibold text-white tracking-tight">Curriculum</h2>
              <p className="text-sm text-slate-600 mt-2 font-medium uppercase tracking-widest">Flute Beginner Path</p>
            </div>
            <div className="text-right">
              {loading ? (
                <span className="text-sm font-bold text-slate-700 animate-pulse">Syncing...</span>
              ) : (
                <span className="text-sm font-bold text-[#ff5a00]">{progressPercent}% Completed</span>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {fluteLessons.map((lesson, idx) => (
              <div key={idx} className="group flex flex-col md:flex-row items-center gap-12 py-10 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-all px-6 -mx-6 rounded-3xl">
                <div className="relative w-full md:w-72 aspect-video rounded-2xl overflow-hidden shrink-0 border border-white/10">
                  <img src={lesson.thumbnail} className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" alt="" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-[#ff5a00] flex items-center justify-center text-white">
                      <Play size={20} fill="currentColor" />
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-[11px] font-bold text-slate-700 tracking-[0.3em]">0{idx + 1}</span>
                    <h3 className="text-2xl font-semibold text-slate-200 group-hover:text-white transition-colors">{lesson.title}</h3>
                  </div>
                  <p className="text-base text-slate-500 leading-relaxed mb-6 max-w-3xl">{lesson.description}</p>
                  <div className="flex items-center gap-10">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
                      <BarChart size={12} className="text-[#ff5a00]" /> {lesson.difficulty}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
                      <Clock size={12} /> {lesson.duration}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-2">
                  {isLessonCompleted(idx) && (
                    <span className="text-xs text-green-400 font-bold uppercase tracking-widest mb-1">Completed</span>
                  )}
                  <Link
                    href={`/dashboard/student/flute/lesson-${idx + 1}`}
                    className="w-full md:w-auto px-12 py-5 rounded-full border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3"
                  >
                    {isLessonCompleted(idx) ? 'Review Lesson' : 'Start Lesson'} <ChevronRight size={14} className="transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}