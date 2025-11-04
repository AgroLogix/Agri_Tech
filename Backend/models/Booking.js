<<<<<<< HEAD
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
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
    status: { type: String, default: "Pending" },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);

=======
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
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
    status: { type: String, default: "Pending" },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
>>>>>>> b11ccf06738854771f55a7d69dd7f9420562d606
