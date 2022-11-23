import './App.css';
import { useState } from 'react';
import "./style/global.css";
import Header from './components/views/Header';
import Swap from './components/views/Swap';
import Footer from './components/views/Footer';
import CLiquidity from './components/views/CLiquidity';
import Liquidity from './components/views/Liquidity';
import RLiquidity from './components/views/RLiquidity';
import {BrowserRouter, Route, Routes } from "react-router-dom";


function App() {

  const [bgColor,setBgColor]=useState("#07071c");
  return (
    <div className='Dark__Theme'>
      <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Swap />} />
        <Route path="/liquidity" element={<Liquidity />} />
        <Route path="/liquidity/create" element={<CLiquidity />} />
        <Route path="/liquidity/remove" element={<RLiquidity />} />
     </Routes>
      <Footer />
    </BrowserRouter>
    </div>
  );
}

export default App;
