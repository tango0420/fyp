"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, ChevronDown, Play, Clock, BarChart, Music, ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";

const guitarLessons = [
  {
    title: "Introduction to Guitar",
    description: "An overview of the instrument, its anatomy, and the fundamentals of sound production.",
    difficulty: "Beginner",
    duration: "10 min",
    videoUrl: "https://www.youtube.com/watch?v=2wZ1pI_2GNs",
    thumbnail: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=800"
  },
  {
    title: "Basic Chords & Strumming",
    description: "Master essential open chords and rhythmic patterns to start playing your first songs.",
    difficulty: "Beginner",
    duration: "15 min",
    videoUrl: "https://www.youtube.com/watch?v=5mgw7b0XxNU",
    thumbnail: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=800"
  },
  {
    title: "Finger Dexterity Exercises",
    description: "Refined techniques to build finger independence and ensure smooth chord transitions.",
    difficulty: "Beginner",
    duration: "12 min",
    videoUrl: "https://www.youtube.com/watch?v=6U1b7uvqKzk",
    thumbnail: "https://tse4.mm.bing.net/th/id/OIP.Bg95a3hrK17fwCIfo6TacgHaFY?pid=Api&h=220&P=0"
  },
  {
    title: "Playing Your First Song",
    description: "Synthesis of chords and rhythm into a complete musical piece.",
    difficulty: "Beginner",
    duration: "18 min",
    videoUrl: "https://www.youtube.com/watch?v=2wZ1pI_2GNs",
    thumbnail: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=800"
  },
  {
    title: "The Pentatonic Scale",
    description: "The minor pentatonic scale is the most used scale in rock, blues, and pop guitar. Learn it in first position and you can start improvising immediately.",
    difficulty: "Beginner",
    duration: "15 min",
    videoUrl: "https://www.youtube.com/watch?v=iE5ioxhATpk",
    thumbnail: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=800"
  },
  {
    title: "First Song Performance",
    description: "Everything you've learned — chords, strumming, switching, and scale awareness — comes together in a complete musical performance.",
    difficulty: "Beginner",
    duration: "20 min",
    videoUrl: "https://www.youtube.com/watch?v=2wZ1pI_2GNs",
    thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=800"
  },
];

type LessonProgress = {
  lessonId: string;
  completed: boolean;
};

