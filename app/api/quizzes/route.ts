import { NextRequest, NextResponse } from "next/server";
import Quiz from "@/app/models/Quiz";
import connectMongoDB from "@/app/lib/mongodb";
import fs from "fs";
import path from "path";

async function seedQuizzesIfEmpty() {
  const existingCount = await Quiz.countDocuments();
  if (existingCount > 0) return;

  const quizFilePath = path.join(process.cwd(), "quiz-data.json");
  if (!fs.existsSync(quizFilePath)) return;

  const rawData = fs.readFileSync(quizFilePath, "utf-8");
  const quizzes = JSON.parse(rawData);
  if (!Array.isArray(quizzes) || quizzes.length === 0) return;

  await Quiz.insertMany(quizzes);
}

export async function GET(request: NextRequest) {
  try {
    await connectMongoDB();
    await seedQuizzesIfEmpty();

    const { searchParams } = new URL(request.url);
    const instrument = searchParams.get("instrument");
    const level = searchParams.get("level");

    const query: Record<string, string> = {};

    if (instrument) {
      query.instrument = instrument;
    }

    if (level) {
      query.level = level;
    }

    const quizzes = await Quiz.find(query).lean();
    
    // Map to include only question count, not all questions
    const quizzesWithCount = quizzes.map((quiz) => ({
      quizId: quiz.quizId,
      instrument: quiz.instrument,
      level: quiz.level,
      title: quiz.title,
      description: quiz.description,
      passingScore: quiz.passingScore,
      questionCount: quiz.questions?.length || 0,
    }));

    return NextResponse.json({
      success: true,
      quizzes: quizzesWithCount,
    });
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch quizzes" },
      { status: 500 }
    );
  }
}
