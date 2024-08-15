import { Schema, Document } from 'mongoose';

export interface Message extends Document {
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
}

export const MessageSchema = new Schema({
  senderId: { type: String, required: true },
  receiverId: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});
