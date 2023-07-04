import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const { Schema } = mongoose;
const userSchema = new mongoose.Schema({
  fName: { type: String, required: true, trim: true},
  lName: { type: String, required: true , trim: true},
  email: { type: String, required: true , trim: true},
  pword: { type: String, required: true , trim: true},
  isAdmin: { type: Boolean, required: true, default: false},
  Tasks: [{ type: Schema.Types.ObjectId, ref: 'Task'}]
});
userSchema.methods.checkPassword = async function (password) {
    return await bcrypt.compare(password, this.pword);
  };  
  userSchema.methods.genToken = function () {
    return jwt.sign({ user: { id: this._id } }, "admin", {
      expiresIn: "365d",
    });
  };
const User = mongoose.model("User", userSchema);
export default User;