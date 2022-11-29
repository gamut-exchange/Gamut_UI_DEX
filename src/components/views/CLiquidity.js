import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useWeb3React } from "@web3-react/core";
import { styled } from "@mui/material/styles";
import tw from "twin.macro";
import {
  Paper,
  Grid,
  Modal,
  TextField,
  Button,
  FormControl,
  Typography,
  Slider
} from "@mui/material";
import {
  AddCircleOutline,
  CurrencyBitcoin,
} from "@mui/icons-material";
import {
  getPoolAddress,
  createPool
} from "../../config/web3";
import SwapCmp from "./SwapCmp";
import { uniList } from "../../config/constants";
import { contractAddresses } from "../../config/constants";


const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function CLiquidity() {
  const selected_chain = useSelector((state) => state.selectedChain);
  const { account, connector } = useWeb3React();

  const [mopen, setMopen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = React.useState(0);
  const [inToken, setInToken] = useState(uniList[selected_chain][0]);
  const [outToken, setOutToken] = useState(uniList[selected_chain][1]);
  const [filterData, setFilterData] = useState(uniList[selected_chain]);
  const [pairStatus, setPairStatus] = useState(0);
  const [weight, setWeight] = useState(50);

  const dispatch = useDispatch();

  const StyledModal = tw.div`
    flex
    flex-col
    relative
    m-auto
    top-1/4
    p-6
    min-h-min
    transform -translate-x-1/2 -translate-y-1/2
    sm:w-1/3 w-11/12
  `;

  const handleMopen = (val) => {
    setSelected(val);
    setMopen(true);
  };

  const handleClose = () => setMopen(false);

  const handleSlider = (event, newValue) => {
    setWeight(newValue);
  };

  const filterToken = (e) => {
    let search_qr = e.target.value;
    setQuery(search_qr);
    if (search_qr.length != 0) {
      const filterDT = uniList[selected_chain].filter((item) => {
        return item["symbol"].toLowerCase().indexOf(search_qr) != -1;
      });
      setFilterData(filterDT);
    } else {
      setFilterData(uniList[selected_chain]);
    }
  };

  const selectToken = async (token, selected) => {
    handleClose();
    if (selected === 0) {
      setInToken(token);
    } else if (selected === 1) {
      setOutToken(token);
    }
    if (account) {
      const provider = await connector.getProvider();
      if (selected === 0) {
        if (token['address'].toLowerCase() === outToken['address'].toLowerCase())
          setPairStatus(1);
        else {
          try {
            const poolAddr = await getPoolAddress(
              provider,
              token["address"],
              outToken["address"],
              contractAddresses[selected_chain]["hedgeFactory"]
            );
            if (poolAddr === "0x0000000000000000000000000000000000000000")
              setPairStatus(2);
            else
              setPairStatus(0);
          } catch (error) {
            setPairStatus(2);
          }
        }
      } else if (selected === 1) {
        if (token['address'].toLowerCase() === inToken['address'].toLowerCase())
          setPairStatus(1);
        else {
          try {
            const poolAddr = await getPoolAddress(
              provider,
              token["address"],
              inToken["address"],
              contractAddresses[selected_chain]["hedgeFactory"]
            );
            if (poolAddr === "0x0000000000000000000000000000000000000000")
              setPairStatus(2);
            else
              setPairStatus(0);
          } catch (error) {
            setPairStatus(2);
          }
        }
      }
    }
  };

  const executeCreatePool = async () => {
    const provider = await connector.getProvider();
    try {
      await createPool(account, provider, inToken["address"], outToken["address"], weight / 100, 1 - weight / 100, contractAddresses[selected_chain]["hedgeFactory"]);
      setPairStatus(0);
    } catch (e) {
      console.log(e.message);
    }
  }

  const clickConWallet = () => {
    document.getElementById("connect_wallet_btn").click();
  };

  useEffect(() => {
    setFilterData(uniList[selected_chain]);
    selectToken(uniList[selected_chain][0], 0);
    selectToken(uniList[selected_chain][1], 1);
  }, [account, dispatch, selected_chain]);

  return (
    <div style={{ display: "flex", justifyContent: "center", paddingBottom: "30px" }}>
      <Grid
        container
        sx={{ maxWidth: "1220px" }}
        border={0}
        columnSpacing={{ xs: 0, sm: 0, md: 0, lg: 2 }}
      >
        <SwapCmp />

        <Grid item xs={12} sm={12} md={5} sx={{ mt: 10 }} className="home__mainC">
          <Item sx={{ pl: 3, pr: 3, pb: 2 }} style={{ backgroundColor: "#12122c", borderRadius: "10px" }} className="home__main">

            <Typography
              variant="h5"
              sx={{ fontWeight: "600", color: "white" }}
              gutterBottom
              style={{ textAlign: "left", margin: "12px 0px" }}

            >
              Create Pool
            </Typography>

            {/* Drop down Start  */}

            <FormControl
              sx={{ m: 0 }}
              style={{ alignItems: "flex-start", display: "inline" }}
              variant="standard"
            >
              <Button
                style={{ width: "40%", float: "left", border: "0px", padding: "8px", fontSize: "13px", backgroundColor: "#07071c", color: "white" }}
                onClick={() => handleMopen(0)}
                startIcon={
                  <img
                    alt=""
                    src={inToken['logoURL']}
                    className="w-8"
                  />
                }
              >
                {inToken['symbol']}
              </Button>
              <div style={{ padding: "0px", width: "20%", textAlign: "center", display: "inline" }}>
                <AddCircleOutline
                  sx={{ color: "white", marginTop: "4px", fontSize: "32px" }}
                />
              </div>
              <Button
                style={{ width: "40%", float: "right", border: "0px", padding: "8px", fontSize: "13px", backgroundColor: "#07071c", color: "white" }}
                onClick={() => handleMopen(1)}
                startIcon={
                  <img
                    alt=""
                    src={outToken['logoURL']}
                    className="w-8"
                  />
                }
              >
                {outToken['symbol']}
              </Button>
            </FormControl>
            <div style={{ textAlign: "left", marginTop: "27px" }}>
              <span style={{ color: "white" }}>
                Weight: {weight}% ({inToken["symbol"]}) + {100 - weight}% ({outToken["symbol"]})
              </span>
              <Slider
                size="small"
                value={weight}
                onChange={handleSlider}
                defaultValue={50}
                step={1}
                min={10}
                max={90}
                aria-label="Small"
                valueLabelDisplay="auto"
              />
              <div>
                <span style={{ textAlign: "start", color: "white", fontSize: "18px" }}>
                  Trading Fee:{" "}
                </span>

                <div style={{ float: "right", display: "inline", fontSize: "18px" }}>
                  <span style={{ textAlign: "right", color: "#6d6d7d" }}>0.1%</span>
                </div>
              </div>
              {account &&
                <>
                  {pairStatus === 0 &&
                    <Button
                      size="large"
                      variant="contained"
                      sx={{ width: "100%", padding: 2, fontWeight: "bold", mt: 2 }}
                      style={{
                        color: "white",
                        background:
                          "linear-gradient(to right bottom, #5e5c5c, #5f6a9d)",
                        textAlign: "center",
                      }}
                      disabled={true}
                    >
                      Existing Pair
                    </Button>
                  }
                  {pairStatus === 1 &&
                    <Button
                      size="large"
                      variant="contained"
                      sx={{ width: "100%", padding: 2, fontWeight: "bold", mt: 2 }}
                      onClick={executeCreatePool}
                      style={{
                        color: "white",
                        background:
                          "linear-gradient(to right bottom, #5e5c5c, #5f6a9d)",
                        textAlign: "center",
                      }}
                    >
                      Same Token Pair
                    </Button>
                  }
                  {pairStatus === 2 &&
                    <Button
                      size="large"
                      variant="contained"
                      onClick={executeCreatePool}
                      sx={{ width: "100%", padding: 2, fontWeight: "bold", mt: 2 }}
                      style={{
                        background:
                          "linear-gradient(to right bottom, #13a8ff, #0074f0)",
                        textAlign: "center",
                      }}
                    >
                      CREATE POOL
                    </Button>
                  }
                </>
              }
              {!account && (
                <Button
                  size="large"
                  variant="contained"
                  sx={{ width: "100%", padding: 2, fontWeight: "bold", mt: 2 }}
                  onClick={clickConWallet}
                  style={{
                    background: "linear-gradient(to right bottom, #13a8ff, #0074f0)",
                    color: "#fff",
                    textAlign: "center",
                    marginRight: "8px",
                    maxHeight: 57
                  }}
                  className="btn-primary font-bold w-full dark:text-black flex-1"
                >
                  {"Connect to Wallet"}
                </Button>
              )}
            </div>
          </Item>
        </Grid>

        <Grid item xs={12} sm={12} md={7} sx={{ mt: 10 }}>
          <Item
            sx={{ mb: 3, justifyContent: "flex-start" }}
            style={{ backgroundColor: "transparent", color: "white" }}
          >
            <div style={{ textAlign: "left" }}>
              <h1>Pool Creation Guide </h1>
              <ol>
                <li style={{ fontSize: "19px" }}>
                  Choose two token which have no existing liquidity Pool.
                </li>
              </ol>

            </div>
          </Item>
        </Grid>
        <Modal
          open={mopen}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <StyledModal className="bg-modal">
            <h3 className="model-title mb-6 text-wight" style={{ color: "#fff" }}>Select Token</h3>
            <TextField
              autoFocus={true}
              value={query}
              onChange={filterToken}
              label="Search"
              InputProps={{
                type: "search",
                style: { color: "#ddd" },
              }}
              InputLabelProps={{
                style: { color: "#ddd" },
              }}
            />
            <hr className="my-6" />
            <ul className="flex flex-col gap-y-2" style={{ overflowY: "scroll" }}>
              {filterData.map((item) => {
                const { address, logoURL, symbol } = item;
                return (
                  <li
                    key={address}
                    className="flex gap-x-1 thelist"
                    style={{ cursor: "pointer", padding: "5px" }}
                    onClick={() => selectToken(item, selected)}
                  >
                    <div className="relative flex">
                      <img src={logoURL} alt="" />
                    </div>
                    <p className="text-light-primary text-lg">{symbol}</p>
                  </li>
                );
              })}
            </ul>
          </StyledModal>
        </Modal>
      </Grid>
    </div>
  );
}
