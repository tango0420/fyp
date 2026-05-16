"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { ChevronLeft, ArrowRight, Calendar, Phone, MessageSquare } from "lucide-react";

export default function BookTutorPage() {
    const { data: session } = useSession();
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedTutor, setSelectedTutor] = useState<any>(null);
  const [tutorInfo, setTutorInfo] = useState<any>(null);
  const [loadingTutorInfo, setLoadingTutorInfo] = useState(false);
  const [booking, setBooking] = useState({
    message: "",
    time: "",
    contactNumber: "",
    social: { instagram: "", youtube: "", tiktok: "", facebook: "" }
  });
  const [submitted, setSubmitted] = useState(false);

  // Debug: Log session whenever it changes
  useEffect(() => {
    console.log("🔐 Session updated:", session);
  }, [session]);

  useEffect(() => {
    fetch("/api/all-teachers")
      .then(res => res.json())
      .then(data => {
        setTeachers(data.teachers || []);
        setLoading(false);
        const tutorId = searchParams.get("tutorId");
        if (tutorId) {
          const found = data.teachers.find((t: any) => t.userId === tutorId);
          if (found) handleBook(found);
        }
      })
      .catch(() => setLoading(false));
  }, [searchParams]);

  const handleBook = (tutor: any) => {
    setSelectedTutor(tutor);
    setBooking({ message: "", time: "", contactNumber: "", social: { instagram: "", youtube: "", tiktok: "", facebook: "" } });
    setSubmitted(false);
    setLoadingTutorInfo(true);
    fetch(`/api/teacher-info?userId=${encodeURIComponent(tutor.userId)}`)
      .then(res => res.json())
      .then(infoData => {
        setTutorInfo(infoData.info || tutor);
        setLoadingTutorInfo(false);
      });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tutorInfo) return;
    const studentEmail = session?.user?.email || '';
    const studentName = session?.user?.name || '';
    
    console.log("Session data:", session);
    console.log("Student Email:", studentEmail);
    console.log("Student Name:", studentName);
    
    if (!studentEmail) {
      alert("Error: Could not get your email. Please log in again.");
      return;
    }
    
    const bookingPayload = {
      studentEmail,
      studentName,
      tutorId: tutorInfo.userId,
      tutorName: tutorInfo.name,
      message: booking.message,
      time: booking.time,
      contactNumber: booking.contactNumber,
      social: booking.social
    };
    
    console.log("Sending booking payload:", bookingPayload);
    
    const res = await fetch('/api/book-tutor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingPayload)
    });
    
    const data = await res.json();
    console.log("Booking response:", data);
    
    if (res.ok) {
      setSubmitted(true);
    } else {
      alert(`Error: ${data.error || "Failed to submit booking"}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-slate-300 font-sans p-8 md:p-16 selection:bg-[#ff5a00]/30">
      <div className="max-w-3xl mx-auto">
        <button
          className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-12 text-xs font-bold uppercase tracking-widest"
          onClick={() => router.push('/dashboard/student')}
        >
          <ChevronLeft size={14} /> Dashboard
        </button>

        {selectedTutor ? (
          <div className="animate-in fade-in duration-700">
            {loadingTutorInfo ? (
              <p className="text-slate-500 animate-pulse uppercase text-xs tracking-widest">Retrieving Instructor Details...</p>
            ) : tutorInfo ? (
              <div className="space-y-12">
                {/* Header Info - No Container */}
                <div className="pb-8 border-b border-white/10">
                  <h1 className="text-4xl font-bold text-white mb-2">{tutorInfo.name}</h1>
                  <p className="text-[#ff5a00] font-medium tracking-widest uppercase text-sm italic">{tutorInfo.instrument} Specialist</p>
                  <p className="mt-6 text-slate-400 leading-relaxed text-lg max-w-2xl">
                    {tutorInfo.bio || "Available for personalized coaching and technical mastery."}
                  </p>
                </div>

                {submitted ? (
                  <div className="py-12 border-t border-white/10">
                    <h3 className="text-2xl font-bold text-white mb-2">Request Successful.</h3>
                    <p className="text-slate-500">The instructor has been notified of your interest.</p>
                  </div>
                ) : (
                  <>
                    {/* Email Info Box */}
                    <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-8">
                      <p className="text-xs text-blue-300 uppercase tracking-wide font-semibold mb-1">Booking will be sent from:</p>
                      <p className="text-white font-mono">{session?.user?.email || "Loading..."}</p>
                      <p className="text-xs text-blue-400 mt-2">The teacher will use this email to contact you about your lesson.</p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Date & Time</label>
                        <input
                          type="datetime-local"
                          className="w-full bg-transparent border-b border-white/20 py-2 text-white outline-none focus:border-[#ff5a00] transition-colors"
                          value={booking.time}
                          onChange={e => setBooking({ ...booking, time: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Phone Number</label>
                        <input
                          type="tel"
                          className="w-full bg-transparent border-b border-white/20 py-2 text-white outline-none focus:border-[#ff5a00] transition-colors placeholder:text-slate-700"
                          placeholder="+1 000 000 0000"
                          value={booking.contactNumber}
                          onChange={e => setBooking({ ...booking, contactNumber: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Your Goals</label>
                      <textarea
                        className="w-full bg-transparent border-b border-white/20 py-2 text-white outline-none focus:border-[#ff5a00] transition-colors resize-none placeholder:text-slate-700"
                        placeholder="What would you like to focus on?"
                        value={booking.message}
                        onChange={e => setBooking({ ...booking, message: e.target.value })}
                        required
                        rows={1}
                      />
                    </div>

                    <button
                      type="submit"
                      className="group flex items-center gap-4 text-white font-bold uppercase tracking-widest text-xs py-4 hover:text-[#ff5a00] transition-all"
                    >
                      Finalize Booking <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                    </button>
                  </form>
                  </>
                )}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}