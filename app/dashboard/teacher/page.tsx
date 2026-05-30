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
  User,
  Clock,
  Star,
  TrendingUp,
  Award,
  ChevronRight,
  BookOpen,
  Headphones,
  Mail,
  Phone,
  FileText,
  X
} from "lucide-react";
import { LogoutButton } from "@/app/components/LogoutButton";
import BlogPanel from "@/app/components/BlogPanel";

export default function TeacherDashboard() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [teacherInfo, setTeacherInfo] = useState<any>(null);
  const [tab, setTab] = useState<'sessions' | 'review' | 'edit'>('sessions');
  const [audioUploads, setAudioUploads] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState("");
  const router = useRouter();

  const handleAcceptRequest = async (request: any) => {
    setProcessingId(request._id);
    console.log("Accepting request:", request);
    
    try {
      if (!request.studentEmail) {
        alert("Error: Student email is missing from booking");
        setProcessingId(null);
        return;
      }
      
      const response = await fetch("/api/teacher/booking-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: request._id,
          action: "accept",
          studentEmail: request.studentEmail,
          studentName: request.studentName || "Student",
          teacherName: teacherInfo.name,
          lessonTime: request.time ? new Date(request.time).toLocaleString() : null,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setBookings(bookings.map(b => b._id === request._id ? { ...b, status: 'accepted', updatedAt: new Date().toISOString() } : b));
        alert("✓ Request accepted! Email sent to student.");
      } else {
        console.error("API error:", data);
        alert(`Failed to accept request: ${data.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error accepting request:", error);
      alert("Error accepting request: " + (error as Error).message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectRequest = async () => {
    if (!selectedRequest) return;
    
    console.log("Rejecting request:", selectedRequest);
    
    setProcessingId(selectedRequest._id);
    try {
      if (!selectedRequest.studentEmail) {
        alert("Error: Student email is missing from booking");
        setProcessingId(null);
        return;
      }

      const response = await fetch("/api/teacher/booking-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: selectedRequest._id,
          action: "reject",
          reason: rejectReason || "Unavailable at this time",
          studentEmail: selectedRequest.studentEmail,
          studentName: selectedRequest.studentName || "Student",
          teacherName: teacherInfo.name,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setBookings(bookings.map(b => b._id === selectedRequest._id ? { ...b, status: 'rejected', updatedAt: new Date().toISOString() } : b));
        setShowRejectModal(false);
        setRejectReason("");
        setSelectedRequest(null);
        alert("✓ Request rejected! Email sent to student.");
      } else {
        console.error("API error:", data);
        alert(`Failed to reject request: ${data.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
      alert("Error rejecting request: " + (error as Error).message);
    } finally {
      setProcessingId(null);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      fetch(`/api/teacher-info?userId=${encodeURIComponent(session.user.email)}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.exists) {
            setTeacherInfo(data.info);
            fetch(`/api/book-tutor?tutorId=${encodeURIComponent(data.info.userId)}`)
              .then(res => res.json())
              .then(reqData => setBookings(reqData.bookings || []));
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

  const pendingRequests = bookings.filter((booking) => booking.status === "pending");
  const acceptedBookings = bookings.filter((booking) => booking.status === "accepted");
  const profileComplete = Boolean(
    teacherInfo?.name &&
    teacherInfo?.instrument &&
    teacherInfo?.bio &&
    teacherInfo?.contact
  );

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] to-[#141414] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#ff5a00] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-400">Loading dashboard...</p>
      </div>
    </div>
  );
  
  if (!teacherInfo) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0f0f0f] to-[#141414] text-slate-200">
      
      {/* --- MODERN TOP NAVIGATION --- */}
      <nav className="bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-[#ff5a00] to-[#ff8c00] rounded-lg"></div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">Virtuoso</span>
            </div>
            <div className="flex gap-1">
              {[
                { id: 'sessions', label: 'Lesson Requests', icon: Calendar },
                { id: 'review', label: 'Reviews', icon: Music },
                { id: 'edit', label: 'Settings', icon: Settings },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setTab(item.id as any)}
                  className={`flex items-center gap-2 px-6 py-2 rounded-xl transition-all relative ${
                    tab === item.id 
                      ? 'text-white bg-white/5' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <item.icon size={18} />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff5a00] to-[#ff8c00] flex items-center justify-center text-sm font-bold">
                {teacherInfo.name?.charAt(0) || "T"}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-white">{teacherInfo.name}</p>
                <p className="text-xs text-slate-500">{teacherInfo.instrument} Teacher</p>
              </div>
            </div>
            <LogoutButton />
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="max-w-[1600px] mx-auto px-8 py-8">
        <div className="grid grid-cols-12 gap-8">
          
          {/* Left Column - Main Content (9 cols) */}
          <div className="col-span-12 lg:col-span-9 space-y-8">
            
            {/* Welcome Section */}
            <div className="bg-gradient-to-br from-[#ff5a00]/10 via-transparent to-transparent rounded-2xl p-8 border border-white/10">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">
                    Welcome back, {teacherInfo.name?.split(' ')[0]}!
                  </h1>
                  <p className="text-slate-400">
                    Here's what's happening with your teaching studio today.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button className="px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-sm font-medium transition-all">
                    View Calendar
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-[#ff5a00]/50 transition-all cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#ff5a00]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Calendar size={24} className="text-[#ff5a00]" />
                  </div>
                  <span className="text-3xl font-bold text-white">{pendingRequests.length}</span>
                </div>
                <h3 className="text-sm font-semibold text-slate-300 mb-1">Pending Requests</h3>
                <p className="text-xs text-slate-500">Awaiting your response</p>
              </div>

              <div className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-[#ff5a00]/50 transition-all cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <CheckCircle size={24} className="text-emerald-400" />
                  </div>
                  <span className="text-3xl font-bold text-white">{acceptedBookings.length}</span>
                </div>
                <h3 className="text-sm font-semibold text-slate-300 mb-1">Confirmed Lessons</h3>
                <p className="text-xs text-slate-500">Scheduled sessions</p>
              </div>

              <div className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-[#ff5a00]/50 transition-all cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Headphones size={24} className="text-blue-400" />
                  </div>
                  <span className="text-3xl font-bold text-white">{audioUploads.length}</span>
                </div>
                <h3 className="text-sm font-semibold text-slate-300 mb-1">Pending Reviews</h3>
                <p className="text-xs text-slate-500">Audio submissions to grade</p>
              </div>

              <div className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-[#ff5a00]/50 transition-all cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Award size={24} className="text-purple-400" />
                  </div>
                  <span className="text-3xl font-bold text-white">{profileComplete ? "✓" : "!"}</span>
                </div>
                <h3 className="text-sm font-semibold text-slate-300 mb-1">Profile Status</h3>
                <p className="text-xs text-slate-500">{profileComplete ? "Ready for students" : "Complete your profile"}</p>
              </div>
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {/* SESSIONS TAB */}
              {tab === 'sessions' && (
                <>
                  {/* Pending Requests Section */}
                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
                    <div className="px-6 py-5 border-b border-white/10 bg-gradient-to-r from-white/5 to-transparent">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-white">Pending Requests</h3>
                          <p className="text-sm text-slate-400 mt-1">Review and respond to student booking requests</p>
                        </div>
                        {pendingRequests.length > 0 && (
                          <span className="px-3 py-1 bg-[#ff5a00]/20 text-[#ff5a00] text-xs font-semibold rounded-full">
                            {pendingRequests.length} pending
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {pendingRequests.length > 0 ? (
                      <div className="divide-y divide-white/10">
                        {pendingRequests.map((req: any, idx: number) => (
                          <div key={idx} className="p-6 hover:bg-white/5 transition-colors">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                              <div className="flex items-start gap-4 flex-1">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ff5a00] to-[#ff8c00] flex items-center justify-center font-bold text-white flex-shrink-0">
                                  {req.studentName?.charAt(0) || "S"}
                                </div>
                                <div className="flex-1">
                                  <h4 className="text-white font-semibold text-lg mb-1">{req.studentName || "Student"}</h4>
                                  <div className="flex flex-wrap gap-3 text-sm text-slate-400 mb-2">
                                    <span className="flex items-center gap-1">
                                      <Calendar size={14} />
                                      {req.time ? new Date(req.time).toLocaleString() : "No time set"}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Mail size={14} />
                                      {req.studentEmail}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Phone size={14} />
                                      {req.contactNumber}
                                    </span>
                                  </div>
                                  {req.message && (
                                    <div className="mt-2 p-3 bg-black/20 rounded-lg border border-white/5">
                                      <p className="text-xs text-slate-400 mb-1">📝 Message:</p>
                                      <p className="text-sm text-slate-300">{req.message}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-3">
                                <button
                                  onClick={() => handleAcceptRequest(req)}
                                  disabled={processingId === req._id}
                                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-60 shadow-lg shadow-emerald-500/20"
                                >
                                  {processingId === req._id ? "Processing..." : "Accept"}
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedRequest(req);
                                    setShowRejectModal(true);
                                  }}
                                  disabled={processingId === req._id}
                                  className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-xl transition-all border border-white/10"
                                >
                                  Decline
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-12 text-center">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                          <Calendar size={32} className="text-slate-600" />
                        </div>
                        <p className="text-slate-400">No pending requests at the moment</p>
                        <p className="text-sm text-slate-500 mt-1">When students book lessons, they'll appear here</p>
                      </div>
                    )}
                  </div>

                  {/* Confirmed Lessons Section */}
                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
                    <div className="px-6 py-5 border-b border-white/10 bg-gradient-to-r from-white/5 to-transparent">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-white">Confirmed Lessons</h3>
                          <p className="text-sm text-slate-400 mt-1">Your upcoming and scheduled sessions</p>
                        </div>
                        {acceptedBookings.length > 0 && (
                          <button className="px-3 py-1 bg-white/5 text-slate-300 text-xs font-semibold rounded-lg hover:bg-white/10 transition-colors">
                            View Calendar →
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {acceptedBookings.length > 0 ? (
                      <div className="divide-y divide-white/10">
                        {acceptedBookings.map((lesson: any, idx: number) => (
                          <div key={idx} className="p-6 hover:bg-white/5 transition-colors">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                              <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                                  <CheckCircle size={24} className="text-emerald-400" />
                                </div>
                                <div>
                                  <h4 className="text-white font-semibold text-lg mb-1">{lesson.studentName || "Student"}</h4>
                                  <div className="flex flex-wrap gap-3 text-sm text-slate-400">
                                    <span className="flex items-center gap-1">
                                      <Calendar size={14} />
                                      {lesson.time ? new Date(lesson.time).toLocaleString() : "No time set"}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Mail size={14} />
                                      {lesson.studentEmail}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-full flex items-center gap-1">
                                  <CheckCircle size={12} />
                                  Confirmed
                                </span>
                                <button className="text-slate-400 hover:text-white transition-colors">
                                  <ChevronRight size={20} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-12 text-center">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                          <CheckCircle size={32} className="text-slate-600" />
                        </div>
                        <p className="text-slate-400">No confirmed lessons yet</p>
                        <p className="text-sm text-slate-500 mt-1">Accepted requests will appear here</p>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* REVIEWS TAB */}
              {tab === 'review' && (
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
                  <div className="px-6 py-5 border-b border-white/10 bg-gradient-to-r from-white/5 to-transparent">
                    <div>
                      <h3 className="text-lg font-semibold text-white">Student Submissions</h3>
                      <p className="text-sm text-slate-400 mt-1">Review and provide feedback on student recordings</p>
                    </div>
                  </div>
                  <div className="p-6">
                    {audioUploads.length > 0 ? (
                      <div className="grid grid-cols-1 gap-5">
                        {audioUploads.map((audio) => (
                          <AudioReviewCard key={audio._id} audio={audio} teacherInfo={teacherInfo} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                          <Music size={32} className="text-slate-600" />
                        </div>
                        <p className="text-slate-400">No submissions to review</p>
                        <p className="text-sm text-slate-500 mt-1">Student recordings will appear here</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* SETTINGS TAB */}
              {tab === 'edit' && (
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
                  <div className="px-6 py-5 border-b border-white/10 bg-gradient-to-r from-white/5 to-transparent">
                    <div>
                      <h3 className="text-lg font-semibold text-white">Profile Settings</h3>
                      <p className="text-sm text-slate-400 mt-1">Manage your teaching profile and information</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Full Name</label>
                        <div className="p-3 bg-black/20 rounded-xl border border-white/10 text-white font-medium">
                          {teacherInfo.name}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Instrument</label>
                        <div className="p-3 bg-black/20 rounded-xl border border-white/10 text-white font-medium">
                          {teacherInfo.instrument}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Contact</label>
                        <div className="p-3 bg-black/20 rounded-xl border border-white/10 text-white">
                          {teacherInfo.contact || "Not provided"}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Teacher ID</label>
                        <div className="p-3 bg-black/20 rounded-xl border border-white/10 text-white font-mono text-sm">
                          {teacherInfo.userId}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-8 space-y-2">
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Biography</label>
                      <div className="p-4 bg-black/20 rounded-xl border border-white/10 text-slate-300 leading-relaxed">
                        {teacherInfo.bio || "No bio provided"}
                      </div>
                    </div>

                    <button 
                      onClick={() => router.push('/dashboard/teacher/info-form')}
                      className="px-6 py-3 bg-gradient-to-r from-[#ff5a00] to-[#ff8c00] hover:from-[#ff6b1a] hover:to-[#ff9c1a] text-white font-semibold rounded-xl transition-all shadow-lg shadow-[#ff5a00]/20"
                    >
                      Edit Profile Details
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - BlogPanel (3 cols) */}
          <div className="col-span-12 lg:col-span-3">
            <div className="sticky top-24">
              <BlogPanel />
            </div>
          </div>

        </div>
      </main>

      {/* REJECT MODAL */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-[#141414] to-[#0a0a0a] border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Decline Request</h3>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedRequest(null);
                  setRejectReason("");
                }}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <p className="text-slate-400 mb-6">
              Are you sure you want to decline this request from <span className="text-white font-semibold">{selectedRequest?.studentName}</span>?
            </p>
            
            <div className="mb-6">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Reason (Optional)
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g., Fully booked, scheduling conflict, etc."
                className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-sm text-slate-300 focus:border-[#ff5a00] focus:ring-1 focus:ring-[#ff5a00] outline-none transition-all resize-none"
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedRequest(null);
                  setRejectReason("");
                }}
                className="flex-1 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all font-medium text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectRequest}
                disabled={processingId !== null}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all font-medium text-sm disabled:opacity-60 shadow-lg shadow-red-500/20"
              >
                {processingId ? "Sending..." : "Confirm Decline"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AudioReviewCard({ audio, teacherInfo }: { audio: any; teacherInfo: any }) {
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
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError("Failed to submit review.");
      }
    } catch {
      setError("Failed to submit review.");
    }
    setSubmitting(false);
  };

  return (
    <div className="bg-black/20 rounded-xl p-5 border border-white/10 hover:border-[#ff5a00]/30 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff5a00] to-[#ff8c00] flex items-center justify-center">
            <User size={18} className="text-white" />
          </div>
          <div>
            <p className="text-white font-semibold">{audio.userId}</p>
            <p className="text-xs text-slate-500">Lesson {audio.lessonId}</p>
          </div>
        </div>
      </div>
      
      <audio controls src={`/uploads/${audio.filename}`} className="w-full h-10 mb-4 rounded-lg" />
      
      <div className="flex gap-3 items-start">
        <textarea
          className="flex-1 bg-black/20 border border-white/10 rounded-xl p-3 text-sm text-slate-300 focus:border-[#ff5a00] focus:ring-1 focus:ring-[#ff5a00] outline-none transition-all resize-none"
          placeholder="Write your feedback here..."
          rows={2}
          value={feedback}
          onChange={e => setFeedback(e.target.value)}
          disabled={submitting}
        />
        <button
          className="px-4 py-3 bg-gradient-to-r from-[#ff5a00] to-[#ff8c00] text-white rounded-xl hover:from-[#ff6b1a] hover:to-[#ff9c1a] transition-all disabled:opacity-60 shadow-lg shadow-[#ff5a00]/20"
          onClick={handleSubmit}
          disabled={submitting || !feedback.trim()}
        >
          <MessageSquare size={18} />
        </button>
      </div>
      
      {success && (
        <div className="mt-3 p-2 bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-emerald-400 text-xs text-center">
          ✓ Review submitted successfully!
        </div>
      )}
      {error && (
        <div className="mt-3 p-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-xs text-center">
          {error}
        </div>
      )}
    </div>
  );
}