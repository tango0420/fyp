"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";

export default function FluteLesson6() {
  const { data: session, status } = useSession();
  const [progressPercent, setProgressPercent] = useState(0);
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      fetch(`/api/progress?userId=${encodeURIComponent(session.user.email)}`)
        .then((res) => res.json())
        .then((data) => {
          const completed = Array.isArray(data)
            ? data.filter((p) => p.completed && typeof p.lessonId === "string" && p.lessonId.startsWith("flute-")).length
            : 0;
          setProgressPercent(Math.round((completed / 6) * 100));
        });
    }
  }, [status, session]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    audioChunksRef.current = [];

    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      const url = URL.createObjectURL(audioBlob);
      setAudioURL(url);
      setUploadSuccess(false);
    };

    mediaRecorderRef.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const markLessonComplete = async () => {
    if (status === "authenticated" && session?.user?.email) {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.email, lessonId: "flute-6" }),
      });
    }
  };

  const handleSendForReview = async () => {
    if (!audioURL || !session?.user?.email) return;

    setUploading(true);
    setUploadSuccess(false);

    try {
      const response = await fetch(audioURL);
      const audioBlob = await response.blob();
      const formData = new FormData();
      formData.append("audio", audioBlob, "flute-practice.wav");
      formData.append("userId", session.user.email);
      formData.append("lessonId", "flute-6");

      const res = await fetch("/api/upload-audio", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setUploadSuccess(true);
      }
    } catch (error) {
      console.error("Audio upload failed", error);
      setUploadSuccess(false);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-[#0d0d0d] text-slate-300 font-sans antialiased min-h-screen">
      <div className="fixed top-8 left-4 md:left-8 z-20">
        <Link href="/dashboard/student/flute" className="flex items-center gap-2 text-slate-400 hover:text-white bg-black/40 px-4 py-2 rounded-full border border-white/10 shadow-lg transition-all">
          <ArrowLeft size={18} />
          <span className="text-xs font-semibold uppercase tracking-widest">Back</span>
        </Link>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-32 pb-24">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Lesson 6: Performance Preparation</h1>
          <p className="text-xl text-slate-400 leading-relaxed max-w-3xl">
            Record your playing, receive feedback, and prepare for confident musical performance.
          </p>
        </header>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">1. Preparing a Performance Piece</h2>
          <p className="text-slate-400 mb-4 leading-relaxed">
            Learn the steps to prepare a piece that showcases your skills and musicality.
          </p>
          <div className="space-y-3">
            <div className="bg-white/5 p-4 rounded-lg">
              <h4 className="text-white font-medium mb-2">Step 1: Select & Learn</h4>
              <p className="text-slate-400 text-sm">Choose a piece you love and practice slowly until note-perfect.</p>
            </div>
            <div className="bg-white/5 p-4 rounded-lg">
              <h4 className="text-white font-medium mb-2">Step 2: Build Tempo</h4>
              <p className="text-slate-400 text-sm">Gradually increase speed with a metronome. Never rush perfection.</p>
            </div>
            <div className="bg-white/5 p-4 rounded-lg">
              <h4 className="text-white font-medium mb-2">Step 3: Add Expression</h4>
              <p className="text-slate-400 text-sm">Incorporate dynamics, articulation, and personal interpretation.</p>
            </div>
            <div className="bg-white/5 p-4 rounded-lg">
              <h4 className="text-white font-medium mb-2">Step 4: Perform & Record</h4>
              <p className="text-slate-400 text-sm">Play confidently and record for feedback and reflection.</p>
            </div>
          </div>
        </section>

        <section className="mb-12 p-8 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-2xl font-semibold text-white mb-4">2. Performance Checklist</h2>
          <div className="space-y-2 text-slate-400">
            <p>✓ Instrument is clean and in good condition</p>
            <p>✓ You are relaxed and have warmed up properly</p>
            <p>✓ Your posture is tall and confident</p>
            <p>✓ You know the piece from memory or have it visible</p>
            <p>✓ You have practiced variations and ornaments</p>
            <p>✓ Your breathing is planned and coordinated</p>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-white mb-4">3. Record Your Performance</h2>
          <p className="text-slate-400 mb-6">
            Record yourself playing a complete piece or exercise. Submit for feedback from teachers.
          </p>

          <div className="flex flex-col items-center gap-4 mb-4">
            {recording ? (
              <button
                onClick={stopRecording}
                className="px-6 py-2 rounded-full bg-red-600 text-white font-semibold hover:bg-red-700 transition-all"
              >
                Stop Recording
              </button>
            ) : (
              <button
                onClick={startRecording}
                className="px-6 py-2 rounded-full bg-[#ff5a00] text-white font-semibold hover:bg-[#ff7a20] transition-all"
              >
                Start Recording
              </button>
            )}

            {audioURL && <audio controls src={audioURL} className="w-full max-w-lg rounded-lg mt-2" />}
          </div>

          <div className="flex flex-col items-center mt-4 gap-2">
            <button
              onClick={handleSendForReview}
              className="px-6 py-2 rounded-full bg-[#ff5a00] text-white text-sm font-semibold hover:bg-[#ff7a20] transition-all disabled:opacity-60"
              disabled={!audioURL || uploading}
            >
              {uploading ? "Sending..." : "Send for Review"}
            </button>
            {uploadSuccess && <span className="text-green-400 text-sm mt-1">Performance recorded and sent for review!</span>}
          </div>
        </section>

        <div className="flex items-center justify-between pt-6 border-t border-white/10 mb-4">
          <span className="text-sm text-slate-400">Progress: <span className="text-[#ff5a00] font-bold">{progressPercent}%</span></span>
        </div>

        <div className="flex justify-end">
          <Link href="/dashboard/student/flute" className="px-8 py-3 bg-[#ff5a00] text-white rounded-full hover:bg-white hover:text-black" onClick={markLessonComplete}>
            Finish Lesson
          </Link>
        </div>
      </main>
    </div>
  );
}