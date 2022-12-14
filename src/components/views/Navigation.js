import React, { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import './Navigation.css'
import { Link, useLocation } from "react-router-dom";

function Navigation() {
  const menuColor = "#13a8ff";
  const [active, setActive] = useState("home");

  const location = useLocation();
  useEffect(() => {
    if (location.pathname === "/add_liquidity" || location.pathname === "/remove_liquidity" || location.pathname === "/create_liquidity")
      setActive('liquidity');
    else if (location.pathname === "/about")
      setActive('about');
    else if (location.pathname === "/contact")
      setActive('contact');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          width: "100%",
          boxShadow: "0px 0px 0px 0px"
        }}
      >
        <Toolbar style={{ padding: "0px", marginLeft: "10px" }}>
          <Box sx={{ display: { xs: "none", sm: "none", md: "block", lg: "block" } }}>
            {/* {navItems.map((item) => ( */}
            <Link to="/" style={{ textDecoration: "none" }}>
              <Button
                // key={item}
                sx={{ color: active === "home" ? menuColor : "white", pr: 5 }}
                style={{ fontSize: 20, fontWeight: "600", padding: "6px 20px" }}
                onClick={() => setActive("home")}
              >
                {/* {item} */}
                Swap
              </Button>
            </Link>

            {/* <Button
              sx={{ color: active === "about" ? menuColor : "white", pr: 5 }}
              style={{ fontSize: 20, fontWeight: "600", padding: "6px 20px" }}
              onClick={() => setActive("about")}
            >
              About Us
            </Button> */}
            {/* <Button
              sx={{ color: active === "contact" ? menuColor : "white", pr: 5 }}
              style={{ fontSize: 20, fontWeight: "600", padding: "6px 20px" }}
              onClick={() => setActive("contact")}
            >
              Contact Us
            </Button> */}

            <Link to="/add_liquidity" style={{ textDecoration: "none" }}>
              <Button
                // key={item}
                sx={{ color: active === "liquidity" ? menuColor : "white", pr: 5 }}
                style={{ fontSize: 20, fontWeight: "600", padding: "6px 20px" }}
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
