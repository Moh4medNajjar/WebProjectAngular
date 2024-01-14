const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String},
  description: String,
  status: { type: String, enum: ['New', 'In Progress', 'Deadline'], default: 'New' },
  category: String,
  launchDate: Date,
  deadlineDate: Date,
});


const Project = mongoose.model('Project', projectSchema);

module.exports = Project;