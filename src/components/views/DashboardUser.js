import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { utils } from "ethers";
import { useWeb3React } from "@web3-react/core";
import { styled } from "@mui/material/styles";
import "./Navigation.css";
import { Grid, Paper } from "@mui/material";
import DashboardCmp from "./DashboardCmp";
import { getERC20, getERC20Transactions } from "./../../services/MolarisAPI";
import { poolList, contractAddresses } from "../../config/constants";
import { getWalletTVL, getHoldingInLP } from "../../config/web3";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: "theme.palette.text.secondary",
}));

export default function UDashboard() {
  const { account, connector } = useWeb3React();
  // const wallet_address = useSelector((state) => state.walletAddress);
  const selected_chain = useSelector((state) => state.selectedChain);
  const [poolsData, setPoolsData] = useState(poolList[selected_chain]);
  const [pools, setPools] = useState({ isLoad: false, data: [] });
  const [userERC20, setUserERC20] = useState([]);
  const [userERC20Transactions, setUserERC20Transactions] = useState([]);
  const [walletTVL, setWalletTVL] = useState(0);

  const fetchUserData = () => {
    // Get User ERC20
    getERC20(account).then((responce) => {
      console.log("Get ERC20 Responce:", responce);
      setUserERC20(responce);
    });
    // Get User Transactions
    getERC20Transactions(account).then((responce) => {
      console.log("Get ERC20 Tx Data:", responce);
      setUserERC20Transactions(responce?.result);
    });
  };

  const handleWalletTVL = async () => {
    const provider = await connector.getProvider();
    const tvlBalance = await getWalletTVL(
      provider,
      account,
      contractAddresses[selected_chain]["hedgeFactory"]
    );
    setWalletTVL(tvlBalance);
    // console.log("TVL Balance:", tvlBalance);
    const UserLPTokens = await getHoldingInLP(
      provider,
      account,
      contractAddresses[selected_chain]["hedgeFactory"]
    );
    setPools({ isLoad: true, data: UserLPTokens });
    // console.log("User LPTokens:", UserLPTokens);
  };

  useEffect(() => {
    if (account === undefined) return;
    setTimeout(function () {
      fetchUserData();
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
            Wallet TVL: {walletTVL}
          </h3>
          <Item
            sx={{ pl: 1, pr: 1, pb: 3 }}
            style={{ backgroundColor: "#12122c", borderRadius: "10px" }}
            className="home__main"
          >
            {/* <div
              style={{ display: "flex", justifyContent: "space-between" }}
              className="text-white"
            >
              <div className="relative w-full overflow-x-auto shadow-md sm:rounded-lg h-64">
              </div>
            </div> */}
            {/* Table Starts */}
            <div className="block w-full overflow-x-auto">
              <table className="items-center w-full border-collapse text-gray-200">
                <thead className="thead-light">
                  <tr>
                    <th className="px-6 bg-gray-500 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                      #
                    </th>
                    <th className="px-6 bg-gray-500 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                      Pools
                    </th>
                    <th className="px-6 bg-gray-500 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                      User LP Tokens
                    </th>
                    <th className="px-6 bg-gray-500 text-blueGray-700 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left min-w-140-px"></th>
                  </tr>
                </thead>
                {pools.isLoad && (
                  <tbody>
                    {pools?.data?.map((pool, poolIndex) => {
                      return (
                        <tr key={poolIndex + "list"}>
                          {console.log(poolIndex, "#", pool)}
                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 ">
                            {poolIndex + 1}
                          </td>
                          <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                            <div className="relative flex items-center">
                              <img
                                src={
                                  poolsData.filter(
                                    (data) => data?.address === pool.address
                                  )[0].logoURLs[0]
                                }
                                alt=""
                                className="h-5 w-5"
                              />
                              <img
                                className="z-10 relative right-2 h-5 w-5"
                                src={
                                  poolsData.filter(
                                    (data) => data?.address === pool.address
                                  )[0].logoURLs[1]
                                }
                                alt=""
                              />
                              <p>
                                {
                                  poolsData.filter(
                                    (data) => data?.address === pool.address
                                  )[0].symbols[0]
                                }
                                /{" "}
                                {
                                  poolsData.filter(
                                    (data) => data?.address === pool.address
                                  )[0].symbols[1]
                                }
                              </p>
                            </div>
                          </th>
                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 ">
                            <h3 className="text-left font-medium">
                              {/* {utils.formatEther(pool?.totalSupply)} */}
                              {pool?.balance}
                            </h3>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                )}
              </table>
            </div>
          </Item>
        </Grid>
        {/* ______________________________ */}
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
            sx={{ pl: 3, pr: 3, pb: 2 }}
            style={{ backgroundColor: "#12122c", borderRadius: "10px" }}
            className="home__main"
          >
            <div
              style={{ display: "flex", justifyContent: "space-between" }}
              className="text-white"
            >
              {/* Table */}
              <div className="relative w-full overflow-x-auto shadow-md sm:rounded-lg h-64">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-blue-500 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        Token
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Address
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Balance
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {userERC20?.map((token, index) => (
                      <tr
                        key={token?.name + index}
                        className={`bg-transparent text-white ${
                          index % 2 !== 0 ? " bg-gray-800" : "bg-transparent"
                        } border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 hover:text-gray-800 dark:hover:bg-blue-200`}
                      >
                        <th
                          scope="row"
                          className="px-6 py-4 font-medium whitespace-nowrap dark:text-white"
                        >
                          {token?.name}
                        </th>
                        <td className="px-6 py-4">
                          {token?.token_address.slice(0, 6)}
                        </td>
                        <td className="px-6 py-4 text-left">
                          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                          <span className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                            {utils.formatEther(token?.balance)} {token?.symbol}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
              <div className="relative w-full overflow-x-auto shadow-md sm:rounded-lg h-64">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-blue-500 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        Txn Hash
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Block
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Age________
                      </th>
                      <th scope="col" className="px-6 py-3">
                        From
                      </th>
                      <th scope="col" className="px-6 py-3">
                        To
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Value
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {userERC20Transactions?.map((token, index) => (
                      <tr
                        key={token?.block_number + index}
                        className={`bg-transparent text-white ${
                          index % 2 !== 0 ? " bg-gray-800" : "bg-transparent"
                        } border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 hover:text-gray-800 dark:hover:bg-blue-200`}
                      >
                        <th
                          scope="row"
                          className="px-6 py-4 font-medium whitespace-nowrap dark:text-white"
                        >
                          {token?.transaction_hash.slice(0, 6) +
                            "..." +
                            token?.transaction_hash.slice(60, -1)}
                        </th>
                        <td className="px-6 py-4">{token?.block_number}</td>
                        <td className="px-6 py-4">
                          {token?.block_timestamp?.split("T")[0]}
                        </td>
                        <td className="px-6 py-4">{token?.from_address}</td>
                        <td className="px-6 py-4">{token?.to_address}</td>
                        <td className="px-6 py-4 text-left">
                          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                          <span className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                            {utils.formatEther(token?.value)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
