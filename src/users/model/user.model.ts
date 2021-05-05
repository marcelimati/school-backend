import { Document, Schema } from 'mongoose';
import { Subject } from '../../subjects/model/subject.model';

export const UserSchema: Schema = new Schema({
  // _id: { type: String },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  refreshToken: { type: String, default: null },
  role: { type: String, default: 'USER' },
  subjects: { type: Array },
  classroom: { type: String },
});

export interface User extends Document {
  id: string;
  username: string;
  password: string;
  role: string;
  refreshToken: string;
  subjects: Subject[];
  classroom: string;
}