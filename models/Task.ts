import mongoose, { Schema, Document } from 'mongoose';

interface Task extends Document {
  title: string;
  description: string;
  status: boolean;
}

const TaskSchema: Schema = new Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true, },
  status: { type: Boolean, default: false }
}, {
  timestamps: true,
});

const TaskModel = mongoose.models.Task || mongoose.model<Task>('Task', TaskSchema);

export default TaskModel;

