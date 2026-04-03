import { NextRequest, NextResponse } from "next/server";
import Quiz from "@/app/models/Quiz";
import clientPromise from "@/app/lib/mongodb-client";

export async function GET(request: NextRequest) {
  try {
    await clientPromise;

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
