"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";

export default function PianoLesson4() {
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
            ? data.filter(
                (p: { lessonId?: string; completed?: boolean }) =>
                  p.completed && typeof p.lessonId === "string" && p.lessonId.startsWith("piano-")
              ).length
            : 0;
          setProgressPercent(Math.round((completed / 4) * 100));
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
        body: JSON.stringify({ userId: session.user.email, lessonId: "piano-4" }),
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
      formData.append("audio", audioBlob, "piano-practice.wav");
      formData.append("userId", session.user.email);
      formData.append("lessonId", "piano-4");

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
        <Link
          href="/dashboard/student/piano"
          className="flex items-center gap-2 text-slate-400 hover:text-white bg-black/40 px-4 py-2 rounded-full border border-white/10 shadow-lg transition-all"
        >
          <ArrowLeft size={18} />
          <span className="text-xs font-semibold uppercase tracking-widest">Back</span>
        </Link>
      </div>

      <main className="max-w-7xl mx-auto px-4 pt-32 pb-24">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Lesson 4: Basic Triads & Chords</h1>
        <p className="text-lg text-slate-400 mb-12 max-w-3xl">
          Combine the keyboard geography, finger control, and scale knowledge from the earlier lessons into real harmonic playing.
        </p>

        <section className="mb-12">
          <h2 className="text-2xl text-white mb-4">1. What Is a Triad?</h2>
          <p className="text-slate-400 mb-4 leading-relaxed">
            A triad is a three-note chord built from the <strong>root</strong>, <strong>third</strong>, and <strong>fifth</strong> of a scale. These are the building blocks of countless songs.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { title: "C Major", notes: "C - E - G" },
              { title: "F Major", notes: "F - A - C" },
              { title: "G Major", notes: "G - B - D" },
            ].map((chord) => (
              <div key={chord.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-white font-semibold mb-2">{chord.title}</h3>
                <p className="text-[#ff5a00] font-mono tracking-[0.25em]">{chord.notes}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12 p-8 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-2xl text-white mb-4">2. Practice Progression</h2>
          <p className="text-slate-400 mb-4">Use this beginner-friendly progression and loop it slowly:</p>
          <div className="bg-black/40 p-6 rounded-xl text-center text-[#ff5a00] font-mono text-xl tracking-[0.4em]">
            C &nbsp;–&nbsp; G &nbsp;–&nbsp; Am &nbsp;–&nbsp; F
          </div>
          <ul className="list-disc list-inside text-slate-400 mt-6 space-y-2">
            <li>Play each chord as a block first.</li>
            <li>Then try broken chords one note at a time.</li>
            <li>Keep a steady pulse while switching between shapes.</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl text-white mb-4">3. Video Reference</h2>
          <div className="flex justify-center">
            <div className="w-full max-w-3xl aspect-video rounded-xl border border-white/10 overflow-hidden">
              <iframe
                src="https://www.youtube.com/embed/Yp69Y6pQnSc"
                title="Piano Chords for Beginners"
                allowFullScreen
                className="w-full h-full rounded-xl"
                style={{ minHeight: 315 }}
              />
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl text-white mb-4">4. Record Your Progress</h2>
          <p className="text-slate-400 mb-4">
            Record yourself playing the C - G - Am - F progression, then submit it for feedback.
          </p>

          <div className="flex flex-col items-center gap-4 mb-4">
            {recording ? (
              <button
                onClick={stopRecording}
                className="px-6 py-2 rounded-full bg-gray-800 text-white font-semibold hover:bg-gray-700 transition-all"
              >
                Stop Recording
              </button>
            ) : (
              <button
                onClick={startRecording}
                className="px-6 py-2 rounded-full bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-all"
              >
                Start Recording
              </button>
            )}

            {audioURL && <audio controls src={audioURL} className="w-full max-w-lg rounded-lg mt-2" />}
          </div>

          <div className="flex flex-col items-center mt-4 gap-2">
            <button
              onClick={handleSendForReview}
              className="px-6 py-2 rounded-full bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-all disabled:opacity-60"
              disabled={!audioURL || uploading}
            >
              {uploading ? "Sending..." : "Send for Review"}
            </button>
            {uploadSuccess && <span className="text-green-400 text-sm mt-1">Audio sent successfully for review!</span>}
          </div>
        </section>

        <div className="flex items-center justify-between pt-6 border-t border-white/10 mb-4">
          <span className="text-sm text-slate-400">
            Progress: <span className="text-[#ff5a00] font-bold">{progressPercent}%</span>
          </span>
        </div>

        <div className="flex justify-end">
          <Link
            href="/dashboard/student/piano"
            className="px-8 py-3 bg-[#ff5a00] text-white rounded-full hover:bg-white hover:text-black"
            onClick={markLessonComplete}
          >
            Finish Lesson
          </Link>
        </div>
      </main>
    </div>
  );
}
