import express from 'express';
import User from '../models/userM.js'

const router = express.Router();

router.get('/allUsers', async (req, res) => {
  try {
    const users = await User.find().populate('fName').populate('_id');
    return res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching users' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(403).json({ error: 'User not found' });
    }
    return res.json({ user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred while fetching user details' });
  }
});


export default router;