export default function GuitarLessonsPage() {
  const curriculumRef = useRef<HTMLElement>(null);
  const { data: session, status } = useSession();
  const [progress, setProgress] = useState<LessonProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      fetch(`/api/progress?userId=${encodeURIComponent(session.user.email)}`)
        .then(res => res.json())
        .then(data => {
          setProgress(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
    }
  }, [status, session]);

  const scrollToCurriculum = () => {
    curriculumRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Helper to check if a lesson is completed
  const isLessonCompleted = (lessonIdx: number) => {
    if (!progress || !Array.isArray(progress)) return false;
    // lessonId is 1-based, idx is 0-based
    return progress.some(p => p.lessonId == String(lessonIdx + 1));
  };

  // Calculate progress percent
  const progressPercent = progress && Array.isArray(progress)
    ? Math.round((progress.filter(p => p.completed).length / guitarLessons.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-slate-300 font-sans antialiased">
      {/* Back Button */}
      <div className="absolute top-8 right-8 z-20">
        <Link href="/dashboard/student" className="flex items-center gap-2 text-slate-400 hover:text-white bg-black/40 px-4 py-2 rounded-full border border-white/10 shadow-lg transition-all">
          <ArrowLeft size={18} />
          <span className="text-xs font-semibold uppercase tracking-widest">Back</span>
        </Link>
      </div>
      <main className="w-full">
        
        {/* 1. Full-Width Cinematic Header */}
        <section className="relative h-[60vh] min-h-[500px] bg-[#1a1a1a] overflow-hidden group flex flex-col justify-center border-b border-white/5">
          <img 
            src="https://images.unsplash.com/photo-1550291652-6ea9114a47b1?q=80&w=2400" 
            className="absolute inset-0 w-full h-full object-cover opacity-20 transition-transform duration-1000 group-hover:scale-105"
            alt="Guitar Masterclass"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-transparent" />
          
          <div className="relative z-10 px-8 md:px-16 lg:px-24 max-w-5xl">
            <div className="flex items-center gap-3 text-[#ff5a00] text-[10px] font-bold uppercase tracking-[0.5em] mb-6">
              <Music size={14} /> Foundational Series
            </div>
            <h1 className="text-6xl lg:text-5xl font-medium text-white mb-8 tracking-tighter leading-none">
              Acoustic <br/><span className="italic font-light opacity-80 text-5xl lg:text-6xl">Fundamentals.</span>
            </h1>
            <p className="text-lg text-slate-400 font-medium leading-relaxed mb-10 max-w-xl">
              Begin your journey by mastering the anatomy, tuning, and basic hand positions of the world&apos;s most versatile instrument.
            </p>
            <div className="flex items-center gap-12">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mb-1">Modules</span>
                <span className="text-2xl font-semibold text-white">04 Lessons</span>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mb-1">Total Time</span>
                <span className="text-2xl font-semibold text-white">55 Mins</span>
              </div>
            </div>
          </div>

          <button 
            onClick={scrollToCurriculum}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500 hover:text-white transition-all group/scroll"
          >
            <span className="text-[9px] font-bold uppercase tracking-[0.3em]">Curriculum</span>
            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center animate-bounce group-hover/scroll:border-[#ff5a00]/50">
              <ChevronDown size={18} />
            </div>
          </button>
        </section>

        {/* 2. Edge-to-Edge Curriculum List */}
        <section ref={curriculumRef} className="px-8 md:px-16 lg:px-24 py-24">
          <div className="flex items-end justify-between mb-20 border-b border-white/5 pb-10">
            <div>
              <h2 className="text-4xl font-semibold text-white tracking-tight">Curriculum</h2>
              <p className="text-sm text-slate-600 mt-2 font-medium uppercase tracking-widest">Selected Modules for Beginners</p>
            </div>
            <div className="text-right">
              {loading ? (
                <span className="text-sm font-bold text-slate-500">Loading...</span>
              ) : (
                <span className="text-sm font-bold text-[#ff5a00]">{progressPercent}% Progress</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1">
            {guitarLessons.map((lesson, idx) => (
              <div 
                key={idx} 
                className="group flex flex-col md:flex-row items-center gap-12 py-12 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-all px-6 -mx-6 rounded-2xl"
              >
                {/* Visual Anchor */}
                <div className="relative w-full md:w-72 aspect-video rounded-xl overflow-hidden shrink-0 shadow-2xl border border-white/5">
                  <img src={lesson.thumbnail} className="w-full h-full object-cover grayscale opacity-20 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" alt="" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-[#ff5a00] flex items-center justify-center text-white">
                      <Play size={20} fill="currentColor" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 text-left">
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

                {/* Action & Progress */}
                <div className="flex flex-col items-center gap-2">
                  {isLessonCompleted(idx) && (
                    <span className="text-xs text-green-400 font-bold uppercase tracking-widest mb-1">Completed</span>
                  )}
                  {idx === 0 ? (
                    <Link
                      href="/dashboard/student/guitar/lesson-1"
                      className="w-full md:w-auto px-12 py-5 rounded-full border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3 group/btn"
                    >
                      {isLessonCompleted(idx) ? "Review Lesson" : "Start Lesson"} <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  ) : idx === 1 ? (
                    <Link
                      href="/dashboard/student/guitar/lesson-2"
                      className="w-full md:w-auto px-12 py-5 rounded-full border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3 group/btn"
                    >
                      {isLessonCompleted(idx) ? "Review Lesson" : "Start Lesson"} <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  ) : idx === 2 ? (
                    <Link
                      href="/dashboard/student/guitar/lesson-3"
                      className="w-full md:w-auto px-12 py-5 rounded-full border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3 group/btn"
                    >
                      {isLessonCompleted(idx) ? "Review Lesson" : "Start Lesson"} <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  ) : idx === 3 ? (
                    <Link
                      href="/dashboard/student/guitar/lesson-4"
                      className="w-full md:w-auto px-12 py-5 rounded-full border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3 group/btn"
                    >
                      {isLessonCompleted(idx) ? "Review Lesson" : "Start Lesson"} <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  ) : idx === 4 ? (
                    <Link
                      href="/dashboard/student/guitar/lesson-5"
                      className="w-full md:w-auto px-12 py-5 rounded-full border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3 group/btn"
                    >
                      {isLessonCompleted(idx) ? "Review Lesson" : "Start Lesson"} <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  ) : idx === 5 ? (
                    <Link
                      href="/dashboard/student/guitar/lesson-6"
                      className="w-full md:w-auto px-12 py-5 rounded-full border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3 group/btn"
                    >
                      {isLessonCompleted(idx) ? "Review Lesson" : "Start Lesson"} <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  ) : (
                    <a
                      href={lesson.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full md:w-auto px-12 py-5 rounded-full border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3 group/btn"
                    >
                      Start Lesson <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}