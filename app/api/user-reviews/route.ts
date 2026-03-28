import { NextResponse } from "next/server";
import connectMongoDB from "@/app/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  await connectMongoDB();
  const mongoose = (await import('mongoose')).default;
  const ReviewSchema = new mongoose.Schema({
    audioId: String,
    teacherId: String,
    teacherName: String,
    feedback: String,
    createdAt: Date,
  }, { collection: 'audioReviews' });
  const AudioSchema = new mongoose.Schema({
    userId: String,
    lessonId: String,
    filename: String,
    uploadedAt: Date,
  }, { collection: 'audioUploads' });
  const Review = mongoose.models.AudioReview || mongoose.model('AudioReview', ReviewSchema);
  const AudioUpload = mongoose.models.AudioUpload || mongoose.model('AudioUpload', AudioSchema);
  // Find all audio uploads for this user
  const uploads = await AudioUpload.find({ userId });
  const audioIds = uploads.map(u => u._id.toString());
  // Find all reviews for these audio uploads
  const reviews = await Review.find({ audioId: { $in: audioIds } }).sort({ createdAt: -1 });
  return NextResponse.json({ reviews });
}
