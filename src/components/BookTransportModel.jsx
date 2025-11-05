// BookTransportModal.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./BookTransportModel.css";

export default function BookTransportModal({ onClose, refreshRequests, preselectedVehicle = null, bookUrl = "/api/farmer/book-transport" }) {
  // Form fields
  const [produce, setProduce] = useState("");
  const [quantity, setQuantity] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [mobile, setMobile] = useState("");
  const [vehicle, setVehicle] = useState(preselectedVehicle ?? null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (preselectedVehicle) {
      setVehicle(preselectedVehicle);
    }
  }, [preselectedVehicle]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    // basic validation
    if (!produce || !quantity || !from || !to || !mobile) {
      setError("Please fill all fields.");
      return;
    }
    if (!vehicle) {
      setError("Please select a vehicle (click Book on a vehicle card).");
      return;
    }

    const payload = {
      produce,
      quantity,
      from,
      to,
      mobile,
      vehicleType: vehicle.type,
      provider: vehicle.provider,
      pricePerKm: vehicle.pricePerKm,
    };

    try {
      setLoading(true);
      const res = await axios.post(bookUrl, payload);
      // assume a success response contains { success: true, booking: { ... } }
      if (res?.data?.success) {
        setSuccessMsg("Booking confirmed (pending provider acceptance).");
        // refresh lists in parent
        if (typeof refreshRequests === "function") refreshRequests();
        // close after short delay so user sees confirmation
        setTimeout(() => {
          onClose();
        }, 900);
      } else {
        // some APIs might return 200 but with message
        setError(res?.data?.message || "Booking failed. Please try again.");
      }
    } catch (err) {
      console.error("Book transport failed:", err);
      setError(err.response?.data?.message || "Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // reset fields if needed
    onClose();
  };

  return (
    <div className="btm-overlay" onClick={handleClose}>
      <div className="btm-modal" onClick={(e) => e.stopPropagation()}>
        <button className="btm-close" onClick={handleClose}>✕</button>
        <h3 style={{ color: "#374826" }}>{vehicle ? `Book — ${vehicle.type}` : "Book Transport"}</h3>

        {error && <div style={{ background: "#fff2f0", color: "#a33", padding: "8px 10px", borderRadius: 8, marginTop: 8 }}>{error}</div>}
        {successMsg && <div style={{ background: "#f0fff0", color: "#2a7", padding: "8px 10px", borderRadius: 8, marginTop: 8 }}>{successMsg}</div>}

        <form className="btm-form" onSubmit={handleSubmit}>
          <label>Produce name</label>
          <input type="text" value={produce} onChange={(e) => setProduce(e.target.value)} placeholder="e.g., Tomatoes" />

          <label>Quantity</label>
          <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="e.g., 200 kg" />

          <label>From</label>
          <input type="text" value={from} onChange={(e) => setFrom(e.target.value)} placeholder="Origin location" />

          <label>To</label>
          <input type="text" value={to} onChange={(e) => setTo(e.target.value)} placeholder="Destination location" />

          <label>Mobile number</label>
          <input type="number" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="Mobile number for contact" />

          <div style={{ marginTop: 12 }}>
            <label>Selected vehicle</label>
            <div style={{ padding: 10, background: "#fbfff8", borderRadius: 8, border: "1px solid #eef4e3", marginTop: 6 }}>
              {vehicle ? (
                <>
                  <div style={{ fontWeight: 800 }}>{vehicle.type} <span style={{ fontWeight: 700, fontSize: 13 }}>{vehicle.provider}</span></div>
                  <div style={{ color: "#6f6f6f", marginTop: 6 }}>Price: ₹{vehicle.pricePerKm}/km • Capacity: {vehicle.capacity}</div>
                </>
              ) : (
                <div style={{ color: "#7a7a7a" }}>No vehicle selected — pick one from the Available Vehicles list.</div>
              )}
            </div>
          </div>

          <div className="btm-actions">
            <button type="button" className="btm-button outline" onClick={handleClose} disabled={loading}>Back</button>
            <button type="submit" className="btm-button primary" disabled={loading}>{loading ? "Booking..." : "Confirm Booking"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
