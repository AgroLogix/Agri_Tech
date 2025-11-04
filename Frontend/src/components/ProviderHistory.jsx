<<<<<<< HEAD
import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaHistory } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./ProviderHistory.css";

const ProviderHistory = () => {
  const navigate = useNavigate();
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    // Fetch from localStorage or API in future
    const storedHistory = JSON.parse(localStorage.getItem("providerHistory")) || [
      {
        id: 1,
        vehicleModel: "Tata 407",
        date: "2025-10-28",
        farmerName: "Ramesh Kumar",
        fromLocation: "Pune",
        toLocation: "Nashik",
        status: "Completed",
        earnings: "₹3,200",
      },
      {
        id: 2,
        vehicleModel: "Mahindra Blazo",
        date: "2025-10-25",
        farmerName: "Sita Patil",
        fromLocation: "Kolhapur",
        toLocation: "Mumbai",
        status: "Cancelled",
        earnings: "₹0",
      },
      {
        id: 3,
        vehicleModel: "Ashok Leyland 1616",
        date: "2025-10-22",
        farmerName: "Ravi Deshmukh",
        fromLocation: "Nagpur",
        toLocation: "Aurangabad",
        status: "Completed",
        earnings: "₹5,000",
      },
    ];

    setHistoryData(storedHistory);
  }, []);

  return (
    <div className="provider-history">
      {/* ===== HEADER ===== */}
      <div className="history-header">
        <button className="back-btn" onClick={() => navigate("/provider")}>
          <FaArrowLeft /> Back
        </button>
        <h2>
          <FaHistory /> Booking History
        </h2>
      </div>

      {/* ===== HISTORY TABLE ===== */}
      <div className="history-table-container">
        {historyData.length === 0 ? (
          <p className="no-history">No past records available.</p>
        ) : (
          <table className="history-table">
            <thead>
              <tr>
                <th>Vehicle Model</th>
                <th>Date</th>
                <th>Farmer Name</th>
                <th>From Location</th>
                <th>To Location</th>
                <th>Status</th>
                <th>Earnings</th>
              </tr>
            </thead>
            <tbody>
              {historyData.map((record) => (
                <tr key={record.id}>
                  <td>{record.vehicleModel}</td>
                  <td>{record.date}</td>
                  <td>{record.farmerName}</td>
                  <td>{record.fromLocation}</td>
                  <td>{record.toLocation}</td>
                  <td className={`status ${record.status.toLowerCase()}`}>
                    {record.status}
                  </td>
                  <td>{record.earnings}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ProviderHistory;
=======
import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaHistory } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./ProviderHistory.css";

const ProviderHistory = () => {
  const navigate = useNavigate();
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    // Fetch from localStorage or API in future
    const storedHistory = JSON.parse(localStorage.getItem("providerHistory")) || [
      {
        id: 1,
        vehicleModel: "Tata 407",
        date: "2025-10-28",
        farmerName: "Ramesh Kumar",
        fromLocation: "Pune",
        toLocation: "Nashik",
        status: "Completed",
        earnings: "₹3,200",
      },
      {
        id: 2,
        vehicleModel: "Mahindra Blazo",
        date: "2025-10-25",
        farmerName: "Sita Patil",
        fromLocation: "Kolhapur",
        toLocation: "Mumbai",
        status: "Cancelled",
        earnings: "₹0",
      },
      {
        id: 3,
        vehicleModel: "Ashok Leyland 1616",
        date: "2025-10-22",
        farmerName: "Ravi Deshmukh",
        fromLocation: "Nagpur",
        toLocation: "Aurangabad",
        status: "Completed",
        earnings: "₹5,000",
      },
    ];

    setHistoryData(storedHistory);
  }, []);

  return (
    <div className="provider-history">
      {/* ===== HEADER ===== */}
      <div className="history-header">
        <button className="back-btn" onClick={() => navigate("/provider")}>
          <FaArrowLeft /> Back
        </button>
        <h2>
          <FaHistory /> Booking History
        </h2>
      </div>

      {/* ===== HISTORY TABLE ===== */}
      <div className="history-table-container">
        {historyData.length === 0 ? (
          <p className="no-history">No past records available.</p>
        ) : (
          <table className="history-table">
            <thead>
              <tr>
                <th>Vehicle Model</th>
                <th>Date</th>
                <th>Farmer Name</th>
                <th>From Location</th>
                <th>To Location</th>
                <th>Status</th>
                <th>Earnings</th>
              </tr>
            </thead>
            <tbody>
              {historyData.map((record) => (
                <tr key={record.id}>
                  <td>{record.vehicleModel}</td>
                  <td>{record.date}</td>
                  <td>{record.farmerName}</td>
                  <td>{record.fromLocation}</td>
                  <td>{record.toLocation}</td>
                  <td className={`status ${record.status.toLowerCase()}`}>
                    {record.status}
                  </td>
                  <td>{record.earnings}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ProviderHistory;
>>>>>>> b11ccf06738854771f55a7d69dd7f9420562d606
