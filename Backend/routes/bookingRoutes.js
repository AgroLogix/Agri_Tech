import express from "express";
import Booking from "../models/Booking.js";
import Vehicle from "../models/Vehicle.js";
import User from "../models/User.js";
import mongoose from "mongoose";

const router = express.Router();

/* 🧾 CREATE BOOKING WITH VALIDATION */
router.post("/add", async (req, res) => {
  try {
    const { vehicleId, deliveryDate, farmerId } = req.body;

    // ✅ Check if vehicle exists
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found"
      });
    }

    // ✅ Check if vehicle is available (not in maintenance)
    if (vehicle.status !== "Available") {
      return res.status(400).json({
        message: "This vehicle is currently not available for booking"
      });
    }

    // ✅ Check if vehicle is already booked for this date
    const existingBooking = await Booking.findOne({
      vehicleId: vehicleId,
      deliveryDate: deliveryDate,
      status: { $in: ["Pending", "Accepted"] } // Only check active bookings
    });

    if (existingBooking) {
      return res.status(400).json({
        message: "This vehicle is already booked for the selected date. Please choose another date or vehicle.",
        bookedBy: existingBooking.farmerId === farmerId ? "you" : "another farmer"
      });
    }

    // ✅ Generate unique userId for this booking
    const bookingData = {
      ...req.body,
      userId: new mongoose.Types.ObjectId().toString() // Unique ID for each booking
    };

    // ✅ Create new booking
    const booking = new Booking(bookingData);
    await booking.save();

    res.status(201).json({
      message: "Booking created successfully! Waiting for provider confirmation.",
      booking
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error creating booking",
      error: err.message
    });
  }
});

/* 🚜 GET BOOKINGS FOR PROVIDER */
router.get("/provider/:providerId", async (req, res) => {
  try {
    const bookings = await Booking.find({ providerId: req.params.providerId })
      .sort({ createdAt: -1 }); // Most recent first
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching provider bookings" });
  }
});

/* 🌾 GET BOOKINGS FOR FARMER */
router.get("/farmer/:farmerId", async (req, res) => {
  try {
    const bookings = await Booking.find({ farmerId: req.params.farmerId })
      .sort({ createdAt: -1 }); // Most recent first
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching farmer bookings" });
  }
});

/* ✅ UPDATE BOOKING STATUS (Accept/Reject) */
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    // ✅ Validate status
    const validStatuses = ["Pending", "Accepted", "Rejected", "Completed", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status value"
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found"
      });
    }

    res.json({
      message: `Booking ${status.toLowerCase()} successfully`,
      booking
    });

  } catch (err) {
    res.status(500).json({
      message: "Error updating booking status",
      error: err.message
    });
  }
});

/* 🔍 CHECK VEHICLE AVAILABILITY FOR SPECIFIC DATE */
router.get("/check-availability/:vehicleId/:date", async (req, res) => {
  try {
    const { vehicleId, date } = req.params;

    const existingBooking = await Booking.findOne({
      vehicleId: vehicleId,
      deliveryDate: date,
      status: { $in: ["Pending", "Accepted"] }
    });

    res.json({
      available: !existingBooking,
      message: existingBooking
        ? "Vehicle already booked for this date"
        : "Vehicle is available"
    });

  } catch (err) {
    res.status(500).json({
      message: "Error checking availability",
      error: err.message
    });
  }
});

export default router;
