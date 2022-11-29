import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import './Navigation.css'
import { Link } from "react-router-dom";

function Navigation(props) {
  const [menuColor, setMenuColor] = React.useState("#13a8ff");
  const [active, setActive] = useState("home");

  return (
    <Box
      sx={{ display: "flex", alignItems: "flex-start", pt: 1, mb: 3, mt: 1 }}
      style={{ width: "100%" }}
      className="Menu__Mobile"
    >
      <AppBar
        component="nav"
        style={{ position: "relative" }}
        sx={{
          display: "flex",
          alignItems: "flex-start",
          backgroundColor: "transparent",
          width: "100%"
        }}
      >
        <Toolbar style={{padding: "0px", marginLeft:"10px"}}>
          <Box sx={{ display: { xs: "none", sm: "none", md: "block", lg: "block" } }}>
            {/* {navItems.map((item) => ( */}
            <Link to="/" style={{ textDecoration: "none" }}>
              <Button
                // key={item}
                sx={{ color: active == "home" ? menuColor : "white", pr: 5 }}
                style={{ fontSize: 20, fontWeight: "600", padding: "6px 20px" }}
                onClick={() => setActive("home")}
              >
                {/* {item} */}
                Home
              </Button>
            </Link>

            <Button
              // key={item}
              sx={{ color: active == "about" ? menuColor : "white", pr: 5 }}
              style={{ fontSize: 20, fontWeight: "600", padding: "6px 20px"  }}
              onClick={() => setActive("about")}
            // {3==3?style={color:"red"}:""}
            >
              {/* {item} */}
              About Us
            </Button>


            <Button
              // key={item}
              sx={{ color: active == "contact" ? menuColor : "white", pr: 5 }}
              style={{ fontSize: 20, fontWeight: "600", padding: "6px 20px"  }}
              onClick={() => setActive("contact")}
            >
              {/* {item} */}
              Contact Us
            </Button>

            <Link to="/add_liquidity" style={{ textDecoration: "none" }}>
              <Button
                // key={item}
                sx={{ color: active == "liquidity" ? menuColor : "white", pr: 5 }}
                style={{ fontSize: 20, fontWeight: "600", padding: "6px 20px"  }}
                onClick={() => setActive("liquidity")}
              >
                {/* {item} */}
                Liquidity
              </Button>
            </Link>
            {/* ))} */}
          </Box>
        </Toolbar>
      </AppBar>
      {/* <Box component="main" sx={{ p: 1 }}>
        <Toolbar />
      </Box> */}
    </Box>
  );
}

export default Navigation;
