import Web3 from "web3";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import WalletConnectors from "../../config/connectors";
import { useWeb3React } from "@web3-react/core";
import {
  Grid,
  styled,
  Paper,
  Button,
  Box,
  Hidden,
  Menu,
  MenuItem
} from "@mui/material";
import { Stack } from "@mui/system";
import logo from "../../images/logo.svg";
import useStyles from "../../assets/styles";
import Navigation from "./Navigation";

import ConnectWallet from "../web3/ConnectWallet";
import { ConnectedWallet } from "../../config/wallets";
import { SELECT_CHAIN } from "../../redux/constants";

function Header() {
  const cWallet = ConnectedWallet();
  const selected_chain = useSelector((state) => state.selectedChain);

  const [darkFontColor, setDarkFontColor] = useState("#FFFFFF");
  const [darkFontColorSec, setDarkFontColorSec] = useState("#13a8ff");
  const [wrongChain, setWrongChain] = useState(false);
  const [openWalletList, setOpenWalletList] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [chainLabel, setChainLabel] = useState(selected_chain);
  const [noDetected, setNoDetected] = useState(true);

  const dispatch = useDispatch();
  const classes = useStyles.header();
  const menuOpen = Boolean(anchorEl);
  const { injected, walletconnect } = WalletConnectors();
  const {
    connector,
    chainId,
    account,
    active,
    activate,
    deactivate,
    chainChanged,
  } = useWeb3React();

  const handleClick = (event) => {
    debugger;
    setAnchorEl(event.currentTarget);
  };

  const handleChain = async (chain) => {
    handleClose();
    if (chain != "") {
      if (chainLabel !== chain) {
        setChainLabel(chain);
        deactivate();
      }
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleWrongChain = async () => {
    if (account) {
      setNoDetected(false);
    }
    if (!noDetected) {
      const provider = await injected.getProvider();
      const web3 = new Web3(provider);
      let current_chainId = await web3.eth.getChainId();
      current_chainId = Number(current_chainId);
      if (
        (chainLabel === "goerli" && current_chainId === 5) ||
        (chainLabel === "fantom" && current_chainId === 4002)
      ) {
        setWrongChain(false);
      } else {
        setWrongChain(true);
      }
    }
  };

  const handleChainLabel = () => {
    dispatch({
      type: SELECT_CHAIN,
      payload: chainLabel,
    });
  };

  useEffect(() => {
    handleWrongChain();
  }, [dispatch, activate, deactivate, active, chainChanged, chainLabel]);

  useEffect(() => {
    handleChainLabel();
  }, [chainLabel]);

  return (
    <div className="s" style={{ display: "flex", justifyContent: "center", padding:"16px 0px" }}>
      {/* <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}> */}

      {/* Header Start  */}
      <Grid
        container
        maxWidth="lg"
        columnSpacing={{ xs: 0, sm: 0, md: 0 }}
        sx={{ pb: 1 }}
        className="header"
      >
        {/* Logo Grid */}
        <Grid
          item
          xs={5}
          sm={5}
          md={6}
          lg={6}
          sx={{ display: "flex", justifyContent: "flex-start" }}
        >
          <Box
            elevation={1}
            style={{ backgroundColor: "transparent", color: darkFontColor }}
          >
            <img
              src={logo}
              width="150px"
              alt="Logo"
              style={{ marginTop: "1.1rem" }}
            />
          </Box>
        </Grid>

        {/* Logo Right Side Grid  */}
        <Grid
          item
          xs={5}
          sm={5}
          md={6}
          lg={6}
          sx={{ display: "flex", justifyContent: "flex-end" }}

        >
          <Box
            elevation={1}
            style={{ backgroundColor: "transparent", color: darkFontColor }}
          >
            <Stack spacing={2} direction="row">
              <Button
                id="basic-button"
                className="transition-all duration-300"
                aria-controls={menuOpen ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={menuOpen ? "true" : undefined}
                onClick={handleClick}
                style={{fontWeight:"bold", fontSize:"16px", color:"white"}}
              >
                {chainLabel}
              </Button>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={menuOpen}
                onClose={(e) => setAnchorEl(false)}
                onClick={(e) => setAnchorEl(false)}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                classes={{
                  paper: classes.darkMenuWrapper,
                }}
              >
                <MenuItem key="goerli" onClick={() => handleChain("goerli")}>
                  Goerli
                </MenuItem>
              </Menu>
              <Hidden mdDown="true">
                {/* <Button
                  size="large"
                  color="primary"
                  variant="contained"
                  sx={{ width: 200, padding: 2, fontWeight: "550" }}
                  style={{
                    background:
                      "linear-gradient(to right bottom, #13a8ff, #0074f0)",
                  }}
                >
                  CONNECT WALLET
                </Button> */}
                <Box className={classes.actionGroup}>
                  <Box className={classes.connectWallet}>
                    {(() => {
                      if (wrongChain) {
                        return (
                          <Button
                            variant="contained"
                            className="btn-primary dark:text-dark-primary w-full"
                            style={{
                              borderRadius: "0px",
                              height: 44,
                              fontSize: 18,
                            }}
                            onClick={() => {
                              setOpenWalletList(true);
                            }}
                          >
                            Wrong Chain
                          </Button>
                        );
                      } else {
                        if (account)
                          return (
                            <Button
                              variant="contained"
                              className="btn-primary dark:text-dark-primary w-full"
                              style={{
                                borderRadius: "0px",
                                height: 44,
                                fontSize: 14,
                              }}
                              startIcon={
                                cWallet && (
                                  <img
                                    width={22}
                                    src={cWallet.logo}
                                    alt={cWallet.name}
                                  />
                                )
                              }
                              onClick={() => {
                                setOpenWalletList(true);
                              }}
                            >
                              {`${account.substring(
                                0,
                                8
                              )} ... ${account.substring(
                                account.length - 4
                              )}`}
                            </Button>
                          );
                        else
                          return (
                            <Button
                              variant="contained"
                              id="connect_wallet_btn"
                              className="btn-primary dark:text-dark-primary w-full"
                              style={{
                                borderRadius: "0px",
                                height: 44,
                                fontSize: 18,
                              }}
                              onClick={() => {
                                setOpenWalletList(true);
                              }}
                            >
                              Connect Wallet
                            </Button>
                          );
                      }
                    })()}
                  </Box>
                </Box>
              </Hidden>
            </Stack>
          </Box>
        </Grid>

        {/* Mobile menu  */}
        <Hidden mdUp="true">
          <Grid item
            xs={2}
            sm={2}
            md={2}
            lg={6}
            sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Navigation />

          </Grid>
        </Hidden>
        {/* Header Section 1 End  */}

        {/* APP bar start  main menu*/}
        <Hidden mdDown="true">
          <Navigation />
        </Hidden>
        {/* App Bar closed */}
      </Grid>
      <ConnectWallet
        isOpen={openWalletList}
        setIsOpen={setOpenWalletList}
        chain={chainLabel}
        setIsWrongChain={setWrongChain}
        setIsNoDetected={setNoDetected}
        wrongChain={wrongChain}
        dark={true}
      />
    </div>
  );
}

export default Header;
