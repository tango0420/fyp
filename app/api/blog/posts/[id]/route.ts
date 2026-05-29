import connectMongoDB from '@/app/lib/mongodb';
import Blog from '@/models/Blog';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  await connectMongoDB();
  const post = await Blog.findById(params.id).lean();
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ post });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    await connectMongoDB();
    const updated = await Blog.findByIdAndUpdate(params.id, body, { new: true }).lean();
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ post: updated });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await connectMongoDB();
  const deleted = await Blog.findByIdAndDelete(params.id).lean();
  if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}
