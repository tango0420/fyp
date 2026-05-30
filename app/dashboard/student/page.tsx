"use client";

import React, { useEffect, useState, useRef } from "react";
import { MessageSquare } from "lucide-react";
import Link from "next/link";
import { Search, Play, Clock, BarChart3, ChevronRight } from "lucide-react";
import { useSession } from "next-auth/react";
import { LogoutButton } from "@/app/components/LogoutButton";
import StudentSidebar from "@/app/components/StudentSidebar";
import BlogPanel from "@/app/components/BlogPanel";

export default function MinimalistDashboard() {
  const progressRef = useRef<HTMLDivElement>(null);
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
  const [fluteProgress, setFluteProgress] = useState(0);
  const [fluteCompleted, setFluteCompleted] = useState(0);
  const [fluteLessonsCount] = useState(6);
  const [bassProgress, setBassProgress] = useState(0);
  const [bassCompleted, setBassCompleted] = useState(0);
  const [bassLessonsCount] = useState(6);
  const [saxophoneProgress, setSaxophoneProgress] = useState(0);
  const [saxophoneCompleted, setSaxophoneCompleted] = useState(0);
  const [saxophoneLessonsCount] = useState(6);
  const [teachers, setTeachers] = useState<Array<{ _id: string; userId: string; name: string; instrument: string }>>([]);
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const [showReviews, setShowReviews] = useState(false);
  const [reviews, setReviews] = useState<Array<{ teacherName: string; feedback: string; createdAt: string }>>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [stats, setStats] = useState({ totalPractice: "0h", instruments: 0, currentLevel: "Beginner", lessonsDone: 0 });
  const [loadingStats, setLoadingStats] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const router = require('next/navigation').useRouter();

  const instruments = [
    "guitar",
    "piano",
    "drums",
    "violin",
    "flute",
    "bass",
    "saxophone",
  ];

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const query = searchQuery.toLowerCase().trim();
      const matchedInstrument = instruments.find((inst) =>
        inst.toLowerCase().includes(query) || query.includes(inst.toLowerCase())
      );

      if (matchedInstrument) {
        router.push(`/dashboard/student/${matchedInstrument}`);
        setSearchQuery("");
      }
    }
  };
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
    if (status === "authenticated" && session?.user?.email) {
      // Fetch stats
      fetch(`/api/stats?userId=${encodeURIComponent(session.user.email)}`)
        .then(res => res.json())
        .then(data => {
          setStats({
            totalPractice: data.totalPractice || "0h",
            instruments: data.instruments || 0,
            currentLevel: data.currentLevel || "Beginner",
            lessonsDone: data.lessonsDone || 0,
          });
          setLoadingStats(false);
        })
        .catch(() => setLoadingStats(false));

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
          const fluteOnly = completedLessons.filter(
            (p: { lessonId?: string }) => typeof p.lessonId === "string" && p.lessonId.startsWith("flute-")
          );
          const bassOnly = completedLessons.filter(
            (p: { lessonId?: string }) => typeof p.lessonId === "string" && p.lessonId.startsWith("bass-")
          );
          const saxophoneOnly = completedLessons.filter(
            (p: { lessonId?: string }) => typeof p.lessonId === "string" && p.lessonId.startsWith("saxophone-")
          );

          setGuitarCompleted(guitarOnly.length);
          setGuitarProgress(Math.round((guitarOnly.length / guitarLessonsCount) * 100));
          setPianoCompleted(pianoOnly.length);
          setPianoProgress(Math.round((pianoOnly.length / pianoLessonsCount) * 100));
          setDrumCompleted(drumOnly.length);
          setDrumProgress(Math.round((drumOnly.length / drumLessonsCount) * 100));
          setViolinCompleted(violinOnly.length);
          setViolinProgress(Math.round((violinOnly.length / violinLessonsCount) * 100));
          setFluteCompleted(fluteOnly.length);
          setFluteProgress(Math.round((fluteOnly.length / fluteLessonsCount) * 100));
          setBassCompleted(bassOnly.length);
          setBassProgress(Math.round((bassOnly.length / bassLessonsCount) * 100));
          setSaxophoneCompleted(saxophoneOnly.length);
          setSaxophoneProgress(Math.round((saxophoneOnly.length / saxophoneLessonsCount) * 100));
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
  }, [status, session, guitarLessonsCount, pianoLessonsCount, drumLessonsCount, violinLessonsCount]);

  return (
    <div className="min-h-screen bg-[#111111] text-slate-300 font-sans antialiased">
      <main className="pl-20 max-w-[1440px] mx-auto">
        <StudentSidebar />
        <header className="fixed top-0 left-20 right-0 z-40 h-20 px-12 flex items-center justify-between border-b border-white/5 bg-[#111111]">
          <div className="flex items-center gap-4 text-sm font-medium tracking-tight">
             <span className="text-slate-600">Virtuoso</span>
             <span className="text-slate-800">/</span>
             <span className="text-slate-200">Dashboard</span>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="relative group border-r border-white/5 pr-8">
              <Search size={18} className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-600" />
              <input
                type="text"
                placeholder="Search instruments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                className="bg-transparent border-none text-sm pl-8 outline-none w-48 placeholder:text-slate-700 focus:placeholder:text-slate-600"
              />
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
                <LogoutButton />
            </div>
          </div>
        </header>

        <div className="pl-5 pt-30 px-12 py-8 grid grid-cols-12 gap-8">
          
          {/* Main Section - Left Column */}
          <div className="col-span-12 lg:col-span-9 space-y-8">
            
            {/* Quick Stats Section */}
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Quick Stats</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-[#1a1a1a] border border-white/10 rounded-lg p-4 hover:border-white/20 transition-colors">
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">Total Practice</p>
                  <p className="text-2xl font-bold text-white">{loadingStats ? "—" : stats.totalPractice}</p>
                  <p className="text-xs text-slate-600 mt-1">All time</p>
                </div>
                <div className="bg-[#1a1a1a] border border-white/10 rounded-lg p-4 hover:border-white/20 transition-colors">
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">Instruments</p>
                  <p className="text-2xl font-bold text-[#ff5a00]">{loadingStats ? "—" : stats.instruments}</p>
                  <p className="text-xs text-slate-600 mt-1">Learning</p>
                </div>
                <div className="bg-[#1a1a1a] border border-white/10 rounded-lg p-4 hover:border-white/20 transition-colors">
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">Current Level</p>
                  <p className="text-2xl font-bold text-white">{loadingStats ? "—" : stats.currentLevel}</p>
                  <p className="text-xs text-slate-600 mt-1">Progress</p>
                </div>
                <div className="bg-[#1a1a1a] border border-white/10 rounded-lg p-4 hover:border-white/20 transition-colors">
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">Lessons Done</p>
                  <p className="text-2xl font-bold text-white">{loadingStats ? "—" : stats.lessonsDone}</p>
                  <p className="text-xs text-slate-600 mt-1">Completed</p>
                </div>
              </div>
            </section>

            {/* Quick Actions */}
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Link href="/dashboard/student/instruments" className="group">
                  <div className="bg-[#1a1a1a] border border-white/10 rounded-lg p-4 text-center hover:border-[#ff5a00] transition-colors cursor-pointer">
                    <p className="text-sm font-semibold text-white group-hover:text-[#ff5a00] transition-colors">Browse Instruments</p>
                  </div>
                </Link>
                <button className="group w-full" onClick={() => router.push("/dashboard/student/book-tutor")}>
                  <div className="bg-[#1a1a1a] border border-white/10 rounded-lg p-4 text-center hover:border-[#ff5a00] transition-colors cursor-pointer">
                    <p className="text-sm font-semibold text-white group-hover:text-[#ff5a00] transition-colors">Book Tutor</p>
                  </div>
                </button>
                <button className="group w-full" onClick={() => progressRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
                  <div className="bg-[#1a1a1a] border border-white/10 rounded-lg p-4 text-center hover:border-[#ff5a00] transition-colors cursor-pointer">
                    <p className="text-sm font-semibold text-white group-hover:text-[#ff5a00] transition-colors">Continue Lesson</p>
                  </div>
                </button>
                <button className="group w-full" onClick={() => router.push("/dashboard/student/quiz")}>
                  <div className="bg-[#1a1a1a] border border-white/10 rounded-lg p-4 text-center hover:border-[#ff5a00] transition-colors cursor-pointer">
                    <p className="text-sm font-semibold text-white group-hover:text-[#ff5a00] transition-colors">Quizzes</p>
                  </div>
                </button>
              </div>
            </section>

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
            {/* Your Learning Progress - Simple Classic */}
            {(guitarCompleted > 0 || pianoCompleted > 0 || drumCompleted > 0 || violinCompleted > 0) && (
              <section ref={progressRef}>
                <h2 className="text-lg font-bold text-white mb-4">Your Progress</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                  {guitarCompleted > 0 && (
                    <Link href="/dashboard/student/guitar" className="group">
                      <div className="bg-[#1a1a1a] border border-white/10 rounded-lg p-4 hover:border-[#ff5a00] transition-colors">
                        <div className="flex items-center gap-3 mb-4">
                          <img src="https://images.unsplash.com/photo-1550291652-6ea9114a47b1?q=80&w=100" alt="Guitar" className="w-10 h-10 object-cover rounded" />
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-white">Guitar</h4>
                            <p className="text-xs text-slate-500">{guitarCompleted}/{guitarLessonsCount} lessons</p>
                          </div>
                        </div>
                        <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-[#ff5a00] transition-all" style={{ width: `${guitarProgress}%` }} />
                        </div>
                        <p className="text-xs text-[#ff5a00] font-semibold mt-3 text-right">{guitarProgress}%</p>
                      </div>
                    </Link>
                  )}
                  
                  {pianoCompleted > 0 && (
                    <Link href="/dashboard/student/piano" className="group">
                      <div className="bg-[#1a1a1a] border border-white/10 rounded-lg p-4 hover:border-[#ff5a00] transition-colors">
                        <div className="flex items-center gap-3 mb-4">
                          <img src="https://cdn.pixabay.com/photo/2023/03/31/18/44/piano-7890735_1280.jpg" alt="Piano" className="w-10 h-10 object-cover rounded" />
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-white">Piano</h4>
                            <p className="text-xs text-slate-500">{pianoCompleted}/{pianoLessonsCount} lessons</p>
                          </div>
                        </div>
                        <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-[#ff5a00] transition-all" style={{ width: `${pianoProgress}%` }} />
                        </div>
                        <p className="text-xs text-[#ff5a00] font-semibold mt-3 text-right">{pianoProgress}%</p>
                      </div>
                    </Link>
                  )}
                  
                  {drumCompleted > 0 && (
                    <Link href="/dashboard/student/drums" className="group">
                      <div className="bg-[#1a1a1a] border border-white/10 rounded-lg p-4 hover:border-[#ff5a00] transition-colors">
                        <div className="flex items-center gap-3 mb-4">
                          <img src="https://images.unsplash.com/photo-1543443374-b6fe10a6ab7b?q=80&w=100&auto=format&fit=crop" alt="Drums" className="w-10 h-10 object-cover rounded" />
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-white">Drums</h4>
                            <p className="text-xs text-slate-500">{drumCompleted}/{drumLessonsCount} lessons</p>
                          </div>
                        </div>
                        <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-[#ff5a00] transition-all" style={{ width: `${drumProgress}%` }} />
                        </div>
                        <p className="text-xs text-[#ff5a00] font-semibold mt-3 text-right">{drumProgress}%</p>
                      </div>
                    </Link>
                  )}
                  
                  {violinCompleted > 0 && (
                    <Link href="/dashboard/student/violin" className="group">
                      <div className="bg-[#1a1a1a] border border-white/10 rounded-lg p-4 hover:border-[#ff5a00] transition-colors">
                        <div className="flex items-center gap-3 mb-4">
                          <img src="https://www.sweetwater.com/sweetcare/media/2022/12/10_Violin-Playing-Position.jpg" alt="Violin" className="w-10 h-10 object-cover rounded" />
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-white">Violin</h4>
                            <p className="text-xs text-slate-500">{violinCompleted}/{violinLessonsCount} lessons</p>
                          </div>
                        </div>
                        <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-[#ff5a00] transition-all" style={{ width: `${violinProgress}%` }} />
                        </div>
                        <p className="text-xs text-[#ff5a00] font-semibold mt-3 text-right">{violinProgress}%</p>
                      </div>
                    </Link>
                  )}

                  {fluteCompleted > 0 && (
                    <Link href="/dashboard/student/flute" className="group">
                      <div className="bg-[#1a1a1a] border border-white/10 rounded-lg p-4 hover:border-[#ff5a00] transition-colors">
                        <div className="flex items-center gap-3 mb-4">
                          <img src="https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=100" alt="Flute" className="w-10 h-10 object-cover rounded" />
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-white">Flute</h4>
                            <p className="text-xs text-slate-500">{fluteCompleted}/{fluteLessonsCount} lessons</p>
                          </div>
                        </div>
                        <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-[#ff5a00] transition-all" style={{ width: `${fluteProgress}%` }} />
                        </div>
                        <p className="text-xs text-[#ff5a00] font-semibold mt-3 text-right">{fluteProgress}%</p>
                      </div>
                    </Link>
                  )}

                  {bassCompleted > 0 && (
                    <Link href="/dashboard/student/bass" className="group">
                      <div className="bg-[#1a1a1a] border border-white/10 rounded-lg p-4 hover:border-[#ff5a00] transition-colors">
                        <div className="flex items-center gap-3 mb-4">
                          <img src="https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=100" alt="Bass" className="w-10 h-10 object-cover rounded" />
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-white">Bass</h4>
                            <p className="text-xs text-slate-500">{bassCompleted}/{bassLessonsCount} lessons</p>
                          </div>
                        </div>
                        <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-[#ff5a00] transition-all" style={{ width: `${bassProgress}%` }} />
                        </div>
                        <p className="text-xs text-[#ff5a00] font-semibold mt-3 text-right">{bassProgress}%</p>
                      </div>
                    </Link>
                  )}

                  {saxophoneCompleted > 0 && (
                    <Link href="/dashboard/student/saxophone" className="group">
                      <div className="bg-[#1a1a1a] border border-white/10 rounded-lg p-4 hover:border-[#ff5a00] transition-colors">
                        <div className="flex items-center gap-3 mb-4">
                          <img src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=100" alt="Saxophone" className="w-10 h-10 object-cover rounded" />
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-white">Saxophone</h4>
                            <p className="text-xs text-slate-500">{saxophoneCompleted}/{saxophoneLessonsCount} lessons</p>
                          </div>
                        </div>
                        <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-[#ff5a00] transition-all" style={{ width: `${saxophoneProgress}%` }} />
                        </div>
                        <p className="text-xs text-[#ff5a00] font-semibold mt-3 text-right">{saxophoneProgress}%</p>
                      </div>
                    </Link>
                  )}
                </div>
              </section>
            )}
          </div>

          {/* Right Column - Blog Panel */}
          <div className="col-span-12 lg:col-span-3">
            <div className="sticky top-28">
              <BlogPanel />
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="px-12 pb-4 grid grid-cols-12 gap-8">
          <div className="col-span-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Recent Achievements</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-[#1a1a1a] border border-white/10 rounded-lg p-4 text-center hover:border-white/20 transition-colors">
                <p className="text-2xl mb-2">🎸</p>
                <p className="text-xs font-semibold text-white">Guitar Master</p>
                <p className="text-[10px] text-slate-500 mt-1">Completed 4 lessons</p>
              </div>
              <div className="bg-[#1a1a1a] border border-white/10 rounded-lg p-4 text-center hover:border-white/20 transition-colors">
                <p className="text-2xl mb-2">🔥</p>
                <p className="text-xs font-semibold text-white">12 Day Streak</p>
                <p className="text-[10px] text-slate-500 mt-1">Keep it up!</p>
              </div>
              <div className="bg-[#1a1a1a] border border-white/10 rounded-lg p-4 text-center hover:border-white/20 transition-colors">
                <p className="text-2xl mb-2">⭐</p>
                <p className="text-xs font-semibold text-white">Quick Learner</p>
                <p className="text-[10px] text-slate-500 mt-1">50 hrs practiced</p>
              </div>
              <div className="bg-[#1a1a1a] border border-white/10 rounded-lg p-4 text-center hover:border-white/20 transition-colors opacity-40">
                <p className="text-2xl mb-2">🏆</p>
                <p className="text-xs font-semibold text-slate-500">Locked</p>
                <p className="text-[10px] text-slate-600 mt-1">8 instruments</p>
              </div>
            </div>
          </div>
        </div>

        {/* Activities & Tutors Section */}
        <div className="px-12 pb-12 grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-6">
            <div className="bg-[#1a1a1a] border border-white/10 rounded-lg p-6 h-full">
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Daily Activity</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border border-white/10 rounded-lg hover:border-white/20 transition-colors">
                    <div className="flex items-center gap-3">
                        <Clock size={16} className="text-slate-500" />
                        <span className="text-xs font-medium text-slate-200">Practice Streak</span>
                    </div>
                    <span className="text-sm font-bold text-white">12 Days</span>
                </div>
                <div className="flex items-center justify-between p-3 border border-white/10 rounded-lg hover:border-white/20 transition-colors">
                    <div className="flex items-center gap-3">
                        <BarChart3 size={16} className="text-slate-500" />
                        <span className="text-xs font-medium text-slate-200">Weekly Goal</span>
                    </div>
                    <span className="text-sm font-bold text-[#ff5a00]">65%</span>
                </div>
                <div className="flex items-center justify-between p-3 border border-white/10 rounded-lg hover:border-white/20 transition-colors">
                    <div className="flex items-center gap-3">
                        <Play size={16} className="text-slate-500" />
                        <span className="text-xs font-medium text-slate-200">Today&apos;s Session</span>
                    </div>
                    <span className="text-sm font-bold text-white">45 min</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-6">
            <div className="bg-[#1a1a1a] border border-white/10 rounded-lg p-6 h-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">Suggested Tutors</h2>
                <button
                  className="px-3 py-1 bg-[#ff5a00] hover:bg-[#ff7a2a] text-white text-xs font-semibold rounded transition-colors flex items-center gap-1"
                  onClick={fetchReviews}
                  disabled={loadingReviews}
                  title="Show My Reviews"
                >
                  <MessageSquare size={14} /> Reviews
                </button>
              </div>
              {loadingTeachers ? (
                <div className="text-slate-500 text-sm">Loading tutors...</div>
              ) : teachers.length === 0 ? (
                <div className="text-slate-500 text-sm">No tutors available yet.</div>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                {teachers.map((tutor: { _id: string; userId: string; name: string; instrument: string }) => (
                  <div
                    key={tutor._id}
                    className="flex items-center justify-between p-3 rounded hover:bg-white/5 transition-colors cursor-pointer group"
                    onClick={() => router.push(`/dashboard/student/book-tutor?tutorId=${encodeURIComponent(tutor.userId)}`)}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold text-sm">
                        {tutor.name ? tutor.name[0] : "T"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-200 truncate">{tutor.name}</p>
                        <p className="text-[10px] text-slate-500">{tutor.instrument}</p>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-slate-700 flex-shrink-0" />
                  </div>
                ))}
                </div>
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
                        {reviews.map((review: { teacherName: string; feedback: string; createdAt: string }, idx: number) => (
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