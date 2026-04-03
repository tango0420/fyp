import mongoose, { Schema, models } from "mongoose";

const QuizSchema = new Schema({
  quizId: {
    type: String,
    required: true,
    unique: true,
  },
  instrument: {
    type: String,
    required: true,
    enum: ["Guitar", "Piano", "Drums", "Violin", "Flute", "Saxophone", "Trumpet", "Bass"],
  },
  level: {
    type: String,
    required: true,
    enum: ["Beginner", "Intermediate", "Advanced"],
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  questions: [
    {
      questionId: String,
      question: String,
      type: {
        type: String,
        enum: ["multiple-choice", "true-false", "fill-blank"],
      },
      options: [String],
      correctAnswer: String,
      explanation: String,
      image: String,
    },
  ],
  passingScore: {
    type: Number,
    default: 70,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Quiz = models.Quiz || mongoose.model("Quiz", QuizSchema);

export default Quiz;
