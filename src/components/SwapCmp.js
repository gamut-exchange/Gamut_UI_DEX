import { Button, Grid, Stack,Paper, styled, Hidden } from '@mui/material'
import React, {useState} from 'react'
import { Link, useLocation } from 'react-router-dom';
import "./Navigation.css"

function SwapCmp() {
  const [darkFontColor, setDarkFontColor] = useState("#FFFFFF");
  const [activeSwap,setActiveSwap]=useState("add_liquidity");
  const [activeSwapColor, setActiveSwapColor]=useState("linear-gradient(to right bottom, #13a8ff, #0074f0)");

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: "center",
        color: theme.palette.text.secondary,
      }));


      const location = useLocation();
      if(location.pathname=="/RLiquidity")
{
  console.log('pathname Swap', location.pathname)}
  else{
    console.warn("incorrect =>",location);
  }


  return (
    <>
    
    <Hidden smDown="true">
          <Grid item xs={12} sm={12} md={9} lg={8} >
          <Item
            elevation={1}
            style={{ backgroundColor: "transparent", color: darkFontColor }}
          >
            <Stack spacing={2} direction="row">
           

            <Link to="/Liquidty" style={{textDecoration:"none"}}>
              <Button
                size="large"
              
                variant="contained"
                sx={{
                  width: 200,
                  padding: 2,
                  fontWeight: "bold",
                
                  background:
                  location.pathname=="/Liquidty"?activeSwapColor:"#12122c",
              }}
              onClick={()=>setActiveSwapColor("/Liquidty")}
              >
                Add Liquidity
              </Button>
              </Link>

             

              <Link to="/RLiquidity" style={{textDecoration:"none"}}>
              <Button
                size="large"
              
                variant="contained"
                sx={{
                  width: 200,
                  padding: 2,
                  fontWeight: "bold",
                  
                  background:
                  location.pathname=="/RLiquidity"?activeSwapColor:"#12122c",
              }}
              onClick={()=>setActiveSwapColor("/RLiquidity")}
              >
                REMOVE LIQUIDTY
              </Button>
              </Link>

              <Link to="/CLiquidity" style={{textDecoration:"none"}}>
              <Button
                size="large"
                variant="contained"
                sx={{ width: 200, padding: 2, fontWeight: "bold" }}
                style={{
                  background:
                  location.pathname=="/CLiquidity"?activeSwapColor:"#12122c",
                }}
                onClick={()=>setActiveSwapColor("/CLiquidtiy")}

              >
                Pool Factory 
              </Button>
              </Link>

             
            </Stack>
          </Item>
        </Grid>

        </Hidden>

<Hidden  smUp="true">
        <Grid sx={{ overflowX: 'scroll' }} item xs={12} sm={12} md={9} lg={8} >
          <Item
            elevation={1}
            
            style={{ backgroundColor: "transparent", color: darkFontColor }} className="swap_b"
          >
            <Stack spacing={2} direction="row" className="swap_b" >
           

            <Link to="/Liquidty" style={{textDecoration:"none"}}>
              <Button
                size="large"
              
                variant="contained"
                sx={{
                  width: 200,
                  padding: 2,
                  fontWeight: "bold",
                
                  background:
                  location.pathname=="/Liquidty"?activeSwapColor:"#12122c",
              }}
              onClick={()=>setActiveSwapColor("/Liquidty")}
              >
                Add Liquidity
              </Button>
              </Link>

             

              <Link to="/RLiquidity" style={{textDecoration:"none"}}>
              <Button
                size="large"
              
                variant="contained"
                sx={{
                  width: 200,
                  padding: 2,
                  fontWeight: "bold",
                  
                  background:
                  location.pathname=="/RLiquidity"?activeSwapColor:"#12122c",
              }}
              onClick={()=>setActiveSwapColor("/RLiquidity")}
              >
                REMOVE LIQUIDTY
              </Button>
              </Link>

              <Link to="/CLiquidity" style={{textDecoration:"none"}}>
              <Button
                size="large"
                variant="contained"
                sx={{ width: 200, padding: 2, fontWeight: "bold" }}
                style={{
                  background:
                  location.pathname=="/CLiquidity"?activeSwapColor:"#12122c",
                }}
                onClick={()=>setActiveSwapColor("/CLiquidtiy")}

              >
                Pool Factory 
              </Button>
              </Link>

             
            </Stack>
          </Item>
        </Grid>
        </Hidden>

        <Grid item xs={12} md={3} lg={4}>
          {/* <Item>xs=4</Item> */}
        </Grid> 
        
    </>
  )
}

export default SwapCmp