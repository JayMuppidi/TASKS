import mongoose from 'mongoose';

const tagSchema = new mongoose.Schema({
  name: { type: String, required: true },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }]
});

const Tag = mongoose.model('Tag', tagSchema);

export default Tag;