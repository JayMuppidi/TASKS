import express from 'express';
import Task from '../models/taskM.js'
import User from '../models/userM.js'
import Tag from '../models/tagM.js'
const router = express.Router();


router.put('/', async (req, res) => {
    try {
      const { name } = req.body;
      console.log(req.body)
      // Create a new task instance
      const newTag = new Tag({
        name
      });
      // Save the task to the database
      const savedTag = await newTag.save();
      res.status(201).json(savedTag);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while creating the tag' });
    }
  });
  router.get('/allTags', async (req, res) => {
    try {

      const tags = await Tag.find().populate('name');
      
      res.json(tags);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching tags' });
    }
  });



export default router;