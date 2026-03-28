import { NextResponse } from "next/server";
import connectMongoDB from "@/app/lib/mongodb";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    await connectMongoDB();
    const mongoose = (await import('mongoose')).default;
    const ReviewSchema = new mongoose.Schema({
      audioId: String,
      teacherId: String,
      teacherName: String,
      feedback: String,
      createdAt: { type: Date, default: Date.now },
    }, { collection: 'audioReviews' });
    const Review = mongoose.models.AudioReview || mongoose.model('AudioReview', ReviewSchema);
    await Review.create({
      audioId: data.audioId,
      teacherId: data.teacherId,
      teacherName: data.teacherName,
      feedback: data.feedback,
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to save review' }, { status: 500 });
  }
}
