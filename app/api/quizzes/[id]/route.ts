import { NextRequest, NextResponse } from "next/server";
import Quiz from "@/app/models/Quiz";
import clientPromise from "@/app/lib/mongodb-client";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await clientPromise;
    
    const { id } = await params;
    const quiz = await Quiz.findOne({ quizId: id });

    if (!quiz) {
      return NextResponse.json(
        { success: false, message: "Quiz not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      quiz,
    });
  } catch (error) {
    console.error("Error fetching quiz:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch quiz" },
      { status: 500 }
    );
  }
}
