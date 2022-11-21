import logo from './logo.svg';
import './App.css';
// import Test from './components/Test';
import { useState } from 'react';
import Header from './components/Header';
import Home from './components/Home';
import ChartHome from './components/ChartHome'
import Footer from './components/Footer';
import CLiquidity from './components/CLiquidity';
import Liquidty from './components/Liquidty';
import RLiquidity from './components/RLiquidity';
import {BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import Slider from './components/Slider';


function App() {

  const [bgColor,setBgColor]=useState("#07071c");
  return (
    <div className='Dark__Theme'>
      <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/liquidty" element={<Liquidty />} />
        <Route path="/create_liquidity" element={<CLiquidity />} />
        <Route path="/remove_liquidity" element={<RLiquidity />} />
     </Routes>
      <Footer />
    </BrowserRouter>
    </div>
  );
}

export default App;
