import { NextResponse } from "next/server";
import connectMongoDB from "@/app/lib/mongodb";

export async function POST(req: Request) {
  try {
    const { bookingId, action, reason, studentEmail, studentName, teacherName, lessonTime } = await req.json();
    
    await connectMongoDB();
    const { default: Booking } = await import("@/app/models/Booking");
    
    // Update booking status
    const updateData: any = {
      status: action === "accept" ? "accepted" : "rejected",
      updatedAt: new Date(),
    };
    
    if (action === "reject" && reason) {
      updateData.rejectionReason = reason;
    }
    
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      updateData,
      { new: true }
    );
    
    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }
    
    // Send email notification to student
    try {
      await fetch(`${process.env.NEXTAUTH_URL}/api/send-booking-status-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentEmail,
          studentName,
          teacherName,
          action,
          reason: action === "reject" ? reason : null,
          lessonTime,
          bookingId,
        }),
      });
    } catch (emailError) {
      console.error("Failed to send email notification:", emailError);
    }
    
    return NextResponse.json({ 
      success: true, 
      booking,
      message: action === "accept" 
        ? "Lesson request accepted! Student has been notified." 
        : "Lesson request rejected. Student has been notified."
    });
  } catch (err) {
    console.error("Booking response error:", err);
    return NextResponse.json(
      { error: "Failed to process booking response", details: (err as Error).message },
      { status: 500 }
    );
  }
}