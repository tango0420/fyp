"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";
interface ProgressRecord { lessonId?: string; completed?: boolean; }

export default function GuitarLesson6() {
  const { data: session, status } = useSession();
  const [progressPercent, setProgressPercent] = useState(0);
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      fetch(`/api/progress?userId=${encodeURIComponent(session.user.email)}`).then(r => r.json()).then((data: ProgressRecord[]) => {
        const c = Array.isArray(data) ? data.filter(p => p.completed && typeof p.lessonId === "string" && p.lessonId.startsWith("guitar-")).length : 0;
        setProgressPercent(Math.round((c / 6) * 100));
      });
    }
  }, [status, session]);

  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      mediaRecorderRef.current.ondataavailable = (e) => { audioChunksRef.current.push(e.data); };
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        setAudioURL(URL.createObjectURL(blob));
        setUploadSuccess(false);
      };
      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (err) {
      setError("Failed to access microphone. Please check permissions.");
      console.error(err);
    }
  };
  const stopRecording = () => { mediaRecorderRef.current?.stop(); setRecording(false); };
  const markLessonComplete = async () => {
    if (status === "authenticated" && session?.user?.email) {
      await fetch("/api/progress", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: session.user.email, lessonId: "guitar-6" }) });
    }
  };
  const handleSendForReview = async () => {
    if (!audioURL || !session?.user?.email) return;
    setUploading(true);
    setError(null);
    try {
      const blob = await (await fetch(audioURL)).blob();
      const form = new FormData();
      form.append("audio", blob, "guitar-performance.wav");
      form.append("userId", session.user.email);
      form.append("lessonId", "guitar-6");
      const res = await fetch("/api/upload-audio", { method: "POST", body: form });
      if (res.ok) {
        setUploadSuccess(true);
      } else {
        setError("Upload failed. Please try again.");
      }
    } catch (e) {
      setError("Upload failed. Please try again.");
      console.error(e);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-[#0d0d0d] text-slate-300 font-sans antialiased min-h-screen">
      <div className="fixed top-8 left-4 md:left-8 z-20">
        <Link href="/dashboard/student/guitar" className="flex items-center gap-2 text-slate-400 hover:text-white bg-black/40 px-4 py-2 rounded-full border border-white/10 shadow-lg transition-all">
          <ArrowLeft size={18} /><span className="text-xs font-semibold uppercase tracking-widest">Back</span>
        </Link>
      </div>
      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-32 pb-24">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Lesson 6: First Song Performance</h1>
          <p className="text-xl text-slate-400 leading-relaxed max-w-3xl">Everything you've learned — chords, strumming, switching, and scale awareness — comes together in a complete musical performance.</p>
        </header>
        <section className="mb-12">
          <h2 className="text-2xl text-white mb-4">1. Performance Checklist</h2>
          <div className="bg-white/5 rounded-xl p-6 text-slate-400 space-y-2">
            <p>• Tune your guitar before you start</p>
            <p>• Warm up with slow chord transitions for 3 minutes</p>
            <p>• Choose a tempo you can maintain through the whole song</p>
            <p>• Keep strumming even when switching chords</p>
            <p>• Focus on feel and consistency over perfection</p>
          </div>
        </section>
        <section className="mb-12 p-8 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-2xl text-white mb-4">2. Suggested Song Structures</h2>
          <div className="space-y-4">
            <div className="bg-black/40 p-4 rounded-xl text-[#ff5a00] font-mono text-center">G – D – Em – C (repeat x4)</div>
            <div className="bg-black/40 p-4 rounded-xl text-[#ff5a00] font-mono text-center">C – G – Am – F (repeat x4)</div>
          </div>
          <p className="text-slate-400 mt-4">Both progressions are used in thousands of popular songs. Pick one and play it through completely without stopping.</p>
        </section>
        <section className="mb-12">
          <h2 className="text-2xl text-white mb-4">3. Add Some Lead</h2>
          <p className="text-slate-400 mb-4">After you're comfortable with the rhythm, try adding a few pentatonic scale notes between chord changes. This is the beginning of lead guitar.</p>
          <div className="bg-black/40 p-6 rounded-xl text-[#ff5a00] font-mono text-center">Rhythm → Scale phrase → Back to rhythm</div>
        </section>
        <section className="mb-16">
          <h2 className="text-2xl text-white mb-4">4. Record and Submit</h2>
          <p className="text-slate-400 mb-4">Record your full performance and send it to your tutor for personalized feedback.</p>
          <div className="flex flex-col items-center gap-4 mb-4">
            {recording ? (
              <button onClick={stopRecording} className="px-6 py-2 rounded-full bg-gray-800 text-white font-semibold hover:bg-gray-700 transition-all">Stop Recording</button>
            ) : (
              <button onClick={startRecording} className="px-6 py-2 rounded-full bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-all">Start Recording</button>
            )}
            {audioURL && <audio controls src={audioURL} className="w-full max-w-lg rounded-lg mt-2" />}
          </div>
          <div className="flex flex-col items-center mt-4 gap-2">
            <button onClick={handleSendForReview} className="px-6 py-2 rounded-full bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-all disabled:opacity-60" disabled={!audioURL || uploading}>
              {uploading ? "Sending..." : "Send for Review"}
            </button>
            {uploadSuccess && <span className="text-green-400 text-sm mt-1">Audio sent successfully for review!</span>}
            {error && <span className="text-red-400 text-sm mt-1">{error}</span>}
          </div>
        </section>
        <div className="flex items-center justify-between pt-6 border-t border-white/10 mb-4">
          <span className="text-sm text-slate-400">Progress: <span className="text-[#ff5a00] font-bold">{progressPercent}%</span></span>
        </div>
        <div className="flex justify-end">
          <Link href="/dashboard/student/guitar" className="px-8 py-3 bg-[#ff5a00] text-white rounded-full hover:bg-white hover:text-black" onClick={markLessonComplete}>Finish Course</Link>
        </div>
      </main>
    </div>
  );
}