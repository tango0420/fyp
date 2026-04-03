"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ChevronRight, Clock } from "lucide-react";
import { useSession } from "next-auth/react";
import { LogoutButton } from "@/app/components/LogoutButton";
import StudentSidebar from "@/app/components/StudentSidebar";


export default function QuizPage() {
  const { data: session } = useSession();
  interface Quiz {
    quizId: string;
    instrument: string;
    level: string;
    title: string;
    description?: string;
    questionCount: number;
  }
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true);
  const [selectedInstrument, setSelectedInstrument] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");

  const instruments = ["Guitar", "Piano", "Drums", "Violin", "Flute", "Saxophone", "Trumpet", "Bass"];
  const levels = ["Beginner", "Intermediate", "Advanced"];

  const fetchQuizzes = useCallback(async () => {
    setLoading(true);
    try {
      let url = "/api/quizzes?";
      if (selectedInstrument !== "all") {
        url += `instrument=${selectedInstrument}&`;
      }
      if (selectedLevel !== "all") {
        url += `level=${selectedLevel}`;
      }

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Failed to fetch quizzes");
      }
      const data = await res.json();
      setQuizzes((data.quizzes || []) as Quiz[]);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      setQuizzes([]);
    }
    setLoading(false);
  }, [selectedInstrument, selectedLevel]);

  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

  return (
    <div className="min-h-screen bg-[#111111] text-slate-300 font-sans antialiased">
      <main className="pl-20 max-w-[1440px] mx-auto">
        <StudentSidebar />
        {/* Header */}
        <header className="fixed top-0 left-20 right-0 z-40 h-20 px-12 flex items-center justify-between border-b border-white/5 bg-[#111111]">
          <div className="flex items-center gap-4 text-sm font-medium tracking-tight">
            <span className="text-slate-600">Virtuoso</span>
            <span className="text-slate-800">/</span>
            <span className="text-slate-200">Quiz</span>
          </div>
          <div className="flex items-center gap-8">
            <p className="text-sm font-semibold text-slate-200">
              {session?.user?.name || "User"}
            </p>
            <div className="w-10 h-10 rounded-full bg-slate-800 overflow-hidden border border-white/10 flex items-center justify-center">
              {session?.user?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={session.user.image} alt="Avatar" className="grayscale w-full h-full object-cover" />
              ) : (
                <span className="text-lg text-white font-bold">
                  {session?.user?.name ? session.user.name[0] : "U"}
                </span>
              )}
            </div>
            <LogoutButton />
          </div>
        </header>

        <div className="pt-32 px-12 pb-12">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Music Quizzes</h1>
            <p className="text-slate-400">Test your knowledge and improve your musical skills</p>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="text-sm font-semibold text-slate-300 mb-2 block">Filter by Instrument</label>
              <select 
                value={selectedInstrument} 
                onChange={(e) => setSelectedInstrument(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-3 text-white outline-none hover:border-white/20 focus:border-[#ff5a00] transition-colors"
              >
                <option value="all">All Instruments</option>
                {instruments.map(inst => (
                  <option key={inst} value={inst}>{inst}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-300 mb-2 block">Filter by Level</label>
              <select 
                value={selectedLevel} 
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-3 text-white outline-none hover:border-white/20 focus:border-[#ff5a00] transition-colors"
              >
                <option value="all">All Levels</option>
                {levels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Quizzes Grid */}
          {loading ? (
            <div className="text-center py-12 text-slate-400">Loading quizzes...</div>
          ) : quizzes.length === 0 ? (
            <div className="text-center py-12 text-slate-400">No quizzes available yet. Check back soon!</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.map((quiz) => (
                <Link key={quiz.quizId} href={`/dashboard/student/quiz/${quiz.quizId}`}>
                  <div className="bg-[#1a1a1a] border border-white/10 rounded-lg p-6 hover:border-[#ff5a00] transition-all cursor-pointer group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white group-hover:text-[#ff5a00] transition-colors mb-1">
                          {quiz.title}
                        </h3>
                        <p className="text-sm text-slate-400 mb-3">{quiz.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="inline-block px-3 py-1 bg-[#ff5a00]/20 text-[#ff5a00] text-xs font-semibold rounded">
                        {quiz.instrument}
                      </span>
                      <span className="inline-block px-3 py-1 bg-white/10 text-slate-300 text-xs font-semibold rounded">
                        {quiz.level}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Clock size={14} />
                        <span>{quiz.questionCount || 0} questions</span>
                      </div>
                      <ChevronRight size={16} className="text-slate-600 group-hover:text-[#ff5a00] transition-colors" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
