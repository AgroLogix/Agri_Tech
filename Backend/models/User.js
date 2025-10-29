import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  userId: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String,
  role: String,
});

const User = mongoose.model("User", userSchema);
export default User;
