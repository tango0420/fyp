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
    <div className="py-16 space-y-8">
      <div className="flex items-center gap-4">
        <CheckCircle size={40} className="text-green-400 shrink-0" />
        <div>
          <h2 className="text-3xl font-bold text-white">Booking Confirmed!</h2>
          <p className="text-slate-400 mt-1">
            Your session with <span className="text-white font-semibold">{tutorName}</span> has
            been booked.
          </p>
        </div>
      </div>

      <div className="border border-white/10 rounded-lg p-6 space-y-4">
        <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">
          Payment Receipt
        </p>
        {amountPaid && (
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Amount Paid</span>
            <span className="text-white font-bold">Rs. {amountPaid}</span>
          </div>
        )}
        {transactionId && (
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Transaction ID</span>
            <span className="text-white font-mono text-sm">{transactionId}</span>
          </div>
        )}
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Status</span>
          <span className="text-green-400 font-semibold">Paid</span>
        </div>
      </div>

      <p className="text-slate-500 text-sm">
        The instructor has been notified and will contact you to confirm the session details.
      </p>

      <button
        onClick={() => router.push("/dashboard/student")}
        className="text-xs uppercase tracking-widest text-slate-400 hover:text-white transition-colors border border-white/10 px-6 py-3 rounded-lg"
      >
        Back to Dashboard
      </button>
    </div>
  );
}
