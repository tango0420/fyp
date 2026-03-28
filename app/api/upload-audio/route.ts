import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import connectMongoDB from "@/app/lib/mongodb";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const audio = formData.get("audio");
    const userId = formData.get("userId");
    const lessonId = formData.get("lessonId");

    if (!audio || typeof userId !== "string" || typeof lessonId !== "string") {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Save audio file to /public/uploads
    const buffer = Buffer.from(await (audio as Blob).arrayBuffer());
    const filename = `${uuidv4()}.wav`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await writeFile(path.join(uploadDir, filename), buffer);


    // Save reference to DB (using mongoose)
    await connectMongoDB();
    const mongoose = (await import('mongoose')).default;
    const AudioUploadSchema = new mongoose.Schema({
      userId: String,
      lessonId: String,
      filename: String,
      uploadedAt: Date,
    }, { collection: 'audioUploads' });
    const AudioUpload = mongoose.models.AudioUpload || mongoose.model('AudioUpload', AudioUploadSchema);
    await AudioUpload.create({
      userId,
      lessonId,
      filename,
      uploadedAt: new Date(),
    });

    return NextResponse.json({ success: true, filename });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
