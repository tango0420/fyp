"use client";

// app/dashboard/book-tutor/page.tsx
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { ChevronLeft } from "lucide-react";

import TutorList from "../components/book-tutor/TutorList";
import TutorProfile from "../components/book-tutor/TutorProfile";
import BookingForm, { BookingData } from "../components/book-tutor/BookingForm";
import EsewaPayment from "../components/book-tutor/EsewaPayment";

type Step = "list" | "form" | "paying";

export default function BookTutorPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [tutors, setTutors] = useState<any[]>([]);
  const [loadingTutors, setLoadingTutors] = useState(true);

  const [selectedTutor, setSelectedTutor] = useState<any>(null);
  const [tutorInfo, setTutorInfo] = useState<any>(null);
  const [loadingTutorInfo, setLoadingTutorInfo] = useState(false);

  const [step, setStep] = useState<Step>("list");
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/all-teachers")
      .then((res) => res.json())
      .then((data) => {
        const list = data.teachers || [];
        setTutors(list);
        setLoadingTutors(false);
        const tutorId = searchParams.get("tutorId");
        if (tutorId) {
          const found = list.find((t: any) => t.userId === tutorId);
          if (found) handleSelectTutor(found);
        }
      })
      .catch(() => setLoadingTutors(false));
  }, [searchParams]);

  const handleSelectTutor = (tutor: any) => {
    setSelectedTutor(tutor);
    setStep("form");
    setLoadingTutorInfo(true);
    fetch(`/api/teacher-info?userId=${encodeURIComponent(tutor.userId)}`)
      .then((res) => res.json())
      .then((data) => {
        setTutorInfo(data.info || tutor);
        setLoadingTutorInfo(false);
      });
  };

  const handleFormSubmit = async (data: BookingData) => {
    setIsSubmitting(true);
    setBookingData(data);
    setStep("paying");
    setIsSubmitting(false);
  };

  const handleBackToList = () => {
    setSelectedTutor(null);
    setTutorInfo(null);
    setBookingData(null);
    setStep("list");
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-slate-300 font-sans p-8 md:p-16 selection:bg-[#ff5a00]/30">
      <div className="max-w-3xl mx-auto">

        {step === "list" && (
          <button
            className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-12 text-xs font-bold uppercase tracking-widest"
            onClick={() => router.push("/dashboard/student")}
          >
            <ChevronLeft size={14} /> Dashboard
          </button>
        )}

        {step === "list" && (
          <>
            {loadingTutors ? (
              <p className="text-slate-500 animate-pulse uppercase text-xs tracking-widest">
                Loading instructors...
              </p>
            ) : (
              <TutorList tutors={tutors} onSelect={handleSelectTutor} />
            )}
          </>
        )}

        {step === "form" && (
          <div className="animate-in fade-in duration-500 space-y-10">
            {loadingTutorInfo ? (
              <p className="text-slate-500 animate-pulse uppercase text-xs tracking-widest">
                Retrieving instructor details...
              </p>
            ) : tutorInfo ? (
              <>
                <TutorProfile tutor={tutorInfo} onBack={handleBackToList} />
                <BookingForm
                  sessionFee={tutorInfo.sessionFee}
                  studentEmail={session?.user?.email || ""}
                  onSubmit={handleFormSubmit}
                  isLoading={isSubmitting}
                />
              </>
            ) : null}
          </div>
        )}

        {step === "paying" && bookingData && tutorInfo && (
          <EsewaPayment
            tutorId={tutorInfo.userId}
            tutorName={tutorInfo.name}
            amount={tutorInfo.sessionFee || 0}
            contactNumber={bookingData.contactNumber}
            bookingTime={bookingData.time}
            message={bookingData.message}
          />
        )}

      </div>
    </div>
  );
}