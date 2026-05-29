"use client";

// components/book-tutor/BookingForm.tsx
import React, { useState } from "react";
import { Loader2 } from "lucide-react";

export interface BookingData {
  time: string;
  contactNumber: string;
  message: string;
}

interface BookingFormProps {
  sessionFee?: number;
  studentEmail: string;
  onSubmit: (data: BookingData) => Promise<void>;
  isLoading: boolean;
}

export default function BookingForm({
  sessionFee,
  studentEmail,
  onSubmit,
  isLoading,
}: BookingFormProps) {
  const [data, setData] = useState<BookingData>({
    time: "",
    contactNumber: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(data);
  };

  return (
    <div className="space-y-10">
      {/* Who this booking goes to */}
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
        <p className="text-xs text-blue-300 uppercase tracking-wide font-semibold mb-1">
          Booking sent from
        </p>
        <p className="text-white font-mono text-sm">{studentEmail || "Loading..."}</p>
        <p className="text-xs text-blue-400 mt-1">
          The instructor will contact you at this email.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
              Date &amp; Time
            </label>
            <input
              type="datetime-local"
              className="w-full bg-transparent border-b border-white/20 py-2 text-white outline-none focus:border-[#ff5a00] transition-colors"
              value={data.time}
              onChange={(e) => setData({ ...data, time: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
              Phone Number
            </label>
            <input
              type="tel"
              className="w-full bg-transparent border-b border-white/20 py-2 text-white outline-none focus:border-[#ff5a00] transition-colors placeholder:text-slate-700"
              placeholder="+977 98XXXXXXXX"
              value={data.contactNumber}
              onChange={(e) => setData({ ...data, contactNumber: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            Your Goals
          </label>
          <textarea
            className="w-full bg-transparent border-b border-white/20 py-2 text-white outline-none focus:border-[#ff5a00] transition-colors resize-none placeholder:text-slate-700"
            placeholder="What would you like to focus on in this session?"
            value={data.message}
            onChange={(e) => setData({ ...data, message: e.target.value })}
            required
            rows={2}
          />
        </div>

        {/* Payment summary */}
        {sessionFee && (
          <div className="border border-white/10 rounded-lg p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">
                Session Fee
              </p>
              <p className="text-2xl font-bold text-white mt-1">Rs. {sessionFee}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-600">Powered by</p>
              <p className="text-[#5C2D8F] font-bold tracking-wide">Khalti</p>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="group flex items-center gap-4 bg-[#5C2D8F] hover:bg-[#4a2370] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold uppercase tracking-widest text-xs py-4 px-8 rounded-lg transition-all"
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Processing...
            </>
          ) : (
            <>
              Pay Rs. {sessionFee || "—"} &amp; Book Session
              <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
