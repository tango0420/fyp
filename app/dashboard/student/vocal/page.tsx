"use client";
import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, ChevronDown, Play, Clock, BarChart, Mic, ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";

interface ProgressItem { lessonId: string; completed?: boolean; }

const vocalLessons = [
  { id: "vocal-1", title: "Breathing & Posture for Singers", description: "Discover how diaphragmatic breathing powers your voice, and how posture affects tone, range, and stamina.", difficulty: "Beginner", duration: "18 min", thumbnail: "https://images.unsplash.com/photo-1516280030429-27679b3dc9cf?q=80&w=800" },
  { id: "vocal-2", title: "Vocal Warm-Ups & Registers", description: "Learn essential warm-up exercises and understand the difference between chest voice, head voice, and mixed register.", difficulty: "Beginner", duration: "20 min", thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800" },
  { id: "vocal-3", title: "Pitch Accuracy & Ear Training", description: "Train your ear to recognize and match pitch. Practice intervals, scales, and simple melodic exercises.", difficulty: "Beginner", duration: "22 min", thumbnail: "https://images.unsplash.com/photo-1516280030429-27679b3dc9cf?q=80&w=800" },
  { id: "vocal-4", title: "Resonance & Tone Shaping", description: "Learn how to shape vowels, use mouth and nasal resonance, and develop a fuller, richer vocal tone.", difficulty: "Intermediate", duration: "24 min", thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800" },
  { id: "vocal-5", title: "Dynamics & Vocal Expression", description: "Control volume, emotion, and phrasing to tell a story. Learn how the best singers use dynamics as their greatest tool.", difficulty: "Intermediate", duration: "26 min", thumbnail: "https://images.unsplash.com/photo-1516280030429-27679b3dc9cf?q=80&w=800" },
  { id: "vocal-6", title: "First Song Performance", description: "Choose a song and deliver a complete performance combining breath support, tone, pitch, and expression.", difficulty: "Intermediate", duration: "30 min", thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800" },
];

export default function VocalLessonsPage() {
  const curriculumRef = useRef<HTMLElement>(null);
  const { data: session, status } = useSession();
  const [progress, setProgress] = useState<ProgressItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      fetch(`/api/progress?userId=${encodeURIComponent(session.user.email)}`).then(r => r.json()).then(data => { setProgress(Array.isArray(data) ? data : []); setLoading(false); }).catch(() => setLoading(false));
    } else { setLoading(false); }
  }, [status, session]);

  const isLessonCompleted = (id: string) => progress.some(p => p.lessonId === id && p.completed);
  const progressPercent = progress.length ? Math.round((progress.filter(p => p.completed && p.lessonId.startsWith("vocal-")).length / vocalLessons.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-slate-300 font-sans antialiased">
      <div className="absolute top-8 right-8 z-20">
        <Link href="/dashboard/student" className="flex items-center gap-2 text-slate-400 hover:text-white bg-black/40 px-4 py-2 rounded-full border border-white/10 shadow-lg transition-all">
          <ArrowLeft size={18} /><span className="text-xs font-semibold uppercase tracking-widest">Back</span>
        </Link>
      </div>
      <main className="w-full">
        <section className="relative h-[60vh] min-h-[500px] bg-[#1a1a1a] overflow-hidden group flex flex-col justify-center border-b border-white/5">
          <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2400" className="absolute inset-0 w-full h-full object-cover opacity-20 transition-transform duration-1000 group-hover:scale-105" alt="Vocal" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-transparent" />
          <div className="relative z-10 px-8 md:px-16 lg:px-24 max-w-5xl">
            <div className="flex items-center gap-3 text-[#ff5a00] text-[10px] font-bold uppercase tracking-[0.5em] mb-6">
              <Mic size={14} /> Voice & Expression
            </div>
            <h1 className="text-6xl lg:text-5xl font-medium text-white mb-8 tracking-tighter leading-none">
              Vocal <br /><span className="italic font-light opacity-80 text-5xl lg:text-6xl">Essentials.</span>
            </h1>
            <p className="text-lg text-slate-400 font-medium leading-relaxed mb-10 max-w-xl">
              Your voice is the most personal instrument there is. Learn to breathe, resonate, and express with control and confidence.
            </p>
            <div className="flex items-center gap-12">
              <div className="flex flex-col"><span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mb-1">Modules</span><span className="text-2xl font-semibold text-white">06 Lessons</span></div>
              <div className="w-px h-10 bg-white/10" />
              <div className="flex flex-col"><span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mb-1">Total Time</span><span className="text-2xl font-semibold text-white">140 Mins</span></div>
            </div>
          </div>
          <button onClick={() => curriculumRef.current?.scrollIntoView({ behavior: "smooth" })} className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500 hover:text-white transition-all">
            <span className="text-[9px] font-bold uppercase tracking-[0.3em]">Curriculum</span>
            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center animate-bounce"><ChevronDown size={18} /></div>
          </button>
        </section>

        <section ref={curriculumRef} className="px-8 md:px-16 lg:px-24 py-24">
          <div className="flex items-end justify-between mb-20 border-b border-white/5 pb-10">
            <div><h2 className="text-4xl font-semibold text-white tracking-tight">Curriculum</h2><p className="text-sm text-slate-600 mt-2 font-medium uppercase tracking-widest">Vocal Beginner Path</p></div>
            <div className="text-right">{loading ? <span className="text-sm font-bold text-slate-500">Loading...</span> : <span className="text-sm font-bold text-[#ff5a00]">{progressPercent}% Progress</span>}</div>
          </div>
          <div className="grid grid-cols-1">
            {vocalLessons.map((lesson, idx) => (
              <div key={lesson.id} className="group flex flex-col md:flex-row items-center gap-12 py-12 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-all px-6 -mx-6 rounded-2xl">
                <div className="relative w-full md:w-72 aspect-video rounded-xl overflow-hidden shrink-0 shadow-2xl border border-white/5">
                  <img src={lesson.thumbnail} className="w-full h-full object-cover grayscale opacity-20 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" alt={lesson.title} />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-[#ff5a00] flex items-center justify-center text-white"><Play size={20} fill="currentColor" /></div>
                  </div>
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-[11px] font-bold text-slate-700 tracking-[0.3em]">0{idx + 1}</span>
                    <h3 className="text-2xl font-semibold text-slate-200 group-hover:text-white transition-colors">{lesson.title}</h3>
                  </div>
                  <p className="text-base text-slate-500 leading-relaxed mb-6 max-w-3xl">{lesson.description}</p>
                  <div className="flex items-center gap-10">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600"><BarChart size={12} className="text-[#ff5a00]" /> {lesson.difficulty}</div>
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600"><Clock size={12} /> {lesson.duration}</div>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  {isLessonCompleted(lesson.id) && <span className="text-xs text-green-400 font-bold uppercase tracking-widest mb-1">Completed</span>}
                  <Link href={`/dashboard/student/vocal/lesson-${idx + 1}`} className="w-full md:w-auto px-12 py-5 rounded-full border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3 group/btn">
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