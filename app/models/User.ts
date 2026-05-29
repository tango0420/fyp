import mongoose, { Schema, Document, Model } from 'mongoose';


export interface IUser extends Document {
  email: string;
  password: string;
  role?: 'student' | 'teacher';
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
}


const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'teacher'], default: undefined },
  resetPasswordToken: { type: String, default: undefined },
  resetPasswordExpires: { type: Date, default: undefined },
});

export default (mongoose.models.User as Model<IUser>) || mongoose.model<IUser>('User', UserSchema);
