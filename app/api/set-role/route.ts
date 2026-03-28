
import { NextResponse } from 'next/server';
import connectMongoDB from '../../lib/mongodb';
import User from '../../models/User';

export async function POST(req: Request) {
  const { email, role } = await req.json();
  if (!email || !role || !['student', 'teacher'].includes(role)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
  await connectMongoDB();
  await User.findOneAndUpdate(
    { email },
    { $set: { role } },
    { new: true }
  );
  return NextResponse.json({ success: true });
}
