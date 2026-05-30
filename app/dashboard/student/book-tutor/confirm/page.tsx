"use client";

// app/dashboard/book-tutor/confirm/page.tsx
// eSewa redirects back here with ?data=<base64encodedJSON> on success.
// We decode it, verify with our server, and save the booking.

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import BookingSuccess from "../../components/book-tutor/BookingSuccess";

export default function ConfirmPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [error, setError] = useState("");
  const [result, setResult] = useState<{
    tutorName: string;
    transactionId: string;
    amountPaid: number;
  } | null>(null);

  useEffect(() => {
    verifyAndBook();
  }, []);

  const verifyAndBook = async () => {
    try { 
      // eSewa sends back base64-encoded data in the `data` query param
      const encodedResponse = searchParams.get("data");
      if (!encodedResponse) {
        throw new Error("No payment data received. Payment may have been cancelled.");
      }

      // Retrieve pending booking saved before redirecting to eSewa
      const raw = sessionStorage.getItem("pendingBooking");
      if (!raw) throw new Error("Booking session expired. Please try again.");

      const pending = JSON.parse(raw);
      const { tutorId, tutorName, message, bookingTime, contactNumber } = pending;

      const res = await fetch("/api/esewa-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          encodedResponse,
          tutorId,
          tutorName,
          message,
          bookingTime,
          contactNumber,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Verification failed");

      sessionStorage.removeItem("pendingBooking");

      setResult({
        tutorName,
        transactionId: data.transactionId,
        amountPaid: data.amountPaid,
      });
      setStatus("success");
    } catch (err: any) {
      setError(err.message);
      setStatus("error");
    }
  };

  if (status === "verifying") {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={40} className="animate-spin text-[#60BB46]" />
          <p className="text-slate-400 text-sm uppercase tracking-widest">
            Verifying your payment...
          </p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center p-8">
        <div className="max-w-md text-center space-y-4">
          <AlertCircle size={40} className="text-red-500 mx-auto" />
          <h2 className="text-xl font-bold text-white">Payment Verification Failed</h2>
          <p className="text-slate-400 text-sm">{error}</p>
          <button
            onClick={() => router.push("/dashboard/book-tutor")}
            className="text-xs uppercase tracking-widest text-slate-400 hover:text-white transition-colors border border-white/10 px-6 py-3 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-slate-300 font-sans p-8 md:p-16">
      <div className="max-w-3xl mx-auto">
        {result && (
          <BookingSuccess
            tutorName={result.tutorName}
            transactionId={result.transactionId}
            amountPaid={result.amountPaid}
          />
        )}
      </div>
    </div>
  );
}