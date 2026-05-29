import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectMongoDB from '../../lib/mongodb';
import User from '../../models/User';

export async function POST(req: Request) {
  const { email, token, password } = await req.json();
  const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

  if (!normalizedEmail || !token || !password) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  await connectMongoDB();

  const user = await User.findOne({
    email: normalizedEmail,
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: new Date() },
  });

  if (!user) {
    return NextResponse.json({ error: 'Invalid or expired reset link' }, { status: 400 });
  }

  user.password = await bcrypt.hash(password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  return NextResponse.json({ success: true });
}