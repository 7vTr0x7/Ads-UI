import mongoose, { Schema, Document } from "mongoose";

export interface IAd extends Document {
  title: string;
  imageUrl: string;
  targetUrl: string;
  isActive: boolean;
}

const AdSchema: Schema = new Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  targetUrl: { type: String, required: true },
  isActive: { type: Boolean, default: true },
});

export default mongoose.model<IAd>("Ad", AdSchema);
