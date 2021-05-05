import { Document, Schema } from 'mongoose';

export const SubjectSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true }
});

export interface Subject extends Document {
  id: string;
  name: string;
}