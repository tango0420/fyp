"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";

const tromboneLessons = [
  {
    title: "Trombone Anatomy & Slide",
    description: "Learn about the unique slide mechanism and how it controls pitch.",
    difficulty: "Beginner",
    duration: "14 min"
  },
  {
    title: "Embouchure & Breathing",
    description: "Develop proper mouth position and air support for clear tones.",
    difficulty: "Beginner",
    duration: "16 min"
  },
  {
    title: "Slide Positions & Scales",
    description: "Master the seven slide positions and begin playing scales.",
    difficulty: "Beginner",
    duration: "18 min"
  },
  {
    title: "Legato & Articulation",
    description: "Learn smooth, connected playing and clear note articulation.",
    difficulty: "Intermediate",
    duration: "20 min"
  },
  {
    title: "Jazz Trombone Basics",
    description: "Explore the fundamentals of jazz trombone improvisation.",
    difficulty: "Intermediate",
    duration: "22 min"
  }
];

export default function TromboneLessonsPage() {
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

  const progressPercent = progress && Array.isArray(progress)
    ? Math.round((progress.filter(p => p.completed).length / tromboneLessons.length) * 100)
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
          <h1 className="text-5xl font-bold text-white mb-4">Trombone Mastery</h1>
          <p className="text-xl text-slate-400">Learn to play trombone with its unique slide technique and powerful sound</p>
        </header>

        <section className="mb-16 rounded-3xl overflow-hidden bg-gradient-to-r from-[#ff5a00]/20 to-[#1a1a1a] border border-[#ff5a00]/30 p-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-4">Master the Slide</h2>
            <p className="text-slate-400 mb-6">Learn the fundamentals of trombone playing from slide positions to jazz improvisation.</p>
            <button onClick={scrollToCurriculum} className="px-8 py-3 bg-[#ff5a00] hover:bg-[#ff7a2a] text-white font-semibold rounded-lg transition-colors">
              View Curriculum
            </button>
          </div>
        </section>

        <section className="grid grid-cols-3 gap-4 mb-16">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-lg p-6 text-center">
            <p className="text-[#ff5a00] text-3xl font-bold">{tromboneLessons.length}</p>
            <p className="text-slate-400 text-sm mt-2">Total Lessons</p>
          </div>
          <div className="bg-[#1a1a1a] border border-white/10 rounded-lg p-6 text-center">
            <p className="text-[#ff5a00] text-3xl font-bold">{progressPercent}%</p>
            <p className="text-slate-400 text-sm mt-2">Your Progress</p>
          </div>
          <div className="bg-[#1a1a1a] border border-white/10 rounded-lg p-6 text-center">
            <p className="text-[#ff5a00] text-3xl font-bold">1.5h+</p>
            <p className="text-slate-400 text-sm mt-2">Total Duration</p>
          </div>
        </section>

        <section ref={curriculumRef} className="space-y-6">
          <h2 className="text-3xl font-bold text-white mb-8">Curriculum</h2>
          {tromboneLessons.map((lesson, idx) => (
            <Link key={idx} href={`/dashboard/student/trombone/lesson-${idx + 1}`}>
              <div className="p-6 rounded-lg bg-[#1a1a1a] border border-white/10 hover:border-[#ff5a00] transition-all cursor-pointer">
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
                </div>
              </div>
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}