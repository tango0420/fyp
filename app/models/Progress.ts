import mongoose, { Schema, models } from "mongoose";

const ProgressSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  lessonId: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Date,
  },
});

const Progress = models.Progress || mongoose.model("Progress", ProgressSchema);

export default Progress;
