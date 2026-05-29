"use client";

// components/book-tutor/TutorProfile.tsx
import React from "react";
import { ChevronLeft } from "lucide-react";

interface TutorProfileProps {
  tutor: {
    name: string;
    instrument: string;
    bio?: string;
    sessionFee?: number;
  };
  onBack: () => void;
}

export default function TutorProfile({ tutor, onBack }: TutorProfileProps) {
  return (
    <div className="pb-8 border-b border-white/10 space-y-4">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest mb-4"
      >
        <ChevronLeft size={14} /> All Instructors
      </button>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white mb-1">{tutor.name}</h1>
          <p className="text-[#ff5a00] font-medium tracking-widest uppercase text-sm italic">
            {tutor.instrument} Specialist
          </p>
        </div>
        {tutor.sessionFee && (
          <div className="text-right shrink-0">
            <p className="text-3xl font-bold text-white">Rs. {tutor.sessionFee}</p>
            <p className="text-slate-500 text-xs uppercase tracking-widest">per session</p>
          </div>
        )}
      </div>

      <p className="text-slate-400 leading-relaxed text-base max-w-2xl">
        {tutor.bio || "Available for personalized coaching and technical mastery."}
      </p>
    </div>
  );
}
