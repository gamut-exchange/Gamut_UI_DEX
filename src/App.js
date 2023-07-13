import './App.css';
import "./style/global.css";
import Header from './components/views/Parts/Header';
import Swap from './components/views/Swap/Swap';
import Ramp from './components/views/Swap/Ramp';
import CrossChain from './components/views/Swap/CrossChain';
import Footer from './components/views/Parts/Footer';
import CLiquidity from './components/views/Liquidity/CLiquidity';
import Liquidity from './components/views/Liquidity/Liquidity';
import RLiquidity from './components/views/Liquidity/RLiquidity';
import PDashboard from './components/views/Dashboard/PlatformDashboard';
import UDashboard from './components/views/Dashboard/UserDashboard';
import StakingPool from './components/views/Earn/StakingPool';
import NftStaking from './components/views/GamutNFT/NftStaking';
import { HashRouter, Route, Routes } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from 'react';
import { TOKEN_LIST } from './redux/constants';
import { tokenList } from './config/constants';

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({
      type: TOKEN_LIST,
      payload: tokenList,
    });
  }, [dispatch])

  return (
    <div className='Dark__Theme' style={{ minHeight: "100vh", padding: "4px" }}>
      <HashRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Swap />} />
          <Route path="/ramp" element={<Ramp />} />
          <Route path="/cross_chain" element={<CrossChain />} />
          <Route path="/add_liquidity" element={<Liquidity />} />
          <Route path="/create_liquidity" element={<CLiquidity />} />
          <Route path="/remove_liquidity" element={<RLiquidity />} />
          <Route path="/platform_dashboard" element={<PDashboard />} />
          <Route path="/user_dashboard" element={<UDashboard />} />
          <Route path="/staking_pool" element={<StakingPool />} />
          <Route path="/nft_staking" element={<NftStaking />} />
        </Routes>
        <Footer />
      </HashRouter>
    </div>
  );
}

export default App;
