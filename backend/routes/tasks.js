import express from 'express';
import Task from '../models/taskM'
import User from '../models/userM'
import Tag from '../models/tagM'
const router = express.Router();

//to get a singular task
router.get('/tasks/:id', async (req, res) => {
  const taskId = req.params.id;
  try {
    // Find the task by ID in the database
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    // Return the task details
    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});
router.put('/tasks/updateStatus/:id', async (req, res) => {
  const taskId = req.params.id;
  const { status } = req.body;

  try {
    // Find the task by ID in the database
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Update the task status
    task.status = status;
    await task.save();

    // Return the updated task
    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

//to get multiple tasks
router.get('/tasks', async (req, res) => {
  const taskIds = req.query.ids;

  try {
    // Find tasks with the given IDs in the database
    const tasks = await Task.find({ _id: { $in: taskIds } })
      .populate('assignedTags', 'name') // Populate the assignedTags field with the tag name
      .populate('assignedUsers', 'fName lName'); // Populate the assignedUsers field with the user's first and last name

    // Return the array of tasks with details and tags
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/tasks', async (req, res) => {
  try {
    const { title, description, dueDate, status, assignedUsers, assignedTags } = req.body;

    // Create a new task instance
    const newTask = new Task({
      title,
      description,
      dueDate,
      status,
      assignedUsers,
      assignedTags,
    });

    // Save the task to the database
    const savedTask = await newTask.save();

    // Update assigned users with the new task
    await User.updateMany(
      { _id: { $in: assignedUsers } },
      { $push: { Tasks: savedTask._id } }
    );

    // Update assigned tags with the new task
    await Tag.updateMany(
      { _id: { $in: assignedTags } },
      { $push: { tasks: savedTask._id } }
    );

    res.status(201).json(savedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while creating the task' });
  }
});

router.delete('/tasks/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;

    // Find the task to be deleted
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Remove the task from all associated users
    await User.updateMany(
      { Tasks: taskId },
      { $pull: { Tasks: taskId } }
    );

    // Remove the task from all associated tags
    await Tag.updateMany(
      { tasks: taskId },
      { $pull: { tasks: taskId } }
    );

    // Delete the task itself
    await Task.findByIdAndDelete(taskId);

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while deleting the task' });
  }
})

export default router;
