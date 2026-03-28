import { NextResponse } from "next/server";
import Progress from "@/app/models/Progress";
import connect from "@/app/lib/mongodb";

// GET /api/progress?userId=xxx
export async function GET(req: { url: string | URL; }) {
  await connect();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  const progress = await Progress.find({ userId });
  return NextResponse.json(progress);
}

// POST /api/progress
export async function POST(req: { json: () => PromiseLike<{ userId: unknown; lessonId: unknown; }> | { userId: unknown; lessonId: unknown; }; }) {
  await connect();
  const { userId, lessonId } = await req.json();
  if (!userId || !lessonId) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  const updated = await Progress.findOneAndUpdate(
    { userId, lessonId },
    { completed: true, completedAt: new Date() },
    { upsert: true, new: true }
  );
  return NextResponse.json(updated);
}
