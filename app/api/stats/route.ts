import { NextResponse } from "next/server";
import Progress from "@/app/models/Progress";
import connect from "@/app/lib/mongodb";

export async function GET(req: { url: string | URL }) {
  await connect();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  try {
    // Fetch all progress records for this user
    const progressRecords = await Progress.find({ userId });

    // Calculate stats
    const completedLessons = progressRecords.filter((p) => p.completed);
    const totalLessons = progressRecords.length;

    // Extract unique instruments from lesson IDs
    const instrumentsSet = new Set<string>();
    progressRecords.forEach((record) => {
      const lessonId = record.lessonId;
      if (typeof lessonId === "string") {
        const match = lessonId.match(/^([a-z]+)-\d+$/);
        if (match) {
          instrumentsSet.add(match[1]);
        } else if (/^\d+$/.test(lessonId)) {
          instrumentsSet.add("guitar");
        }
      }
    });

    // Calculate total practice time (estimate based on completed lessons - assume 15 min per lesson)
    const estimatedPracticeMinutes = completedLessons.length * 15;
    const practiceHours = (estimatedPracticeMinutes / 60).toFixed(1);

    // Determine current level based on progress percentage
    const progressPercentage =
      totalLessons > 0 ? Math.round((completedLessons.length / totalLessons) * 100) : 0;
    let currentLevel = "Beginner";
    if (progressPercentage >= 50 && progressPercentage < 80) {
      currentLevel = "Intermediate";
    } else if (progressPercentage >= 80) {
      currentLevel = "Advanced";
    }

    // Return stats
    return NextResponse.json({
      totalPractice: `${practiceHours}h`,
      instruments: instrumentsSet.size,
      currentLevel: currentLevel.substring(0, 3).concat("."),
      lessonsDone: completedLessons.length,
      totalLessons: totalLessons,
      progressPercentage: progressPercentage,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
