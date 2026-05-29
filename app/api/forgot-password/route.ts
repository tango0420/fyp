import { randomBytes } from 'crypto';
import { NextResponse } from 'next/server';
import connectMongoDB from '../../lib/mongodb';
import User from '../../models/User';
import { sendEmail } from '../../lib/mailer';

export async function POST(req: Request) {
  const { email } = await req.json();
  const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

  if (!normalizedEmail) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  await connectMongoDB();
  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    return NextResponse.json({ success: true });
  }

  const token = randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 1000 * 60 * 60);

  await User.updateOne(
    { _id: user._id },
    {
      $set: {
        resetPasswordToken: token,
        resetPasswordExpires: expires,
      },
    }
  );

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const resetLink = `${appUrl}/reset-password?token=${encodeURIComponent(token)}&email=${encodeURIComponent(normalizedEmail)}`;

  const emailResult = await sendEmail({
    to: normalizedEmail,
    subject: 'Reset your Virtuoso password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #f97316 0%, #fb923c 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Reset your password</h1>
        </div>
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #eee;">
          <p style="color: #333; font-size: 16px; margin: 0 0 16px 0;">We received a request to reset your Virtuoso password.</p>
          <p style="color: #555; font-size: 15px; line-height: 1.6; margin: 0 0 24px 0;">This link will expire in 1 hour.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background: #f97316; color: white; padding: 12px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">Reset Password</a>
          </div>
          <p style="color: #777; font-size: 12px; word-break: break-all;">If the button doesn't work, paste this link into your browser:<br/>${resetLink}</p>
        </div>
      </div>
    `,
    text: `Reset your Virtuoso password: ${resetLink}\n\nThis link expires in 1 hour.`,
  });

  if (!emailResult.success) {
    return NextResponse.json({ error: 'Could not send reset email' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}