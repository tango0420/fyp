// app/api/esewa-verify/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { verifyEsewaResponse } from "../../lib/esewa";

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { encodedResponse, tutorId, tutorName, message, bookingTime, contactNumber } =
    await req.json();

  if (!encodedResponse) {
    return NextResponse.json({ error: "Missing payment response" }, { status: 400 });
  }

  // Verify signature and status with eSewa
  const { valid, data } = verifyEsewaResponse(encodedResponse);

  if (!valid || !data) {
    return NextResponse.json({ error: "Payment verification failed or incomplete" }, { status: 400 });
  }

  // Save the booking
  const bookingPayload = {
    studentEmail: session.user.email,
    studentName: session.user.name || "",
    tutorId,
    tutorName,
    message,
    time: bookingTime,
    contactNumber,
    paymentId: data.transaction_uuid,
    paymentRefId: data.ref_id || "",
    amountPaid: Number(data.total_amount),
    paymentStatus: "paid",
    paymentMethod: "esewa",
  };

  const bookingRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/book-tutor`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bookingPayload),
  });

  if (!bookingRes.ok) {
    const err = await bookingRes.json();
    return NextResponse.json(
      { error: err.error || "Booking save failed after payment" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    transactionId: data.transaction_uuid,
    refId: data.ref_id || "",
    amountPaid: Number(data.total_amount),
  });
}