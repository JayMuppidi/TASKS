import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  dueDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ['Pending', 'working', 'Completed'],
    default: 'Pending',
    required: true
  },
  assignedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
  assignedTags: [{ type: String, ref: 'Tag'}]
});
taskSchema.index({ title: 'text', description: 'text' });
const Task = mongoose.model('Task', taskSchema);

export default Task;