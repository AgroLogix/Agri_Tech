import express from "express";
import Booking from "../models/Booking.js";
import Vehicle from "../models/Vehicle.js";
import User from "../models/User.js";

const router = express.Router();

/* 🧾 CREATE BOOKING */
router.post("/add", async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).json({ message: "Booking created", booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating booking" });
  }
});

/* 🚜 GET BOOKINGS FOR PROVIDER */
router.get("/provider/:providerId", async (req, res) => {
  try {
    const bookings = await Booking.find({ providerId: req.params.providerId })
      .populate("vehicleId")
      .populate("farmerId");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching provider bookings" });
  }
});

/* 🌾 GET BOOKINGS FOR FARMER */
router.get("/farmer/:farmerId", async (req, res) => {
  try {
    const bookings = await Booking.find({ farmerId: req.params.farmerId })
      .populate("vehicleId")
      .populate("providerId");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching farmer bookings" });
  }
});

/* ✅ UPDATE BOOKING STATUS (Accept/Reject) */
router.put("/:id/status", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: "Error updating booking status" });
  }
});

export default router;
