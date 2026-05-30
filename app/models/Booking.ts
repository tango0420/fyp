// app/models/Booking.ts
import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  studentEmail: { type: String, required: true },
  tutorId: { type: String, required: true },
  tutorName: { type: String, required: true },
  tutorEmail: { type: String },
  time: { type: Date, required: true },
  contactNumber: { type: String, required: true },
  message: { type: String },
  lessonId: { type: String },
  status: { 
    type: String, 
    enum: ["pending", "accepted", "rejected", "completed"],
    default: "pending" 
  },
  sessionFee: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Booking || mongoose.model("Booking", BookingSchema);