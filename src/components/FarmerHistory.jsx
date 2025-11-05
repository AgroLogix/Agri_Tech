import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaCalendarAlt, FaTruck, FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./FarmerHistory.css";

const FarmerHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    const storedBookings = JSON.parse(localStorage.getItem("bookings"));
    if (storedBookings) {
      setBookings(storedBookings);
    }
  }, []);

  const filteredBookings =
    filterStatus === "All"
      ? bookings
      : bookings.filter((b) => b.status === filterStatus);

  return (
    <div className="history-page">
      {/* HEADER SECTION */}
      <div className="history-header">
        <button className="back-btn" onClick={() => navigate("/farmer")}>
          <FaArrowLeft /> Back
        </button>
        <h2>📜 Booking History</h2>
      </div>

      {/* FILTER SECTION */}
      <div className="filter-section">
        <label>Filter by Status:</label>
        <select
          className="filter-dropdown"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Accepted">Accepted</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* BOOKING LIST SECTION */}
      <div className="history-list">
        {filteredBookings.length === 0 ? (
          <p className="no-bookings">No bookings found.</p>
        ) : (
          filteredBookings.map((b) => (
            <div key={b.id} className="history-card">
              <div className="history-details">
                <h3>
                  <FaTruck className="icon" /> Vehicle:{" "}
                  <span>{b.vehicleName || "N/A"}</span>
                </h3>
                <p>
                  <FaMapMarkerAlt className="icon" /> Route:{" "}
                  <strong>
                    {b.source} ➝ {b.destination}
                  </strong>
                </p>
                <p>
                  <FaCalendarAlt className="icon" /> Date: <strong>{b.date}</strong>
                </p>
                <p>Quantity: {b.quantity} tons</p>
                <p>Status: <span className={`status ${b.status.toLowerCase()}`}>{b.status}</span></p>
              </div>

              {/* ADDITIONAL ATTRIBUTES */}
              <div className="extra-info">
                <p>🚚 Driver: {b.driverName || "Assigned Soon"}</p>
                <p>📞 Contact: {b.driverPhone || "N/A"}</p>
                <p>💰 Cost: ₹{b.cost || "—"}</p>
                <p>🕒 Estimated Delivery: {b.deliveryDate || "Pending"}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FarmerHistory;
