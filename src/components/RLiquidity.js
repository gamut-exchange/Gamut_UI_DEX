import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import ChartHome from './ChartHome'
import History from './History';

import Grid from "@mui/material/Grid";
import {
  Button,
  FormControl,
  InputLabel,
  ListItemIcon,
  ListItemText,
  NativeSelect,
  Slider,
  Switch,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import Select from "@mui/material/Select";
import InputBase from "@mui/material/InputBase";
import MenuItem from "@mui/material/MenuItem";
import {
    AddCircleOutline,
  ArrowCircleDown,
  ArrowCircleDownRounded,
  CurrencyBitcoin,
  ForkRight,
  Settings,
} from "@mui/icons-material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import graph from "../images/grap.JPG";
import SwapCmp from "./SwapCmp";
import { useLocation } from "react-router-dom";



const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

// drop down style start
const BootstrapInput = styled(InputBase)(({ theme }) => ({
  "label + &": {
    marginTop: theme.spacing(3),
  },
  "& .MuiInputBase-input": {
    borderRadius: 4,
    position: "relative",
    backgroundColor: "#07071c",
    border: "0px solid #ced4da",
    fontSize: 20,
    textAlign: "start",
    padding: "10px 16px 10px 12px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    "&:focus": {
      borderRadius: 4,
      borderColor: "#80bdff",
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
      color:"white"
    },
  },
  icon: {
    color: "white",
  },
}));

//   drop down style close

