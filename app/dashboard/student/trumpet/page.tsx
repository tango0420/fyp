"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, ChevronDown, Play, Clock, BarChart, Music, ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";

const trumpetLessons = [
  {
    title: "Introduction to Trumpet",
    description: "Learn the anatomy of the trumpet, how it produces sound, and proper handling.",
    difficulty: "Beginner",
    duration: "12 min",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail: "https://playthetunes.com/wp-content/uploads/2022/09/The-Trumpet-1024x642.jpg"
  },
  {
    title: "Embouchure & Breathing",
    description: "Master the correct mouth position and breathing technique for producing clear tones.",
    difficulty: "Beginner",
    duration: "15 min",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail: "https://playthetunes.com/wp-content/uploads/2022/09/The-Trumpet-1024x642.jpg"
  },
  {
    title: "Basic Valve Combinations",
    description: "Learn how to use the three valves to produce different pitches and play your first notes.",
    difficulty: "Beginner",
    duration: "18 min",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail: "https://playthetunes.com/wp-content/uploads/2022/09/The-Trumpet-1024x642.jpg"
  },
  {
    title: "Playing Simple Melodies",
    description: "Combine valve techniques with proper breathing to play simple, recognizable melodies.",
    difficulty: "Beginner",
    duration: "20 min",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail: "https://playthetunes.com/wp-content/uploads/2022/09/The-Trumpet-1024x642.jpg"
  },
  {
    title: "Scales & Technique",
    description: "Build finger dexterity and musicality through scales and technical exercises.",
    difficulty: "Intermediate",
    duration: "22 min",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail: "https://playthetunes.com/wp-content/uploads/2022/09/The-Trumpet-1024x642.jpg"
  },
  {
    title: "Jazz and Blues Basics",
    description: "Explore the fundamentals of jazz improvisation and bluesy trumpet sounds.",
    difficulty: "Intermediate",
    duration: "25 min",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail: "https://playthetunes.com/wp-content/uploads/2022/09/The-Trumpet-1024x642.jpg"
  }
];

export default function TrumpetLessonsPage() {
  const curriculumRef = useRef<HTMLElement>(null);
  const { data: session, status } = useSession();
  const [progress, setProgress] = useState<any[]>([]);
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

  const isLessonCompleted = (lessonIdx: number) => {
    return progress.some(p => p.lessonId === String(lessonIdx + 1));
  };

  const progressPercent = progress && Array.isArray(progress)
    ? Math.round((progress.filter(p => p.completed).length / trumpetLessons.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-[#111111] text-slate-300 font-sans antialiased">
      <main className="max-w-5xl mx-auto px-6 pt-20 pb-20">
        <Link 
          href="/dashboard/student/instruments" 
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8"
        >
          <ArrowLeft size={18} />
          <span className="text-xs font-semibold uppercase tracking-widest">Back to Instruments</span>
        </Link>

        <header className="mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">Trumpet Mastery</h1>
          <p className="text-xl text-slate-400">Learn to play trumpet from fundamentals to intermediate techniques</p>
        </header>

        {/* Hero Section */}
        <section className="mb-16 rounded-3xl overflow-hidden bg-gradient-to-r from-[#ff5a00]/20 to-[#1a1a1a] border border-[#ff5a00]/30 p-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">Ready to Learn Trumpet?</h2>
              <p className="text-slate-400 mb-6">Start with the fundamentals and progress through structured lessons designed for beginners.</p>
              <button onClick={scrollToCurriculum} className="px-8 py-3 bg-[#ff5a00] hover:bg-[#ff7a2a] text-white font-semibold rounded-lg transition-colors">
                View Curriculum
              </button>
            </div>
            <img src="https://playthetunes.com/wp-content/uploads/2022/09/The-Trumpet-1024x642.jpg" alt="Trumpet" className="w-48 h-48 object-cover rounded-2xl hidden md:block" />
          </div>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-3 gap-4 mb-16">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-lg p-6 text-center">
            <p className="text-[#ff5a00] text-3xl font-bold">{trumpetLessons.length}</p>
            <p className="text-slate-400 text-sm mt-2">Total Lessons</p>
          </div>
          <div className="bg-[#1a1a1a] border border-white/10 rounded-lg p-6 text-center">
            <p className="text-[#ff5a00] text-3xl font-bold">{progressPercent}%</p>
            <p className="text-slate-400 text-sm mt-2">Your Progress</p>
          </div>
          <div className="bg-[#1a1a1a] border border-white/10 rounded-lg p-6 text-center">
            <p className="text-[#ff5a00] text-3xl font-bold">2h+</p>
            <p className="text-slate-400 text-sm mt-2">Total Duration</p>
          </div>
        </section>

        {/* Curriculum */}
        <section ref={curriculumRef} className="space-y-6">
          <h2 className="text-3xl font-bold text-white mb-8">Curriculum</h2>
          {trumpetLessons.map((lesson, idx) => (
            <Link key={idx} href={`/dashboard/student/trumpet/lesson-${idx + 1}`}>
              <div className={`p-6 rounded-lg border transition-all cursor-pointer ${
                isLessonCompleted(idx)
                  ? "bg-[#1a1a1a]/50 border-[#ff5a00]/50"
                  : "bg-[#1a1a1a] border-white/10 hover:border-[#ff5a00]"
              }`}>
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#ff5a00]/20 flex items-center justify-center">
                    <span className="text-[#ff5a00] font-bold">{idx + 1}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">{lesson.title}</h3>
                    <p className="text-slate-400 text-sm">{lesson.description}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[#ff5a00] text-sm font-semibold">{lesson.difficulty}</p>
                    <p className="text-slate-500 text-xs mt-1">{lesson.duration}</p>
                  </div>
                  {isLessonCompleted(idx) && <div className="text-[#ff5a00] text-2xl">✓</div>}
                </div>
              </div>
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}
