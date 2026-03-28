import { NextRequest } from 'next/server';
import connectMongoDB from '../../lib/mongodb';
import User, { IUser } from '../../models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  await connectMongoDB();

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = new User({ email, password: hashedPassword } as IUser);
    await user.save();
    return new Response(JSON.stringify({ message: 'User created', success: true }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'User already exists' }), { status: 400 });
  }
}
