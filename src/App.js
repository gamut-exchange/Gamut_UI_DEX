import './App.css';
import "./style/global.css";
import Header from './components/views/Header';
import Swap from './components/views/Swap';
import Footer from './components/views/Footer';
import CLiquidity from './components/views/CLiquidity';
import Liquidity from './components/views/Liquidity';
import RLiquidity from './components/views/RLiquidity';
import PDashboard from './components/views/PlatformDashboard';
import UDashboard from './components/views/UserDashboard';
import StakingPool from './components/views/StakingPool';
import {HashRouter, Route, Routes } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { TOKEN_LIST } from './redux/constants';
import { tokenListLink } from './config/constants';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    fetch(tokenListLink).then(response => response.json()).then(data => {
      dispatch({
        type: TOKEN_LIST,
        payload: data,
      });
    })
  }, [dispatch])

  return (
    <div className='Dark__Theme' style={{minHeight:"100vh", padding:"4px"}}>
      <HashRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Swap />} />
        <Route path="/add_liquidity" element={<Liquidity />} />
        <Route path="/create_liquidity" element={<CLiquidity />} />
        <Route path="/remove_liquidity" element={<RLiquidity />} />
        <Route path="/platform_dashboard" element={<PDashboard />} />
        <Route path="/user_dashboard" element={<UDashboard />} />
        <Route path="/staking_pool" element={<StakingPool />} />
      </Routes>
      <Footer />
    </HashRouter>
    </div>
  );
}

export default App;
