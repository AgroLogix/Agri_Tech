import React, { useEffect, useState } from "react";
import { FaBell, FaSearch, FaPlus, FaTruck, FaTimes, FaCloudUploadAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./ProviderDashboard.css";

const ProviderDashboard = () => {
  const [dateTime, setDateTime] = useState(new Date());
  const [greeting, setGreeting] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [showModal, setShowModal] = useState(false); // ✅ Modal visibility state
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const hour = dateTime.getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, [dateTime]);

  const formattedDate = dateTime.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const formattedTime = dateTime.toLocaleTimeString();

  const handleLogout = () => {
    navigate("/login");
  };

  const handleAddVehicle = () => {
    setShowModal(true); // ✅ open modal
  };

  const handleAccept = (id) => {
    setBookings(
      bookings.map((b) => (b.id === id ? { ...b, status: "Accepted" } : b))
    );
  };

  const handleReject = (id) => {
    setBookings(
      bookings.map((b) => (b.id === id ? { ...b, status: "Rejected" } : b))
    );
  };

  useEffect(() => {
    const storedBookings = JSON.parse(localStorage.getItem("bookings"));
    if (storedBookings) {
      setBookings(storedBookings);
    }
  }, []);

  return (
    <div className="provider-dashboard">
      {/* ===== TOP NAVBAR ===== */}
      <div className="navbar">
        <div className="navbar-left">
          <img src="Our-Prmise.png" alt="Agrologix Logo" className="logo" />
          <h1 className="site-name">AgrologiX</h1>
        </div>

        <div className="navbar-center">
          <button className="nav-btn active">Dashboard</button>
          <button className="nav-btn">Vehicle</button>
          <button className="nav-btn">History</button>
          <button className="nav-btn">Help & Support</button>
          <button className="nav-btn">Earning</button>
          <button
            className="nav-btn"
            onClick={() => navigate("/provider-profile")}
          >
            Profile
          </button>
        </div>

        <div className="navbar-right">
          <FaBell className="bell-icon" />
          <img
            src={user?.profilePic || user?.image || "/default_profile.png"}
            alt="Profile"
            className="profile-pic"
          />
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* ===== GREETING SECTION ===== */}
      <div className="greeting-section">
        <div className="greeting-left">
          <h3>
            {greeting}, <span>{user?.userId || "User"} 👋</span>
          </h3>
          <p>
            {formattedDate} — {formattedTime}
          </p>
        </div>

        <div className="greeting-right">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Track using Tracking ID"
              className="search-input"
            />
          </div>
          <button className="add-vehicle-btn" onClick={handleAddVehicle}>
            <FaPlus /> Add Vehicle
          </button>
        </div>
      </div>

      {/* ===== DASHBOARD STAT BOXES ===== */}
      <div className="stats-section">
        <div className="stat-box">
          <h4>Total Bookings</h4>
          <p>128</p>
        </div>
        <div className="stat-box">
          <h4>Active Booking</h4>
          <p>12</p>
        </div>
        <div className="stat-box">
          <h4>Total Vehicles</h4>
          <p>{vehicles.length}</p>
        </div>
        <div className="stat-box">
          <h4>Total Earnings</h4>
          <p>₹54,200</p>
        </div>
        <div className="stat-box">
          <h4>Reviews</h4>
          <p>4.8 ★</p>
        </div>
      </div>

      {/* ===== VEHICLE LIST BELOW BOXES ===== */}
      <div className="vehicle-list-section">
        <h3>Your Vehicles</h3>
        {vehicles.length === 0 ? (
          <p className="no-vehicles">No vehicles added yet.</p>
        ) : (
          <div className="vehicle-list">
            {vehicles.map((v) => (
              <div
                key={v.id}
                className={`vehicle-card ${v.status.toLowerCase()}`}
              >
                <h4>{v.name}</h4>
                <p className="status">
                  Status: <span>{v.status}</span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ===== BOOKING STATUS SECTION ===== */}
      <div className="booking-status-section">
        <h3>Booking Status</h3>
        {bookings.length === 0 ? (
          <p className="no-bookings">No booking requests yet.</p>
        ) : (
          <div className="booking-list">
            {bookings.map((b) => (
              <div key={b.id} className="booking-card">
                <div className="booking-details">
                  <h4>Farmer: {b.farmerName}</h4>
                  <p>
                    Route: {b.source} ➝ {b.destination}
                  </p>
                  <p>Quantity: {b.quantity} tons</p>
                  <p>Date: {b.date}</p>
                  <p>Time: {b.time}</p>
                </div>
                <div className="booking-actions">
                  {b.status === "Pending" ? (
                    <>
                      <button
                        className="accept-btn"
                        onClick={() => handleAccept(b.id)}
                      >
                        Accept
                      </button>
                      <button
                        className="reject-btn"
                        onClick={() => handleReject(b.id)}
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <p className={`status-text ${b.status.toLowerCase()}`}>
                      {b.status}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ===== ADD VEHICLE MODAL ===== */}
      {showModal && (
        <div className="modal" id="addVehicleModal">
          <div className="modal-content">
            <div className="modal-header">
              <h2><FaTruck /> Add New Vehicle</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <FaTimes />
              </button>
            </div>

            <form className="vehicle-form" id="vehicleForm">
              <div className="form-row">
                <div className="form-group">
                  <label>Vehicle Type <span className="required">*</span></label>
                  <select required>
                    <option value="">Select Type</option>
                    <option value="mini-truck">Mini Truck (1-2 Tons)</option>
                    <option value="medium-truck">Medium Truck (2-5 Tons)</option>
                    <option value="heavy-truck">Heavy Truck (5-10 Tons)</option>
                    <option value="trailer">Trailer (10+ Tons)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Vehicle Brand <span className="required">*</span></label>
                  <select required>
                    <option value="">Select Brand</option>
                    <option value="tata">Tata Motors</option>
                    <option value="ashok-leyland">Ashok Leyland</option>
                    <option value="mahindra">Mahindra</option>
                    <option value="eicher">Eicher Motors</option>
                    <option value="bharat-benz">Bharat Benz</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Vehicle Model <span className="required">*</span></label>
                  <input type="text" placeholder="e.g., Tata 407" required />
                </div>
                <div className="form-group">
                  <label>Registration Number <span className="required">*</span></label>
                  <input type="text" placeholder="e.g., MH-12-AB-1234" required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Capacity (Tons) <span className="required">*</span></label>
                  <input type="number" placeholder="e.g., 2.5" step="0.1" required />
                </div>
                <div className="form-group">
                  <label>Manufacturing Year <span className="required">*</span></label>
                  <input type="number" placeholder="e.g., 2022" min="2000" max="2025" required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Fuel Type <span className="required">*</span></label>
                  <select required>
                    <option value="">Select Fuel Type</option>
                    <option value="diesel">Diesel</option>
                    <option value="petrol">Petrol</option>
                    <option value="cng">CNG</option>
                    <option value="electric">Electric</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Rate per KM (₹) <span className="required">*</span></label>
                  <input type="number" placeholder="e.g., 15" required />
                </div>
              </div>

              <div className="form-group full-width">
                <label>Base Location <span className="required">*</span></label>
                <input type="text" placeholder="Enter city/location" required />
              </div>

              <div className="form-group full-width">
                <label>Vehicle Description</label>
                <textarea placeholder="Additional details about the vehicle" rows="3"></textarea>
              </div>

              <div className="form-group full-width">
                <label>Upload Vehicle Images</label>
                <div className="file-upload">
                  <FaCloudUploadAlt />
                  <p>Drag and drop images or <span className="browse">Browse</span></p>
                  <input type="file" multiple accept="image/*" />
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <FaPlus /> Add Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderDashboard;
