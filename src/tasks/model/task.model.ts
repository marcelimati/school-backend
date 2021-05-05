import { Document, Schema } from 'mongoose';

export const TaskSchema: Schema = new Schema({
  name: { type: String, required: true },
  teacher: { type: String, required: true },
  subject: { type: String, required: true },
  classroom: { type: String, required: true },
  file: { type: String, required: true },
  complete: { type: Object },
  grade: { type: Object },
});

export interface Task extends Document {
    id: string;
    name: string;
    teacher: string;
    subject: string;
    classroom: string;
    file: string;
    complete: Object;
    grade: Object;
}