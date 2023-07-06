import express from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import User from '../models/userM.js';
const router = express.Router();
router.post('/signup', [
  body('fName').not().isEmpty().withMessage('First name is required'),
  body('lName').not().isEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Invalid email address'),
  body('isAdmin'),
  body('pword').isLength({ min: 1 }).withMessage('Password is required')
],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { fName, lName, email, isAdmin, pword } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(403).json({ errors: [{ msg: 'There is already an account with this email.' }] });
      }
      user = new User({ fName, lName, email, isAdmin, pword });
      const salt = await bcrypt.genSalt();
      user.pword = await bcrypt.hash(pword, salt);
      await user.save();
      const token = user.genToken();
      res.status(201).json({ token });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

router.post('/login', [
  body('email').not().isEmpty().withMessage('Email is required').trim().escape(),
  body('pword').isLength({ min: 1 }).withMessage('Password is required')
],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, pword } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
      const isMatch = await user.checkPassword(pword);

      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const token = user.genToken();
      res.status(200).json({ token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server Error" });
    }
  }

)
export default router;