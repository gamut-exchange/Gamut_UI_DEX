import Web3 from "web3";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { utils } from "ethers";
import { useWeb3React } from "@web3-react/core";
import { styled } from "@mui/material/styles";
import "./Navigation.css";
import { Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Menu, Fade, MenuItem, Skeleton, Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Link } from "react-router-dom";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DashboardCmp from "./DashboardCmp";
import { getKavaERC20, getKavaTx } from "../../services/kavaAPI";
import { poolList, contractAddresses } from "../../config/constants";
import { getHoldingInLP, calcOutput, getSwapFeePercent } from "../../config/web3";
import routerABI from "../../assets/abi/router";
import abiDecoder from "../../config/abiDecoder";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: "theme.palette.text.secondary",
}));

export const useStyles = makeStyles((theme: Theme) => ({
  menu: {
    "& .MuiPaper-root": {
      backgroundColor: "#07071c",
      color:"white"
    }
  }
}));

export default function UDashboard() {
  const { account, connector } = useWeb3React();
  const selected_chain = useSelector((state) => state.selectedChain);
  const uniList = useSelector((state) => state.tokenList);

  const [poolsData, setPoolsData] = useState(poolList[selected_chain]);
  const [pools, setPools] = useState({ isLoad: false, data: [], total: 0 });
  const [userERC20, setUserERC20] = useState([]);
  const [userERC20Transactions, setUserERC20Transactions] = useState({isLoad: false, data: []});
  const [walletTVL, setWalletTVL] = useState(0);
  const [userTVL, setUserTVL] = useState(0);
  const [swapFee, setSwapFee] = useState(0);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const classes = useStyles();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const fetchUserData = async () => {
    const provider = await connector.getProvider();
    const web3 = new Web3(provider);
    abiDecoder.addABI(routerABI[0]);
    // Get Kava Token
    getKavaERC20(account).then((response) => {
      let filteredTokens = response.filter((item) => {
        return item.symbol !== "Gamut-LP"
      });
      filteredTokens.map((item) => {
        item.eth_bal = numFormat(item.balance/10**item.decimals);
      });
      setUserERC20(filteredTokens);
    });
    getKavaTx(account).then(async (response) => {
      let filteredThx = response;
      await filteredThx.map((item) => {
        item.raw_input = abiDecoder.decodeMethod(item.input);
      });

      filteredThx = await filteredThx.filter((item) => {
        return item.raw_input !== undefined;
      });

      await filteredThx.map(async (item) => {
        if(item.raw_input.name === "swap") {
          let item_token1 = uniList[selected_chain].filter((unit) => {
            return unit.address.toLowerCase() === item.raw_input.params[0].value.tokenIn.toLowerCase();
          });
          let item_token2 = uniList[selected_chain].filter((unit) => {
            return unit.address.toLowerCase() === item.raw_input.params[0].value.tokenOut.toLowerCase();
          });
          if (item_token1 && item_token2) {
            item.action_type = 0;
            item.token1_symbol = item_token1[0].symbol;
            item.token2_symbol = item_token2[0].symbol;
            web3.eth.getTransactionReceipt(item.hash, function(e, receipt) {
              const decodedLogs = abiDecoder.decodeLogs(receipt.logs);
              item.amount1 = numFormat(decodedLogs[0].events[2].value/10**item_token1[0].decimals);
              item.amount2 = numFormat(decodedLogs[0].events[3].value/10**item_token2[0].decimals);
            });
          } else {
            item.action_type = 0;
            item.token1_symbol = "Unknown";
            item.token2_symbol = "Unknown";
            item.amount1 = 0;
            item.amount2 = 0;
          }
        } else if(item.raw_input.name === "batchSwap") {
          let item_token1 = uniList[selected_chain].filter((unit) => {
            return unit.address.toLowerCase() === item.raw_input.params[1].value[0].toLowerCase();
          });
          let item_token2 = uniList[selected_chain].filter((unit) => {
            return unit.address.toLowerCase() === item.raw_input.params[1].value[item.raw_input.params[1].value.length-1].toLowerCase();
          });
          if (item_token1 && item_token2) {
            item.action_type = 0;
            item.token1_symbol = item_token1[0].symbol;
            item.token2_symbol = item_token2[0].symbol;
            web3.eth.getTransactionReceipt(item.hash, function(e, receipt) {
              const decodedLogs = abiDecoder.decodeLogs(receipt.logs);
              item.amount1 = numFormat(decodedLogs[0].events[2].value/10**item_token1[0].decimals);
              item.amount2 = numFormat(decodedLogs[decodedLogs.length-1].events[3].value/10**item_token2[0].decimals);
            });
          } else {
            item.action_type = 0;
            item.token1_symbol = "Unknown";
            item.token2_symbol = "Unknown";
            item.amount1 = 0;
            item.amount2 = 0;
          }
        } else if(item.raw_input.name === "joinPool") {
          let item_token1 = uniList[selected_chain].filter((unit) => {
            return unit.address.toLowerCase() === item.raw_input.params[1].value.tokens[0].toLowerCase();
          });
          let item_token2 = uniList[selected_chain].filter((unit) => {
            return unit.address.toLowerCase() === item.raw_input.params[1].value.tokens[1].toLowerCase();
          });
          if(item_token1 && item_token2) {
            let userDT = [];
            try {
              userDT = ethers.utils.defaultAbiCoder.decode(["uint256", "uint256[]", "uint256"], item.raw_input.params[1].value.userData);
              item.amount1 = numFormat((userDT[1][0]._hex).toString()/10**item_token1[0].decimals);
              item.amount2 = numFormat((userDT[1][1]._hex).toString()/10**item_token2[0].decimals);
            } catch (e) {
              userDT = ethers.utils.defaultAbiCoder.decode(["uint256", "uint256", "uint256", "uint256"], item.raw_input.params[1].value.userData);
              item.amount1 = numFormat((userDT[1]._hex).toString()/10**item_token1[0].decimals);
              item.amount2 = numFormat((userDT[2]._hex).toString()/10**item_token2[0].decimals);
            }
            item.action_type = 1;
            item.token1_symbol = item_token1[0].symbol;
            item.token2_symbol = item_token2[0].symbol;
          } else {
            item.action_type = 1;
            item.token1_symbol = "Unknown";
            item.token2_symbol = "Unknown";
            item.amount1 = 0;
            item.amount2 = 0;
          }
        } else if(item.raw_input.name === "exitPool") {
          let item_token1 = uniList[selected_chain].filter((unit) => {
            return unit.address.toLowerCase() === item.raw_input.params[1].value.tokens[0].toLowerCase();
          });
          let item_token2 = uniList[selected_chain].filter((unit) => {
            return unit.address.toLowerCase() === item.raw_input.params[1].value.tokens[1].toLowerCase();
          });
          if(item_token1 && item_token2) {
            let userDT = ethers.utils.defaultAbiCoder.decode(["uint256", "uint256"], item.raw_input.params[1].value.userData);
            web3.eth.getTransactionReceipt(item.hash, function(e, receipt) {
              const decodedLogs = abiDecoder.decodeLogs(receipt.logs);
              console.log(decodedLogs[0].events[2].value[0]);
              item.amount1 = numFormat(decodedLogs[0].events[2].value[0]/10**item_token1[0].decimals);
              item.amount2 = numFormat(decodedLogs[0].events[2].value[1]/10**item_token2[0].decimals);
            });
            item.action_type = 2;
            item.token1_symbol = item_token1[0].symbol;
            item.token2_symbol = item_token2[0].symbol;
          } else {
            item.action_type = 2;
            item.token1_symbol = "Unknown";
            item.token2_symbol = "Unknown";
            item.amount1 = 0;
            item.amount2 = 0;
          }
        } else {
          item.action_type = 3;
        }
      });
      filteredThx.filter((item) => {
        return item.action_type !== 3;
      });
      await setUserERC20Transactions({isLoad: true, data: filteredThx})
    });
  };

  const handleWalletTVL = async () => {
    const provider = await connector.getProvider();
    const UserLPTokens = await getHoldingInLP(
      provider,
      account,
      contractAddresses[selected_chain]["hedgeFactory"],
      poolList[selected_chain]
    );
    setWalletTVL(UserLPTokens[0])
    let c = 0;
    UserLPTokens[1]?.map(
      (pool, index) =>
        (c += parseFloat(pool?.totalSupply))
    );
    setPools({ isLoad: true, data: UserLPTokens[1], total: c.toFixed(2) });
  };

  const numFormat = (val) => {
    if (Math.abs(val) > 1)
      return Number(val).toFixed(4) * 1;
    else if (Math.abs(val) > 0.001)
      return Number(val).toFixed(6) * 1;
    else if (Math.abs(val) > 0.00001)
      return Number(val).toFixed(8) * 1;
    else
      return Number(val).toFixed(8) * 1;
  }

  useEffect(() => {
    if (account === undefined) return;
    const getInfo = async () => {
      const provider = await connector.getProvider();
      const swapFeePercent = await getSwapFeePercent(
        provider,
        poolList[selected_chain][0]["address"]
      );
      setSwapFee(swapFeePercent * 0.01);
      fetchUserData();
      setTimeout(function () {
        handleWalletTVL();
      }, 1000);
    };
    getInfo();
  }, [account]);

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Grid
        container
        sx={{ maxWidth: "1220px" }}
        border={0}
        columnSpacing={{ xs: 0, sm: 0, md: 2, lg: 2 }}
      >
        <DashboardCmp />
        {/* Column 1 */}
        <Grid
          item
          xs={12}
          sm={12}
          md={6}
          sx={{ mt: 2, flexDirection:"column" }}
          className="home__mainC"
        >
          <div style={{width:"100%"}}>
            <h3 className="text-white text-xl text-left font-semibold mb-2 ml-2">
              Wallet TVL: ${pools.total}
            </h3>
          </div>
          <Item
            sx={{ pt: 2, pl: 1, pr: 1, pb: 2 }}
            style={{ backgroundColor: "#12122c", borderRadius: "10px" }}
            className="home__main"
          >
            <TableContainer component={Paper} style={{backgroundColor:"transparent"}}>
              <Table sx ={{ minWidth: 550 }} aria-label="simple table">
                <TableHead>
                  <TableRow style={{color:"white"}}>
                    <TableCell align="center" style={{color:"white", paddingTop:5, paddingBottom:5}}>
                      #
                    </TableCell>
                    <TableCell align="left" style={{color:"white", paddingTop:5, paddingBottom:5}}>
                      Pools
                    </TableCell>
                    <TableCell align="left" style={{color:"white", paddingTop:5, paddingBottom:5}}>
                      User LP Tokens
                    </TableCell>
                    <TableCell align="left" style={{color:"white", paddingTop:5, paddingBottom:5}}>
                      APR
                    </TableCell>
                    <TableCell align="center" style={{color:"white", paddingTop:5, paddingBottom:5}}>
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                {pools.isLoad && (
                  <TableBody>
                    {pools?.data?.map((pool, poolIndex) => {
                      return (
                        <TableRow 
                          key={poolIndex + "list"}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell component="th" scope="row" align="center" style={{color:"white", paddingTop:5, paddingBottom:5}}>
                            {poolIndex + 1}
                          </TableCell>
                          <TableCell align="left" style={{color:"white", paddingTop:5, paddingBottom:5}}>
                            <div className="flex justify-left">
                              <img
                                src={
                                  poolsData.filter(
                                    (data) => data?.address.toLowerCase() === pool.address.toLowerCase()
                                  )[0]?.logoURLs[0]
                                }
                                alt=""
                                className="h-5 w-5"
                              />
                              <img
                                className="z-10 relative right-2 h-5 w-5"
                                src={
                                  poolsData.filter(
                                    (data) => data?.address.toLowerCase() === pool.address.toLowerCase()
                                  )[0].logoURLs[1]
                                }
                                alt=""
                              />
                              <p>
                                {
                                  poolsData.filter(
                                    (data) => data?.address.toLowerCase() === pool.address.toLowerCase()
                                  )[0].symbols[0]
                                }
                                /{" "}
                                {
                                  poolsData.filter(
                                    (data) => data?.address.toLowerCase() === pool.address.toLowerCase()
                                  )[0].symbols[1]
                                }
                              </p>
                            </div>
                          </TableCell>
                          <TableCell align="left" style={{color:"white", paddingTop:5, paddingBottom:5}}>
                            <h3 className="font-medium">
                              {/* {utils.formatEther(pool?.totalSupply)} */}$
                              {pool?.totalSupply}
                            </h3>
                          </TableCell>
                          <TableCell align="left" style={{color:"white", paddingTop:5, paddingBottom:5}}>
                            0%
                          </TableCell>
                          <TableCell align="center" style={{paddingTop:5, paddingBottom:5}}>
                            <IconButton
                              aria-label="more"
                              id="long-button"
                              style={{color:"white"}}
                              aria-controls={open ? 'long-menu' : undefined}
                              aria-expanded={open ? 'true' : undefined}
                              aria-haspopup="true"
                              onClick={handleClick}
                            >
                              <MoreVertIcon />
                            </IconButton>
                            <Menu
                              id="fade-menu"
                              MenuListProps={{
                                'aria-labelledby': 'fade-button',
                              }}
                              anchorEl={anchorEl}
                              open={open}
                              onClose={handleClose}
                              TransitionComponent={Fade}
                              className={classes.menu}
                            >
                              <Link to="/add_liquidity">
                                <MenuItem onClick={handleClose}>To LP Page</MenuItem>
                              </Link>
                            </Menu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                )}
                {!pools.isLoad && 
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Box sx={{ width: "100%" }}>
                          <Skeleton animation="wave" />
                          <Skeleton animation="wave" />
                          <Skeleton animation="wave" />
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                }
              </Table>
            </TableContainer >
          </Item>
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={6}
          sx={{ mt: 2, flexDirection:"column" }}
          className="home__mainC"
        >
          <h3
            xs={12}
            sm={12}
            md={12}
            className="text-white text-xl text-left font-semibold mb-2 ml-2 w-full">
            User Tokens
          </h3>
          <Item
            xs={12}
            sm={12}
            md={12}
            sx={{ pt: 2, pl: 1, pr: 1, pb: 2 }}
            style={{ backgroundColor: "#12122c", borderRadius: "10px" }}
            className="home__main"
          >
            <div
              style={{ display: "flex", justifyContent: "space-between" }}
              className="text-white"
            >
              {/* Table */}
              <div className="relative w-full overflow-x-auto shadow-md sm:rounded-lg">
                <TableContainer component={Paper} style={{backgroundColor:"transparent"}}>
                  <Table sx ={{ minWidth: 550 }} aria-label="simple table">
                    <TableHead>
                      <TableRow style={{color:"white"}}>
                        <TableCell align="left" style={{color:"white", paddingTop:5, paddingBottom:5}}>
                          Token
                        </TableCell>
                        <TableCell align="left" style={{color:"white", paddingTop:5, paddingBottom:5}}>
                          Address
                        </TableCell>
                        <TableCell align="left" style={{color:"white", paddingTop:5, paddingBottom:5}}>
                          Balance
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {userERC20?.map((token, index) => (
                        <TableRow
                          key={token?.name + index}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell component="th" scope="row" align="left" style={{color:"white", paddingTop:15, paddingBottom:15}}>
                            {token?.name}
                          </TableCell>
                          <TableCell align="left" style={{color:"white", paddingTop:10, paddingBottom:10}}>
                            {token?.contractAddress?.slice(0, 6) +
                              "..." +
                              token?.contractAddress?.slice(38, -1)}
                          </TableCell>
                          <TableCell align="left" style={{paddingTop:10, paddingBottom:10}}>
                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                            <span className="font-medium text-blue-600 dark:text-blue-500">
                              {token?.eth_bal} {token?.symbol}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </div>
          </Item>
        </Grid>
        {/* Transaction Table */}
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          sx={{ mt: 2, flexDirection:"column" }}
          className="home__mainC"
        >
          <h3 className="text-white text-xl text-left font-semibold mb-2 ml-2">
            Transactions
          </h3>
          <Item
            // sx={{ pl: 3, pr: 3, pb: 2 }}
            style={{ backgroundColor: "#12122c", borderRadius: "10px" }}
            className="home__main"
          >
            <div
              style={{ display: "flex", justifyContent: "space-between" }}
              className="text-white"
            >
              {/* Table */}
              <div className="relative w-full overflow-x-auto shadow-md sm:rounded-lg">
                <TableContainer component={Paper} style={{backgroundColor:"transparent"}}>
                  <Table sx ={{ minWidth: 600 }} aria-label="simple table">
                    <TableHead >
                      <TableRow style={{color:"white"}}>
                        <TableCell align="left" style={{color:"white", paddingTop:5, paddingBottom:5}}>
                          Action
                        </TableCell>
                        <TableCell align="left" style={{color:"white", paddingTop:5, paddingBottom:5}}>
                          Block
                        </TableCell>
                        <TableCell align="left" style={{color:"white", paddingTop:5, paddingBottom:5}}>
                          Token Amount
                        </TableCell>
                        <TableCell align="left" style={{color:"white", paddingTop:5, paddingBottom:5}}>
                          Token Amount
                        </TableCell>
                        <TableCell align="left" style={{color:"white", paddingTop:5, paddingBottom:5}}>
                          Time
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    {userERC20Transactions.isLoad &&
                      <TableBody>
                        {userERC20Transactions.data?.map((token, index) => (
                          <TableRow
                            key={token?.blockHash + index} // blockNumber
                            onClick={() =>
                              window.open(
                                "https://explorer.kava.io/tx/" +
                                  token?.hash +
                                  "/internal-transactions",
                                "_blank"
                              )                          
                            }
                            style={{cursor: "pointer"}}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            {token.action_type === 0 &&
                              <TableCell component="th" scope="row" align="left" style={{color:"#fc077d", paddingTop:15, paddingBottom:15}}>
                                SWAP {token.token1_symbol} for {token.token2_symbol}
                              </TableCell>
                            }
                            {token.action_type === 1 &&
                              <TableCell component="th" scope="row" align="left" style={{color:"#fc077d", paddingTop:15, paddingBottom:15}}>
                                ADD {token.token1_symbol} & {token.token2_symbol}
                              </TableCell>
                            }
                            {token.action_type === 2 &&
                              <TableCell component="th" scope="row" align="left" style={{color:"#fc077d", paddingTop:15, paddingBottom:15}}>
                                REMOVE {token.token1_symbol} & {token.token2_symbol}
                              </TableCell>
                            }
                            <TableCell align="left" style={{color:"white", paddingTop:10, paddingBottom:10}}>
                              {token?.blockNumber}
                            </TableCell>
                            <TableCell align="left" style={{color:"white", paddingTop:10, paddingBottom:10}}>
                              {token.amount1?token.amount1:"..."} {token?.token1_symbol}
                            </TableCell>
                            <TableCell align="left" style={{color:"white", paddingTop:10, paddingBottom:10}}>
                              {token.amount2?token.amount2:"..."} {token?.token2_symbol}
                            </TableCell>
                            <TableCell align="left" style={{color:"white", paddingTop:10, paddingBottom:10}}>
                              {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(token?.timeStamp * 1000)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    }
                    {!userERC20Transactions.isLoad &&
                      <TableBody>
                        <TableRow>
                          <TableCell colSpan={5} align="center">
                            <Box sx={{ width: "100%" }}>
                              <Skeleton animation="wave" />
                              <Skeleton animation="wave" />
                              <Skeleton animation="wave" />
                            </Box>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    }
                  </Table>
                </TableContainer>
              </div>
            </div>
          </Item>
        </Grid>
      </Grid>
    </div>
  );
}
