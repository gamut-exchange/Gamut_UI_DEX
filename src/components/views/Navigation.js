import React, { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
// import Button from "@mui/material/Button";
import "./Navigation.css";
import { Link, useLocation } from "react-router-dom";

function Navigation() {
  // const menuColor = "#13a8ff";
  const [active, setActive] = useState("home");

  const location = useLocation();
  useEffect(() => {
    if (
      location.pathname === "/add_liquidity" ||
      location.pathname === "/remove_liquidity" ||
      location.pathname === "/create_liquidity"
    )
      setActive("liquidity");
    else if (location.pathname === "/about") setActive("about");
    else if (location.pathname === "/contact") setActive("contact");
    else if (location.pathname === "/platform_dashboard")
      setActive("platform_dashboard");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box
      sx={{ display: "flex", alignItems: "flex-start", pt: 1, mb: 0, mt: 1 }}
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
          boxShadow: "0px 0px 0px 0px",
          margin: 0,
        }}
      >
        <Toolbar style={{ padding: "0px", marginLeft: "10px" }}>
          <Box
            sx={{
              display: { xs: "none", sm: "none", md: "block", lg: "block" },
            }}
            style={{ margin: 0 }}
          >
            <Link to="/" style={{ textDecoration: "none" }}>
              <button
                className={`text-22 uppercase font-semibold border-blue-400 py-4 px-10 ${
                  active === "home"
                    ? "border-b-2 text-blue-400"
                    : "border-0 text-white"
                }`}
                onClick={() => setActive("home")}
              >
                Swap
              </button>
            </Link>
            <Link to="/add_liquidity" style={{ textDecoration: "none" }}>
              <button
                className={`text-22 uppercase font-semibold border-blue-400 py-4 px-5 ${
                  active === "liquidity"
                    ? "border-b-2 text-blue-400"
                    : "border-0 text-white"
                }`}
                onClick={() => setActive("liquidity")}
              >
                liquidity
              </button>
            </Link>
            <Link to="/platform_dashboard" style={{ textDecoration: "none" }}>
              <button
                className={`text-22 uppercase font-semibold border-blue-400 py-4 px-5 ${
                  active === "platform_dashboard"
                    ? "border-b-2 text-blue-400"
                    : "border-0 text-white"
                }`}
                onClick={() => setActive("platform_dashboard")}
              >
                Dashboard
              </button>
            </Link>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Navigation;
