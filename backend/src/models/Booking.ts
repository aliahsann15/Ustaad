import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  serviceRequestId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  providerId: mongoose.Types.ObjectId;
  scheduledTime: Date;
  priceBreakdown: {
    visitFee: number;
    distanceCost: number;
    urgencyAdjustment: number;
    totalEstimated: number;
  };
  status: 'requested' | 'confirmed' | 'en_route' | 'in_progress' | 'completed' | 'disputed' | 'cancelled';
  disputeDetails?: {
    reason: string;
    resolution: string;
    status: 'open' | 'resolved';
  };
  feedback?: {
    rating: number;
    comment: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema: Schema = new Schema({
  serviceRequestId: { type: Schema.Types.ObjectId, ref: 'ServiceRequest', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  providerId: { type: Schema.Types.ObjectId, ref: 'Provider', required: true },
  scheduledTime: { type: Date, required: true },
  priceBreakdown: {
    visitFee: { type: Number, required: true },
    distanceCost: { type: Number, required: true },
    urgencyAdjustment: { type: Number, required: true },
    totalEstimated: { type: Number, required: true },
  },
  status: { 
    type: String, 
    enum: ['requested', 'confirmed', 'en_route', 'in_progress', 'completed', 'disputed', 'cancelled'], 
    default: 'requested' 
  },
  disputeDetails: {
    reason: { type: String },
    resolution: { type: String },
    status: { type: String, enum: ['open', 'resolved'] }
  },
  feedback: {
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String }
  }
}, { timestamps: true });

export default mongoose.model<IBooking>('Booking', BookingSchema);
