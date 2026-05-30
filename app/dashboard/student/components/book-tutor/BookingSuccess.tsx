"use client";

// components/book-tutor/BookingSuccess.tsx
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface BookingSuccessProps {
  tutorName: string;
  transactionId?: string;
  amountPaid?: number;
}

export default function BookingSuccess({
  tutorName,
  transactionId,
  amountPaid,
}: BookingSuccessProps) {
  const router = useRouter();

  return (
    <div className="py-16 space-y-8 max-w-xl mx-auto text-center">
      <div>
        <CheckCircle size={48} className="text-green-400 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-white">Booking Confirmed</h2>
        <p className="text-slate-400 mt-2">Your lesson with {tutorName} has been scheduled.</p>
      </div>

      <div className="bg-[#111111] border border-white/10 rounded-xl p-6 space-y-4 text-left">
        {amountPaid !== undefined && (
          <div className="flex justify-between">
            <span className="text-slate-400">Amount Paid</span>
            <span className="text-white font-semibold">Rs. {amountPaid}</span>
          </div>
        )}
        {transactionId && (
          <div className="flex justify-between">
            <span className="text-slate-400">Transaction ID</span>
            <span className="text-white font-mono text-sm">{transactionId}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-slate-400">Status</span>
          <span className="text-green-400 font-semibold">Paid</span>
        </div>
      </div>

      <p className="text-slate-500 text-sm">
        Both you and your tutor have been emailed with each other’s contact details.
      </p>

      <button
        onClick={() => router.push("/dashboard/student")}
        className="w-full rounded-xl bg-white text-black py-3 font-semibold hover:bg-slate-100 transition-colors"
      >
        Back to Dashboard
      </button>
    </div>
  );
}