export default function RLiquidity() {
  const [darkFontColor, setDarkFontColor] = useState("#FFFFFF");
  const [darkFontColorSec, setDarkFontColorSec] = useState("#13a8ff");
  const [grayColor,setGrayColor]=useState("#6d6d7d");
  const [setting,setSetting]=useState(false);
  const [swSlide,setSwSlide]=useState(true);



  // drop down js start
  const [age, setAge] = React.useState("0");
  const handleChange = (event) => {
    setAge(event.target.value);
  };

  //   Dropdown js close

  const nameUrl = window.location.href

  // const location = useLocation();

  // console.log('pathname', location.pathname);
 

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Grid
        container
        sx={{maxWidth:"1220px"}}
        border={0}
        columnSpacing={{ xs: 0, sm: 0, md: 0, lg: 2 }}
      >
      
      <SwapCmp />



        <Grid item xs={12} sm={12} md={5} sx={{ mt: 2 }} className="home__mainC">
        <Item sx={{ pl: 3, pr: 3,pb:2 }} style={{ backgroundColor: "#12122c",borderRadius: "10px" }} className="home__main">

            <Typography
              variant="h5"
              sx={{ fontWeight: "600", color: "white" }}
              gutterBottom
              style={{ textAlign: "left", margin:"12px 0px" }}

            >
              Remove Liquidity 
            </Typography>

         {/* Drop down Start  */}

         <FormControl
              sx={{ m: 0}}
              style={{ alignItems: "flex-start", display: "inline" }}
              variant="standard"
            >
          

              <div style={{ backgroundColor: "#12122c", marginTop:"24px" }}>
                <Select
                  labelId="demo-customized-select-label"
                  id="demo-customized-select"
                  value={age}
                  onChange={handleChange}
                  input={<BootstrapInput />}
                  style={{ width: "35%", float: "left", border: "0px" }}
                >
                  <MenuItem value={0}></MenuItem>

                  <MenuItem value={0}>
                    {" "}
                    <CurrencyBitcoin
                      sx={{ color: "#fc8416", marginBottom: "-5px" }}
                    />{" "}
                    <span style={{ color: "#FFFFFF", display: "inline" }}>
                      BTC
                    </span>{" "}
                  </MenuItem>
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
                <BootstrapInput
                  id="demo-customized-textbox"
                  type="text"
                  value={0}
                  style={{
                    color: "#FFFFFF",
                    width: "65%",
                    float: "left",
                    borderLeft: "1px solid white",
                    borderRadius: "14px",
                  }}
                />
              </div>

              <div>
                <span style={{ float: "left", color: grayColor }}>
                  Balance: Connect wallet
                </span>

                <span style={{ float: "right", color: grayColor }}>
                  25% 50% 75% 100%
                </span>
              </div>
            
            </FormControl>
            {/* </FormControl> */}

            

            
            <div style={{width:"100%"}}>
     
      <Slider defaultValue={50} aria-label="Default" valueLabelDisplay="auto" />
      </div>
            
        
           {/* Drop down 2 Start  */}

           <FormControl
              sx={{ m: 0}}
              style={{ alignItems: "flex-start", display: "inline" }}
              variant="standard"
            >
          

              <div style={{ backgroundColor: "#12122c", marginTop:"4px" }}>
                <Select
                  labelId="demo-customized-select-label"
                  id="demo-customized-select"
                  value={age}
                  onChange={handleChange}
                  input={<BootstrapInput />}
                  style={{ width: "35%", float: "left", border: "0px" }}
                >
                  <MenuItem value={0}></MenuItem>

                  <MenuItem value={0}>
                    {" "}
                    <CurrencyBitcoin
                      sx={{ color: "#fc8416", marginBottom: "-5px" }}
                    />{" "}
                    <span style={{ color: "#FFFFFF", display: "inline" }}>
                      BTC
                    </span>{" "}
                  </MenuItem>
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
                <BootstrapInput
                  id="demo-customized-textbox"
                  type="text"
                  value={0}
                  style={{
                    color: "#FFFFFF",
                    width: "65%",
                    float: "left",
                    borderLeft: "1px solid white",
                    borderRadius: "14px",
                  }}
                />
              </div>

             
            
            </FormControl>
            {/* </FormControl> */}

<br />
<br />
<br />


            
              {/* Drop down 3 Start  */}
  {/* Drop down Start  */}

  <FormControl
              sx={{ m: 0 }}
              style={{ alignItems: "flex-start", display: "inline" }}
              variant="standard"
            >
            

              <div style={{ backgroundColor: "#12122c" }}>
                <Select
                  labelId="demo-customized-select-label"
                  id="demo-customized-select"
                  value={age}
                  onChange={handleChange}
                  input={<BootstrapInput />}
                  style={{ width: "35%", float: "left", border: "0px" }}
                >
                  <MenuItem value={0}></MenuItem>

                  <MenuItem value={0}>
                    {" "}
                    <CurrencyBitcoin
                      sx={{ color: "#fc8416", marginBottom: "-5px" }}
                    />{" "}
                    <span style={{ color: "#FFFFFF", display: "inline" }}>
                      BTC
                    </span>{" "}
                  </MenuItem>
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
                <BootstrapInput
                  id="demo-customized-textbox"
                  type="text"
                  value={0}
                  style={{
                    color: "#FFFFFF",
                    width: "65%",
                    float: "left",
                    borderLeft: "1px solid white",
                    borderRadius: "14px",
                  }}
                />
              </div>
              <br />
        

            
            </FormControl>

{swSlide?
            <div style={{width:"100%",marginTop: "40px"}}>
     
     <Slider defaultValue={50} aria-label="Default" valueLabelDisplay="auto" />
     </div>
:""}
            <div style={{ color: "white",display:"block",textAlign:"left", marginTop:"9px",marginBottom:"12px" }}>
                <InfoOutlinedIcon
                  style={{
                    fontSize: "18px",
                    paddingTop: "3px",
                    marginBottom: "-3px",
                  }}
                />{" "}
                Pool Compoositon 50% BTC + 50% ETH
                <span onClick={()=>setSetting(!setting)} style={{ color: "white",float:"right", cursor:"pointer"}}>
                  <Settings />
                </span>
              </div>

            {
            setting?
         
                 <div>

<div className="s" sx={{width:"100%"}}>
                <span style={{ float: "left", color: grayColor }}>
                Add custom Proportion:
                </span>

                <span onClick={()=>setSwSlide(!swSlide)} style={{ float: "right", color: grayColor, marginTop:"-7px", marginRight:"-7xpx",paddingRight:"0px"}}>
               <Switch  defaultChecked style={{paddingRight: "0px"}}/>
                </span>
              </div>
              <br />

                  <div className="s" sx={{width:"100%"}} style={{marginTop: "18px"}}>
                <span style={{ float: "left", color: grayColor }}>
                Max Slippage:
                </span>

                <span style={{ float: "right", color: grayColor }}>
                0.1 &nbsp; 0.25 &nbsp; 0.5 &nbsp;&nbsp; custom
                </span>
              </div>
<br />
              <div style={{marginTop:"7px"}}>
                <span style={{ float: "left", color: grayColor }}>
                Time Deadline:
                </span>

                <span style={{ float: "right", color: grayColor }}>
                30sec &nbsp; 1min &nbsp; 2min &nbsp; custom
                </span>
              </div>
              <br />

<hr style={{border:"1px solid #6d6d7d"}} />
<br />

              </div>
           
          // </Item>
:null
}


           
<div style={{textAlign:"left"}}>
            <span style={{ textAlign: "start", color: "white" }}>
              Price Impact:
            </span>

            <div style={{ float: "right", display: "inline" }}>
              <span style={{ textAlign: "right", color: "white" }}>0%</span>
            </div>

            <div>
              <span style={{ textAlign: "start", color: "white" }}>
                Expected Output:
              </span>

              <div style={{ float: "right", display: "inline" }}>
                <span style={{ textAlign: "right", color: "white" }}>0</span>
              </div>
            </div>

            <div>
              <span style={{ textAlign: "start", color: "white" }}>
                Minimum Output after Slippage:
              </span>

              <div style={{ float: "right", display: "inline" }}>
                <span style={{ textAlign: "right", color: "white" }}>0</span>
              </div>
            </div>
            <Button
              size="large"
              variant="contained"
              sx={{ width: "100%", padding: 2, fontWeight: "bold", mt: 2 }}
              style={{
                background:
                  "linear-gradient(to right bottom, #13a8ff, #0074f0)",
                textAlign: "center",
              }}
            >
              withdraw
            </Button>
            </div>
          </Item>
        </Grid>

        <Grid item xs={12} sm={12} md={7} sx={{ mt: 2}} className="chart__main">
        <Item sx={{ pl: 3, pr: 3,pb:2,mb:4 }} style={{ backgroundColor: "#12122c",borderRadius: "10px" }} className="chart">
              <ChartHome  />
              {/* <img src={graph} style={{ maxWidth: "100%" }} /> */}
          </Item>

          <History />
        </Grid>
      </Grid>
    </div>
  );
}
