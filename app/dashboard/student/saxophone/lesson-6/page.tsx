"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Mic, Square } from "lucide-react";
import { useSession } from "next-auth/react";

export default function SaxophoneLesson6() {
  const { data: session, status } = useSession();
  const [progressPercent, setProgressPercent] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      fetch(`/api/progress?userId=${encodeURIComponent(session.user.email)}`)
        .then((res) => res.json())
        .then((data) => {
          const completed = Array.isArray(data)
            ? data.filter((p) => p.completed && typeof p.lessonId === "string" && p.lessonId.startsWith("saxophone-")).length
            : 0;
          setProgressPercent(Math.round((completed / 6) * 100));
        });
    }
  }, [status, session]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        chunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setRecordedAudio(url);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Please allow microphone access to record");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const uploadRecording = async () => {
    if (!recordedAudio || !session?.user?.email) return;

    setUploading(true);
    try {
      const response = await fetch(recordedAudio);
      const blob = await response.blob();
      const formData = new FormData();
      formData.append("audio", blob, "saxophone-lesson-6.webm");
      formData.append("userId", session.user.email);
      formData.append("lessonId", "saxophone-6");

      await fetch("/api/audio-uploads", {
        method: "POST",
        body: formData,
      });

      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.email, lessonId: "saxophone-6" }),
      });

      alert("Recording uploaded successfully! Lesson marked complete.");
      setRecordedAudio(null);
    } catch (error) {
      console.error("Error uploading recording:", error);
      alert("Failed to upload recording");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-[#0d0d0d] text-slate-300 font-sans antialiased min-h-screen">
      <div className="fixed top-8 left-4 md:left-8 z-20">
        <Link href="/dashboard/student/saxophone" className="flex items-center gap-2 text-slate-400 hover:text-white bg-black/40 px-4 py-2 rounded-full border border-white/10 shadow-lg transition-all">
          <ArrowLeft size={18} />
          <span className="text-xs font-semibold uppercase tracking-widest">Back</span>
        </Link>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-32 pb-24">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Lesson 6: Performance & Recording</h1>
          <p className="text-xl text-slate-400 leading-relaxed max-w-3xl">
            Prepare your final performance piece and submit your recording to complete the saxophone course.
          </p>
        </header>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">1. Performance Readiness</h2>
          <p className="text-slate-400 mb-4 leading-relaxed">
            You've learned the fundamentals. Now showcase your progress with a polished performance.
          </p>
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10 space-y-3">
            <div className="flex gap-3">
              <div className="text-[#ff5a00] font-bold text-lg mt-1">✓</div>
              <div>
                <p className="text-white font-semibold">Select Your Piece</p>
                <p className="text-slate-400 text-sm">A scale, simple melody, or improvisation you've practiced</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="text-[#ff5a00] font-bold text-lg mt-1">✓</div>
              <div>
                <p className="text-white font-semibold">Practice with Purpose</p>
                <p className="text-slate-400 text-sm">Focus on tone quality, steady rhythm, and clear articulation</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="text-[#ff5a00] font-bold text-lg mt-1">✓</div>
              <div>
                <p className="text-white font-semibold">Tone Quality</p>
                <p className="text-slate-400 text-sm">Record in a quiet space for best sound capture</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="text-[#ff5a00] font-bold text-lg mt-1">✓</div>
              <div>
                <p className="text-white font-semibold">Confidence</p>
                <p className="text-slate-400 text-sm">Perform with energy and pride in your progress</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12 p-8 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-2xl font-semibold text-white mb-4">2. Recording Guidelines</h2>
          <ul className="text-slate-400 space-y-2">
            <li>☐ Duration: 30-90 seconds</li>
            <li>☐ Clear, audible sound</li>
            <li>☐ No background noise</li>
            <li>☐ Steady tempo throughout</li>
            <li>☐ Confident, expressive playing</li>
            <li>☐ Well-prepared performance</li>
          </ul>
        </section>

        <section className="mb-16 p-8 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-2xl font-semibold text-white mb-6">3. Submit Your Performance</h2>
          <div className="space-y-4">
            {!recordedAudio ? (
              <>
                <p className="text-slate-400">Click the button below to record your saxophone performance:</p>
                <div className="flex gap-3">
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${
                      isRecording
                        ? "bg-red-600 hover:bg-red-700 text-white"
                        : "bg-[#ff5a00] hover:bg-[#ff7a20] text-white"
                    }`}
                  >
                    {isRecording ? (
                      <>
                        <Square size={18} />
                        Stop Recording
                      </>
                    ) : (
                      <>
                        <Mic size={18} />
                        Start Recording
                      </>
                    )}
                  </button>
                </div>
                {isRecording && <p className="text-red-400 text-sm font-semibold animate-pulse">● Recording...</p>}
              </>
            ) : (
              <div className="space-y-4">
                <p className="text-slate-400">Recording ready! Listen and verify:</p>
                <audio controls className="w-full bg-black/40 rounded-lg">
                  <source src={recordedAudio} type="audio/webm" />
                </audio>
                <div className="flex gap-3">
                  <button
                    onClick={() => setRecordedAudio(null)}
                    className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-full font-semibold transition-all"
                  >
                    Re-record
                  </button>
                  <button
                    onClick={uploadRecording}
                    disabled={uploading}
                    className="px-6 py-3 bg-[#ff5a00] hover:bg-[#ff7a20] text-white rounded-full font-semibold transition-all disabled:opacity-50"
                  >
                    {uploading ? "Uploading..." : "Submit Recording"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        <div className="flex items-center justify-between pt-6 border-t border-white/10">
          <span className="text-sm text-slate-400">Progress: <span className="text-[#ff5a00] font-bold">{progressPercent}%</span></span>
          <Link href="/dashboard/student" className="px-8 py-3 bg-white/10 hover:bg-white/20 text-slate-300 rounded-full transition-all">
            Back to Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}