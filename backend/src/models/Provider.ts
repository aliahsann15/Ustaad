import mongoose, { Schema, Document } from 'mongoose';

export interface IProvider extends Document {
  name: string;
  phoneNumber: string;
  skills: string[]; // e.g., 'plumber', 'electrician', 'ac_technician'
  specializationLevel: 'basic' | 'intermediate' | 'expert';
  location: {
    type: 'Point';
    coordinates: number[]; // [longitude, latitude]
  };
  availability: boolean;
  rating: number;
  reviewCount: number;
  onTimeScore: number; // 0-100%
  cancellationRate: number; // 0-100%
  baseRatePerHour: number;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProviderSchema: Schema = new Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  skills: [{ type: String }],
  specializationLevel: { type: String, enum: ['basic', 'intermediate', 'expert'], default: 'basic' },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], index: '2dsphere', required: true }
  },
  availability: { type: Boolean, default: true },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  onTimeScore: { type: Number, default: 100 },
  cancellationRate: { type: Number, default: 0 },
  baseRatePerHour: { type: Number, required: true },
  isVerified: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model<IProvider>('Provider', ProviderSchema);
