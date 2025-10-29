import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from "./components/Dashboard";
import SignUp from './components/SignUp';
import Login from './components/Login';
import FarmerDashboard from "./components/FarmerDashboard";
import ProviderDashboard from "./components/ProviderDashboard";
import ProviderProfile from "./components/ProviderProfile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/Signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/farmer" element={<FarmerDashboard />} />
        <Route path="/provider" element={<ProviderDashboard />} />
        <Route path="/provider-profile" element={<ProviderProfile />} />
      </Routes>
    </Router>
  );
}

export default App;

