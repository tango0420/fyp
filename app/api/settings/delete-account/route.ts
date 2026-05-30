import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectMongoDB from "@/app/lib/mongodb";

export async function POST(req: Request) {
  try {
    // Get the current session using NextAuth's default export
    const { authOptions } = await import("@/app/api/auth/[...nextauth]/route");
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { password } = await req.json();

    if (!password) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    await connectMongoDB();
    
    const mongoose = (await import('mongoose')).default;
    
    // Get User model
    const UserSchema = new mongoose.Schema({
      email: String,
      name: String,
      password: String,
      image: String,
      role: String,
    });
    
    const User = mongoose.models.User || mongoose.model('User', UserSchema);
    
    // Find the user
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Verify password
    const bcrypt = require('bcryptjs');
    const isValid = await bcrypt.compare(password, user.password);
    
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 401 }
      );
    }

    // Define schemas for other collections
    const TeacherSchema = new mongoose.Schema({
      userId: String,
      name: String,
      email: String,
      bio: String,
      instrument: String,
      contact: String,
      sessionFee: Number,
    }, { collection: 'teachers' });
    
    const BookingSchema = new mongoose.Schema({
      studentEmail: String,
      tutorId: String,
      tutorName: String,
      status: String,
    });
    
    const AudioUploadSchema = new mongoose.Schema({
      userId: String,
      lessonId: String,
      filename: String,
    });
    
    const ProgressSchema = new mongoose.Schema({
      userId: String,
      lessonId: String,
      completed: Boolean,
    });

    // Get models if they exist, or create temporary ones
    const Teacher = mongoose.models.Teacher || mongoose.model('Teacher', TeacherSchema);
    const Booking = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
    const AudioUpload = mongoose.models.AudioUpload || mongoose.model('AudioUpload', AudioUploadSchema);
    const Progress = mongoose.models.Progress || mongoose.model('Progress', ProgressSchema);
    
    // Delete all user-related data
    const results = await Promise.allSettled([
      // Delete user account
      User.deleteOne({ email: session.user.email }),
      // Delete teacher profile if exists
      Teacher.deleteOne({ userId: session.user.email }),
      // Delete all bookings made by this user as student
      Booking.deleteMany({ studentEmail: session.user.email }),
      // Delete all bookings where user is tutor
      Booking.deleteMany({ tutorId: session.user.email }),
      // Delete audio uploads
      AudioUpload.deleteMany({ userId: session.user.email }),
      // Delete progress records
      Progress.deleteMany({ userId: session.user.email }),
    ]);
    
    console.log(`Account deleted for ${session.user.email}`);
    console.log('Deletion results:', results.map(r => r.status));
    
    return NextResponse.json({ 
      success: true, 
      message: "Account deleted successfully" 
    });
    
  } catch (error) {
    console.error("Account deletion error:", error);
    return NextResponse.json(
      { error: "Failed to delete account", details: (error as Error).message },
      { status: 500 }
    );
  }
}