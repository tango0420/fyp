// app/api/esewa-initiate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { generateEsewaSignature } from "../../lib/esewa";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { tutorId, tutorName, amount, contactNumber, bookingTime, message } = await req.json();

  if (!tutorId || !amount || !contactNumber) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const productCode = process.env.ESEWA_PRODUCT_CODE || "EPAYTEST";
  const transactionUuid = uuidv4();
  const totalAmount = Math.round(Number(amount));

  const signature = generateEsewaSignature({
    totalAmount,
    transactionUuid,
    productCode,
  });

  const successUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/student/book-tutor/confirm`;
  const failureUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/student/book-tutor?error=payment_failed`;

  // Return all form fields needed for eSewa's POST form
  return NextResponse.json({
    formFields: {
      amount: totalAmount.toString(),
      tax_amount: "0",
      total_amount: totalAmount.toString(),
      transaction_uuid: transactionUuid,
      product_code: productCode,
      product_service_charge: "0",
      product_delivery_charge: "0",
      success_url: successUrl,
      failure_url: failureUrl,
      signed_field_names: "total_amount,transaction_uuid,product_code",
      signature,
    },
    esewaUrl: process.env.ESEWA_URL || "https://rc-epay.esewa.com.np/api/epay/main/v2/form",
    // Save booking context so confirm page can complete the booking
    bookingContext: {
      tutorId,
      tutorName,
      message,
      bookingTime,
      contactNumber,
      transactionUuid,
    },
  });
}