import express from 'express';
import Task from '../models/taskM.js'
import User from '../models/userM.js'
import Tag from '../models/tagM.js'
const router = express.Router();

router.put('/addUser', async (req, res) => {
  try {
    const { userId, taskId } = req.body;
    // Find the user and task
    const user = await User.findById(userId);
    const task = await Task.findById(taskId);

    // Check if the task is already assigned to the user
    if (user.Tasks.includes(taskId)) {
      return res.status(400).json({ error: 'Task already assigned to the user' });
    }

    // Check if the user is already assigned to the task
    if (task.assignedUsers.includes(userId)) {
      return res.status(400).json({ error: 'User already assigned to the task' });
    }

    // Add the task to the user
    user.Tasks.push(taskId);
    await user.save();

    // Add the user to the task
    task.assignedUsers.push(userId);
    await task.save();

    res.status(200).json({ message: 'Task assigned to user successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while assigning the task to the user' });
  }
});

router.put('/addTag', async (req, res) => {
  try {
    const { tagId, taskId } = req.body;

    // Find the tag and task
    const tag = await Tag.findById(tagId);
    const task = await Task.findById(taskId);

    // Check if the task is already assigned to the tag
    if (tag.tasks.includes(taskId)) {
      return res.status(400).json({ error: 'Task already assigned to the tag' });
    }

    // Check if the tag is already assigned to the task
    if (task.assignedTags.includes(tagId)) {
      return res.status(400).json({ error: 'Tag already assigned to the task' });
    }

    // Add the tag to the task
    task.assignedTags.push(tagId);
    await task.save();

    // Add the task to the tag
    tag.tasks.push(taskId);
    await tag.save();

    res.status(200).json({ message: 'Tag added to task successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while adding the tag to the task' });
  }
});

router.put('/updateStatus/:id', async (req, res) => {
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

//to get tasks for users
router.post('/multiple', async (req, res) => {
  const {taskIds} = req.body;
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

//for admins
router.get('/allTasks', async (req, res) => {
  try {
    const tasks = await Task.find().populate('assignedUsers').populate('assignedTags');
    return res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching tasks' });
  }
});

router.put('/', async (req, res) => {
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

router.delete('/:taskId', async (req, res) => {
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
