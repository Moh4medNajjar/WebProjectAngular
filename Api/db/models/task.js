const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String},
  description: String,
  due_date: Date,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assigned_to: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  priority: { type: String, enum: ['Low', 'Medium', 'High'] },
  status: { type: String, enum: ['Todo', 'In Progress','In Review', 'Done'], default: 'Todo' },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },

});


const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
