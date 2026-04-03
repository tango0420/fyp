"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Disc, Layers, Music, BarChart3, Settings, ChevronLeft, Check, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { LogoutButton } from "@/app/components/LogoutButton";
import { useParams, useRouter } from "next/navigation";
import StudentSidebar from "@/app/components/StudentSidebar";


interface Question {
  questionId: string;
  question: string;
  type: "multiple-choice" | "true-false" | "fill-blank";
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface QuizDetail {
  quizId: string;
  instrument: string;
  level: string;
  title: string;
  description?: string;
  questions: Question[];
  passingScore: number;
}

export default function QuizDetailPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const quizId = params.id as string;

  const [quiz, setQuiz] = useState<QuizDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const fetchQuiz = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/quizzes/${quizId}`);
      if (!res.ok) {
        throw new Error("Quiz not found");
      }
      const data = await res.json();
      setQuiz(data.quiz);
    } catch (error) {
      console.error("Error fetching quiz:", error);
      setQuiz(null);
    }
    setLoading(false);
  }, [quizId]);

  useEffect(() => {
    fetchQuiz();
  }, [fetchQuiz]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center">
        <p className="text-slate-400">Loading quiz...</p>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400 mb-4">Quiz not found</p>
          <Link href="/dashboard/student/quiz" className="text-[#ff5a00] hover:underline">
            Back to Quizzes
          </Link>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  const handleAnswer = (answer: string) => {
    setUserAnswers({
      ...userAnswers,
      [currentQuestion.questionId]: answer,
    });
  };

  const handleNext = () => {
    if (!isLastQuestion) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    let correctCount = 0;
    quiz.questions.forEach((question) => {
      if (userAnswers[question.questionId] === question.correctAnswer) {
        correctCount++;
      }
    });
    const percentage = Math.round((correctCount / quiz.questions.length) * 100);
    setScore(percentage);
    setShowResults(true);
  };

  if (showResults) {
    const passed = score >= quiz.passingScore;
    return (
      <div className="min-h-screen bg-[#111111] text-slate-300 font-sans antialiased">
        <aside className="fixed left-0 top-0 h-full w-20 z-50 border-r border-white/5 bg-[#1a1a1a] flex flex-col items-center py-10">
          <div className="mb-12">
            <Disc size={24} className="text-[#ff5a00]" />
          </div>
          <nav className="flex flex-col gap-10 text-slate-600">
            <Link href="/dashboard/student" className="hover:text-[#ff5a00] transition-colors inline-flex items-center justify-center">
              <Layers size={22} className="text-slate-200 cursor-pointer" />
            </Link>
            <Link href="/dashboard/student/instruments" className="hover:text-[#ff5a00] transition-colors inline-flex items-center justify-center">
              <Music size={22} className="text-slate-600 cursor-pointer" />
            </Link>
            <Link href="/dashboard/student/quiz" className="hover:text-[#ff5a00] transition-colors inline-flex items-center justify-center">
              <BarChart3 size={22} className="text-slate-600 cursor-pointer" />
            </Link>
            <button className="hover:text-white transition-colors cursor-pointer inline-flex items-center justify-center">
              <Settings size={22} />
            </button>
          </nav>
        </aside>

        <main className="pl-20 max-w-[1440px] mx-auto">
            <StudentSidebar />
          <header className="fixed top-0 left-20 right-0 z-40 h-20 px-12 flex items-center justify-between border-b border-white/5 bg-[#111111]">
            <div className="flex items-center gap-4 text-sm font-medium tracking-tight">
              <span className="text-slate-600">Virtuoso</span>
              <span className="text-slate-800">/</span>
              <span className="text-slate-200">Quiz Results</span>
            </div>
            <LogoutButton />
          </header>

          <div className="pt-32 px-12 pb-12 flex items-center justify-center min-h-screen">
            <div className="max-w-2xl w-full text-center">
              <div className={`text-6xl font-bold mb-4 ${passed ? "text-green-500" : "text-red-500"}`}>
                {score}%
              </div>
              <h1 className="text-3xl font-bold text-white mb-4">
                {passed ? "Congratulations!" : "Quiz Incomplete"}
              </h1>
              <p className="text-slate-400 mb-8">
                {passed 
                  ? `You passed the quiz! You answered ${Object.keys(userAnswers).length} out of ${quiz.questions.length} questions correctly.`
                  : `You need ${quiz.passingScore}% to pass. Your score: ${score}%`
                }
              </p>

              {/* Detailed Results */}
              <div className="bg-[#1a1a1a] border border-white/10 rounded-lg p-8 mb-8 text-left">
                <h2 className="text-xl font-bold text-white mb-6">Detailed Results</h2>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {quiz.questions.map((question, idx) => {
                    const userAnswer = userAnswers[question.questionId];
                    const isCorrect = userAnswer === question.correctAnswer;
                    return (
                      <div key={idx} className="bg-[#111111] border border-white/10 rounded-lg p-4">
                        <div className="flex items-start gap-4">
                          <div className={`mt-1 ${isCorrect ? "text-green-500" : "text-red-500"}`}>
                            {isCorrect ? <Check size={20} /> : <X size={20} />}
                          </div>
                          <div className="flex-1">
                            <p className="text-white font-semibold mb-2">Q{idx + 1}: {question.question}</p>
                            <p className="text-xs text-slate-400 mb-2">
                              <span className={isCorrect ? "text-green-500" : "text-red-500"}>
                                Your answer: {userAnswer || "Not answered"}
                              </span>
                            </p>
                            {!isCorrect && (
                              <p className="text-xs text-green-500 mb-2">
                                Correct answer: {question.correctAnswer}
                              </p>
                            )}
                            <p className="text-xs text-slate-500 italic">{question.explanation}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => {
                    setShowResults(false);
                    setCurrentQuestionIndex(0);
                    setUserAnswers({});
                    setScore(0);
                  }}
                  className="px-6 py-3 bg-[#ff5a00] hover:bg-[#ff7a2a] text-white font-semibold rounded-lg transition-colors"
                >
                  Retake Quiz
                </button>
                <Link href="/dashboard/student/quiz" className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors inline-flex items-center gap-2">
                  <ChevronLeft size={16} /> Back to Quizzes
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111111] text-slate-300 font-sans antialiased">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-20 z-50 border-r border-white/5 bg-[#1a1a1a] flex flex-col items-center py-10">
        <div className="mb-12">
          <Disc size={24} className="text-[#ff5a00]" />
        </div>
        <nav className="flex flex-col gap-10 text-slate-600">
          <Link href="/dashboard/student" className="hover:text-[#ff5a00] transition-colors inline-flex items-center justify-center">
            <Layers size={22} className="text-slate-200 cursor-pointer" />
          </Link>
          <Link href="/dashboard/student/instruments" className="hover:text-[#ff5a00] transition-colors inline-flex items-center justify-center">
            <Music size={22} className="text-slate-600 cursor-pointer" />
          </Link>
          <Link href="/dashboard/student/quiz" className="hover:text-[#ff5a00] transition-colors inline-flex items-center justify-center">
            <BarChart3 size={22} className="text-slate-600 cursor-pointer" />
          </Link>
          <button className="hover:text-white transition-colors cursor-pointer inline-flex items-center justify-center">
            <Settings size={22} />
          </button>
        </nav>
      </aside>

      <main className="pl-20 max-w-[1440px] mx-auto">
        {/* Header */}
        <header className="fixed top-0 left-20 right-0 z-40 h-20 px-12 flex items-center justify-between border-b border-white/5 bg-[#111111]">
          <div className="flex items-center gap-4 text-sm font-medium tracking-tight">
            <Link href="/dashboard/student/quiz" className="hover:text-[#ff5a00] transition-colors flex items-center gap-2">
              <ChevronLeft size={18} />
              <span className="text-slate-600">Back</span>
            </Link>
            <span className="text-slate-800">/</span>
            <span className="text-slate-200">Quiz</span>
          </div>
          <LogoutButton />
        </header>

        <div className="pt-32 px-12 pb-12">
          {/* Quiz Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">{quiz.title}</h1>
            <p className="text-slate-400 mb-4">{quiz.description}</p>
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 bg-[#ff5a00]/20 text-[#ff5a00] text-xs font-semibold rounded">
                {quiz.instrument}
              </span>
              <span className="px-3 py-1 bg-white/10 text-slate-300 text-xs font-semibold rounded">
                {quiz.level}
              </span>
              <span className="text-slate-400 text-sm">
                Question {currentQuestionIndex + 1} of {quiz.questions.length}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8 bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-[#ff5a00] transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
            />
          </div>

          {/* Question Card */}
          <div className="bg-[#1a1a1a] border border-white/10 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">{currentQuestion.question}</h2>

            {/* Answer Options */}
            <div className="space-y-3 mb-8">
              {currentQuestion.type === "true-false" ? (
                <>
                  {["True", "False"].map((option) => (
                    <button
                      key={option}
                      onClick={() => handleAnswer(option)}
                      className={`w-full p-4 border rounded-lg transition-all text-left font-semibold ${
                        userAnswers[currentQuestion.questionId] === option
                          ? "border-[#ff5a00] bg-[#ff5a00]/20 text-[#ff5a00]"
                          : "border-white/10 bg-[#111111] text-slate-200 hover:border-white/20"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </>
              ) : (
                currentQuestion.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(option)}
                    className={`w-full p-4 border rounded-lg transition-all text-left font-semibold ${
                      userAnswers[currentQuestion.questionId] === option
                        ? "border-[#ff5a00] bg-[#ff5a00]/20 text-[#ff5a00]"
                        : "border-white/10 bg-[#111111] text-slate-200 hover:border-white/20"
                    }`}
                  >
                    {option}
                  </button>
                ))
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-6 border-t border-white/10">
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className="px-6 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
              >
                Previous
              </button>

              <div className="flex gap-2">
                {quiz.questions.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      idx === currentQuestionIndex
                        ? "bg-[#ff5a00]"
                        : userAnswers[quiz.questions[idx].questionId]
                        ? "bg-green-500"
                        : "bg-slate-600"
                    }`}
                  />
                ))}
              </div>

              {isLastQuestion ? (
                <button
                  onClick={handleSubmit}
                  disabled={Object.keys(userAnswers).length !== quiz.questions.length}
                  className="px-6 py-2 bg-[#ff5a00] hover:bg-[#ff7a2a] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
                >
                  Submit Quiz
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={!userAnswers[currentQuestion.questionId]}
                  className="px-6 py-2 bg-[#ff5a00] hover:bg-[#ff7a2a] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
