import express from 'express';
import User from '../models/userM.js'

const router = express.Router();

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  console.log(id)
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