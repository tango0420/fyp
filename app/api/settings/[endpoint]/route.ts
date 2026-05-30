import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectMongoDB from "@/app/lib/mongodb";
import User from "@/app/models/User";

async function getUser(email: string) {
  await connectMongoDB();
  return await User.findOne({ email });
}

export async function POST(req: NextRequest, context: { params: Promise<{ endpoint: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { endpoint } = await context.params;
  const data = await req.json();

  try {
    const user = await getUser(session.user.email);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    user.settings = user.settings || {};

    switch (endpoint) {
      case "account":
        user.name = data.fullName || user.name;
        user.bio = data.bio || user.bio;
        user.instrument = data.instrument || user.instrument;
        user.timezone = data.timezone || user.timezone;
        if (data.avatarUrl) user.image = data.avatarUrl;
        user.settings.secondaryInstruments = data.secondaryInstruments || user.settings.secondaryInstruments || [];
        break;
      case "audio":
        Object.assign(user.settings, {
          micSensitivity: data.micSensitivity,
          inputGain: data.inputGain,
          micDevice: data.micDevice,
          tuningA4: data.tuningA4,
          temperament: data.temperament,
          metronomeBPM: data.metronomeBPM,
          metronomeVolume: data.metronomeVolume,
          beatSubdivision: data.beatSubdivision,
          visualCue: data.visualCue,
        });
        break;
      case "privacy":
        Object.assign(user.settings, {
          privacy: data.privacy,
          accessibility: data.accessibility,
          fontSize: data.fontSize,
        });
        break;
      case "security":
        Object.assign(user.settings, {
          twoFactor: data.twoFactor,
        });
        break;
      default:
        return NextResponse.json({ error: "Invalid endpoint" }, { status: 400 });
    }

    await user.save();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error saving ${endpoint} settings:`, error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest, context: { params: Promise<{ endpoint: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { endpoint } = await context.params;
    const user = await getUser(session.user.email);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const settings = user.settings || {};

    switch (endpoint) {
      case "account":
        return NextResponse.json({
          fullName: user.name || "",
          email: user.email,
          bio: user.bio || "",
          instrument: user.instrument || "Guitar",
          timezone: user.timezone || "Asia/Kathmandu",
          secondaryInstruments: settings.secondaryInstruments || ["Piano"],
          avatarUrl: user.image || "",
        });
      case "audio":
        return NextResponse.json({
          micSensitivity: settings.micSensitivity ?? 75,
          inputGain: settings.inputGain ?? 60,
          micDevice: settings.micDevice || "default",
          tuningA4: settings.tuningA4 ?? 440,
          temperament: settings.temperament || "Equal",
          metronomeBPM: settings.metronomeBPM ?? 120,
          metronomeVolume: settings.metronomeVolume ?? 80,
          beatSubdivision: settings.beatSubdivision || "Quarter",
          visualCue: settings.visualCue ?? true,
        });
      case "privacy":
        return NextResponse.json({
          privacy: settings.privacy || { publicProfile: true, sharePractice: false, researchConsent: true },
          accessibility: settings.accessibility || { captions: false, reducedMotion: false, highContrast: false },
          fontSize: settings.fontSize || "Medium",
        });
      case "security":
        return NextResponse.json({
          twoFactor: settings.twoFactor ?? false,
        });
      default:
        return NextResponse.json({ error: "Invalid endpoint" }, { status: 400 });
    }
  } catch (error) {
    console.error(`Error fetching settings:`, error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
