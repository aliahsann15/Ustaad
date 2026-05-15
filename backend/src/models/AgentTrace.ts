import mongoose, { Schema, Document } from 'mongoose';

export interface IAgentTrace extends Document {
  serviceRequestId: mongoose.Types.ObjectId;
  steps: {
    timestamp: Date;
    action: string;      // "OBSERVE", "REASON", "TOOL_CALL", "TOOL_RESULT", "ACT", "EVALUATE"
    description: string; 
    metadata?: any;      
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const AgentTraceSchema: Schema = new Schema({
  serviceRequestId: { type: Schema.Types.ObjectId, ref: 'ServiceRequest', required: true },
  steps: [{
    timestamp: { type: Date, default: Date.now },
    action: { type: String, required: true },
    description: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed }
  }]
}, { timestamps: true });

export default mongoose.model<IAgentTrace>('AgentTrace', AgentTraceSchema);
