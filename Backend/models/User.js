import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  userId: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String,
  role: String,

  // ✅ Add provider profile fields
  profilePic: String,
  gender: String,
  dob: String,
  phone: String,
  addressLine: String,
  city: String,
  state: String,
  district: String,
  pincode: String,
  baseLocation: String,
  aadhaar: String,
  pan: String,
  drivingLicense: String,
<<<<<<< HEAD
});
=======
}, { timestamps: true });
>>>>>>> 19ba1a5387f9ca11837f024270256ddfd0cc7b44

const User = mongoose.model("User", userSchema);
export default User;
