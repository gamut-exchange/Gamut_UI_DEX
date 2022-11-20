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
  // const router = createBrowserRouter([
  //   {
  //     path: "/",
  //     element: <Home />,
  //   },
  //   {
  //     path: "/Liquidity",
  //     element: <Liquidty />,
  //   },
  //   {
  //     path: "/RLiquidity",
  //     element: <RLiquidity />,
  //   },
  //   {
  //     path: "/CLiquidity",
  //     element: <CLiquidity />,
  //   },
    
  // ]);

  const [bgColor,setBgColor]=useState("#07071c");
  
  return (
  
        <div className='Dark__Theme'>

          
      <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Liquidty" element={<Liquidty />} />
        <Route path="/CLiquidity" element={<CLiquidity />} />
        <Route path="/RLiquidity" element={<RLiquidity />} />


     </Routes>

    {/* <ChartHome  /> */}
      {/* <Home /> */}
      {/* <CLiquidity /> */}
      {/* <Liquidty /> */}
      {/* <RLiquidity /> */}
      {/* <RouterProvider router={router} /> */}
     {/* <Test /> */}
    <Footer />
    {/* <Slider /> */}
    {/* <h2>sdkfjslk</h2> */}
    </BrowserRouter>

    </div>
  );
}

export default App;
