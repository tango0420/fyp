
import { NextResponse } from 'next/server';
import connectMongoDB from '../../lib/mongodb';
import User from '../../models/User';

export async function POST(req: Request) {
  const { email, role } = await req.json();
  const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

  if (!normalizedEmail || !role || !['student', 'teacher'].includes(role)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  await connectMongoDB();

  const updatedUser = await User.findOneAndUpdate(
    { email: normalizedEmail },
    { $set: { email: normalizedEmail, role } },
    { upsert: true, returnDocument: 'after' }
  );

  return NextResponse.json({ success: true, role: updatedUser?.role ?? role });
}
