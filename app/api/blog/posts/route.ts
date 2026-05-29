import connectMongoDB from '@/app/lib/mongodb';
import Blog from '@/models/Blog';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(req: Request) {
  await connectMongoDB();
  const posts = await Blog.find().sort({ createdAt: -1 }).limit(20).lean();
  return NextResponse.json({ posts });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, content, authorName } = body;
    if (!title || !content) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    // handle optional base64 image upload
    let imageUrl = undefined;
    if (body.imageBase64) {
      const matches = body.imageBase64.match(/^data:(image\/(png|jpeg|jpg));base64,(.+)$/);
      if (matches) {
        const ext = matches[2] === 'jpeg' ? 'jpg' : matches[2];
        const data = matches[3];
        const buffer = Buffer.from(data, 'base64');
        const filename = `blog-${Date.now()}.${ext}`;
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
        const filePath = path.join(uploadsDir, filename);
        fs.writeFileSync(filePath, buffer);
        imageUrl = `/uploads/${filename}`;
      }
    }

    await connectMongoDB();
    const post = await Blog.create({ title, content, authorName, imageUrl });
    return NextResponse.json({ post }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
