<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import {
  FaBell,
  FaSearch,
  FaTractor,
  FaPlus,
  FaTimes,
  FaMapMarkerAlt,
  FaTruck,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./FarmerDashboard.css";
import logo from "../assets/Logo.jpg";

const FarmerDashboard = () => {
  const [dateTime, setDateTime] = useState(new Date());
  const [greeting, setGreeting] = useState("");
  const [bookings, setBookings] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null); // ✅ NEW
  const [bookingData, setBookingData] = useState({
    // ✅ NEW
    productName: "",
    quantity: "",
    source: "",
    destination: "",
    deliveryDate: "",
  });
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  // Time update
  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Greeting
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
    navigate("/");
  };

  // ✅ Load bookings from localStorage and vehicles from backend
  useEffect(() => {
    const storedBookings = JSON.parse(localStorage.getItem("bookings")) || [];
    setBookings(storedBookings);

    const fetchVehicles = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/vehicles");
        setVehicles(res.data);
      } catch (err) {
        console.error("Error fetching vehicles:", err);
      }
    };

    fetchVehicles();
  }, []);

  const handleBookVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowModal(true);
  };

  // ✅ Handle confirm booking (ADD THIS FUNCTION HERE)
  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!selectedVehicle) return;

    const farmer = JSON.parse(localStorage.getItem("user"));
    const booking = {
      farmerId: farmer.userId,
      farmerName: farmer.name || farmer.userId,
      providerId: selectedVehicle.providerId,
      vehicleId: selectedVehicle._id,
      vehicleName: `${selectedVehicle.brand} ${selectedVehicle.model}`,
      productName: bookingData.productName,
      quantity: bookingData.quantity,
      source: bookingData.source,
      destination: bookingData.destination,
      deliveryDate: bookingData.deliveryDate,
    };

    try {
      await axios.post("http://localhost:5000/api/bookings/add", booking);
      alert("✅ Booking submitted successfully!");
      setShowModal(false);
      setBookingData({
        productName: "",
        quantity: "",
        source: "",
        destination: "",
        deliveryDate: "",
      });
    } catch (err) {
      console.error("Booking error:", err);
      alert("❌ Error submitting booking");
    }
  };

  // ✅ Fetch farmer's bookings live from backend
  useEffect(() => {
    const fetchFarmerBookings = async () => {
      try {
        const farmer = JSON.parse(localStorage.getItem("user"));
        const res = await axios.get(
          `http://localhost:5000/api/bookings/farmer/${farmer.userId}`
        );
        setBookings(res.data);
      } catch (err) {
        console.error("Error fetching farmer bookings:", err);
      }
    };
    fetchFarmerBookings();
    const interval = setInterval(fetchFarmerBookings, 5000); // auto-refresh every 5s
    return () => clearInterval(interval);
  }, []);

  const currentBooking = bookings.find(
    (b) => b.status === "Accepted" || b.status === "Confirmed"
  );

  return (
    <div className="farmer-dashboard">
      {/* ===== NAVBAR ===== */}
      <div className="navbar">
        <div className="navbar-left">
          <img src={logo} alt="Agrologix Logo" className="logo" />
          <h1 className="site-name">AgrologiX</h1>
        </div>

        <div className="navbar-center">
          <button className="nav-btn active">Dashboard</button>
          <button
            className="nav-btn"
            onClick={() => navigate("/farmer-history")}
          >
            History
          </button>
          <button className="nav-btn" onClick={() => navigate("/farmer-help")}>
            Help & Support
          </button>
          <button
            className="nav-btn"
            onClick={() => navigate("/farmer-profile")}
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

      {/* ===== GREETING ===== */}
      <div className="greeting-section">
        <div className="greeting-left">
          <h3>
            {greeting}, <span>{user?.userId || "Farmer"} 👋</span>
          </h3>
          <p>
            {formattedDate} — {formattedTime}
          </p>
        </div>

        {/* Search bar on the right side */}
        <div className="greeting-right">
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Track using Tracking ID"
            />
            <FaSearch className="search-icon" />
          </div>
        </div>
      </div>

      {/* ===== STATS ===== */}
      <div className="stats-section">
        <div className="stat-box">
          <h4>Total Bookings</h4>
          <p>{bookings.length}</p>
        </div>
        <div className="stat-box">
          <h4>Active Bookings</h4>
          <p>{bookings.filter((b) => b.status === "Accepted").length}</p>
        </div>
        <div className="stat-box">
          <h4>Pending Requests</h4>
          <p>{bookings.filter((b) => b.status === "Pending").length}</p>
        </div>
        <div className="stat-box">
          <h4>Completed Deliveries</h4>
          <p>{bookings.filter((b) => b.status === "Completed").length}</p>
        </div>
      </div>

      {/* ===== VEHICLE + CURRENT BOOKING SECTION ===== */}
      <div className="middle-section">
        <div className="available-vehicles">
          <div className="vehicle-header">
            <h3>Available Vehicles</h3>
            <div className="vehicle-filters">
              <input
                type="text"
                placeholder="Enter District"
                className="filter-input"
              />
              <input
                type="text"
                placeholder="Enter City"
                className="filter-input"
              />
              <button className="find-btn">Find Vehicle</button>
            </div>
          </div>

          {/* Divider line */}
          <hr className="vehicle-divider" />

          {vehicles.length === 0 ? (
            <p className="no-vehicles">No vehicles available currently.</p>
          ) : (
            <div className="vehicle-list">
              {vehicles.map((v) => (
                <div key={v._id} className="vehicle-card">
                  <img
                    src={`http://localhost:5000${v.vehicleImages[0]}`}
                    alt={v.model}
                    className="vehicle-img"
                  />
                  <h4>
                    <FaTruck /> {v.brand} {v.model}
                  </h4>
                  <p>
                    <strong>Type:</strong> {v.vehicleType}
                  </p>
                  <p>
                    <strong>Capacity:</strong> {v.capacity} tons
                  </p>
                  <p>
                    <strong>Price per Kg:</strong> ₹{v.ratePerKm}
                  </p>
                  <p>
                    <strong>Rating:</strong> ⭐ {v.rating}
                  </p>
                  <p>
                    <strong>Location:</strong> {v.baseLocation}
                  </p>
                  <div className="vehicle-buttons">
                    <button
                      className="book-btn"
                      onClick={() => handleBookVehicle(v)}
                    >
                      Book
                    </button>
                    <button className="details-btn">Details</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="current-booking">
          <h3>Current Booking</h3>
          {currentBooking ? (
            <div className="current-booking-card">
              <h4>Vehicle Name - {currentBooking.vehicleName}</h4>
              <p>
                <strong>Provider:</strong>{" "}
                {currentBooking.providerName?.name || "Loading..."}
              </p>
              <p>
                <strong>Vehicle:</strong> {currentBooking.vehicleId?.brand}{" "}
                {currentBooking.vehicleId?.model}
              </p>
              <p>
                <strong>Route:</strong> {currentBooking.source} ➝{" "}
                {currentBooking.destination}
              </p>
              <p>
                <strong>Quantity:</strong> {currentBooking.quantity} tons
              </p>
              <p>
                <strong>Delivery Date:</strong> {currentBooking.deliveryDate}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {currentBooking.status === "Accepted"
                  ? "✅ Confirmed & Ready to Transport"
                  : currentBooking.status}
              </p>
            </div>
          ) : (
            <p className="no-booking">No active booking yet.</p>
          )}
        </div>
      </div>

      {/* ===== RECENT REQUESTS SECTION ===== */}
      <div className="recent-requests-section">
        <h3>Recent Requests</h3>
        <div className="requests-table-container">
          <table className="requests-table">
            <thead>
              <tr>
                <th>Vehicle Name</th>
                <th>Product</th>
                <th>Quantity (Tons)</th>
                <th>Source</th>
                <th>Destination</th>
                <th>Date</th>
                <th>Edit</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(bookings) && bookings.length > 0 ? (
                bookings.map((b, index) => (
                  <tr key={b.id || index}>
                    <td>{b.vehicleName || "N/A"}</td>
                    <td>{b.productName || "N/A"}</td>
                    <td>{b.quantity || "-"}</td>
                    <td>{b.source || "N/A"}</td>
                    <td>{b.destination || "N/A"}</td>
                    <td>{b.deliveryDate || "-"}</td>
                    <td>
                      <button className="edit-btn">
                        <FaTimes /> Edit
                      </button>
                    </td>
                    <td>
                      <span
                        className={`status-badge ${
                          b.status === "Accepted"
                            ? "accepted"
                            : b.status === "Pending"
                            ? "pending"
                            : "completed"
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
                    colSpan="8"
                    style={{ textAlign: "center", color: "#888" }}
                  >
                    No requests yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== BOOK VEHICLE MODAL ===== */}
      {showModal && (
        <div className="modal" id="bookVehicleModal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>
                <FaTruck /> Book Vehicle
              </h2>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                <FaTimes />
              </button>
            </div>

            <form className="booking-form" onSubmit={handleConfirmBooking}>
              <div className="form-row">
                <div className="form-group">
                  <label>Product Name</label>
                  <input
                    type="text"
                    required
                    value={bookingData.productName}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        productName: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Quantity (Tons)</label>
                  <input
                    type="number"
                    required
                    value={bookingData.quantity}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        quantity: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Source</label>
                  <input
                    type="text"
                    required
                    value={bookingData.source}
                    onChange={(e) =>
                      setBookingData({ ...bookingData, source: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Destination</label>
                  <input
                    type="text"
                    required
                    value={bookingData.destination}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        destination: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Delivery Date</label>
                <input
                  type="date"
                  required
                  value={bookingData.deliveryDate}
                  onChange={(e) =>
                    setBookingData({
                      ...bookingData,
                      deliveryDate: e.target.value,
                    })
                  }
                />
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
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerDashboard;
=======
import React, { useState, useEffect } from "react";
import {
  FaBell,
  FaSearch,
  FaTractor,
  FaPlus,
  FaTimes,
  FaMapMarkerAlt,
  FaTruck,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./FarmerDashboard.css";
import logo from "../assets/Logo.jpg";

const FarmerDashboard = () => {
  const [dateTime, setDateTime] = useState(new Date());
  const [greeting, setGreeting] = useState("");
  const [bookings, setBookings] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null); // ✅ NEW
  const [bookingData, setBookingData] = useState({
    // ✅ NEW
    productName: "",
    quantity: "",
    source: "",
    destination: "",
    deliveryDate: "",
  });
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  // Time update
  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Greeting
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
    navigate("/");
  };

  // ✅ Load bookings from localStorage and vehicles from backend
  useEffect(() => {
    const storedBookings = JSON.parse(localStorage.getItem("bookings")) || [];
    setBookings(storedBookings);

    const fetchVehicles = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/vehicles");
        setVehicles(res.data);
      } catch (err) {
        console.error("Error fetching vehicles:", err);
      }
    };

    fetchVehicles();
  }, []);

  const handleBookVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowModal(true);
  };

  // ✅ Handle confirm booking (ADD THIS FUNCTION HERE)
  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!selectedVehicle) return;

    const farmer = JSON.parse(localStorage.getItem("user"));
    const booking = {
      farmerId: farmer.userId,
      farmerName: farmer.name || farmer.userId,
      providerId: selectedVehicle.providerId,
      vehicleId: selectedVehicle._id,
      vehicleName: `${selectedVehicle.brand} ${selectedVehicle.model}`,
      productName: bookingData.productName,
      quantity: bookingData.quantity,
      source: bookingData.source,
      destination: bookingData.destination,
      deliveryDate: bookingData.deliveryDate,
    };

    try {
      await axios.post("http://localhost:5000/api/bookings/add", booking);
      alert("✅ Booking submitted successfully!");
      setShowModal(false);
      setBookingData({
        productName: "",
        quantity: "",
        source: "",
        destination: "",
        deliveryDate: "",
      });
    } catch (err) {
      console.error("Booking error:", err);
      alert("❌ Error submitting booking");
    }
  };

  // ✅ Fetch farmer's bookings live from backend
  useEffect(() => {
    const fetchFarmerBookings = async () => {
      try {
        const farmer = JSON.parse(localStorage.getItem("user"));
        const res = await axios.get(
          `http://localhost:5000/api/bookings/farmer/${farmer.userId}`
        );
        setBookings(res.data);
      } catch (err) {
        console.error("Error fetching farmer bookings:", err);
      }
    };
    fetchFarmerBookings();
    const interval = setInterval(fetchFarmerBookings, 5000); // auto-refresh every 5s
    return () => clearInterval(interval);
  }, []);

  const currentBooking = bookings.find(
    (b) => b.status === "Accepted" || b.status === "Confirmed"
  );

  return (
    <div className="farmer-dashboard">
      {/* ===== NAVBAR ===== */}
      <div className="navbar">
        <div className="navbar-left">
          <img src={logo} alt="Agrologix Logo" className="logo" />
          <h1 className="site-name">AgrologiX</h1>
        </div>

        <div className="navbar-center">
          <button className="nav-btn active">Dashboard</button>
          <button
            className="nav-btn"
            onClick={() => navigate("/farmer-history")}
          >
            History
          </button>
          <button className="nav-btn" onClick={() => navigate("/farmer-help")}>
            Help & Support
          </button>
          <button
            className="nav-btn"
            onClick={() => navigate("/farmer-profile")}
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

      {/* ===== GREETING ===== */}
      <div className="greeting-section">
        <div className="greeting-left">
          <h3>
            {greeting}, <span>{user?.userId || "Farmer"} 👋</span>
          </h3>
          <p>
            {formattedDate} — {formattedTime}
          </p>
        </div>

        {/* Search bar on the right side */}
        <div className="greeting-right">
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Track using Tracking ID"
            />
            <FaSearch className="search-icon" />
          </div>
        </div>
      </div>

      {/* ===== STATS ===== */}
      <div className="stats-section">
        <div className="stat-box">
          <h4>Total Bookings</h4>
          <p>{bookings.length}</p>
        </div>
        <div className="stat-box">
          <h4>Active Bookings</h4>
          <p>{bookings.filter((b) => b.status === "Accepted").length}</p>
        </div>
        <div className="stat-box">
          <h4>Pending Requests</h4>
          <p>{bookings.filter((b) => b.status === "Pending").length}</p>
        </div>
        <div className="stat-box">
          <h4>Completed Deliveries</h4>
          <p>{bookings.filter((b) => b.status === "Completed").length}</p>
        </div>
      </div>

      {/* ===== VEHICLE + CURRENT BOOKING SECTION ===== */}
      <div className="middle-section">
        <div className="available-vehicles">
          <div className="vehicle-header">
            <h3>Available Vehicles</h3>
            <div className="vehicle-filters">
              <input
                type="text"
                placeholder="Enter District"
                className="filter-input"
              />
              <input
                type="text"
                placeholder="Enter City"
                className="filter-input"
              />
              <button className="find-btn">Find Vehicle</button>
            </div>
          </div>

          {/* Divider line */}
          <hr className="vehicle-divider" />

          {vehicles.length === 0 ? (
            <p className="no-vehicles">No vehicles available currently.</p>
          ) : (
            <div className="vehicle-list">
              {vehicles.map((v) => (
                <div key={v._id} className="vehicle-card">
                  <img
                    src={`http://localhost:5000${v.vehicleImages[0]}`}
                    alt={v.model}
                    className="vehicle-img"
                  />
                  <h4>
                    <FaTruck /> {v.brand} {v.model}
                  </h4>
                  <p>
                    <strong>Type:</strong> {v.vehicleType}
                  </p>
                  <p>
                    <strong>Capacity:</strong> {v.capacity} tons
                  </p>
                  <p>
                    <strong>Price per Kg:</strong> ₹{v.ratePerKm}
                  </p>
                  <p>
                    <strong>Rating:</strong> ⭐ {v.rating}
                  </p>
                  <p>
                    <strong>Location:</strong> {v.baseLocation}
                  </p>
                  <div className="vehicle-buttons">
                    <button
                      className="book-btn"
                      onClick={() => handleBookVehicle(v)}
                    >
                      Book
                    </button>
                    <button className="details-btn">Details</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="current-booking">
          <h3>Current Booking</h3>
          {currentBooking ? (
            <div className="current-booking-card">
              <h4>Vehicle Name - {currentBooking.vehicleName}</h4>
              <p>
                <strong>Provider:</strong>{" "}
                {currentBooking.providerName?.name || "Loading..."}
              </p>
              <p>
                <strong>Vehicle:</strong> {currentBooking.vehicleId?.brand}{" "}
                {currentBooking.vehicleId?.model}
              </p>
              <p>
                <strong>Route:</strong> {currentBooking.source} ➝{" "}
                {currentBooking.destination}
              </p>
              <p>
                <strong>Quantity:</strong> {currentBooking.quantity} tons
              </p>
              <p>
                <strong>Delivery Date:</strong> {currentBooking.deliveryDate}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {currentBooking.status === "Accepted"
                  ? "✅ Confirmed & Ready to Transport"
                  : currentBooking.status}
              </p>
            </div>
          ) : (
            <p className="no-booking">No active booking yet.</p>
          )}
        </div>
      </div>

      {/* ===== RECENT REQUESTS SECTION ===== */}
      <div className="recent-requests-section">
        <h3>Recent Requests</h3>
        <div className="requests-table-container">
          <table className="requests-table">
            <thead>
              <tr>
                <th>Vehicle Name</th>
                <th>Product</th>
                <th>Quantity (Tons)</th>
                <th>Source</th>
                <th>Destination</th>
                <th>Date</th>
                <th>Edit</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(bookings) && bookings.length > 0 ? (
                bookings.map((b, index) => (
                  <tr key={b.id || index}>
                    <td>{b.vehicleName || "N/A"}</td>
                    <td>{b.productName || "N/A"}</td>
                    <td>{b.quantity || "-"}</td>
                    <td>{b.source || "N/A"}</td>
                    <td>{b.destination || "N/A"}</td>
                    <td>{b.deliveryDate || "-"}</td>
                    <td>
                      <button className="edit-btn">
                        <FaTimes /> Edit
                      </button>
                    </td>
                    <td>
                      <span
                        className={`status-badge ${
                          b.status === "Accepted"
                            ? "accepted"
                            : b.status === "Pending"
                            ? "pending"
                            : "completed"
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
                    colSpan="8"
                    style={{ textAlign: "center", color: "#888" }}
                  >
                    No requests yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== BOOK VEHICLE MODAL ===== */}
      {showModal && (
        <div className="modal" id="bookVehicleModal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>
                <FaTruck /> Book Vehicle
              </h2>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                <FaTimes />
              </button>
            </div>

            <form className="booking-form" onSubmit={handleConfirmBooking}>
              <div className="form-row">
                <div className="form-group">
                  <label>Product Name</label>
                  <input
                    type="text"
                    required
                    value={bookingData.productName}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        productName: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Quantity (Tons)</label>
                  <input
                    type="number"
                    required
                    value={bookingData.quantity}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        quantity: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Source</label>
                  <input
                    type="text"
                    required
                    value={bookingData.source}
                    onChange={(e) =>
                      setBookingData({ ...bookingData, source: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Destination</label>
                  <input
                    type="text"
                    required
                    value={bookingData.destination}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        destination: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Delivery Date</label>
                <input
                  type="date"
                  required
                  value={bookingData.deliveryDate}
                  onChange={(e) =>
                    setBookingData({
                      ...bookingData,
                      deliveryDate: e.target.value,
                    })
                  }
                />
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
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerDashboard;
>>>>>>> b11ccf06738854771f55a7d69dd7f9420562d606
