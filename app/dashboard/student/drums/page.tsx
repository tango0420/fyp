"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, ChevronDown, Play, Clock, BarChart, Music, ArrowLeft, Drum } from "lucide-react";
import { useSession } from "next-auth/react";

interface ProgressItem {
  lessonId: string;
  completed: boolean;
}

const drumLessons = [
  {
    id: "drums-1",
    title: "Drum Kit Anatomy & Grip",
    description: "Learn the parts of the kit, matched grip, rebound, and the posture that powers every strong drummer.",
    difficulty: "Beginner",
    duration: "18 min",
    thumbnail: "https://images.unsplash.com/photo-1524230613590-d89046019952?q=80&w=800"
  },
  {
    id: "drums-2",
    title: "The Basic 4/4 Groove",
    description: "Coordinate hi-hat, snare, and kick to play the first beat used in rock, pop, and worship music.",
    difficulty: "Beginner",
    duration: "22 min",
    thumbnail: "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?q=80&w=800"
  },
  {
    id: "drums-3",
    title: "Rudiments & Stick Control",
    description: "Build your hands with single strokes, doubles, and paradiddles to improve speed and control.",
    difficulty: "Beginner",
    duration: "24 min",
    thumbnail: "https://images.unsplash.com/photo-1543443258-92b04ad5ecf5?q=80&w=800"
  },
  {
    id: "drums-4",
    title: "Limb Independence",
    description: "Train your hands and feet to do different jobs at the same time without losing the pulse.",
    difficulty: "Intermediate",
    duration: "26 min",
    thumbnail: "https://images.unsplash.com/photo-1594132174009-082046487e41?q=80&w=800"
  },
  {
    id: "drums-5",
    title: "Fills, Dynamics & Transitions",
    description: "Add movement and expression to your grooves with controlled fills, accents, and smooth transitions.",
    difficulty: "Intermediate",
    duration: "28 min",
    thumbnail: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=800"
  },
  {
    id: "drums-6",
    title: "Performance Groove Lab",
    description: "Put everything together into a complete practice performance and submit it for tutor review.",
    difficulty: "Intermediate",
    duration: "32 min",
    thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=800"
  },
];

export default function DrumsDashboard() {
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

  const isLessonCompleted = (lessonId: string) => {
    return progress.some(p => p.lessonId === lessonId && p.completed);
  };

  const completedCount = progress.filter(p => p.lessonId.startsWith('drums') && p.completed).length;
  const progressPercent = Math.round((completedCount / drumLessons.length) * 100);

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-slate-300 font-sans antialiased">
      <div className="fixed top-8 right-8 z-20">
        <Link href="/dashboard/student" className="flex items-center gap-2 text-slate-400 hover:text-white bg-black/40 px-4 py-2 rounded-full border border-white/10 shadow-lg transition-all backdrop-blur-md">
          <ArrowLeft size={18} />
          <span className="text-xs font-semibold uppercase tracking-widest">Back</span>
        </Link>
      </div>

      <main className="w-full">
        <section className="relative h-[60vh] min-h-[500px] bg-[#1a1a1a] overflow-hidden flex flex-col justify-center border-b border-white/5">
          <img 
            src="https://images.unsplash.com/photo-1524230613590-d89046019952?q=80&w=2400" 
            className="absolute inset-0 w-full h-full object-cover opacity-20"
            alt="Drum Kit"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-transparent" />
          
          <div className="relative z-10 px-8 md:px-16 lg:px-24 max-w-5xl">
            <div className="flex items-center gap-3 text-[#ff5a00] text-[10px] font-bold uppercase tracking-[0.5em] mb-6">
              <Drum size={14} /> Rhythm & Percussion
            </div>
            <h1 className="text-6xl lg:text-5xl font-medium text-white mb-8 tracking-tighter leading-none">
              Drum <br/><span className="italic font-light opacity-80 text-5xl lg:text-6xl text-slate-400">Mastery.</span>
            </h1>
            <p className="text-lg text-slate-400 font-medium leading-relaxed mb-10 max-w-xl">
              Develop your internal clock, master your rudiments, and learn to drive the band with precision.
            </p>
            <div className="flex items-center gap-12">
              <div className="flex flex-col text-center">
                <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mb-1">Modules</span>
                <span className="text-2xl font-semibold text-white">06</span>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="flex flex-col text-center">
                <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mb-1">Time</span>
                <span className="text-2xl font-semibold text-white">150m</span>
              </div>
            </div>
          </div>

          <button onClick={scrollToCurriculum} className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500 hover:text-white transition-all group">
            <span className="text-[9px] font-bold uppercase tracking-[0.3em]">Curriculum</span>
            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center animate-bounce">
              <ChevronDown size={18} />
            </div>
          </button>
        </section>

        <section ref={curriculumRef} className="px-8 md:px-16 lg:px-24 py-24">
          <div className="flex items-end justify-between mb-20 border-b border-white/5 pb-10">
            <div>
              <h2 className="text-4xl font-semibold text-white tracking-tight">Curriculum</h2>
              <p className="text-sm text-slate-600 mt-2 font-medium uppercase tracking-widest">Rhythm Foundations</p>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-[#ff5a00] uppercase tracking-widest">
                {loading ? "Loading..." : `${progressPercent}% Complete`}
              </span>
            </div>
          </div>

          <div className="space-y-6">
            {drumLessons.map((lesson, idx) => (
              <div key={lesson.id} className="group flex flex-col md:flex-row items-center gap-12 py-10 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-all px-6 -mx-6 rounded-3xl">
                <div className="relative w-full md:w-72 aspect-video rounded-2xl overflow-hidden shrink-0 border border-white/10">
                  <img src={lesson.thumbnail} className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" alt="" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-[#ff5a00] flex items-center justify-center text-white">
                      <Play size={20} fill="currentColor" />
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-[11px] font-bold text-slate-700 tracking-[0.3em]">DRUM-0{idx + 1}</span>
                    <h3 className="text-2xl font-semibold text-slate-200 group-hover:text-white transition-colors">{lesson.title}</h3>
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

                <div className="flex flex-col items-center">
                  {isLessonCompleted(lesson.id) && (
                    <span className="text-[10px] text-green-500 font-bold uppercase tracking-widest mb-3">Mastered</span>
                  )}
                  <Link
                    href={`/dashboard/student/drums/lesson-${idx + 1}`}
                    className="whitespace-nowrap px-10 py-4 rounded-full border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center gap-3"
                  >
                    {isLessonCompleted(lesson.id) ? "Review" : "Start"} <ChevronRight size={14} />
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