import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  studentName: string;
  studentEmail: string;
  tutorId: string;
  tutorName?: string;
  lessonId?: string;
  time?: Date;
  contactNumber?: string;
  message?: string;
  status: "pending" | "accepted" | "rejected";
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    studentName: { type: String, required: true },
    studentEmail: { type: String, required: true },
    tutorId: { type: String, required: true },
    tutorName: { type: String },
    lessonId: { type: String },
    time: { type: Date },
    contactNumber: { type: String },
    message: { type: String },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    rejectionReason: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Booking ||
  mongoose.model<IBooking>("Booking", BookingSchema);
