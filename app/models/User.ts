import mongoose, { Schema, Document, Model } from 'mongoose';


export interface IUser extends Document {
  email: string;
  password: string;
  role?: 'student' | 'teacher';
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  name?: string;
  bio?: string;
  instrument?: string;
  timezone?: string;
  image?: string;
  settings?: {
    secondaryInstruments?: string[];
    micSensitivity?: number;
    inputGain?: number;
    micDevice?: string;
    tuningA4?: number;
    temperament?: string;
    metronomeBPM?: number;
    metronomeVolume?: number;
    beatSubdivision?: string;
    visualCue?: boolean;
    privacy?: {
      publicProfile?: boolean;
      sharePractice?: boolean;
      researchConsent?: boolean;
    };
    accessibility?: {
      captions?: boolean;
      reducedMotion?: boolean;
      highContrast?: boolean;
    };
    fontSize?: string;
    twoFactor?: boolean;
  };
}


const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'teacher'], default: undefined },
  resetPasswordToken: { type: String, default: undefined },
  resetPasswordExpires: { type: Date, default: undefined },
  name: { type: String, default: '' },
  bio: { type: String, default: '' },
  instrument: { type: String, default: 'Guitar' },
  timezone: { type: String, default: 'Asia/Kathmandu' },
  image: { type: String, default: '' },
  settings: { type: Object, default: {} },
});

export default (mongoose.models.User as Model<IUser>) || mongoose.model<IUser>('User', UserSchema);
