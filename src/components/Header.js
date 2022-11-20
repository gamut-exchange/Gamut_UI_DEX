import {
  Grid,
  container,
  styled,
  box,
  Paper,
  Button,
  AppBar,
  Container,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Avator,
  Hidden,
} from "@mui/material";
import AdbIcon from "@mui/icons-material/Adb";
import Avatar from "@mui/material/Avatar";
import { Stack } from "@mui/system";
import React, { useState } from "react";
import logo from "../images/logo.svg";

import { createTheme } from "@mui/material/styles";
import { purple } from "@mui/material/colors";
import { MenuBook } from "@mui/icons-material";
import Navigation from "./Navigation";

function Header() {
  const [darkFontColor, setDarkFontColor] = useState("#FFFFFF");
  const [darkFontColorSec, setDarkFontColorSec] = useState("#13a8ff");

  const theme = createTheme({
    palette: {
      primary: {
        main: "#07071c",
      },
      secondary: {
        main: "#12a5fe",
      },
    },
  });

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));
  return (
    <div className="s" style={{ display: "flex", justifyContent: "center" }}>
      {/* <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}> */}

      {/* Header Start  */}
      <Grid
        container
        maxWidth="lg"
        columnSpacing={{ xs: 0, sm: 0, md: 0}}
        sx={{ pb: 1 }}
        className="header"
      >
        {/* Logo Grid */}
        <Grid
          item
          xs={5}
          sm={12}
          md={6}
          lg={6}
          sx={{ display: "flex", justifyContent: "flex-start" }}
        >
          <Item
            elevation={1}
            style={{ backgroundColor: "transparent", color: darkFontColor }}
          >
            <img
              src={logo}
              width="150px"
              alt="Logo"
              style={{ marginTop: "1.1rem" }}
            />
          </Item>
        </Grid>

        {/* Logo Right Side Grid  */}
        <Grid
          item
          xs={5}
          md={6}
          lg={6}
          sx={{ display: "flex", justifyContent: "flex-end" }}
          
        >
          <Item
            elevation={1}
            style={{ backgroundColor: "transparent", color: darkFontColor }}
          >
            <Stack spacing={2} direction="row">
            <Hidden only="xs">
              <Button
                size="large"
                variant="outlined"
                sx={{
                  width: "45%",
                  padding: 2,
                  fontWeight: "bold",
                  border: 2,
                  color: darkFontColorSec,
                }}
                style={{ marginLeft: " 2px" }}
              >
                Network
              </Button>
              
              <Button
                size="large"
                color="primary"
                variant="contained"
                sx={{ width: 200, padding: 2, fontWeight: "bold" }}
                style={{
                  background:
                    "linear-gradient(to right bottom, #13a8ff, #0074f0)",
                }}
              >
                CONNECT WALLET
              </Button>
              </Hidden>

              <Hidden smUp="true">
              <Button
                size="large"
                variant="outlined"
                sx={{
                  width: "100%",
                  padding: 2,
                  fontWeight: "bold",
                  border: 2,
                  color: darkFontColorSec,
                }}
                style={{ marginLeft: " 2px" }}
              >
                Network
              </Button>
              </Hidden>
            </Stack>
          </Item>
        </Grid>

{/* Mobile menu  */}
<Hidden smUp="true">
        <Grid  item
          xs={2}
          md={6}
          lg={6}
          sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Navigation />
       
        </Grid>
        </Hidden>  
        {/* Header Section 1 End  */}

        {/* APP bar start  main menu*/}
<Hidden smDown="true">
        <Navigation />
        </Hidden>
        {/* App Bar closed */}
      </Grid>
    </div>
  );
}

export default Header;
