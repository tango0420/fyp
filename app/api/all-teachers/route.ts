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
    contact: String,
  }, { collection: 'teachers' });
  const Teacher = mongoose.models.Teacher || mongoose.model('Teacher', TeacherSchema);
  const teachers = await Teacher.find({});
  return NextResponse.json({ teachers });
}
