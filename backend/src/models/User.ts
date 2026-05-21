import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  firebaseUid: string;
  phoneNumber: string;
  name?: string;
  email?: string;
  profileImage?: string;
  languagePreference: 'en' | 'ur' | 'ur-Latn'; // English, Urdu, Roman Urdu
  location?: {
    type: 'Point';
    coordinates: number[]; // [longitude, latitude]
  };
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  firebaseUid: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true, unique: true },
  name: { type: String },
  email: { type: String, trim: true, lowercase: true, index: { unique: true, sparse: true } },
  profileImage: { type: String, trim: true },
  languagePreference: { type: String, enum: ['en', 'ur', 'ur-Latn'], default: 'ur-Latn' },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], index: '2dsphere' }
  },
  address: { type: String },
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
