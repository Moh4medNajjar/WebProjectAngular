const express = require('express');
const router = express.Router();
const Task = require('../db/models/task');
const Project = require('../db/models/project');

//Get all tasks
router.get('/all/', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Get all tasks by owner
router.get('/all/:ownerId', async (req, res) => {
  try {
    const ownerId = req.params.ownerId;
    const tasks = await Task.find({ owner: ownerId });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Get task by Id
router.get('/:taskId', async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const task = await Task.findById(taskId);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


//add a task
router.post('/add', async (req, res) => {
  try {
    let data = req.body;

    // Assuming 'projectId' is passed in the request body; adjust as needed
    const projectId = data.projectId;

    // Check if the project with the given ID exists
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).send({ message: 'Project not found' });
    }

    // Create a new task with the project ID
    data.projectId = projectId;
    let task = new Task(data);

    // Save the task
    const newTask = await task.save();

    // Update the project's tasks array
    project.tasks.push(newTask._id);
    await project.save();

    res.status(200).send(newTask);
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(400).send(err);
  }
});



// Update a task
router.put('/update/:id', async (req, res) => {
  try {
    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a task
router.delete('/delete/:id', async (req, res) => {
  try {
    await Task.deleteOne({ _id: req.params.id });
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;
