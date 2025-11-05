import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
<<<<<<< HEAD
    // ✅ ADD userId field to satisfy the MongoDB index
    userId: { 
      type: String, 
      required: true,
      default: () => new mongoose.Types.ObjectId().toString() // Generate unique ID for each booking
    },
=======
>>>>>>> 19ba1a5387f9ca11837f024270256ddfd0cc7b44
    farmerId: { type: String, required: true },
    farmerName: { type: String, required: true },
    providerId: { type: String, required: true },
    vehicleId: { type: String, required: true },
    vehicleName: { type: String },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true },
    source: { type: String, required: true },
    destination: { type: String, required: true },
    deliveryDate: { type: String, required: true },
<<<<<<< HEAD
    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Accepted", "Rejected", "Completed", "Cancelled"]
    },
=======
    status: { type: String, default: "Pending" },
>>>>>>> 19ba1a5387f9ca11837f024270256ddfd0cc7b44
  },
  { timestamps: true }
);

<<<<<<< HEAD
// ✅ Compound index to prevent duplicate bookings for same vehicle on same date
bookingSchema.index({ vehicleId: 1, deliveryDate: 1, status: 1 });

// ✅ Pre-save hook to ensure userId is always unique
bookingSchema.pre('save', function(next) {
  if (!this.userId) {
    this.userId = new mongoose.Types.ObjectId().toString();
  }
  next();
});

export default mongoose.model("Booking", bookingSchema);
=======
export default mongoose.model("Booking", bookingSchema);

>>>>>>> 19ba1a5387f9ca11837f024270256ddfd0cc7b44
