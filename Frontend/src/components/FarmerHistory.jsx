<<<<<<< HEAD
import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaTruck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./FarmerHistory.css";

const FarmerHistory = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const storedBookings = JSON.parse(localStorage.getItem("bookings")) || [];
    setBookings(storedBookings);
  }, []);

  return (
    <div className="farmer-history-page">
      {/* ===== Header ===== */}
      <div className="farmer-history-header">
        <button className="farmer-back-btn" onClick={() => navigate("/farmer")}>
          <FaArrowLeft /> Back
        </button>
        <h2>
          <FaTruck /> Booking History
        </h2>
      </div>

      {/* ===== Table ===== */}
      <div className="farmer-history-table-container">
        <table className="farmer-history-table">
          <thead>
            <tr>
              <th>Vehicle Name</th>
              <th>Product</th>
              <th>Quantity (Tons)</th>
              <th>Source</th>
              <th>Destination</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(bookings) && bookings.length > 0 ? (
              bookings.map((b, index) => (
                <tr key={b.id || index}>
                  <td>{b.vehicleName || "N/A"}</td>
                  <td>{b.produce || "N/A"}</td>
                  <td>{b.quantity || "-"}</td>
                  <td>{b.source || "N/A"}</td>
                  <td>{b.destination || "N/A"}</td>
                  <td>{b.date || "-"}</td>
                  <td>
                    <span
                      className={`farmer-status-badge ${
                        b.status === "Accepted"
                          ? "farmer-accepted"
                          : b.status === "Pending"
                          ? "farmer-pending"
                          : "farmer-completed"
                      }`}
                    >
                      {b.status || "Pending"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  style={{
                    textAlign: "center",
                    color: "#777",
                    padding: "15px",
                  }}
                >
                  No bookings yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FarmerHistory;
=======
import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaTruck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./FarmerHistory.css";

const FarmerHistory = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const storedBookings = JSON.parse(localStorage.getItem("bookings")) || [];
    setBookings(storedBookings);
  }, []);

  return (
    <div className="farmer-history-page">
      {/* ===== Header ===== */}
      <div className="farmer-history-header">
        <button className="farmer-back-btn" onClick={() => navigate("/farmer")}>
          <FaArrowLeft /> Back
        </button>
        <h2>
          <FaTruck /> Booking History
        </h2>
      </div>

      {/* ===== Table ===== */}
      <div className="farmer-history-table-container">
        <table className="farmer-history-table">
          <thead>
            <tr>
              <th>Vehicle Name</th>
              <th>Product</th>
              <th>Quantity (Tons)</th>
              <th>Source</th>
              <th>Destination</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(bookings) && bookings.length > 0 ? (
              bookings.map((b, index) => (
                <tr key={b.id || index}>
                  <td>{b.vehicleName || "N/A"}</td>
                  <td>{b.produce || "N/A"}</td>
                  <td>{b.quantity || "-"}</td>
                  <td>{b.source || "N/A"}</td>
                  <td>{b.destination || "N/A"}</td>
                  <td>{b.date || "-"}</td>
                  <td>
                    <span
                      className={`farmer-status-badge ${
                        b.status === "Accepted"
                          ? "farmer-accepted"
                          : b.status === "Pending"
                          ? "farmer-pending"
                          : "farmer-completed"
                      }`}
                    >
                      {b.status || "Pending"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  style={{
                    textAlign: "center",
                    color: "#777",
                    padding: "15px",
                  }}
                >
                  No bookings yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FarmerHistory;
>>>>>>> b11ccf06738854771f55a7d69dd7f9420562d606
