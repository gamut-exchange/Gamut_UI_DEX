import './App.css';
import "./style/global.css";
import Header from './components/views/Header';
import Swap from './components/views/Swap';
import Footer from './components/views/Footer';
import CLiquidity from './components/views/CLiquidity';
import Liquidity from './components/views/Liquidity';
import RLiquidity from './components/views/RLiquidity';
import {BrowserRouter, Route, Routes } from "react-router-dom";


function App() {
  return (
    <div className='Dark__Theme' style={{minHeight:"100vh", padding:"4px"}}>
      <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Swap />} />
        <Route path="/add_liquidity" element={<Liquidity />} />
        <Route path="/create_liquidity" element={<CLiquidity />} />
        <Route path="/remove_liquidity" element={<RLiquidity />} />
     </Routes>
      <Footer />
    </BrowserRouter>
    </div>
  );
}

export default App;
