import { NextResponse } from "next/server";
import connectMongoDB from "@/app/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET() {
  await connectMongoDB();
  const mongoose = (await import('mongoose')).default;
  const TeacherSchema = new mongoose.Schema({
    userId: String,
    name: String,
    email: String,
    bio: String,
    instrument: String,
    sessionFee: Number,
    contact: String,
  }, { collection: 'teachers' });
  const Teacher = mongoose.models.Teacher || mongoose.model('Teacher', TeacherSchema);
  const teachers = await Teacher.find({});
  // Ensure sessionFee is numeric when returning
  const normalized = teachers.map((t: any) => {
    const obj = t.toObject ? t.toObject() : t;
    obj.sessionFee = Number(obj.sessionFee) || 0;
    return obj;
  });
  return NextResponse.json({ teachers: normalized });
}
