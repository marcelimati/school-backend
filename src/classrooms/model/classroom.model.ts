import { Document, Schema } from 'mongoose';

export const ClassroomSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
});

export interface Classroom extends Document {
    id: string;
    name: string;
}