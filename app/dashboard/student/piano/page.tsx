"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, ChevronDown, Play, Clock, BarChart, Music, ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";

interface ProgressItem {
  lessonId: string;
  completed?: boolean;
}

const pianoLessons = [
  {
    title: "Geography of the Keys",
    description: "Identify the pattern of black and white keys, find Middle C, and understand the musical alphabet on a keyboard.",
    difficulty: "Beginner",
    duration: "12 min",
    videoUrl: "https://www.youtube.com/watch?v=PwNHe0vui0k",
    thumbnail: "https://images.unsplash.com/photo-1552422535-c45813c61732?q=80&w=800"
  },
  {
    title: "Hand Posture & Fingering",
    description: "Learn the 'claw' technique and the numbering system (1-5) essential for playing fluid melodies.",
    difficulty: "Beginner",
    duration: "15 min",
    videoUrl: "https://www.youtube.com/watch?v=3uun_S_vXvE",
    thumbnail: "https://i.pinimg.com/736x/b3/46/6b/b3466b35ad291880945a8f3f9f39359d.jpg"
  },
  {
    title: "The C Major Scale",
    description: "Your first linear movement. Master the thumb-tuck technique to play a full octave smoothly.",
    difficulty: "Beginner",
    duration: "18 min",
    videoUrl: "https://www.youtube.com/watch?v=83S8WfS_P_Y",
    thumbnail: "https://i.pinimg.com/1200x/2c/60/84/2c6084871f12ef660645ca361bd010a0.jpg"
  },
  {
    title: "Basic Triads & Chords",
    description: "Build 3-note chords (C, F, and G) to provide the harmonic foundation for thousands of songs.",
    difficulty: "Beginner",
    duration: "22 min",
    videoUrl: "https://www.youtube.com/watch?v=Yp69Y6pQnSc",
    thumbnail: "https://i.pinimg.com/736x/e7/cd/87/e7cd87443e7ec289a5e9bb4fd1c5d151.jpg"
  },
];

export default function PianoDashboard() {
  const curriculumRef = useRef<HTMLElement>(null);
  const { data: session, status } = useSession();
  const [progress, setProgress] = useState<ProgressItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      // Fetching progress specifically for piano
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
    // We'll use a string ID like "piano-1" to distinguish from guitar-1
    return progress.some(p => p.lessonId === `piano-${idx + 1}`);
  };

  const progressPercent = progress && Array.isArray(progress)
    ? Math.round((progress.filter(p => p.completed && p.lessonId.startsWith("piano-")).length / pianoLessons.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-slate-300 font-sans antialiased">
      {/* Navigation */}
      <div className="absolute top-8 right-8 z-20">
        <Link href="/dashboard/student" className="flex items-center gap-2 text-slate-400 hover:text-white bg-black/40 px-4 py-2 rounded-full border border-white/10 shadow-lg transition-all">
          <ArrowLeft size={18} />
          <span className="text-xs font-semibold uppercase tracking-widest">Back to Hub</span>
        </Link>
      </div>

      <main className="w-full">
        {/* Cinematic Piano Header */}
        <section className="relative h-[65vh] min-h-[500px] bg-[#111] overflow-hidden group flex flex-col justify-center border-b border-white/5">
          <img 
            src="https://i.pinimg.com/736x/7d/14/75/7d14752a3a49a938ed6afdcb4ecbd0d4.jpg" 
            className="absolute inset-0 w-full h-full object-cover opacity-25 transition-transform duration-1000 group-hover:scale-105"
            alt="Piano Keys"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-transparent" />
          
          <div className="relative z-10 px-8 md:px-16 lg:px-24 max-w-5xl">
            <div className="flex items-center gap-3 text-[#ff5a00] text-[10px] font-bold uppercase tracking-[0.5em] mb-6">
              <Music size={14} /> Ivory Mastery Series
            </div>
            <h1 className="text-6xl lg:text-7xl font-medium text-white mb-8 tracking-tighter leading-none">
              Piano <br/><span className="italic font-light opacity-80 text-5xl lg:text-6xl text-slate-400">Foundations.</span>
            </h1>
            <p className="text-lg text-slate-400 font-medium leading-relaxed mb-10 max-w-xl">
              From the first touch of Middle C to polyphonic coordination. Master the geometry of the keyboard.
            </p>
            <div className="flex items-center gap-12">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mb-1">Modules</span>
                <span className="text-2xl font-semibold text-white">04 Lessons</span>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mb-1">Estimated Time</span>
                <span className="text-2xl font-semibold text-white">67 Mins</span>
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

        {/* Lesson List */}
        <section ref={curriculumRef} className="px-8 md:px-16 lg:px-24 py-24 bg-[#0d0d0d]">
          <div className="flex items-end justify-between mb-20 border-b border-white/5 pb-10">
            <div>
              <h2 className="text-4xl font-semibold text-white tracking-tight">Curriculum</h2>
              <p className="text-sm text-slate-600 mt-2 font-medium uppercase tracking-widest">Piano Beginner Path</p>
            </div>
            <div className="text-right">
              {loading ? (
                <span className="text-sm font-bold text-slate-700 animate-pulse">Syncing...</span>
              ) : (
                <span className="text-sm font-bold text-[#ff5a00]">{progressPercent}% Completed</span>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {pianoLessons.map((lesson, idx) => (
              <div 
                key={idx} 
                className="group flex flex-col md:flex-row items-center gap-12 py-10 border-b border-white/5 last:border-0 hover:bg-white/[0.01] transition-all px-6 -mx-6 rounded-3xl"
              >
                {/* Image Container */}
                <div className="relative w-full md:w-80 aspect-video rounded-2xl overflow-hidden shrink-0 shadow-2xl border border-white/5">
                  <img src={lesson.thumbnail} className="w-full h-full object-cover grayscale opacity-30 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" alt="" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-14 h-14 rounded-full bg-[#ff5a00] flex items-center justify-center text-white shadow-xl">
                      <Play size={24} fill="currentColor" />
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-[11px] font-bold text-slate-700 tracking-[0.4em]">PIANO-0{idx + 1}</span>
                    <h3 className="text-2xl font-semibold text-slate-300 group-hover:text-white transition-colors">{lesson.title}</h3>
                  </div>
                  <p className="text-base text-slate-500 leading-relaxed mb-6 max-w-2xl">{lesson.description}</p>
                  
                  <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-600">
                      <BarChart size={12} className="text-[#ff5a00]" /> {lesson.difficulty}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-600">
                      <Clock size={12} /> {lesson.duration}
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="flex flex-col items-center">
                  {isLessonCompleted(idx) && (
                    <span className="text-[10px] text-green-500 font-black uppercase tracking-tighter mb-2">Lesson Mastered</span>
                  )}
                  <Link
                    href={`/dashboard/student/piano/lesson-${idx + 1}`}
                    className="whitespace-nowrap px-10 py-4 rounded-full border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center gap-3"
                  >
                    {isLessonCompleted(idx) ? "Review" : "Enter Lesson"} <ChevronRight size={14} />
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