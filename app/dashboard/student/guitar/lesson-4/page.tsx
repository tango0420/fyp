"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";

export default function Lesson4() {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const [progress, setProgress] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [recordingError, setRecordingError] = useState<string | null>(null);

  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      fetch(`/api/progress?userId=${encodeURIComponent(session.user.email)}`)
        .then(res => res.json())
        .then(data => {
          const completed = Array.isArray(data) ? data.filter(p => p.completed).length : 0;
          setProgressPercent(Math.round((completed / 4) * 100));
        });
    }
  }, [status, session]);

  const startRecording = async () => {
    try {
      setRecordingError(null);
      
      // Stop existing stream if any
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      // Check browser support
      const mediaDevices = navigator.mediaDevices;
      if (!mediaDevices || !mediaDevices.getUserMedia) {
        setRecordingError("Your browser doesn't support audio recording. Please use Chrome, Firefox, Edge, or Safari.");
        return;
      }

      // Request microphone with relaxed constraints
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true
      }).catch(async (err) => {
        // Retry with more relaxed constraints
        return navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: false
          }
        });
      });
      
      streamRef.current = stream;
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        setUploadSuccess(false);
      };

      mediaRecorderRef.current.start();
      setRecording(true);
      setRecordingError(null);
    } catch (err) {
      const error = err as Error & { name: string };
      
      if (error.name === "NotAllowedError") {
        setRecordingError("Microphone permission denied. Please allow microphone access in your browser settings and try again.");
      } else if (error.name === "NotFoundError" || error.name === "DeviceNotFoundError") {
        setRecordingError("No microphone found. Please check that a microphone is connected.");
      } else if (error.name === "NotReadableError") {
        setRecordingError("Microphone is in use or unavailable. Please close other apps using the microphone and try again.");
      } else if (error.name === "SecurityError") {
        setRecordingError("This page must be served over HTTPS to record audio. Please use a secure connection.");
      } else {
        setRecordingError(`Microphone error: ${error.message || "Could not access microphone. Please try again."}`);
      }
      setRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    
    // Stop all audio tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    setRecording(false);
  };

  const chords = [
    { name: "C", img: "/c.png" },
    { name: "G", img: "/g.png" },
    { name: "Am", img: "/a.png" },
    { name: "F", img: "/f.png" },
    { name: "D", img: "/d.png" },
    { name: "Em", img: "/e.png" },
  ];

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProgress(0);
    
    // Cleanup on unmount
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const markLessonComplete = async () => {
    if (status === "authenticated" && session?.user?.email) {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.email, lessonId: "4" })
      });
    }
  };

  // Handler for sending audio for review
  const handleSendForReview = async () => {
    if (!audioURL || !session?.user?.email) return;
    setUploading(true);
    setUploadSuccess(false);
    try {
      const response = await fetch(audioURL);
      const audioBlob = await response.blob();
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.wav");
      formData.append("userId", session.user.email);
      formData.append("lessonId", "4");
      const res = await fetch("/api/upload-audio", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        setUploadSuccess(true);
      }
    } catch (err) {
      setUploadSuccess(false);
      console.error("Audio upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-[#0d0d0d] text-slate-300 font-sans antialiased">
      {/* Back Button */}
      <div className="fixed top-8 left-4 md:left-8 z-20">
        <Link
          href="/dashboard/student/guitar"
          className="flex items-center gap-2 text-slate-400 hover:text-white bg-black/40 px-4 py-2 rounded-full border border-white/10"
        >
          <ArrowLeft size={18} />
          <span className="text-xs uppercase">Back</span>
        </Link>
      </div>

      <main className="max-w-7xl mx-auto px-4 pt-32 pb-24">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Lesson 4: Consolidate & Record
        </h1>
        <p className="text-lg text-slate-400 mb-12">
          Combine everything learned — chords, strumming, and finger exercises — and record your performance for review by our tutor.
        </p>

        {/* Warmup */}
        <section className="mb-12">
          <h2 className="text-2xl text-white mb-4">1. Warm-Up Recap</h2>
          <p className="text-slate-400 mb-4">
            Do 5 minutes of finger exercises from Lesson 3 before playing:
          </p>
          <div className="bg-white/5 p-6 rounded-xl space-y-2 text-slate-400">
            <p>• Spider Walk (1-2-3-4)</p>
            <p>• Finger Independence (1-3-2-4)</p>
            <p>• Use a metronome to gradually increase speed</p>
          </div>
        </section>

        {/* Chord Loop */}
        <section className="mb-12">
          <h2 className="text-2xl text-white mb-4">2. Chord Loop Practice</h2>
          <p className="text-slate-400 mb-4">
            Practice all chords in a loop to build smooth transitions:
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-6">
            {chords.map((chord) => (
              <div key={chord.name} className="text-center flex flex-col items-center">
                <div className="w-32 h-40 flex items-center justify-center bg-white/5 rounded-lg p-2">
                  <img
                    src={chord.img}
                    alt={chord.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <p className="mt-2 text-sm text-slate-400">{chord.name}</p>
              </div>
            ))}
          </div>

          <div className="bg-black/40 p-6 rounded-xl text-center text-orange-500 font-mono mb-4">
            Strum pattern: Down – Down-Up – Up-Down-Up
          </div>
          <p className="text-slate-400">
            Repeat 4–8 times. Focus on timing and clean sound.
          </p>
        </section>

        {/* Optional Improv */}
        <section className="mb-12">
          <h2 className="text-2xl text-white mb-4">3. Free Play / Improv</h2>
          <p className="text-slate-400 mb-4">
            Try creating your own 8–16 chord progression. Helps internalize rhythm, chord shapes, and finger independence.
          </p>
          <div className="bg-white/5 p-6 rounded-xl text-slate-400">
            <p>• Start with any chord</p>
            <p>• Switch chords smoothly with strumming pattern</p>
            <p>• Experiment with timing variations</p>
          </div>
        </section>

        {/* Recording */}
        <section className="mb-16">
          <h2 className="text-2xl text-white mb-4">4. Record Your Progress</h2>
          <p className="text-slate-400 mb-4">
            Record yourself playing the chord loop or your own progression. You can submit a recording of your performance for review by our tutor.
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
                className="px-6 py-2 rounded-full bg-[#ff5a00] text-white font-semibold hover:bg-[#ff5a00]/90 transition-all"
              >
                Start Recording
              </button>
            )}

            {recordingError && (
              <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4 max-w-lg text-red-300 text-sm space-y-3">
                <p>{recordingError}</p>
                <button
                  onClick={() => {
                    setRecordingError(null);
                    startRecording();
                  }}
                  className="px-4 py-1 bg-red-600 hover:bg-red-700 rounded text-white text-xs font-semibold transition-all"
                >
                  Retry
                </button>
              </div>
            )}

            {audioURL && (
              <audio controls src={audioURL} className="w-full max-w-lg rounded-lg mt-2" />
            )}
          </div>

          <p className="text-sm text-slate-400 text-center max-w-xl mx-auto mt-2">
            Once recorded, send this clip to our tutor for a **free one-time review**.
          </p>

          <div className="flex flex-col items-center mt-4 gap-2">
            <button
              onClick={handleSendForReview}
              className="px-6 py-2 rounded-full bg-[#ff5a00] text-white text-sm font-semibold hover:bg-[#ff5a00]/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={!audioURL || uploading}
            >
              {uploading ? "Sending..." : "Send for Review"}
            </button>
            {uploadSuccess && (
              <span className="text-green-400 text-sm mt-1">✓ Audio sent successfully for review!</span>
            )}
          </div>
        </section>

        {/* Progress UI */}
        <div className="flex items-center justify-between pt-6 border-t border-white/10 mb-4">
          <span className="text-sm text-slate-400">Progress: <span className="text-[#ff5a00] font-bold">{progressPercent}%</span></span>
        </div>
        {/* Footer */}
        <div className="flex justify-end">
          <Link
            href="/dashboard/student/guitar"
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