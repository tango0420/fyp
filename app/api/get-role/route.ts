import User from '../../models/User';
import connectMongoDB from '../../lib/mongodb';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { email } = await req.json();
  await connectMongoDB();
  const user = await User.findOne({ email });
  return NextResponse.json({ role: user?.role || null });
}
