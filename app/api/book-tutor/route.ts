import { NextResponse } from "next/server";
import connectMongoDB from "@/app/lib/mongodb";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    await connectMongoDB();
    const mongoose = (await import('mongoose')).default;
    const BookingSchema = new mongoose.Schema({
      studentId: String,
      studentName: String,
      tutorId: String,
      tutorName: String,
      message: String,
      time: String,
      contactNumber: String,
      status: { type: String, default: 'pending' },
      createdAt: { type: Date, default: Date.now },
    }, { collection: 'bookings' });
    const Booking = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
    const booking = await Booking.create(data);
    return NextResponse.json({ success: true, booking });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const tutorId = searchParams.get('tutorId');
  await connectMongoDB();
  const mongoose = (await import('mongoose')).default;
  const BookingSchema = new mongoose.Schema({
    studentId: String,
    studentName: String,
    tutorId: String,
    tutorName: String,
    message: String,
    status: { type: String, default: 'pending' },
    createdAt: { type: Date, default: Date.now },
  }, { collection: 'bookings' });
  const Booking = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
  let query = {};
  if (tutorId) query = { tutorId };
  const bookings = await Booking.find(query).sort({ createdAt: -1 });
  return NextResponse.json({ bookings });
}
