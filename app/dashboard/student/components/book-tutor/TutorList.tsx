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
  // Group tutors by instrument/category
  const groups: Record<string, Tutor[]> = tutors.reduce((acc, t) => {
    const key = (t.instrument && t.instrument.trim()) || "Other";
    acc[key] = acc[key] || [];
    acc[key].push(t);
    return acc;
  }, {} as Record<string, Tutor[]>);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Find Your Instructor</h1>
        <p className="text-slate-500 text-sm tracking-widest uppercase">
          {tutors.length} instructor{tutors.length !== 1 ? "s" : ""} available
        </p>
      </div>

      <div className="space-y-8">
        {Object.entries(groups).map(([category, list]) => (
          <section key={category} className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 bg-[#0b0b0b]/60">
              <h2 className="text-lg font-semibold text-white">{category}</h2>
              <p className="text-slate-500 text-xs mt-1">{list.length} instructor{list.length !== 1 ? "s" : ""}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5">
              {list.map((tutor) => (
                <button
                  key={tutor.userId}
                  onClick={() => onSelect(tutor)}
                  className="group flex items-center justify-between p-6 bg-[#0d0d0d] hover:bg-white/5 transition-all text-left"
                >
                  <div className="flex items-center gap-5">
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
          </section>
        ))}
      </div>
    </div>
  );
}
