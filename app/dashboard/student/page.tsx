"use client";

import React, { useEffect, useState } from "react";
import { MessageSquare } from "lucide-react";

import Link from "next/link";
import { Disc, Bell, Search, Play, Clock, BarChart3, Layers, Settings, ChevronRight } from "lucide-react";
import { useSession } from "next-auth/react";

const instruments = [
  { name: "Guitar", type: "Electric / Acoustic", image: "https://images.unsplash.com/photo-1550291652-6ea9114a47b1?q=80&w=800&auto=format&fit=crop" },
  { name: "Piano", type: "Grand / Digital", image: "https://cdn.pixabay.com/photo/2023/03/31/18/44/piano-7890735_1280.jpg" },
  { name: "Drums", type: "Percussion", image: "https://images.unsplash.com/photo-1543443374-b6fe10a6ab7b?q=80&w=800&auto=format&fit=crop" },
  { name: "Violin", type: "Classical", image: "https://www.sweetwater.com/sweetcare/media/2022/12/10_Violin-Playing-Position.jpg" },
];


export default function MinimalistDashboard() {
  const [userProgress, setUserProgress] = useState({});
  const { data: session, status } = useSession();
  const [guitarProgress, setGuitarProgress] = useState(0);
  const [guitarCompleted, setGuitarCompleted] = useState(0);
  const [guitarLessonsCount] = useState(4);
  const [pianoProgress, setPianoProgress] = useState(0);
  const [pianoCompleted, setPianoCompleted] = useState(0);
  const [pianoLessonsCount] = useState(4);
  const [drumProgress, setDrumProgress] = useState(0);
  const [drumCompleted, setDrumCompleted] = useState(0);
  const [drumLessonsCount] = useState(6);
  const [violinProgress, setViolinProgress] = useState(0);
  const [violinCompleted, setViolinCompleted] = useState(0);
  const [violinLessonsCount] = useState(6);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const [showReviews, setShowReviews] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const router = require('next/navigation').useRouter();
  const fetchReviews = async () => {
    if (!session?.user?.email) return;
    setLoadingReviews(true);
    setShowReviews(true);
    try {
      const res = await fetch(`/api/user-reviews?userId=${encodeURIComponent(session.user.email)}`);
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch {
      setReviews([]);
    }
    setLoadingReviews(false);
  };
  useEffect(() => {
    if (session?.user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUserProgress({
        practiceStreak: 12,
        weeklyGoal: 65,
      });
    }

    if (status === "authenticated" && session?.user?.email) {
      fetch(`/api/progress?userId=${encodeURIComponent(session.user.email)}`)
        .then(res => res.json())
        .then(data => {
          const completedLessons = Array.isArray(data)
            ? data.filter((p: { lessonId?: string; completed?: boolean }) => p.completed)
            : [];

          const guitarOnly = completedLessons.filter(
            (p: { lessonId?: string }) => typeof p.lessonId === "string" && /^\d+$/.test(p.lessonId)
          );
          const pianoOnly = completedLessons.filter(
            (p: { lessonId?: string }) => typeof p.lessonId === "string" && p.lessonId.startsWith("piano-")
          );
          const drumOnly = completedLessons.filter(
            (p: { lessonId?: string }) => typeof p.lessonId === "string" && p.lessonId.startsWith("drums-")
          );
          const violinOnly = completedLessons.filter(
            (p: { lessonId?: string }) => typeof p.lessonId === "string" && p.lessonId.startsWith("violin-")
          );

          setGuitarCompleted(guitarOnly.length);
          setGuitarProgress(Math.round((guitarOnly.length / guitarLessonsCount) * 100));
          setPianoCompleted(pianoOnly.length);
          setPianoProgress(Math.round((pianoOnly.length / pianoLessonsCount) * 100));
          setDrumCompleted(drumOnly.length);
          setDrumProgress(Math.round((drumOnly.length / drumLessonsCount) * 100));
          setViolinCompleted(violinOnly.length);
          setViolinProgress(Math.round((violinOnly.length / violinLessonsCount) * 100));
        });
    }

    // Fetch all teachers for suggested tutors
    fetch('/api/all-teachers')
      .then(res => res.json())
      .then(data => {
        setTeachers(data.teachers || []);
        setLoadingTeachers(false);
      })
      .catch(() => setLoadingTeachers(false));
  }, [session, status, guitarLessonsCount, pianoLessonsCount, drumLessonsCount, violinLessonsCount]);

  return (
    <div className="min-h-screen bg-[#111111] text-slate-300 font-sans antialiased">
      
      {/* 1. Sidebar - Strictly Grayscale */}
      <aside className="fixed left-0 top-0 h-full w-20 z-50 border-r border-white/5 bg-[#1a1a1a] flex flex-col items-center py-10">
        <div className="mb-12">
          <Disc size={24} className="text-[#ff5a00]" />
        </div>
        <nav className="flex flex-col gap-10 text-slate-600">
          <Layers size={22} className="text-slate-200 cursor-pointer" />
          <BarChart3 size={22} className="hover:text-white transition-colors cursor-pointer" />
          <Settings size={22} className="hover:text-white transition-colors cursor-pointer" />
        </nav>
      </aside>

      <main className="pl-20 max-w-[1440px] mx-auto">
        
        {/* 2. Header - Simple & Clean */}
        <header className="fixed top-0 left-20 right-0 z-40 h-20 px-12 flex items-center justify-between border-b border-white/5 bg-[#111111]">
          <div className="flex items-center gap-4 text-sm font-medium tracking-tight">
             <span className="text-slate-600">Virtuoso</span>
             <span className="text-slate-800">/</span>
             <span className="text-slate-200">Dashboard</span>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="relative group border-r border-white/5 pr-8">
              <Search size={18} className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-600" />
              <input type="text" placeholder="Search..." className="bg-transparent border-none text-sm pl-8 outline-none w-48 placeholder:text-slate-700" />
            </div>
            <div className="flex items-center gap-4">
                <p className="text-sm font-semibold text-slate-200">
  {session?.user?.name || "User"}
</p>
<div className="w-10 h-10 rounded-full bg-slate-800 overflow-hidden border border-white/10 flex items-center justify-center">
  {session?.user?.image ? (
    <img src={session.user.image} alt="Avatar" className="grayscale w-full h-full object-cover" />
  ) : (
    <span className="text-lg text-white font-bold">
      {session?.user?.name ? session.user.name[0] : "U"}
    </span>
  )}
</div>
            </div>
          </div>
        </header>

        <div className="pl-5 pt-30 px-12 py-12 grid grid-cols-12 gap-12">
          
          {/* Main Section */}
          <div className="col-span-12 lg:col-span-8 space-y-16">
            
          
            {/* Welcome Section for First-Time Users */}
            <section className="relative overflow-hidden rounded-3xl bg-[#1a1a1a] border border-white/5 flex flex-col items-center justify-center text-center py-20 px-8">
              <img 
                src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2070&auto=format&fit=crop" 
                className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none select-none"
                alt="Studio"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#111111] via-[#111111]/40 to-transparent" />
              <div className="relative z-10 flex flex-col items-center">
                <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">Welcome to Virtuoso!</h2>
                <p className="text-lg text-slate-400 mb-8 max-w-xl">Start your musical journey by exploring instruments below. Choose an instrument to discover beginner-friendly lessons and get started!</p>
                <span className="text-xs text-slate-500">No lessons yet. Explore and enroll to begin learning!</span>
              </div>
            </section>
            {/* Your Learning Progress Cards */}
            {guitarCompleted > 0 && (
              <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#181818] to-[#232323] border border-white/5 flex flex-col md:flex-row items-center justify-between px-8 py-8 mb-8 shadow-lg">
                <div className="flex flex-col items-start md:items-center md:flex-row gap-6 w-full">
                  <img src="https://images.unsplash.com/photo-1550291652-6ea9114a47b1?q=80&w=400" alt="Guitar" className="w-28 h-28 object-cover rounded-2xl border border-white/10 shadow" />
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Guitar Course Progress</h2>
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-lg font-semibold text-[#ff5a00]">{guitarProgress}%</span>
                      <span className="text-xs text-slate-400">({guitarCompleted} of {guitarLessonsCount} lessons completed)</span>
                    </div>
                    <div className="w-full h-0.5 bg-[#222] rounded-full overflow-hidden mb-2">
                      <div className="h-full bg-[#ff5a00] transition-all" style={{ width: `${guitarProgress}%` }} />
                    </div>
                    <Link href="/dashboard/student/guitar" className="inline-block mt-2 px-6 py-2 rounded-full bg-[#ff5a00] text-white font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all">Resume Learning</Link>
                  </div>
                </div>
              </section>
            )}

            {pianoCompleted > 0 && (
              <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#171717] to-[#202020] border border-white/5 flex flex-col md:flex-row items-center justify-between px-8 py-8 mb-8 shadow-lg">
                <div className="flex flex-col items-start md:items-center md:flex-row gap-6 w-full">
                  <img src="https://cdn.pixabay.com/photo/2023/03/31/18/44/piano-7890735_1280.jpg" alt="Piano" className="w-28 h-28 object-cover rounded-2xl border border-white/10 shadow" />
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Piano Course Progress</h2>
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-lg font-semibold text-[#ff5a00]">{pianoProgress}%</span>
                      <span className="text-xs text-slate-400">({pianoCompleted} of {pianoLessonsCount} lessons completed)</span>
                    </div>
                    <div className="w-full h-0.5 bg-[#222] rounded-full overflow-hidden mb-2">
                      <div className="h-full bg-[#ff5a00] transition-all" style={{ width: `${pianoProgress}%` }} />
                    </div>
                    <Link href="/dashboard/student/piano" className="inline-block mt-2 px-6 py-2 rounded-full bg-[#ff5a00] text-white font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all">Resume Learning</Link>
                  </div>
                </div>
              </section>
            )}

            {drumCompleted > 0 && (
              <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#171717] to-[#242424] border border-white/5 flex flex-col md:flex-row items-center justify-between px-8 py-8 mb-8 shadow-lg">
                <div className="flex flex-col items-start md:items-center md:flex-row gap-6 w-full">
                  <img src="https://images.unsplash.com/photo-1543443374-b6fe10a6ab7b?q=80&w=400&auto=format&fit=crop" alt="Drums" className="w-28 h-28 object-cover rounded-2xl border border-white/10 shadow" />
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Drum Course Progress</h2>
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-lg font-semibold text-[#ff5a00]">{drumProgress}%</span>
                      <span className="text-xs text-slate-400">({drumCompleted} of {drumLessonsCount} lessons completed)</span>
                    </div>
                    <div className="w-full h-0.5 bg-[#222] rounded-full overflow-hidden mb-2">
                      <div className="h-full bg-[#ff5a00] transition-all" style={{ width: `${drumProgress}%` }} />
                    </div>
                    <Link href="/dashboard/student/drums" className="inline-block mt-2 px-6 py-2 rounded-full bg-[#ff5a00] text-white font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all">Resume Learning</Link>
                  </div>
                </div>
              </section>
            )}

            {violinCompleted > 0 && (
              <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#181818] to-[#232323] border border-white/5 flex flex-col md:flex-row items-center justify-between px-8 py-8 mb-8 shadow-lg">
                <div className="flex flex-col items-start md:items-center md:flex-row gap-6 w-full">
                  <img src="https://www.sweetwater.com/sweetcare/media/2022/12/10_Violin-Playing-Position.jpg" alt="Violin" className="w-28 h-28 object-cover rounded-2xl border border-white/10 shadow" />
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Violin Course Progress</h2>
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-lg font-semibold text-[#ff5a00]">{violinProgress}%</span>
                      <span className="text-xs text-slate-400">({violinCompleted} of {violinLessonsCount} lessons completed)</span>
                    </div>
                    <div className="w-full h-0.5 bg-[#222] rounded-full overflow-hidden mb-2">
                      <div className="h-full bg-[#ff5a00] transition-all" style={{ width: `${violinProgress}%` }} />
                    </div>
                    <Link href="/dashboard/student/violin" className="inline-block mt-2 px-6 py-2 rounded-full bg-[#ff5a00] text-white font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all">Resume Learning</Link>
                  </div>
                </div>
              </section>
            )}
            {/* Grid - Simple Card Style */}
            <section>
              <h3 className="text-lg font-semibold text-white mb-8">Instrument Archive</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                {instruments.map((inst) => (
                  inst.name === "Guitar" ? (
                    <Link key={inst.name} href="/dashboard/student/guitar" className="group cursor-pointer block">
                      <div className="aspect-[4/5] rounded-2xl overflow-hidden mb-4 bg-[#1a1a1a] border border-white/5">
                        <img src={inst.image} className="w-full h-full object-cover grayscale opacity-40 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-500" alt={inst.name} />
                      </div>
                      <h4 className="text-sm font-semibold text-slate-200">{inst.name}</h4>
                      <p className="text-xs text-slate-600 mt-1">{inst.type}</p>
                    </Link>
                    ) : inst.name === "Piano" ? (
                    <Link key={inst.name} href="/dashboard/student/piano" className="group cursor-pointer block">
                      <div className="aspect-[4/5] rounded-2xl overflow-hidden mb-4 bg-[#1a1a1a] border border-white/5">
                        <img src={inst.image} className="w-full h-full object-cover grayscale opacity-40 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-500" alt={inst.name} />
                      </div>
                      <h4 className="text-sm font-semibold text-slate-200">{inst.name}</h4>
                      <p className="text-xs text-slate-600 mt-1">{inst.type}</p>
                    </Link>
                    ) : inst.name === "Drums" ? (
  <Link key={inst.name} href="/dashboard/student/drums" className="group cursor-pointer block">
    <div className="aspect-[4/5] rounded-2xl overflow-hidden mb-4 bg-[#1a1a1a] border border-white/5 shadow-2xl">
      <img 
        src={inst.image} 
        className="w-full h-full object-cover grayscale opacity-40 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" 
        alt={inst.name} 
      />
    </div>
    <h4 className="text-sm font-semibold text-slate-200">{inst.name}</h4>
    <p className="text-xs text-slate-600 mt-1">{inst.type}</p>
  </Link>
                    ) : inst.name === "Violin" ? (
                    <Link key={inst.name} href="/dashboard/student/violin" className="group cursor-pointer block">
                      <div className="aspect-[4/5] rounded-2xl overflow-hidden mb-4 bg-[#1a1a1a] border border-white/5">
                        <img src={inst.image} className="w-full h-full object-cover grayscale opacity-40 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-500" alt={inst.name} />
                      </div>
                      <h4 className="text-sm font-semibold text-slate-200">{inst.name}</h4>
                      <p className="text-xs text-slate-600 mt-1">{inst.type}</p>
                    </Link>
                  ) : (
                  
                    <div key={inst.name} className="group cursor-pointer">
                      <div className="aspect-[4/5] rounded-2xl overflow-hidden mb-4 bg-[#1a1a1a] border border-white/5">
                        <img src={inst.image} className="w-full h-full object-cover grayscale opacity-40 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-500" alt={inst.name} />
                      </div>
                      <h4 className="text-sm font-semibold text-slate-200">{inst.name}</h4>
                      <p className="text-xs text-slate-600 mt-1">{inst.type}</p>
                    </div>
                  )
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar - Clean Typography */}
          <div className="col-span-12 lg:col-span-4 space-y-12">
            <div className="bg-[#1a1a1a] border border-white/5 rounded-3xl p-10">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-600 mb-10">Daily Activity</h4>
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Clock size={20} className="text-slate-500" />
                        <span className="text-sm font-medium">Practice Streak</span>
                    </div>
                    <span className="text-xl font-bold text-white">12 Days</span>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <BarChart3 size={20} className="text-slate-500" />
                        <span className="text-sm font-medium">Weekly Goal</span>
                    </div>
                    <span className="text-xl font-bold text-[#ff5a00]">65%</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-600">Suggested Tutors</h4>
                <button
                  className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#ff5a00] text-white text-xs font-semibold hover:bg-white hover:text-black transition-all"
                  onClick={fetchReviews}
                  disabled={loadingReviews}
                  title="Show My Reviews"
                >
                  <MessageSquare size={14} /> Review
                </button>
              </div>
              {loadingTeachers ? (
                <div className="text-slate-500 text-sm">Loading tutors...</div>
              ) : teachers.length === 0 ? (
                <div className="text-slate-500 text-sm">No tutors available yet.</div>
              ) : (
                teachers.map((tutor) => (
                  <div
                    key={tutor._id}
                    className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer group"
                    onClick={() => router.push(`/dashboard/student/book-tutor?tutorId=${encodeURIComponent(tutor.userId)}`)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold text-lg">
                        {tutor.name ? tutor.name[0] : "T"}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-200">{tutor.name}</p>
                        <p className="text-[10px] text-slate-600 uppercase tracking-widest">{tutor.instrument}</p>
                        <p className="text-[10px] text-slate-500">{tutor.contact}</p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-slate-700 group-hover:text-white transition-colors" />
                  </div>
                ))
              )}
              {/* Review Modal/Dropdown */}
              {showReviews && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                  <div className="bg-[#181818] rounded-2xl p-8 max-w-md w-full shadow-xl relative">
                    <button
                      className="absolute top-2 right-2 text-slate-400 hover:text-white text-xl"
                      onClick={() => setShowReviews(false)}
                      title="Close"
                    >
                      ×
                    </button>
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <MessageSquare size={18} /> My Reviews
                    </h3>
                    {loadingReviews ? (
                      <div className="text-slate-400">Loading...</div>
                    ) : reviews.length === 0 ? (
                      <div className="text-slate-500 text-sm">No reviews yet.</div>
                    ) : (
                      <ul className="space-y-4 max-h-80 overflow-y-auto pr-2">
                        {reviews.map((review, idx) => (
                          <li key={idx} className="bg-[#232323] p-4 rounded-xl border border-white/10">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs text-slate-400">Teacher:</span>
                              <span className="text-xs text-orange-400 font-semibold">{review.teacherName}</span>
                            </div>
                            <div className="text-slate-200 text-sm mb-1">{review.feedback}</div>
                            <div className="text-xs text-slate-500">{new Date(review.createdAt).toLocaleString()}</div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}