import { NextRequest } from 'next/server';
import connectMongoDB from '../../lib/mongodb';
import User from '../../models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  await connectMongoDB();

  const user = await User.findOne({ email });
  if (!user) return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return new Response(JSON.stringify({ error: 'Invalid password' }), { status: 401 });

  return new Response(JSON.stringify({ message: 'Login successful', role: user.role || null }), { status: 200 });
}