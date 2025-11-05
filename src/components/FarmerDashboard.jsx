

// FarmerDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BookTransportModal from "../components/BookTransportModel";
import "./FarmerDashboard.css";
import "./BookTransportModel.css"; // modal style file (kept separate)

const DASHBOARD_URL = "http://localhost:5000/api/farmer/dashboard";
const REQUESTS_URL = "http://localhost:5000/api/farmer/requests";
const TRANSACTIONS_URL = "http://localhost:5000/api/farmer/transactions";
const PROFILE_URL = "http://localhost:5000/api/farmer/profile";
const AVAILABLE_VEHICLES_URL =
  "http://localhost:5000/api/farmer/available-vehicles";
const HISTORY_URL = "http://localhost:5000/api/farmer/history";
const BOOK_URL = "http://localhost:5000/api/farmer/book-transport";

const dummyDashboard = {
  totalRequests: 158,
  pending: 24,
  completed: 112,
  earnings: "₹12,450",
};

const dummyRequests = [
  {
    _id: "r1",
    produce: "Tomatoes",
    quantity: "200 kg",
    from: "Village A",
    to: "City Market",
    date: "2025-10-25",
    status: "Pending",
    vehicle: "Mini Truck",
    tracking: "TRK-1001",
  },
  {
    _id: "r2",
    produce: "Potatoes",
    quantity: "500 kg",
    from: "Village B",
    to: "Main Town",
    date: "2025-10-22",
    status: "Completed",
    vehicle: "Tractor",
    tracking: "TRK-1002",
  },
];

const dummyTransactions = [
  {
    id: "tx1",
    date: "2025-10-20",
    amount: "₹1,200",
    desc: "Tomato transport",
    status: "Paid",
  },
  {
    id: "tx2",
    date: "2025-10-18",
    amount: "₹2,400",
    desc: "Potato transport",
    status: "Paid",
  },
];

const dummyProfile = {
  firstName: "Tapan",
  lastName: "Barik",
  email: "tapan@example.com",
  userId: "tapan123",
  mobile: "+91-XXXXXXXXXX",
  role: "farmer",
  address: "Village A",
};

const dummyVehicles = [
  {
    id: "v1",
    type: "Mini Truck",
    pricePerKm: 20,
    capacity: "1000kg",
    rating: 4.7,
    provider: "RoadFast",
  },
  {
    id: "v2",
    type: "Tractor",
    pricePerKm: 15,
    capacity: "1500kg",
    rating: 4.5,
    provider: "FarmLift",
  },
  {
    id: "v3",
    type: "Pickup Van",
    pricePerKm: 18,
    capacity: "1200kg",
    rating: 4.6,
    provider: "QuickHaul",
  },
];

