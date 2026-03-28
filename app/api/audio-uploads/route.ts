import { NextResponse } from "next/server";
import connectMongoDB from "@/app/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET() {
  await connectMongoDB();
  const mongoose = (await import('mongoose')).default;
  const AudioSchema = new mongoose.Schema({
    userId: String,
    lessonId: String,
    filename: String,
    uploadedAt: Date,
  }, { collection: 'audioUploads' });
  const AudioUpload = mongoose.models.AudioUpload || mongoose.model('AudioUpload', AudioSchema);
  const uploads = await AudioUpload.find({}).sort({ uploadedAt: -1 });
  return NextResponse.json({ uploads });
}
