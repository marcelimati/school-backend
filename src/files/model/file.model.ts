import { Document, Schema } from 'mongoose';

export const FileSchema: Schema = new Schema({
  file: { type: Object, required: true },
  subject: { type: String, required: true },
  userid: { type: String, required: true },
  classroom: { type: String, required: true},
  date: { type: Date, required: true },
  task: { type: String },
});

export interface File extends Document {
  orginalname: string;
  encoding: string;
  mimetype: string;
  filename: string;
  path: string;
  size: string;
}