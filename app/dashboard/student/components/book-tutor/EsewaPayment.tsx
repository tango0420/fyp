"use client";

// components/book-tutor/EsewaPayment.tsx
// eSewa works via a POST form submission (not a redirect like Khalti).
// This component fetches the form fields from our API, then auto-submits
// a hidden HTML form to eSewa's endpoint.

import { useEffect, useRef, useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";

interface EsewaPaymentProps {
  tutorId: string;
  tutorName: string;
  amount: number;
  contactNumber: string;
  bookingTime: string;
  message: string;
}

interface FormFields {
  amount: string;
  tax_amount: string;
  total_amount: string;
  transaction_uuid: string;
  product_code: string;
  product_service_charge: string;
  product_delivery_charge: string;
  success_url: string;
  failure_url: string;
  signed_field_names: string;
  signature: string;
}

export default function EsewaPayment({
  tutorId,
  tutorName,
  amount,
  contactNumber,
  bookingTime,
  message,
}: EsewaPaymentProps) {
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<{ fields: FormFields; url: string } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    initiate();
  }, []);

  // Auto-submit form once we have the fields
  useEffect(() => {
    if (status === "ready" && formRef.current) {
      // Small delay so user sees the "Redirecting" message
      setTimeout(() => {
        formRef.current?.submit();
      }, 800);
    }
  }, [status]);

  const initiate = async () => {
    setStatus("loading");
    try {
      const res = await fetch("/api/esewa-initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tutorId, tutorName, amount, contactNumber, bookingTime, message }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to initiate payment");

      // Save booking context so confirm page can complete the booking
      sessionStorage.setItem(
        "pendingBooking",
        JSON.stringify(data.bookingContext)
      );

      setFormData({ fields: data.formFields, url: data.esewaUrl });
      setStatus("ready");
    } catch (err: any) {
      setStatus("error");
      setError(err.message);
    }
  };

  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <AlertCircle size={32} className="text-red-500" />
        <p className="text-red-400 text-sm text-center max-w-sm">{error}</p>
        <button
          onClick={initiate}
          className="text-xs uppercase tracking-widest text-slate-400 hover:text-white transition-colors border border-white/10 px-4 py-2 rounded"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-24 gap-6">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-2 border-[#60BB46]/30 flex items-center justify-center">
          <span className="text-2xl font-black text-[#60BB46]">e</span>
        </div>
        <div className="absolute inset-0 rounded-full border-2 border-[#60BB46] border-t-transparent animate-spin" />
      </div>
      <div className="text-center">
        <p className="text-white font-semibold">Redirecting to eSewa</p>
        <p className="text-slate-500 text-xs uppercase tracking-widest mt-1">
          Please wait...
        </p>
      </div>

      {/* Hidden form that auto-submits to eSewa */}
      {formData && (
        <form
          ref={formRef}
          method="POST"
          action={formData.url}
          className="hidden"
        >
          {Object.entries(formData.fields).map(([key, value]) => (
            <input key={key} type="hidden" name={key} value={value} />
          ))}
        </form>
      )}
    </div>
  );
}