import React from "react";

const FarmerDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <div style={{ padding: "2rem" }}>
      <h1>👩‍🌾 Farmer Dashboard</h1>
      <p>Welcome, {user?.firstName}</p>
      <p>Email: {user?.email}</p>
    </div>
  );
};

export default FarmerDashboard;
