import { NextResponse } from "next/server";
import connectMongoDB from "@/app/lib/mongodb";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    // Coerce sessionFee to number (if provided as string from form)
    if (data.sessionFee !== undefined) {
      const num = Number(data.sessionFee);
      data.sessionFee = Number.isFinite(num) ? num : 0;
    }
    await connectMongoDB();
    const mongoose = (await import('mongoose')).default;
    const TeacherSchema = new mongoose.Schema({
      userId: String,
      name: String,
      email: String,
      bio: String,
      instrument: String,
      contact: String,
      social: {
        instagram: String,
        youtube: String,
        tiktok: String,
        facebook: String,
      },
      preferredContact: String,
    }, { collection: 'teachers' });
    const Teacher = mongoose.models.Teacher || mongoose.model('Teacher', TeacherSchema);
    await Teacher.findOneAndUpdate(
      { userId: data.userId },
      data,
      { upsert: true, new: true }
    );
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to save teacher info' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  await connectMongoDB();
  const mongoose = (await import('mongoose')).default;
  const TeacherSchema = new mongoose.Schema({
    userId: String,
    name: String,
    email: String,
    bio: String,
    instrument: String,
    sessionFee: Number,
    sessionFee: Number,
    contact: String,
    social: {
      instagram: String,
      youtube: String,
      tiktok: String,
      facebook: String,
    },
    preferredContact: String,
  }, { collection: 'teachers' });
  const Teacher = mongoose.models.Teacher || mongoose.model('Teacher', TeacherSchema);
  const info = await Teacher.findOne({ userId });
  if (info) {
    const obj = info.toObject ? info.toObject() : info;
    obj.sessionFee = Number(obj.sessionFee) || 0;
    return NextResponse.json({ exists: true, info: obj });
  } else {
    return NextResponse.json({ exists: false });
  }
}
