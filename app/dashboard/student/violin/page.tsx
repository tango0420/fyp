"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, ChevronDown, Play, Clock, BarChart, Music, ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";

interface ProgressItem {
  lessonId: string;
  completed?: boolean;
}

const violinLessons = [
  {
    id: "violin-1",
    title: "Violin Anatomy & Posture",
    description: "Understand the parts of the violin, how to hold it correctly, and how posture affects tone and comfort.",
    difficulty: "Beginner",
    duration: "18 min",
    videoUrl: "https://www.youtube.com/watch?v=Tnkhp6jLkMw",
    thumbnail: "https://images.unsplash.com/photo-1465821185615-20b3c2fbf41b?q=80&w=800"
  },
  {
    id: "violin-2",
    title: "Bow Hold & Open Strings",
    description: "Develop a relaxed bow hold and produce your first clean sounds on the open strings.",
    difficulty: "Beginner",
    duration: "22 min",
    videoUrl: "https://www.youtube.com/watch?v=YOTiM1aCVNQ",
    thumbnail: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=800"
  },
  {
    id: "violin-3",
    title: "First Finger Notes",
    description: "Place your first fingers accurately and begin reading simple pitch patterns on the A and D strings.",
    difficulty: "Beginner",
    duration: "24 min",
    videoUrl: "https://www.youtube.com/watch?v=U8BfYQxSx6Q",
    thumbnail: "https://images.unsplash.com/photo-1458560871784-56d23406c091?q=80&w=800"
  },
  {
    id: "violin-4",
    title: "Rhythm & Bowing Patterns",
    description: "Coordinate left-hand notes with steady rhythms and basic bowing styles such as détaché and legato.",
    difficulty: "Intermediate",
    duration: "26 min",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail: "https://images.unsplash.com/photo-1514119412350-e174d90d280e?q=80&w=800"
  },
  {
    id: "violin-5",
    title: "Intonation & Ear Training",
    description: "Train your ear, improve finger placement, and learn how to stay in tune without relying only on your eyes.",
    difficulty: "Intermediate",
    duration: "28 min",
    videoUrl: "https://www.youtube.com/watch?v=7YhKZPZsTzA",
    thumbnail: "https://images.unsplash.com/photo-1516280030429-27679b3dc9cf?q=80&w=800"
  },
  {
    id: "violin-6",
    title: "First Melody Performance",
    description: "Bring posture, rhythm, intonation, and bow control together in a short performance challenge.",
    difficulty: "Intermediate",
    duration: "30 min",
    videoUrl: "https://www.youtube.com/watch?v=H1Dvg2MxQn8",
    thumbnail: "https://images.unsplash.com/photo-1465821185615-20b3c2fbf41b?q=80&w=800"
  },
];

export default function ViolinLessonsPage() {
  const curriculumRef = useRef<HTMLElement>(null);
  const { data: session, status } = useSession();
  const [progress, setProgress] = useState<ProgressItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      fetch(`/api/progress?userId=${encodeURIComponent(session.user.email)}`)
        .then((res) => res.json())
        .then((data) => {
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

  const isLessonCompleted = (lessonId: string) => {
    return progress.some((p) => p.lessonId === lessonId && p.completed);
  };

  const progressPercent = progress.length
    ? Math.round((progress.filter((p) => p.completed && p.lessonId.startsWith("violin-")).length / violinLessons.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-slate-300 font-sans antialiased">
      <div className="absolute top-8 right-8 z-20">
        <Link href="/dashboard/student" className="flex items-center gap-2 text-slate-400 hover:text-white bg-black/40 px-4 py-2 rounded-full border border-white/10 shadow-lg transition-all">
          <ArrowLeft size={18} />
          <span className="text-xs font-semibold uppercase tracking-widest">Back</span>
        </Link>
      </div>

      <main className="w-full">
        <section className="relative h-[60vh] min-h-[500px] bg-[#1a1a1a] overflow-hidden group flex flex-col justify-center border-b border-white/5">
          <img
            src="https://images.unsplash.com/photo-1514119412350-e174d90d280e?q=80&w=2400"
            className="absolute inset-0 w-full h-full object-cover opacity-20 transition-transform duration-1000 group-hover:scale-105"
            alt="Violin Masterclass"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-transparent" />

          <div className="relative z-10 px-8 md:px-16 lg:px-24 max-w-5xl">
            <div className="flex items-center gap-3 text-[#ff5a00] text-[10px] font-bold uppercase tracking-[0.5em] mb-6">
              <Music size={14} /> String Foundations
            </div>
            <h1 className="text-6xl lg:text-5xl font-medium text-white mb-8 tracking-tighter leading-none">
              Violin <br /><span className="italic font-light opacity-80 text-5xl lg:text-6xl">Essentials.</span>
            </h1>
            <p className="text-lg text-slate-400 font-medium leading-relaxed mb-10 max-w-xl">
              Build elegant posture, clean tone, rhythmic control, and expressive bowing through a guided beginner violin path.
            </p>
            <div className="flex items-center gap-12">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mb-1">Modules</span>
                <span className="text-2xl font-semibold text-white">06 Lessons</span>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mb-1">Total Time</span>
                <span className="text-2xl font-semibold text-white">148 Mins</span>
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
            {violinLessons.map((lesson, idx) => (
              <div
                key={lesson.id}
                className="group flex flex-col md:flex-row items-center gap-12 py-12 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-all px-6 -mx-6 rounded-2xl"
              >
                <div className="relative w-full md:w-72 aspect-video rounded-xl overflow-hidden shrink-0 shadow-2xl border border-white/5">
                  <img src={lesson.thumbnail} className="w-full h-full object-cover grayscale opacity-20 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" alt={lesson.title} />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-[#ff5a00] flex items-center justify-center text-white">
                      <Play size={20} fill="currentColor" />
                    </div>
                  </div>
                </div>

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

                <div className="flex flex-col items-center gap-2">
                  {isLessonCompleted(lesson.id) && (
                    <span className="text-xs text-green-400 font-bold uppercase tracking-widest mb-1">Completed</span>
                  )}
                  <Link
                    href={`/dashboard/student/violin/lesson-${idx + 1}`}
                    className="w-full md:w-auto px-12 py-5 rounded-full border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3 group/btn"
                  >
                    {isLessonCompleted(lesson.id) ? "Review Lesson" : "Start Lesson"} <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
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
