import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import connectMongoDB from "@/app/lib/mongodb";

export async function POST() {
  try {
    // Get current session
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Connect to MongoDB and clear all sessions for this user
    await connectMongoDB();
    const mongoose = (await import('mongoose')).default;
    
    const SessionSchema = new mongoose.Schema({
      sessionToken: String,
      userId: String,
      expires: Date,
      user: Object,
    }, { collection: 'sessions' });
    
    const Session = mongoose.models.Session || mongoose.model('Session', SessionSchema);
    
    // Delete all sessions for this user
    await Session.deleteMany({ "user.email": session.user.email });

    return NextResponse.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
