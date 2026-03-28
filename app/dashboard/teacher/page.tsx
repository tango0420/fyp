"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  Users, 
  Music, 
  Settings, 
  CheckCircle, 
  PlayCircle, 
  MessageSquare, 
  Calendar,
  User
} from "lucide-react";

export default function TeacherDashboard() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [teacherInfo, setTeacherInfo] = useState<any>(null);
  const [tab, setTab] = useState<'sessions' | 'review' | 'edit'>('sessions');
  const [audioUploads, setAudioUploads] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      fetch(`/api/teacher-info?userId=${encodeURIComponent(session.user.email)}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.exists) {
            setTeacherInfo(data.info);
            // Fetch booking requests for this teacher
            fetch(`/api/book-tutor?tutorId=${encodeURIComponent(data.info.userId)}`)
              .then(res => res.json())
              .then(reqData => setRequests(reqData.bookings || []));
          } else {
            router.replace("/dashboard/teacher/info-form");
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));

      fetch('/api/audio-uploads')
        .then(res => res.json())
        .then(data => setAudioUploads(data.uploads || []));
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [status, session, router]);

  if (loading) return <div className="p-12 text-center text-slate-400">Loading Dashboard...</div>;
  if (!teacherInfo) return null;



  return (
    <div className="min-h-screen bg-[#0f1115] text-slate-200 font-sans pb-12">
      
      {/* --- CLASSIC TOP NAV --- */}
      <nav className="bg-[#161920] border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <span className="text-[#ff5a00] font-bold text-xl tracking-tight">Virtuoso.</span>
            <div className="flex h-16">
              {[
                { id: 'sessions', label: 'Sessions', icon: Calendar },
                { id: 'review', label: 'Reviews', icon: Music },
                { id: 'edit', label: 'Settings', icon: Settings },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setTab(item.id as any)}
                  className={`flex items-center gap-2 px-4 transition-all relative ${
                    tab === item.id ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <item.icon size={18} />
                  <span className="text-sm font-medium">{item.label}</span>
                  {tab === item.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ff5a00]" />
                  )}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm font-medium">
            <span className="text-slate-400">{teacherInfo.name}</span>
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs">
              <User size={16} />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 mt-10">
        
        {/* --- SECTION HEADER --- */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-white">
            {tab === 'sessions' && "Lesson Requests"}
            {tab === 'review' && "Student Submissions"}
            {tab === 'edit' && "Account Settings"}
          </h2>
          <p className="text-slate-500 text-sm">
            Manage your teaching schedule and student feedback.
          </p>
        </div>

        {/* --- CONTENT AREA --- */}
        <div className="space-y-4">

          {/* SESSIONS TAB */}
          {tab === 'sessions' && (
            <div className="bg-[#161920] border border-white/5 rounded-xl overflow-hidden">
              {requests.length > 0 ? (
                <div className="divide-y divide-white/5">
                  {requests.map((req: any, idx: number) => (
                    <div key={idx} className="p-4 flex flex-col md:flex-row md:items-center justify-between hover:bg-white/[0.02] transition-colors gap-2 md:gap-0">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-[#ff5a00]/10 text-[#ff5a00] flex items-center justify-center font-bold">
                          {req.studentName?.charAt(0) || "S"}
                        </div>
                        <div>
                          <p className="text-white font-bold text-lg mb-1">{req.studentName || "Student"}</p>
                          <p className="text-xs text-slate-500 uppercase tracking-wide">{req.time ? new Date(req.time).toLocaleString() : "No time set"}</p>
                          <p className="text-xs text-slate-400">Contact: {req.contactNumber}</p>
                          <p className="text-xs text-slate-400">Message: {req.message}</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-white text-black text-sm font-semibold rounded-lg hover:bg-[#ff5a00] hover:text-white transition-all">
                        Accept Request
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center text-slate-500 text-sm italic">No pending requests at the moment.</div>
              )}
            </div>
          )}

          {/* REVIEWS TAB */}
          {tab === 'review' && (
            <div className="grid grid-cols-1 gap-4">
              {audioUploads.length > 0 ? (
  audioUploads.map((audio) => (
    <AudioReviewCard key={audio._id} audio={audio} teacherInfo={teacherInfo} />
  ))
) : (
                <div className="bg-[#161920] border border-white/5 rounded-xl p-12 text-center text-slate-500 text-sm">No submissions to review.</div>
              )}
            </div>
          )}

          {/* SETTINGS TAB */}
          {tab === 'edit' && (
            <div className="bg-[#161920] border border-white/5 rounded-xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Full Name</label>
                  <div className="p-3 bg-[#0f1115] rounded-lg border border-white/5 text-white">{teacherInfo.name}</div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Instrument</label>
                  <div className="p-3 bg-[#0f1115] rounded-lg border border-white/5 text-white">{teacherInfo.instrument}</div>
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Biography</label>
                <div className="p-4 bg-[#0f1115] rounded-lg border border-white/5 text-slate-300 text-sm leading-relaxed">
                  {teacherInfo.bio}
                </div>
              </div>
              <button 
                onClick={() => router.push('/dashboard/teacher/info-form')}
                className="text-sm font-semibold text-[#ff5a00] hover:underline"
              >
                Edit Profile Details
              </button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

function AudioReviewCard({ audio, teacherInfo }) {
  const [feedback, setFeedback] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleSubmit = async () => {
    setSubmitting(true);
    setSuccess(false);
    setError("");
    try {
      const res = await fetch("/api/audio-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audioId: audio._id,
          teacherId: teacherInfo.userId,
          teacherName: teacherInfo.name,
          feedback,
        }),
      });
      if (res.ok) {
        setSuccess(true);
        setFeedback("");
      } else {
        setError("Failed to submit review.");
      }
    } catch {
      setError("Failed to submit review.");
    }
    setSubmitting(false);
  };

  return (
    <div className="bg-[#161920] border border-white/5 rounded-xl p-5 space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <PlayCircle className="text-[#ff5a00]" size={20} />
          <span className="text-white font-medium">{audio.userId}</span>
          <span className="text-xs bg-white/5 px-2 py-1 rounded text-slate-400">Lesson {audio.lessonId}</span>
        </div>
      </div>
      <audio controls src={`/uploads/${audio.filename}`} className="w-full h-8 filter invert contrast-125 opacity-70" />
      <div className="flex gap-3 items-start">
        <textarea
          className="flex-1 bg-[#0f1115] border border-white/10 rounded-lg p-3 text-sm text-slate-300 focus:border-[#ff5a00] focus:ring-1 focus:ring-[#ff5a00] outline-none transition-all resize-none"
          placeholder="Type your feedback here..."
          rows={2}
          value={feedback}
          onChange={e => setFeedback(e.target.value)}
          disabled={submitting}
        />
        <button
          className="px-4 py-3 bg-[#ff5a00] text-white rounded-lg hover:bg-[#e65100] transition-colors disabled:opacity-60"
          onClick={handleSubmit}
          disabled={submitting || !feedback.trim()}
        >
          <MessageSquare size={18} />
        </button>
      </div>
      {success && <div className="text-green-400 text-xs">Review submitted!</div>}
      {error && <div className="text-red-400 text-xs">{error}</div>}
    </div>
  );
}