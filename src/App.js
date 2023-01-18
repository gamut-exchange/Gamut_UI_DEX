import './App.css';
import "./style/global.css";
import Header from './components/views/Header';
import Swap from './components/views/Swap';
import Footer from './components/views/Footer';
import CLiquidity from './components/views/CLiquidity';
import Liquidity from './components/views/Liquidity';
import RLiquidity from './components/views/RLiquidity';
import PDashboard from "./components/views/DashboardPlatfrom";
import UDashboard from "./components/views/DashboardUser";
import {HashRouter, Route, Routes } from "react-router-dom";


function App() {
  return (
    <div className="Dark__Theme" style={{ minHeight: "100vh", padding: "4px" }}>
      <HashRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Swap />} />
          <Route path="/platform_dashboard" element={<PDashboard />} />
          <Route path="/user_dashboard" element={<UDashboard />} />
          <Route path="/add_liquidity" element={<Liquidity />} />
          <Route path="/create_liquidity" element={<CLiquidity />} />
          <Route path="/remove_liquidity" element={<RLiquidity />} />
        </Routes>
        <Footer />
      </HashRouter>
    </div>
  );
}

export default App;
