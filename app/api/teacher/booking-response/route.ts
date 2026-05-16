import { NextRequest, NextResponse } from "next/server";
import  connectMongoDB from "@/app/lib/mongodb";
import { 
  sendLessonAcceptanceEmail, 
  sendLessonRejectionEmail 
} from "@/app/lib/mailer";

interface BookingRequest {
  _id?: string;
  studentEmail?: string;
  studentName?: string;
  tutorId?: string;
  time?: string;
  status?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingId, action, reason, studentEmail, studentName, teacherName, lessonTime } = body;

    // Log for debugging
    console.log("Booking response payload:", body);

    // Validate required fields with helpful error messages
    const missingFields = [];
    if (!bookingId) missingFields.push("bookingId");
    if (!action) missingFields.push("action");
    if (!studentEmail) missingFields.push("studentEmail");
    if (!studentName) missingFields.push("studentName");
    if (!teacherName) missingFields.push("teacherName");

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    // Validate action
    if (!["accept", "reject"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action. Use 'accept' or 'reject'" },
        { status: 400 }
      );
    }

    await connectMongoDB();
    
    // Import models inside the function to ensure connection
    const { default: BookingModel } = await import("@/app/models/Booking");
    
    // Update booking status in database
    const updateData: Record<string, any> = { 
      status: action === "accept" ? "accepted" : "rejected",
      updatedAt: new Date()
    };
    
    if (action === "reject" && reason) {
      updateData.rejectionReason = reason;
    }

    const updatedBooking = await BookingModel.findByIdAndUpdate(bookingId, updateData, { new: true });
    
    if (!updatedBooking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    // Send appropriate email
    let emailResult;
    if (action === "accept") {
      emailResult = await sendLessonAcceptanceEmail(
        studentEmail,
        studentName,
        teacherName,
        lessonTime
      );
    } else {
      emailResult = await sendLessonRejectionEmail(
        studentEmail,
        studentName,
        teacherName,
        reason || "The tutor is currently unavailable"
      );
    }

    if (!emailResult.success) {
      console.warn("Email send warning:", emailResult.error);
      // Don't fail the request if email fails, but log it
    }

    return NextResponse.json({
      success: true,
      message: `Lesson request ${action}ed successfully. Email sent to ${studentEmail}.`,
      emailSent: emailResult.success,
    });
  } catch (error) {
    console.error("Error processing booking response:", error);
    return NextResponse.json(
      { error: "Failed to process booking response", details: (error as Error).message },
      { status: 500 }
    );
  }
}
