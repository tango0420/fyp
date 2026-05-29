import mongoose, { Schema, model, models } from 'mongoose';

const BlogSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  authorName: { type: String },
  imageUrl: { type: String },
  authorId: { type: Schema.Types.ObjectId, ref: 'User' },
  published: { type: Boolean, default: true },
}, { timestamps: true });

const Blog = (models && (models as any).Blog) || model('Blog', BlogSchema);

export default Blog;