export default function FarmerDashboard() {
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const farmerName = (storedUser?.firstName || "DELISAS")
    .toString()
    .toUpperCase();

  // UI
  const [activeSection, setActiveSection] = useState("overview"); // overview | transactions | history | profile
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  // data
  const [dashboardData, setDashboardData] = useState(dummyDashboard);
  const [requests, setRequests] = useState(dummyRequests);
  const [transactions, setTransactions] = useState(dummyTransactions);
  const [historyList, setHistoryList] = useState([]);
  const [profile, setProfile] = useState(storedUser || dummyProfile);

  // vehicles
  const [vehicles, setVehicles] = useState(dummyVehicles);
  const [loadingVehicles, setLoadingVehicles] = useState(false);

  // loading/errors
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [errorBanner, setErrorBanner] = useState("");

  // modal
  const [showModal, setShowModal] = useState(false);
  const [preselectedVehicle, setPreselectedVehicle] = useState(null);

  // search inputs for vehicles (from/to)
  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");

  // tracking search inside Live Tracking card
  const [trackingSearch, setTrackingSearch] = useState("");
  const [liveTracking, setLiveTracking] = useState(null);

  // fetch helpers with fallback
  const fetchDashboard = async () => {
    try {
      setLoadingDashboard(true);
      const res = await axios.get(DASHBOARD_URL);
      if (res?.data) setDashboardData(res.data);
      setErrorBanner("");
    } catch (err) {
      console.warn("Dashboard API failed, using dummy", err);
      setDashboardData(dummyDashboard);
      
    } finally {
      setLoadingDashboard(false);
    }
  };

  const fetchRequests = async () => {
    try {
      setLoadingRequests(true);
      const res = await axios.get(REQUESTS_URL);
      const fetched = res?.data?.requests ?? res?.data ?? [];
      setRequests(
        Array.isArray(fetched) && fetched.length ? fetched : dummyRequests
      );
      setErrorBanner("");
    } catch (err) {
      console.warn("Requests API failed, using dummy", err);
      setRequests(dummyRequests);
      setErrorBanner(
        (prev) => prev
      );
    } finally {
      setLoadingRequests(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      setLoadingTransactions(true);
      const res = await axios.get(TRANSACTIONS_URL);
      const fetched = res?.data?.transactions ?? res?.data ?? [];
      setTransactions(
        Array.isArray(fetched) && fetched.length ? fetched : dummyTransactions
      );
      setErrorBanner("");
    } catch (err) {
      console.warn("Transactions API failed, using dummy", err);
      setTransactions(dummyTransactions);
      setErrorBanner(
        (prev) =>
          prev 
      );
    } finally {
      setLoadingTransactions(false);
    }
  };

  const fetchProfile = async () => {
    try {
      setLoadingProfile(true);
      const res = await axios.get(PROFILE_URL);
      if (res?.data) {
        setProfile(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      }
      setErrorBanner("");
    } catch (err) {
      console.warn("Profile API failed, using stored/dummy", err);
      const stored = JSON.parse(localStorage.getItem("user") || "null");
      if (stored) setProfile(stored);
      else setProfile(dummyProfile);
      setErrorBanner(
        (prev) =>
          prev
      );
    } finally {
      setLoadingProfile(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await axios.get(HISTORY_URL);
      setHistoryList(res?.data?.history ?? []);
      setErrorBanner("");
    } catch (err) {
      console.warn("History API failed, using requests as fallback", err);
      setHistoryList(requests);
      setErrorBanner(
        (prev) => prev
      );
    }
  };

  useEffect(() => {
    // initial load (no polling)
    fetchDashboard();
    fetchRequests();
    fetchProfile();
    fetchTransactions();
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // UI actions
  const openBookingModalWithVehicle = (vehicle) => {
    setPreselectedVehicle(vehicle);
    setShowModal(true);
  };

  const refreshRequests = async () => {
    await fetchRequests();
    await fetchHistory();
  };

  // Search by transport/tracking id (shows live tracking area)
  const handleTrackingSearch = async () => {
    if (!trackingSearch) return alert("Enter a tracking ID to search.");
    try {
      const res = await axios.get(
        `/api/farmer/track/${encodeURIComponent(trackingSearch)}`
      );
      setLiveTracking(
        res?.data ?? { tracking: trackingSearch, status: "Unknown", route: [] }
      );
    } catch (err) {
      console.warn("Track API failed — using dummy tracking", err);
      setLiveTracking({
        tracking: trackingSearch,
        status: "In Transit",
        vehicle: "VH-9088",
        lastSeen: new Date().toISOString(),
        route: [
          { time: "09:24", place: "Village A" },
          { time: "12:10", place: "Highway 18" },
        ],
      });
      setErrorBanner(
        (prev) => prev 
      );
    }
  };

  // Find available vehicles by location (from/to)
  const handleFindVehicles = async () => {
    try {
      setLoadingVehicles(true);
      const res = await axios.get(AVAILABLE_VEHICLES_URL, {
        params: { from: searchFrom, to: searchTo },
      });
      const fetched = res?.data?.vehicles ?? res?.data ?? [];
      setVehicles(
        Array.isArray(fetched) && fetched.length ? fetched : dummyVehicles
      );
      setErrorBanner("");
    } catch (err) {
      console.warn("Available vehicles API failed — using dummy vehicles", err);
      setVehicles(dummyVehicles);
      setErrorBanner(
        (prev) => prev 
      );
    } finally {
      setLoadingVehicles(false);
    }
  };

  // logout: clear token and redirect to root "/" (home)
  const handleLogout = async () => {
    try {
      // optional: call backend logout if you have endpoint
      // await axios.post("/api/auth/logout");
    } catch (err) {
      // ignore errors
    } finally {
      localStorage.removeItem("user");
      // redirect to root
      navigate("/");
    }
  };

  return (
    <div className="fd-wrapper">
      {/* Top navbar (now contains the navigation) */}
      <header className="fd-navbar">
        <div className="nav-left">
          <div className="brand">AgroLogiX</div>

          <nav className="nav-items">
            <button
              className={`nav-btn ${
                activeSection === "overview" ? "active" : ""
              }`}
              onClick={() => setActiveSection("overview")}
            >
              <span className="nav-ico">🏠</span> Dashboard
            </button>
            <button
              className={`nav-btn ${
                activeSection === "transactions" ? "active" : ""
              }`}
              onClick={() => setActiveSection("transactions")}
            >
              <span className="nav-ico">💼</span> Transactions
            </button>
            <button
              className={`nav-btn ${
                activeSection === "history" ? "active" : ""
              }`}
              onClick={() => setActiveSection("history")}
            >
              <span className="nav-ico">📚</span> History
            </button>
            <button
              className={`nav-btn ${
                activeSection === "profile" ? "active" : ""
              }`}
              onClick={() => setActiveSection("profile")}
            >
              <span className="nav-ico">👤</span> Profile
            </button>
          </nav>
        </div>

        <div className="nav-right">
          {/* profile icon + menu (rightmost) */}
          <div className="profile-area">
            <button
              className="profile-circle"
              onClick={() => setProfileMenuOpen((p) => !p)}
              title={`${profile?.firstName ?? "User"}`}
            >
              {(profile?.firstName || "T").charAt(0).toUpperCase()}
            </button>
            {profileMenuOpen && (
              <div className="profile-menu">
                <button
                  className="profile-menu-item"
                  onClick={() => {
                    setActiveSection("profile");
                    setProfileMenuOpen(false);
                  }}
                >
                  Profile
                </button>
                <button
                  className="profile-menu-item logout"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* top welcome + banner */}
      <div className="fd-welcome">
        <div>
          <div className="welcome-text">Welcome back,</div>
          <div className="welcome-name">
            {profile?.firstName} {profile?.lastName}
          </div>
        </div>
        {errorBanner && <div className="error-banner">{errorBanner}</div>}
      </div>

      {/* main content area */}
      <main className="fd-main">
        {/* OVerview / Dashboard */}
        {activeSection === "overview" && (
          <>
            <section className="stats-row">
              <div className="stat-card">
                <div className="stat-top">
                  <div className="stat-label">Total Requests</div>
                  <div className="stat-icon">📦</div>
                </div>
                <div className="stat-value">
                  {loadingDashboard ? "—" : dashboardData.totalRequests}
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-top">
                  <div className="stat-label">Pending</div>
                  <div className="stat-icon">⏳</div>
                </div>
                <div className="stat-value">
                  {loadingDashboard ? "—" : dashboardData.pending}
                </div>
                <div className="stat-sub"></div>
              </div>
              <div className="stat-card">
                <div className="stat-top">
                  <div className="stat-label">Completed</div>
                  <div className="stat-icon">✅</div>
                </div>
                <div className="stat-value">
                  {loadingDashboard ? "—" : dashboardData.completed}
                </div>
                <div className="stat-sub"></div>
              </div>
              <div className="stat-card">
                <div className="stat-top">
                  <div className="stat-label">Earnings</div>
                  <div className="stat-icon">💰</div>
                </div>
                <div className="stat-value">
                  {loadingDashboard ? "—" : dashboardData.earnings}
                </div>
                <div className="stat-sub"></div>
              </div>
            </section>

            <section className="main-grid">
              {/* Vehicles panel */}
              <div className="vehicles-panel">
                <div className="vehicles-header">
                  <h3>Available Vehicles</h3>
                  <div className="vehicles-search-inline">
                    <input
                      placeholder="From (location)"
                      value={searchFrom}
                      onChange={(e) => setSearchFrom(e.target.value)}
                    />
                    <input
                      placeholder="To (location)"
                      value={searchTo}
                      onChange={(e) => setSearchTo(e.target.value)}
                    />
                    <button className="find-btn" onClick={handleFindVehicles}>
                      {loadingVehicles ? "Searching..." : "Find Vehicles"}
                    </button>
                  </div>
                </div>

                <div className="vehicle-grid">
                  {vehicles.length === 0 ? (
                    <div className="no-vehicles">No vehicles available.</div>
                  ) : (
                    vehicles.map((v) => (
                      <div
                        className="vehicle-card"
                        key={v.id || v.type + Math.random()}
                      >
                        <div className="vehicle-title">
                          🚚 {v.type}{" "}
                          <span className="vehicle-rating">
                            ⭐ {v.rating ?? "—"}
                          </span>
                        </div>
                        <div className="vehicle-meta">
                          <div>Price: ₹{v.pricePerKm}/km</div>
                          <div>Capacity: {v.capacity}</div>
                        </div>
                        <div className="vehicle-provider">
                          Provider: {v.provider ?? "Unknown"}
                        </div>
                        <div className="vehicle-actions">
                          <button
                            className="details-btn"
                            onClick={() => alert(JSON.stringify(v, null, 2))}
                          >
                            Details
                          </button>
                          <button
                            className="book-cta"
                            onClick={() => openBookingModalWithVehicle(v)}
                          >
                            Book
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Right panel: Live Tracking (includes the tracking search input now) */}
              <aside className="right-panel">
                <div className="live-track card">
                  <h4>Live Tracking</h4>
                  <div className="tracking-inline">
                    <input
                      placeholder="Enter tracking ID..."
                      value={trackingSearch}
                      onChange={(e) => setTrackingSearch(e.target.value)}
                    />
                    <button
                      className="small-find"
                      onClick={handleTrackingSearch}
                    >
                      🔎
                    </button>
                  </div>

                  {!liveTracking ? (
                    <div className="track-empty">
                      Search a tracking ID above to view tracking.
                    </div>
                  ) : (
                    <div className="track-content">
                      <div>
                        <strong>Tracking:</strong> {liveTracking.tracking}
                      </div>
                      <div>
                        <strong>Vehicle:</strong> {liveTracking.vehicle ?? "—"}
                      </div>
                      <div>
                        <strong>Status:</strong> {liveTracking.status}
                      </div>
                      <div className="track-route">
                        <strong>Route:</strong>
                        <ul>
                          {(liveTracking.route || []).map((p, i) => (
                            <li key={i}>
                              {p.time} — {p.place}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>

                {/* Removed quick-book; keep a small card with a hint or contact if you want */}
                
              </aside>
            </section>

            {/* Recent requests (unchanged) */}
            <section className="requests-table-card">
              <div className="table-header">
                <h3>Recent Requests</h3>
                <div className="table-actions">
                  <button onClick={refreshRequests}>⟳</button>
                </div>
              </div>

              {loadingRequests ? (
                <div className="table-loading">Loading requests…</div>
              ) : requests.length === 0 ? (
                <div className="table-empty">No requests found.</div>
              ) : (
                <div className="requests-table-wrap">
                  <table className="requests-table">
                    <thead>
                      <tr>
                        <th>Tracking</th>
                        <th>Produce</th>
                        <th>Quantity</th>
                        <th>From</th>
                        <th>To</th>
                        <th>Date</th>
                        <th>Vehicle</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.map((r) => (
                        <tr key={r._id}>
                          <td className="mono">{r.tracking || `#${r._id}`}</td>
                          <td>{r.produce}</td>
                          <td>{r.quantity}</td>
                          <td>{r.from}</td>
                          <td>{r.to}</td>
                          <td>{r.date}</td>
                          <td>{r.vehicle || "-"}</td>
                          <td>
                            <span
                              className={`status-chip ${r.status.toLowerCase()}`}
                            >
                              {r.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}

        {/* TRANSACTIONS */}
        {activeSection === "transactions" && (
          <section className="card-section">
            <h2>Transactions</h2>
            {loadingTransactions ? (
              <div>Loading transactions…</div>
            ) : transactions.length === 0 ? (
              <div>No transactions yet.</div>
            ) : (
              <table className="simple-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Details</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.id}>
                      <td>{tx.date}</td>
                      <td>{tx.desc}</td>
                      <td>{tx.amount}</td>
                      <td>{tx.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        )}

        {/* HISTORY */}
        {activeSection === "history" && (
          <section className="card-section">
            <h2>Booking History</h2>
            <div className="history-wrap">
              {historyList.length === 0 ? (
                <div>No history yet.</div>
              ) : (
                <table className="simple-table">
                  <thead>
                    <tr>
                      <th>Tracking</th>
                      <th>Produce</th>
                      <th>From</th>
                      <th>To</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyList.map((h) => (
                      <tr key={h._id || h.id || Math.random()}>
                        <td>{h.tracking ?? `#${h._id ?? h.id ?? "-"}`}</td>
                        <td>{h.produce ?? h.desc ?? "-"}</td>
                        <td>{h.from ?? "-"}</td>
                        <td>{h.to ?? "-"}</td>
                        <td>{h.date ?? "-"}</td>
                        <td>
                          <span
                            className={`status-chip ${(
                              h.status || ""
                            ).toLowerCase()}`}
                          >
                            {h.status ?? "-"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        )}

        {/* PROFILE */}
        {activeSection === "profile" && (
          <section className="card-section profile-section">
            <h2>Profile</h2>
            {loadingProfile ? (
              <div>Loading profile…</div>
            ) : (
              <div className="profile-card">
                <div className="profile-row">
                  <strong>Name:</strong> {profile.firstName} {profile.lastName}
                </div>
                <div className="profile-row">
                  <strong>User ID:</strong> {profile.userId ?? profile.email}
                </div>
                <div className="profile-row">
                  <strong>Email:</strong> {profile.email}
                </div>
                <div className="profile-row">
                  <strong>Mobile:</strong> {profile.mobile ?? "-"}
                </div>
                <div className="profile-row">
                  <strong>Role:</strong> {profile.role}
                </div>
                <div className="profile-row">
                  <strong>Address:</strong> {profile.address ?? "-"}
                </div>
              </div>
            )}
          </section>
        )}
      </main>

      {/* Book Transport Modal popup (always popup, not a page) */}
      {showModal && (
        <BookTransportModal
          onClose={() => {
            setShowModal(false);
            setPreselectedVehicle(null);
          }}
          refreshRequests={refreshRequests}
          preselectedVehicle={preselectedVehicle}
          bookUrl={BOOK_URL}
        />
      )}
    </div>
  );
}


