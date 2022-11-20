import React,{useState} from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import './Navigation.css'
import { Link, useParams, useLocation } from "react-router-dom";



const drawerWidth = 240;
const navItems = ["Home", "About", "Contact"];

function Navigation(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [menuColor,setMenuColor] = React.useState("#13a8ff");
  const [active,setActive]=useState("home");

  console.warn("active = ",active);

  // const params = useParams();
  // console.log("URL = ",params);
  // console.log('current Pathname 👉️', window.location.pathname);
  // console.log('pathname', location.pathname);


  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Gamut
      </Typography>
      <Divider />
      <List>
       
       <Link to="/" style={{textDecoration:"none", color:"black"}}>
          <ListItem  disablePadding>
            <ListItemButton sx={{ textAlign: "center" }}>
              <ListItemText primary={"Home"} />
            </ListItemButton>
          </ListItem>
          </Link>

      <Link to="#" style={{textDecoration:"none", color:"black"}}>
          <ListItem  disablePadding>
            <ListItemButton sx={{ textAlign: "center" }}>
              <ListItemText primary={"About Us"} />
            </ListItemButton>
          </ListItem>
          </Link>

          <Link to="#" style={{textDecoration:"none", color:"black"}}>
          <ListItem  disablePadding>
            <ListItemButton sx={{ textAlign: "center" }}>
              <ListItemText primary={"Contact Us"} />
            </ListItemButton>
          </ListItem>
          </Link>

          <Link to="/Liquidty" style={{textDecoration:"none", color:"black"}}>
          <ListItem  disablePadding>
            <ListItemButton sx={{ textAlign: "center" }}>
              <ListItemText primary={"Liquidity"} />
            </ListItemButton>
          </ListItem>
          </Link>

          <Link to="/CLiquidty" style={{textDecoration:"none", color:"black"}}>
          <ListItem  disablePadding>
            <ListItemButton sx={{ textAlign: "center" }}>
              <ListItemText primary={"Connect Wallet"} />
            </ListItemButton>
          </ListItem>
          </Link>
        
      
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
   
      <Box
      sx={{ display: "flex", alignItems: "flex-start", pt: 1, mb: 3, mt: 1 }}
    style={{width:"100%"}}
      className="Menu__Mobile"
    >
     
    
      <AppBar
        component="nav"
        style={{ position: "relative" }}
        sx={{
          display: "flex",
          alignItems: "flex-start",
          backgroundColor: "transparent",
          width:"100%"
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ display: { xs: "none", sm: "none", md: "block", lg: "block" } }}>
            {/* {navItems.map((item) => ( */}
            <Link to="/" style={{textDecoration:"none"}}>
              <Button
                // key={item}
                sx={{ color: active=="home"?menuColor:"white", pr: 5 }}
                style={{ fontSize: 20, fontWeight: "600" }}
                onClick={()=>setActive("home")}
              >
                {/* {item} */}
                Home
              </Button>
              </Link>
              
              <Button
                // key={item}
                sx={{ color: active=="about"?menuColor:"white", pr: 5 }}
                style={{ fontSize: 20, fontWeight: "600" }}
                onClick={()=>setActive("about")}
                // {3==3?style={color:"red"}:""}
              >
                {/* {item} */}
                About Us
              </Button>


              <Button
                // key={item}
                sx={{ color: active=="contact"?menuColor:"white", pr: 5 }}
                style={{ fontSize: 20, fontWeight: "600" }}
                onClick={()=>setActive("contact")}
              >
                {/* {item} */}
                Contact Us
              </Button>

<Link to="/Liquidty" style={{textDecoration:"none"}}>
              <Button
                // key={item}
                sx={{ color: active=="liquidty"?menuColor:"white", pr: 5 }}
                style={{ fontSize: 20, fontWeight: "600" }}
                onClick={()=>setActive("liquidty")}
              >
                {/* {item} */}
                Liquidty
              </Button>
              </Link>
            {/* ))} */}
          </Box>
        </Toolbar>
      </AppBar>

      
      <Box component="nav">
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "block", md: "none",lg: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: "100%",
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box component="main" sx={{ p: 1 }}>
        <Toolbar />
      </Box>
    </Box>
    
  );
}

export default Navigation;
