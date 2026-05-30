import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectMongoDB from "@/app/lib/mongodb";
import User from "@/app/models/User";
import fs from "fs/promises";
import path from "path";

const AVATAR_DIRECTORY = path.join(process.cwd(), "public", "uploads", "avatars");

function getSanitizedFileName(email: string, originalName: string) {
  const safeEmail = email.replace(/[^a-z0-9]/gi, "_").toLowerCase();
  const safeName = originalName.replace(/[^a-z0-9\.\-_]/gi, "_");
  return `${Date.now()}-${safeEmail}-${safeName}`;
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const avatarFile = formData.get("avatar");

  if (!avatarFile || !(avatarFile instanceof File)) {
    return NextResponse.json({ error: "Avatar file is required" }, { status: 400 });
  }

  const fileName = getSanitizedFileName(session.user.email, avatarFile.name || "avatar.png");
  const filePath = path.join(AVATAR_DIRECTORY, fileName);

  try {
    await fs.mkdir(AVATAR_DIRECTORY, { recursive: true });
    const arrayBuffer = await avatarFile.arrayBuffer();
    await fs.writeFile(filePath, Buffer.from(arrayBuffer));

    await connectMongoDB();
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    user.image = `/uploads/avatars/${fileName}`;
    await user.save();

    return NextResponse.json({ success: true, avatarUrl: user.image });
  } catch (error) {
    console.error("Error uploading avatar:", error);
    return NextResponse.json({ error: "Failed to upload avatar" }, { status: 500 });
  }
}
