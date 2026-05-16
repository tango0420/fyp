"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, ChevronDown, Play, Clock, BarChart, Music, ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";

interface ProgressItem {
  lessonId: string;
  completed?: boolean;
}

const saxophoneLessons = [
  {
    title: "Saxophone Anatomy & Reeds",
    description: "Learn the parts of the saxophone, reed types, and how to choose and care for reeds.",
    difficulty: "Beginner",
    duration: "15 min",
    thumbnail: "https://i.pinimg.com/1200x/63/01/ec/6301ec184b15de6277206be0082d026f.jpg"
  },
  {
    title: "Embouchure & Assembly",
    description: "Master the correct embouchure formation and proper saxophone assembly techniques.",
    difficulty: "Beginner",
    duration: "18 min",
    thumbnail: "https://i.pinimg.com/1200x/2a/91/bd/2a91bd3ea6f2c593e8aefbddc6867ff9.jpg"
  },
  {
    title: "First Notes & Fingerings",
    description: "Learn basic finger positions and produce your first clear saxophone notes.",
    difficulty: "Beginner",
    duration: "20 min",
    thumbnail: "https://i.pinimg.com/1200x/9f/0d/7b/9f0d7b3d0a1711ea683f5de888e069ed.jpg"
  },
  {
    title: "Tone Production & Breath",
    description: "Develop a warm, rich tone through proper breathing and embouchure control.",
    difficulty: "Beginner",
    duration: "22 min",
    thumbnail: "https://i.pinimg.com/736x/43/69/2c/43692c62ac19e2cfd745d83a1aafbb4d.jpg"
  },
  {
    title: "Scales & Articulation",
    description: "Master scales, tonguing techniques, and expressive articulation.",
    difficulty: "Intermediate",
    duration: "25 min",
    thumbnail: "https://i.pinimg.com/736x/71/d0/01/71d001653ca3877ee044821eea82e209.jpg"
  },
  {
    title: "Performance Preparation",
    description: "Record and perfect your saxophone performance with professional techniques.",
    difficulty: "Intermediate",
    duration: "20 min",
    thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=800"
  },
];

export default function SaxophoneDashboard() {
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
    return progress.some(p => p.lessonId === `saxophone-${idx + 1}`);
  };

  const progressPercent = progress && Array.isArray(progress)
    ? Math.round((progress.filter(p => p.completed && p.lessonId.startsWith("saxophone-")).length / saxophoneLessons.length) * 100)
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
            src="https://i.pinimg.com/736x/f6/80/d7/f680d750b35ada068ad5e04257038400.jpg" 
            className="absolute inset-0 w-full h-full object-cover opacity-25 transition-transform duration-1000 group-hover:scale-105"
            alt="Saxophone"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-transparent" />
          
          <div className="relative z-10 px-8 md:px-16 lg:px-24 max-w-5xl">
            <div className="flex items-center gap-3 text-[#ff5a00] text-[10px] font-bold uppercase tracking-[0.5em] mb-6">
              <Music size={14} /> Saxophone Mastery Series
            </div>
            <h1 className="text-6xl lg:text-7xl font-medium text-white mb-8 tracking-tighter leading-none">
              Saxophone <br/><span className="italic font-light opacity-80 text-5xl lg:text-6xl text-slate-400">Excellence.</span>
            </h1>
            <p className="text-lg text-slate-400 font-medium leading-relaxed mb-10 max-w-xl">
              From reed selection to smooth jazz improvisation. Master the horn that defined cool.
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
              <p className="text-sm text-slate-600 mt-2 font-medium uppercase tracking-widest">Saxophone Beginner Path</p>
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
            {saxophoneLessons.map((lesson, idx) => (
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
                    href={`/dashboard/student/saxophone/lesson-${idx + 1}`}
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