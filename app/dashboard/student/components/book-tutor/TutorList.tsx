"use client";

// components/book-tutor/TutorList.tsx
import React from "react";
import { ArrowRight } from "lucide-react";

interface Tutor {
  userId: string;
  name: string;
  instrument: string;
  bio?: string;
  sessionFee?: number; // in NPR
  profileImage?: string;
}

interface TutorListProps {
  tutors: Tutor[];
  onSelect: (tutor: Tutor) => void;
}

export default function TutorList({ tutors, onSelect }: TutorListProps) {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Find Your Instructor</h1>
        <p className="text-slate-500 text-sm tracking-widest uppercase">
          {tutors.length} instructor{tutors.length !== 1 ? "s" : ""} available
        </p>
      </div>

      <div className="grid grid-cols-1 gap-px bg-white/5 border border-white/10 rounded-lg overflow-hidden">
        {tutors.map((tutor) => (
          <button
            key={tutor.userId}
            onClick={() => onSelect(tutor)}
            className="group flex items-center justify-between p-6 bg-[#0d0d0d] hover:bg-white/5 transition-all text-left"
          >
            <div className="flex items-center gap-5">
              {/* Avatar placeholder */}
              <div className="w-12 h-12 rounded-full bg-[#ff5a00]/10 border border-[#ff5a00]/20 flex items-center justify-center text-[#ff5a00] font-bold text-lg shrink-0">
                {tutor.name.charAt(0)}
              </div>
              <div>
                <p className="text-white font-semibold text-base">{tutor.name}</p>
                <p className="text-[#ff5a00] text-xs uppercase tracking-widest font-medium mt-0.5">
                  {tutor.instrument}
                </p>
                {tutor.bio && (
                  <p className="text-slate-500 text-sm mt-1 line-clamp-1 max-w-md">{tutor.bio}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-6 shrink-0 ml-4">
              {tutor.sessionFee && (
                <div className="text-right">
                  <p className="text-white font-bold">Rs. {tutor.sessionFee}</p>
                  <p className="text-slate-600 text-xs">per session</p>
                </div>
              )}
              <ArrowRight
                size={16}
                className="text-slate-600 group-hover:text-[#ff5a00] group-hover:translate-x-1 transition-all"
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
