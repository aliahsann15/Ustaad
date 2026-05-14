import mongoose, { Schema, Document } from 'mongoose';

export interface IServiceRequest extends Document {
  userId: mongoose.Types.ObjectId;
  rawText: string;
  extractedIntent?: {
    serviceType: string;
    urgency: 'low' | 'medium' | 'high';
    preferredTime?: Date;
    priceSensitivity: 'low' | 'medium' | 'high';
    location: {
      type: 'Point';
      coordinates: number[];
    };
    addressText: string;
  };
  languageConfidenceScore?: number;
  status: 'pending' | 'clarification_needed' | 'matched' | 'failed';
  clarificationQuestions?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ServiceRequestSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rawText: { type: String, required: true },
  extractedIntent: {
    serviceType: { type: String },
    urgency: { type: String, enum: ['low', 'medium', 'high'] },
    preferredTime: { type: Date },
    priceSensitivity: { type: String, enum: ['low', 'medium', 'high'] },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number] }
    },
    addressText: { type: String }
  },
  languageConfidenceScore: { type: Number },
  status: { type: String, enum: ['pending', 'clarification_needed', 'matched', 'failed'], default: 'pending' },
  clarificationQuestions: [{ type: String }],
}, { timestamps: true });

export default mongoose.model<IServiceRequest>('ServiceRequest', ServiceRequestSchema);
