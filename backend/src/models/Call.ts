import mongoose, { Schema, Document } from 'mongoose';

export interface ICallEvent {
  event: string;
  timestamp: Date;
  payload: Record<string, unknown>;
}

export interface ICallDtmfInput {
  digit: string;
  timestamp: Date;
}

export interface ICall extends Document {
  telnyxCallId?: string;
  callControlId?: string;
  userId: string;
  providerId: mongoose.Types.ObjectId;
  serviceRequestId?: mongoose.Types.ObjectId;
  fromNumber?: string;
  toNumber: string;
  serviceType?: string;
  serviceLocation?: string;
  status: 'requested' | 'initiated' | 'ringing' | 'answered' | 'completed' | 'failed' | 'cancelled';
  promptText?: string;
  dtmfInputs: ICallDtmfInput[];
  events: ICallEvent[];
  recordingUrl?: string;
  failureReason?: string;
  answeredAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CallEventSchema = new Schema<ICallEvent>({
  event: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  payload: { type: Schema.Types.Mixed, default: {} },
}, { _id: false });

const CallDtmfInputSchema = new Schema<ICallDtmfInput>({
  digit: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
}, { _id: false });

const CallSchema: Schema = new Schema({
  telnyxCallId: { type: String, index: true },
  callControlId: { type: String, index: true },
  userId: { type: String, required: true, index: true },
  providerId: { type: Schema.Types.ObjectId, ref: 'Provider', required: true, index: true },
  serviceRequestId: { type: Schema.Types.ObjectId, ref: 'ServiceRequest', index: true },
  fromNumber: { type: String },
  toNumber: { type: String, required: true },
  serviceType: { type: String },
  serviceLocation: { type: String },
  status: {
    type: String,
    enum: ['requested', 'initiated', 'ringing', 'answered', 'completed', 'failed', 'cancelled'],
    default: 'requested',
    index: true,
  },
  promptText: { type: String },
  dtmfInputs: { type: [CallDtmfInputSchema], default: [] },
  events: { type: [CallEventSchema], default: [] },
  recordingUrl: { type: String },
  failureReason: { type: String },
  answeredAt: { type: Date },
  completedAt: { type: Date },
}, { timestamps: true });

CallSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<ICall>('Call', CallSchema);