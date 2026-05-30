import { NextResponse } from "next/server";
import connectMongoDB from "@/app/lib/mongodb";
import { sendBookingNotificationEmailToStudent, sendBookingNotificationEmailToTutor } from "@/app/lib/mailer";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    // console.log("Booking data received:", data);
    
    await connectMongoDB();
    
    const { default: Booking } = await import("@/app/models/Booking");
    const mongoose = (await import('mongoose')).default;
    const TeacherSchema = new mongoose.Schema({
      userId: String,
      name: String,
      email: String,
      bio: String,
      instrument: String,
      contact: String,
    }, { collection: 'teachers' });
    const Teacher = mongoose.models.Teacher || mongoose.model('Teacher', TeacherSchema);

    // Ensure required fields for email functionality
    const bookingData = {
      studentName: data.studentName || "Student",
      studentEmail: data.studentEmail || data.email || data.contactEmail,
      tutorId: data.tutorId,
      tutorName: data.tutorName,
      tutorEmail: data.tutorEmail || "",
      time: data.time,
      contactNumber: data.contactNumber,
      message: data.message,
      lessonId: data.lessonId,
      sessionFee: Number(data.amountPaid || data.sessionFee || 0),
      status: "pending",
    };
    
    // Validate essential fields
    if (!bookingData.studentEmail) {
      return NextResponse.json(
        { error: "Student email is required" },
        { status: 400 }
      );
    }
    
    if (!bookingData.tutorId) {
      return NextResponse.json(
        { error: "Tutor ID is required" },
        { status: 400 }
      );
    }

    const tutorProfile = await Teacher.findOne({ userId: bookingData.tutorId });
    if (tutorProfile) {
      bookingData.tutorEmail = tutorProfile.email || bookingData.tutorEmail;
      bookingData.tutorName = bookingData.tutorName || tutorProfile.name || bookingData.tutorName;
      bookingData.contactNumber = bookingData.contactNumber || tutorProfile.contact || bookingData.contactNumber;
    }

    console.log("Creating booking with data:", bookingData);
    
    const booking = await Booking.create(bookingData);
    console.log("Booking created:", booking);

    if (bookingData.tutorEmail && bookingData.studentEmail) {
      try {
        await Promise.all([
          sendBookingNotificationEmailToStudent(
            bookingData.studentEmail,
            bookingData.studentName,
            bookingData.tutorName,
            bookingData.tutorEmail,
            tutorProfile?.contact || "Not provided",
            bookingData.time,
            bookingData.sessionFee
          ),
          sendBookingNotificationEmailToTutor(
            bookingData.tutorEmail,
            bookingData.tutorName,
            bookingData.studentName,
            bookingData.studentEmail,
            bookingData.time,
            bookingData.contactNumber,
            bookingData.sessionFee,
            bookingData.message
          ),
        ]);
      } catch (emailError) {
        console.error("Failed to send booking emails:", emailError);
      }
    }
    
    return NextResponse.json({ success: true, booking });
  } catch (err) {
    console.error("Booking creation error:", err);
    return NextResponse.json(
      { error: "Failed to create booking", details: (err as Error).message },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const tutorId = searchParams.get("tutorId");
    
    console.log("Fetching bookings for tutor:", tutorId);
    
    await connectMongoDB();
    const { default: Booking } = await import("@/app/models/Booking");
    
    let query: Record<string, any> = {};
    if (tutorId) {
      query.tutorId = tutorId;
    }
    
    // Only fetch pending bookings
    query.status = "pending";
    
    console.log("Query:", query);
    
    const bookings = await Booking.find(query).sort({ createdAt: -1 });
    
    console.log("Found bookings:", bookings.length);
    console.log("Bookings data:", bookings);
    
    return NextResponse.json({ bookings, success: true });
  } catch (err) {
    console.error("Booking fetch error:", err);
    return NextResponse.json(
      { error: "Failed to fetch bookings", details: (err as Error).message },
      { status: 500 }
    );
  }
}
