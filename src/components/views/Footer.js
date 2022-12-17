import { Facebook, Instagram, Twitter } from '@mui/icons-material';
import { Grid, Paper, styled } from '@mui/material'
import React from 'react'
import logo from "../../images/logo.svg";


function Footer() {
    const backgroundColor = "#12122c";
    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: "center",
        color: theme.palette.text.secondary,
      }));
  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "30px" }} >
        <Grid container  sx={{maxWidth: "1205px",backgroundColor: backgroundColor}} spacing={2} id="footer">
  <Grid item xs={12} md={4}>
    <Item  style={{ backgroundColor: "transparent"}}> <img
              src={logo}
              width="150px"
              alt="Logo"
              style={{ marginBottom: "1.1rem", marginTop: "-0.5rem" }}
            /></Item>
  </Grid>
  <Grid item xs={8} md={4}>
  <Item  style={{ backgroundColor: "transparent", color: "white"}}  elevation={0}>
  &copy; 2022 All rights reserved
    </Item>
  </Grid>
  <Grid item xs={4} md={4}>
  <Item  style={{ backgroundColor: "transparent", color: "white"}}  elevation={0}>
      <Twitter style={{ marginRight:"10px" }} />
      <Instagram />
      <Facebook style={{ marginLeft:"10px" }} />
      </Item>
  </Grid>
 
</Grid>
    </div>
  )
}

export default Footer
