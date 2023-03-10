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
import { getHoldingInLP } from "../../config/web3";

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
  // const wallet_address = useSelector((state) => state.walletAddress);
  const selected_chain = useSelector((state) => state.selectedChain);
  const [poolsData, setPoolsData] = useState(poolList[selected_chain]);
  const [pools, setPools] = useState({ isLoad: false, data: [], total: 0 });
  const [userERC20, setUserERC20] = useState([]);
  const [userERC20Transactions, setUserERC20Transactions] = useState([]);
  const [walletTVL, setWalletTVL] = useState(0);
  const [userTVL, setUserTVL] = useState(0);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const classes = useStyles();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const fetchUserData = () => {
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
    getKavaTx(account).then((response) => {
      setUserERC20Transactions(response);
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
    fetchUserData();
    setTimeout(function () {
      handleWalletTVL();
    }, 1000);
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
          md={5}
          sx={{ mt: 2 }}
          className="home__mainC"
        >
          <h3 className="text-white text-xl text-left font-semibold mb-2 ml-2">
            Wallet TVL: ${pools.total}
          </h3>
          <Item
            sx={{ pt: 2, pl: 1, pr: 1, pb: 2 }}
            style={{ backgroundColor: "#12122c", borderRadius: "10px" }}
            className="home__main"
          >
            <TableContainer component={Paper} style={{backgroundColor:"transparent"}}>
              <Table sx ={{ minWidth: 400 }} aria-label="simple table">
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
                      <TableCell colSpan={4} align="center">
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
          md={7}
          sx={{ mt: 2 }}
          className="home__mainC"
        >
          <h3 className="text-white text-xl text-left font-semibold mb-2 ml-2">
            User Tokens
          </h3>
          <Item
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
                  <Table sx ={{ minWidth: 600 }} aria-label="simple table">
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
          sx={{ mt: 2 }}
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
                  <Table aria-label="simple table">
                    <TableHead >
                      <TableRow style={{color:"white"}}>
                        <TableCell align="left" style={{color:"white", paddingTop:5, paddingBottom:5}}>
                          Txn Hash
                        </TableCell>
                        <TableCell align="left" style={{color:"white", paddingTop:5, paddingBottom:5}}>
                          Block
                        </TableCell>
                        <TableCell align="left" style={{color:"white", paddingTop:5, paddingBottom:5}}>
                          TimeStamp
                        </TableCell>
                        <TableCell align="left" style={{color:"white", paddingTop:5, paddingBottom:5}}>
                          From
                        </TableCell>
                        <TableCell align="left" style={{color:"white", paddingTop:5, paddingBottom:5}}>
                          To
                        </TableCell>
                        <TableCell align="left" style={{color:"white", paddingTop:5, paddingBottom:5}}>
                          Value
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {userERC20Transactions?.map((token, index) => (
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
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell component="th" scope="row" align="left" style={{color:"white", paddingTop:15, paddingBottom:15}}>
                            {token?.blockHash.slice(0, 10) +
                              "..." +
                              token?.blockHash.slice(55, -1)}
                          </TableCell>
                          <TableCell align="left" style={{color:"white", paddingTop:10, paddingBottom:10}}>
                            {token?.blockNumber}
                          </TableCell>
                          <TableCell align="left" style={{color:"white", paddingTop:10, paddingBottom:10}}>
                          {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(token?.timeStamp * 1000)}
                          </TableCell>
                          <TableCell align="left" style={{color:"white", paddingTop:10, paddingBottom:10}}>
                          {token?.from.slice(0, 10) +
                              "..." +
                          token?.from.slice(30, -1)}
                          </TableCell>
                          <TableCell align="left" style={{color:"white", paddingTop:10, paddingBottom:10}}>
                            {token?.to.slice(0, 10) +
                                "..." +
                            token?.to.slice(30, -1)}
                          </TableCell>
                          <TableCell align="left" style={{color:"white", paddingTop:10, paddingBottom:10}}>
                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                            <span className="font-medium text-blue-600 dark:text-blue-500">
                              {numFormat(utils.formatEther(token?.value))}
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

        {/* Column 2 */}
        {/* <Grid
          item
          xs={12}
          sm={12}
          md={5}
          sx={{ mt: 2 }}
          className="chart__main"
        >
          <Item
            sx={{ pl: 3, pr: 3, pb: 2 }}
            style={{ backgroundColor: "#12122c", borderRadius: "10px" }}
            className="home__main"
          >
            <div
              style={{ display: "flex", justifyContent: "space-between" }}
              className="text-white"
            >
              User Data No.1
            </div>
          </Item>
        </Grid> */}
      </Grid>
    </div>
  );
}
