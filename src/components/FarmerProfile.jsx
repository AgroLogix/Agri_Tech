
import React, { useState, useEffect } from "react";
import "./FarmerProfile.css";
import {
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaSeedling,
  FaTractor,
  FaCalendarAlt,
  FaVenusMars,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import logos from "../assets/LOGO.png";

const FarmerProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
    phone: "",
    address: "",
    crop: "",
    land: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    localStorage.setItem("user", JSON.stringify(user));
    setIsEditing(false);
    alert("Profile updated successfully ✅");
  };

  return (
    <div className="profile-page">
      {/* ===== NAVBAR ===== */}
      <div className="navbar">
        <div className="navbar-left">
          <img src={logos} alt="Agrologix Logo" className="logo" />
          <h1 className="site-name">AgrologiX</h1>
        </div>
        <div className="navbar-center">
          <button className="nav-btn" onClick={() => navigate("/farmer")}>
            Dashboard
          </button>
          <button className="nav-btn active">Profile</button>
        </div>
        <div className="navbar-right">
          <img
            src={user?.profilePic || user?.image || "/default_profile.png"}
            alt="Profile"
            className="profile-pic"
          />
        </div>
      </div>

      {/* ===== PROFILE CARD ===== */}
      <div className="profile-container">
        <h2>👨‍🌾 Farmer Profile</h2>

        <div className="profile-card">
          {/* First Name */}
          <div className="profile-section">
            <FaUser className="icon" />
            <div>
              <label>First Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="firstName"
                  value={user.firstName}
                  onChange={handleChange}
                  placeholder="Enter first name"
                />
              ) : (
                <p>{user.firstName || "Swapna"}</p>
              )}
            </div>
          </div>

          {/* Last Name */}
          <div className="profile-section">
            <FaUser className="icon" />
            <div>
              <label>Last Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="lastName"
                  value={user.lastName}
                  onChange={handleChange}
                  placeholder="Enter last name"
                />
              ) : (
                <p>{user.lastName || "Panda"}</p>
              )}
            </div>
          </div>

          {/* Date of Birth */}
          <div className="profile-section">
            <FaCalendarAlt className="icon" />
            <div>
              <label>Date of Birth</label>
              {isEditing ? (
                <input
                  type="date"
                  name="dob"
                  value={user.dob}
                  onChange={handleChange}
                />
              ) : (
                <p>{user.dob || "2002-05-12"}</p>
              )}
            </div>
          </div>

          {/* Gender */}
          <div className="profile-section">
            <FaVenusMars className="icon" />
            <div>
              <label>Gender</label>
              {isEditing ? (
                <select name="gender" value={user.gender} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <p>{user.gender || "Female"}</p>
              )}
            </div>
          </div>

          {/* Phone */}
          <div className="profile-section">
            <FaPhone className="icon" />
            <div>
              <label>Contact Number</label>
              {isEditing ? (
                <input
                  type="text"
                  name="phone"
                  value={user.phone}
                  onChange={handleChange}
                  placeholder="+91 9876543210"
                />
              ) : (
                <p>{user.phone || "+91 9876543210"}</p>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="profile-section">
            <FaMapMarkerAlt className="icon" />
            <div>
              <label>Address</label>
              {isEditing ? (
                <input
                  type="text"
                  name="address"
                  value={user.address}
                  onChange={handleChange}
                  placeholder="Enter address"
                />
              ) : (
                <p>{user.address || "Balasore, Odisha"}</p>
              )}
            </div>
          </div>

          {/* Crop */}
          <div className="profile-section">
            <FaSeedling className="icon" />
            <div>
              <label>Primary Crop</label>
              {isEditing ? (
                <input
                  type="text"
                  name="crop"
                  value={user.crop}
                  onChange={handleChange}
                  placeholder="Enter crop type"
                />
              ) : (
                <p>{user.crop || "Paddy"}</p>
              )}
            </div>
          </div>

          {/* Land */}
          <div className="profile-section">
            <FaTractor className="icon" />
            <div>
              <label>Land Area</label>
              {isEditing ? (
                <input
                  type="text"
                  name="land"
                  value={user.land}
                  onChange={handleChange}
                  placeholder="e.g., 5 Acres"
                />
              ) : (
                <p>{user.land || "5 Acres"}</p>
              )}
            </div>
          </div>
        </div>

        {/* ===== BUTTONS ===== */}
        <div className="button-group">
          {isEditing ? (
            <>
              <button className="save-btn" onClick={handleSave}>
                Save
              </button>
              <button
                className="cancel-btn"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              className="edit-btn"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FarmerProfile;

