import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from "./components/Dashboard";
import SignUp from './components/SignUp';
import Login from './components/Login';
import FarmerDashboard from "./components/FarmerDashboard";
import ProviderDashboard from "./components/ProviderDashboard";
import FarmerProfile from "./components/FarmerProfile";
import FarmerHelpSupport from "./components/FarmerHelpSupport";
import FarmerHistory from "./components/FarmerHistory";
import ProviderHistory from "./components/ProviderHistory";
import ProviderHelpSupport from "./components/ProviderHelpSupport";
import ProviderVehicle from "./components/ProviderVehicle";
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
        <Route path="/farmer-profile" element={<FarmerProfile />} />
        <Route path="/farmer-help" element={<FarmerHelpSupport/>}/>
        <Route path="/farmer-history" element={<FarmerHistory />} />
        <Route path="/provider-history" element={<ProviderHistory/>}/>
        <Route path="/provider-help" element={<ProviderHelpSupport/>}/>
        <Route path="/provider-vehicle" element={<ProviderVehicle/>}/>
        <Route path="/provider-profile" element={<ProviderProfile/>}/>


        
      </Routes>
    </Router>
  );
}

export default App;

