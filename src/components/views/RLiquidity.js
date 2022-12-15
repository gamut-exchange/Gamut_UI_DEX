import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useWeb3React } from "@web3-react/core";
import { styled } from "@mui/material/styles";
import History from './History';
import {
  Paper,
  Grid,
  Modal,
  Button,
  FormControl,
  Slider,
  InputBase,
  useMediaQuery,
  Typography,
  TextField
} from "@mui/material";
import {
  Settings,
} from "@mui/icons-material";
import tw from "twin.macro";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SwapCmp from "./SwapCmp";
import { useWeightsData, useExitTransactionsData } from "../../config/chartData";
import {
  getPoolData,
  getPoolBalance,
  removePool,
  fromWeiVal,
  getPoolSupply,
  calculateSwap,
} from "../../config/web3";
import { poolList, uniList } from "../../config/constants";
import { contractAddresses } from "../../config/constants";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Brush,
  ResponsiveContainer,
} from "recharts";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  "label + &": {
    marginTop: theme.spacing(3),
  },
  "& .MuiInputBase-input": {
    borderRadius: 4,
    position: "relative",
    backgroundColor: "#07071c",
    border: "0px solid #ced4da",
    fontSize: 20,
    textAlign: "start",
    padding: "10px 16px 10px 12px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    "&:focus": {
      borderRadius: 4,
      borderColor: "#80bdff",
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
      color: "white"
    },
  },
  icon: {
    color: "white",
  },
}));

export default function RLiquidity() {
  const grayColor = "#6d6d7d";
  const selected_chain = useSelector((state) => state.selectedChain);
  const { account, connector } = useWeb3React();
  const [setting, setSetting] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(0);
  const [weightA, setWeightA] = useState(0.5);
  const [tokenA, setTokenA] = useState([]);
  const [tokenB, setTokenB] = useState([]);
  const [scale, setScale] = useState(50);
  const [lpPercentage, setLpPercentage] = useState(50);
  const [poolAmount, setPoolAmount] = useState(0);
  const [selectedItem, setSelectedItem] = useState(poolList[selected_chain][0]);
  const [filterData, setFilterData] = useState(poolList[selected_chain]);
  const [query, setQuery] = useState("");
  const [totalLPTokens, setTotalLPTokens] = useState(0);
  const [outTokenA, setOutTokenA] = useState(0);
  const [outTokenB, setOutTokenB] = useState(0);
  const [removing, setRemoving] = useState(false);
  const [slippage, setSlippage] = useState(5);
  // const [slippageFlag, setSlippageFlag] = useState(false);

  const dispatch = useDispatch();
  const weightData = useWeightsData(selectedItem["address"].toLowerCase());
  const exitTransactionsData = useExitTransactionsData(account);
  const isMobile = useMediaQuery("(max-width:600px)");

  const StyledModal = tw.div`
    flex
    flex-col
    relative
    m-auto
    top-1/4
    p-6
    shadow-box
    min-h-min
    transform -translate-x-1/2 -translate-y-1/2
    sm:w-1/3 w-11/12
  `;

  const clickConWallet = () => {
    document.getElementById("connect_wallet_btn").click();
  }

  const handleOpen = () => {
    setQuery("");
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleScale = async (event, newValue) => {
    setScale(newValue * 1);
    let weight1 = newValue / 100;
    setWeightA(weight1);
    await calculateOutput(totalLPTokens, value, weight1);
  };

  const handleSlider = async (event, newValue) => {
    setLpPercentage(newValue);
    const val = numFormat(poolAmount * (newValue / 100));
    setValue(val);
    await calculateOutput(totalLPTokens, val, weightA);
  };

  const calculateOutput = async (totalLkTk, inValue, weight1) => {
    const provider = await connector.getProvider();
    const poolData = await getPoolData(
      provider,
      selectedItem["address"]
    );

    let removeingPercentage = inValue / (Number(totalLkTk) + 0.0000000001);
    let standardOutA = removeingPercentage * poolData.balances[0];
    let standardOutB = removeingPercentage * poolData.balances[1];
    let reqWeightA = (1 - weight1) * 10 ** 18;
    let reqWeightB = weight1 * 10 ** 18;
    let outA = 0;
    let outB = 0;
    if (reqWeightB < Number(poolData.weights[1])) {
      outB = (standardOutB / poolData.weights[1]) * reqWeightB;
      let extraA = await
        calculateSwap(poolData.tokens[1], poolData, numFormat((standardOutB - outB) / 10 ** poolData.decimals[1])) *
        10 ** poolData.decimals[0];
      outA = standardOutA + extraA;
    } else {
      outA = (standardOutA / poolData.weights[0]) * reqWeightA;
      let extraB = await
        calculateSwap(poolData.tokens[0], poolData, numFormat((standardOutA - outA) / 10 ** poolData.decimals[0])) *
        10 ** poolData.decimals[1];
      outB = standardOutB + extraB;
    }

    const vaueA = Math.floor(outA).toLocaleString("fullwide", { useGrouping: false });
    const vaueB = Math.floor(outB).toLocaleString("fullwide", { useGrouping: false });
    const amount1 = fromWeiVal(provider, vaueA, poolData.decimals[0]);
    const amount2 = fromWeiVal(provider, vaueB, poolData.decimals[1]);
    setOutTokenA(numFormat(amount1));
    setOutTokenB(numFormat(amount2));
  };

  const filterLP = (e) => {
    let search_qr = e.target.value;
    setQuery(search_qr);
    if (search_qr.length !== 0) {
      const filterDT = poolList[selected_chain].filter((item) => {
        return (
          item["symbols"][0].toLowerCase().indexOf(search_qr) !== -1 ||
          item["symbols"][1].toLowerCase().indexOf(search_qr) !== -1
        );
      });
      setFilterData(filterDT);
    } else {
      setFilterData(poolList[[selected_chain]]);
    }
  };

  const getStatusData = async () => {
    const result1 = uniList[selected_chain].filter((item) => {
      return item.symbol === selectedItem['symbols'][0];
    });

    setTokenA(result1[0]);

    const result2 = uniList[selected_chain].filter((item) => {
      return item.symbol === selectedItem['symbols'][1];
    });

    setTokenB(result2[0]);
    if (account) {
      const provider = await connector.getProvider();
      const poolData = await getPoolData(
        provider,
        selectedItem["address"]
      );
      const weight1 = fromWeiVal(provider, poolData["weights"][0], "18");
      setWeightA(weight1);
      setScale((weight1 * 100));

      // const result1 = uniList[selected_chain].filter((item) => {
      //   return item.address.toLowerCase() === poolData["tokens"][0].toLowerCase();
      // });

      // setTokenA(result1[0]);

      // const result2 = uniList[selected_chain].filter((item) => {
      //   return item.address.toLowerCase() === poolData["tokens"][1].toLowerCase();
      // });

      // setTokenB(result2[0]);

      let amount = await getPoolBalance(
        account,
        provider,
        selectedItem["address"]
      );
      amount = numFormat(amount);
      setPoolAmount(amount);
      setValue(numFormat((amount * lpPercentage) / 100));
      let totalLPAmount = await getPoolSupply(
        provider,
        selectedItem["address"]
      );
      setTotalLPTokens(totalLPAmount);
      await calculateOutput(totalLPAmount, (amount * lpPercentage) / 100, weight1);
    }
  }

  const selectToken = async (item) => {
    handleClose();
    setSelectedItem(item);
  };

  const executeRemovePool = async () => {
    if (!(Number(value) <= 0 || Number(value) > poolAmount)) {
      const provider = await connector.getProvider();
      let ratio = (1 - scale / 100).toFixed(8);
      setRemoving(true);
      await removePool(
        account,
        provider,
        value,
        ratio,
        tokenA.address,
        tokenB.address,
        outTokenA,
        outTokenB,
        slippage * 0.01,
        contractAddresses[selected_chain]["router"]
      );
      setRemoving(false);
    }
  };

  const numFormat = (val) => {
    if (Number(val) > 1)
      return Number(val).toFixed(2) * 1;
    else if (Number(val) > 0.001)
      return Number(val).toFixed(4) * 1;
    else if (Number(val) > 0.00001)
      return Number(val).toFixed(6) * 1;
    else
      return Number(val).toFixed(8) * 1;
  }

  const valueLabelFormat = (value) => {
    return value + "%";
  }

  const CustomTooltip0 = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      var eventTime = new Date(payload[0].payload["timestamp"] * 1000);
      var year = eventTime.getUTCFullYear();
      var month =
        eventTime.getUTCMonth() + 1 < 10
          ? "0" + (eventTime.getUTCMonth() + 1)
          : eventTime.getUTCMonth() + 1;
      var day =
        eventTime.getUTCDate() < 10
          ? "0" + eventTime.getUTCDate()
          : eventTime.getUTCDate();
      var hour =
        eventTime.getUTCHours() < 10
          ? "0" + eventTime.getUTCHours()
          : eventTime.getUTCHours();
      var min =
        eventTime.getUTCMinutes() < 10
          ? "0" + eventTime.getUTCMinutes()
          : eventTime.getUTCMinutes();
      var sec =
        eventTime.getUTCSeconds() < 10
          ? "0" + eventTime.getUTCSeconds()
          : eventTime.getUTCSeconds();
      eventTime =
        year + "/" + month + "/" + day + " " + hour + ":" + min + ":" + sec;
      return (
        <div
          className="custom-tooltip"
          style={{ backgroundColor: "white", padding: 5 }}
        >
          <p className="label fw-bold">{eventTime}</p>
          <p className="label">
            {payload[0].payload["token0"]} : {payload[0].payload["weight0"]}
          </p>
        </div>
      );
    }

    return null;
  };

  const CustomTooltip1 = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      var eventTime = new Date(payload[0].payload["timestamp"] * 1000);
      var year = eventTime.getUTCFullYear();
      var month =
        eventTime.getUTCMonth() + 1 < 10
          ? "0" + (eventTime.getUTCMonth() + 1)
          : eventTime.getUTCMonth() + 1;
      var day =
        eventTime.getUTCDate() < 10
          ? "0" + eventTime.getUTCDate()
          : eventTime.getUTCDate();
      var hour =
        eventTime.getUTCHours() < 10
          ? "0" + eventTime.getUTCHours()
          : eventTime.getUTCHours();
      var min =
        eventTime.getUTCMinutes() < 10
          ? "0" + eventTime.getUTCMinutes()
          : eventTime.getUTCMinutes();
      var sec =
        eventTime.getUTCSeconds() < 10
          ? "0" + eventTime.getUTCSeconds()
          : eventTime.getUTCSeconds();
      eventTime =
        year + "/" + month + "/" + day + " " + hour + ":" + min + ":" + sec;
      return (
        <div
          className="custom-tooltip"
          style={{ backgroundColor: "white", padding: 5 }}
        >
          <p className="label fw-bold">{eventTime}</p>
          <p className="label">
            {payload[0].payload["token1"]} : {payload[0].payload["weight1"]}
          </p>
        </div>
      );
    }

    return null;
  };

  const formattedWeightsData = useMemo(() => {
    if (weightData && weightData.weights) {
      return weightData.weights.map((item, index) => {
        var tempArr = {};
        tempArr["name"] = index;
        tempArr["weight0"] = Number(item.weight0).toFixed(2);
        tempArr["weight1"] = Number(item.weight1).toFixed(2);
        tempArr["token0"] = item.token0.symbol;
        tempArr["token1"] = item.token1.symbol;
        tempArr["timestamp"] = item.timestamp;
        return tempArr;
      });
    } else {
      return [];
    }
  }, [weightData]);

  const transactionsData = useMemo(() => {
    if (account) {
      if (exitTransactionsData.exits && exitTransactionsData.exits.length !== 0) {
        let result = [];
        result = exitTransactionsData.exits.map(item => {
          return item;
        });
        return result;
      } else {
        return [];
      }
    } else {
      return [];
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exitTransactionsData]);


  useEffect(() => {
    getStatusData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItem])

  useEffect(() => {
    const result1 = uniList[selected_chain].filter((item) => {
      return item.symbol === selectedItem['symbols'][0];
    });

    setTokenA(result1[0]);

    const result2 = uniList[selected_chain].filter((item) => {
      return item.symbol === selectedItem['symbols'][1];
    });

    setTokenB(result2[0]);
    if (account) {
      const getInfo = async () => {
        const provider = await connector.getProvider();
        const pData = await getPoolData(
          provider,
          selectedItem["address"]
        );
        const weight1 = fromWeiVal(provider, pData["weights"][1], "18");
        setWeightA(weight1);
        setScale((weight1 * 100));

        // const result1 = uniList[selected_chain].filter((item) => {
        //   return item.address.toLowerCase() === pData["tokens"][0].toLowerCase();
        // });

        // setTokenA(result1[0]);

        // const result2 = uniList[selected_chain].filter((item) => {
        //   return item.address.toLowerCase() === pData["tokens"][1].toLowerCase();
        // });

        // setTokenB(result2[0]);

        let amount = await getPoolBalance(
          account,
          provider,
          selectedItem["address"]
        );
        let amount2 = await getPoolSupply(
          provider,
          selectedItem["address"]
        );
        amount = numFormat(amount);
        setTotalLPTokens(amount2);
        setPoolAmount(amount);
        await calculateOutput(
          amount2,
          (amount * lpPercentage) / 100,
          weight1
        );
      };

      getInfo();
      // const intervalId = setInterval(() => {
      //   getStatusData();
      // }, 40000);
      // return () => clearInterval(intervalId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  useEffect(() => {
    setFilterData(poolList[[selected_chain]]);
    selectToken(poolList[selected_chain][0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, selected_chain, account]);

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Grid
        container
        sx={{ maxWidth: "1220px" }}
        border={0}
        columnSpacing={{ xs: 0, sm: 0, md: 2, lg: 2 }}
      >
        <SwapCmp />
        <Grid item xs={12} sm={12} md={5} sx={{ mt: 2 }} className="home__mainC">
          <Item sx={{ pl: 3, pr: 3, pb: 2 }} style={{ backgroundColor: "#12122c", borderRadius: "10px" }} className="home__main">
            <Typography
              variant="h5"
              sx={{ fontWeight: "600", color: "white" }}
              gutterBottom
              style={{ textAlign: "left", margin: "12px 0px" }}
            >
              Remove Liquidity
            </Typography>
            {/* Drop down Start  */}
            <FormControl
              sx={{ m: 0 }}
              style={{ alignItems: "flex-start", display: "inline" }}
              variant="standard"
              className="flex"
            >
              <div style={{ backgroundColor: "#12122c", marginTop: "24px" }}>
                <Button
                  style={{ width: isMobile ? "45%" : "40%", float: "left", border: "0px", padding: "9px 8px", backgroundColor: "#07071c", minHeight: "48px", fontSize: isMobile ? "10 px" : "11px", fontWeight: "bold" }}
                  startIcon={
                    <div style={{ float: "left" }}>
                      <img
                        src={selectedItem["logoURLs"][0]}
                        alt=""
                        style={{ float: "left" }}
                        className="w-4 md:w-6"
                      />
                      <img
                        src={selectedItem["logoURLs"][1]}
                        alt=""
                        style={{ float: "left", marginLeft: -5 }}
                        className="w-4 md:w-6"
                      />
                    </div>
                  }
                  onClick={handleOpen}
                  className="w-36 sm:w-48"
                >
                  {selectedItem["symbols"][0]} -{" "}
                  {selectedItem["symbols"][1]} LP
                </Button>
                <BootstrapInput
                  id="demo-customized-textbox"
                  type="text"
                  value={value}
                  min={0}
                  style={{
                    color: "#FFFFFF",
                    width: isMobile ? "55%" : "60%",
                    float: "left",
                    borderLeft: "1px solid white",
                    borderRadius: "14px",
                  }}
                  readOnly={true}
                />
              </div>
              {/* <div>
                <span style={{ float: "left", color: grayColor }}>
                  Balance: {poolAmount}
                </span>
                <span style={{ float: "right", color: grayColor }}>
                  25% 50% 75% 100%
                </span>
              </div> */}
            </FormControl>
            {/* </FormControl> */}
            <div style={{ width: "100%" }}>
              <span style={{ float: "left", color: grayColor, paddingTop:"7px" }}>
                Percentage to remove:
              </span>
              <Slider
                size="small"
                value={lpPercentage}
                step={0.01}
                aria-label="Small"
                valueLabelDisplay="auto"
                onChange={handleSlider} />
            </div>
            {/* Drop down 2 Start  */}
            <FormControl
              sx={{ m: 0 }}
              style={{ alignItems: "flex-start", display: "inline" }}
              variant="standard"
            >
              <div style={{ backgroundColor: "#12122c", marginTop: "4px" }}>
                <Button
                  style={{ width: isMobile ? "45%" : "40%", float: "left", border: "0px", padding: "9px 8px", fontSize: "13px", backgroundColor: "#07071c", color: "white", minHeight:50 }}
                  startIcon={
                    <img
                      src={tokenB.logoURL}
                      alt=""
                      className="w-8"
                    />
                  }
                  disabled={true}
                >
                  {tokenB.symbol}
                </Button>
                <BootstrapInput
                  id="demo-customized-textbox"
                  type="text"
                  value={numFormat(outTokenB)}
                  style={{
                    color: "#FFFFFF",
                    width: isMobile ? "55%" : "60%",
                    float: "left",
                    borderLeft: "1px solid white",
                    borderRadius: "14px",
                  }}
                  readOnly={true}
                />
              </div>
            </FormControl>
            {/* </FormControl> */}
            <br />
            <br />
            <br />
            <FormControl
              sx={{ m: 0 }}
              style={{ alignItems: "flex-start", display: "inline" }}
              variant="standard"
            >
              <div style={{ backgroundColor: "#12122c", marginBottom: "15px" }}>
                <Button
                  style={{ width: isMobile ? "45%" : "40%", float: "left", border: "0px", padding: "9px 8px", fontSize: "13px", backgroundColor: "#07071c", color: "white", minHeight:50 }}
                  startIcon={
                    <img
                      src={tokenA.logoURL}
                      alt=""
                      className="w-8"
                    />
                  }
                  disabled={true}
                >
                  {tokenA.symbol}
                </Button>
                <BootstrapInput
                  id="demo-customized-textbox"
                  type="text"
                  value={numFormat(outTokenA)}
                  style={{
                    color: "#FFFFFF",
                    width: isMobile ? "55%" : "60%",
                    float: "left",
                    borderLeft: "1px solid white",
                    borderRadius: "14px",
                  }}
                  readOnly={true}
                />
              </div>
              <br />
            </FormControl>
            <br />
            <br />
            <div style={{ color: "white", display: "block", textAlign: "left", marginTop: "9px", marginBottom: "12px" }}>
              <InfoOutlinedIcon
                style={{
                  fontSize: "18px",
                }}
              />{" "}
              <span>Ratio {numFormat(scale)}% {tokenB.symbol} - {numFormat(100 - scale)}% {tokenA.symbol}</span>
              <span onClick={() => setSetting(!setting)} style={{ color: "white", float: "right", cursor: "pointer" }}>
                <Settings />
              </span>
            </div>
            {
              setting ?
                <div className="mt-2">
                  <div className="s" sx={{ width: "100%" }}>
                    <span style={{ float: "left", color: grayColor }}>
                      Change Ratio:
                    </span>
                  </div>
                  <Slider
                    size="small"
                    value={scale}
                    onChange={handleScale}
                    step={0.1}
                    min={0.1}
                    max={99.9}
                    valueLabelDisplay="auto"
                  />
                  {/* <div className="s" style={{ float: "left", width: "100%" }}>
                    <span style={{ float: "left", color: grayColor }}>
                      Max Slippage:
                    </span>
                    <span style={{ float: "right", color: grayColor }}>
                      <a href="#;" onClick={() => { setSlippage(0.1); }} style={{ color: slippage === 0.1 ? "lightblue" : "" }}>0.1%</a>
                      <a href="#;" onClick={() => { setSlippage(0.5); }} style={{ paddingLeft: "5px", color: slippage === 0.5 ? "lightblue" : "" }}>0.5%</a>
                      <a href="#;" onClick={() => { setSlippage(1); }} style={{ paddingLeft: "5px", color: slippage === 1 ? "lightblue" : "" }}>1%</a>
                      <a href="#;" onClick={() => { setSlippageFlag(!slippageFlag); }} style={{ paddingLeft: "5px" }}>custom</a>
                    </span>
                    {slippageFlag && <Slider size="small" value={slippage} aria-label="Default" min={0.1} max={10} step={0.1} valueLabelDisplay="auto" getAriaValueText={valueLabelFormat} valueLabelFormat={valueLabelFormat} onChange={(e) => setSlippage(Number(e.target.value))} />}
                  </div> */}
                </div>
                : null
            }
            <div style={{ textAlign: "left" }}>
              {/* <span style={{ textAlign: "start", color: "white" }}>
                Price Impact:
              </span>
              <div style={{ float: "right", display: "inline" }}>
                <span style={{ textAlign: "right", color: "white" }}>0%</span>
              </div>
              <div>
                <span style={{ textAlign: "start", color: "white" }}>
                  Expected Output:
                </span>
                <div style={{ float: "right", display: "inline" }}>
                  <span style={{ textAlign: "right", color: "white" }}>0</span>
                </div>
              </div>
              <div>
                <span style={{ textAlign: "start", color: "white" }}>
                  Minimum Output after Slippage:
                </span>
                <div style={{ float: "right", display: "inline" }}>
                  <span style={{ textAlign: "right", color: "white" }}>0</span>
                </div>
              </div> */}
              <div className="">
                {account &&
                  <Button
                    size={isMobile ? "small" : "large"}
                    variant="contained"
                    sx={{ width: "100%", padding: 2, fontWeight: "bold", mt: 2 }}
                    onClick={executeRemovePool}
                    style={{
                      background: (Number(value) === 0 || removing) ? "linear-gradient(to right bottom, #5e5c5c, #5f6a9d)" : "linear-gradient(to right bottom, #13a8ff, #0074f0)",
                      color: (Number(value) === 0 || removing) ? "#ddd" : "#fff",
                    }}
                    disabled={Number(value) === 0 || removing}
                  >
                    {Number(value) === 0
                      ? "Define your Liquidity Input"
                      : (removing ? "Removing Liquidity" : "Confirm")}
                  </Button>
                }
                {!account &&
                  <Button
                    size={isMobile ? "small" : "large"}
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
                }
              </div>
            </div>
          </Item>
        </Grid>
        <Grid item xs={12} sm={12} md={7} sx={{ mt: 2 }} className="chart__main">
          <Item sx={{ pt: 3, pl: 3, pr: 3, pb: 2, mb: 2 }} style={{ backgroundColor: "#12122c", borderRadius: "10px" }} className="chart">
            <div className="flex-1 w-full mb-4">
              {formattedWeightsData[0] && (
                <h3 className="model-title mb-4" style={{ fontSize: 18, color: "white" }}>
                  <b>{formattedWeightsData[0]["token0"]}</b> weight
                </h3>
              )}
              <ResponsiveContainer width="95%" height={250}>
                <LineChart
                  width={isMobile ? 400 : 500}
                  height={200}
                  data={formattedWeightsData}
                  syncId="anyId"
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis ticks={[0, 0.2, 0.4, 0.6, 0.8, 1]} />
                  <Tooltip content={<CustomTooltip0 />} />
                  <Line
                    type="monotone"
                    dataKey="weight0"
                    stroke="#8884d8"
                    fill="#8884d8"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
              {formattedWeightsData[0] && (
                <h3 className="model-title mb-4" style={{ fontSize: 18, color: "white" }}>
                  <b>{formattedWeightsData[0]["token1"]}</b> weight
                </h3>
              )}
              <ResponsiveContainer width="95%" height={250}>
                <LineChart
                  width={isMobile ? 400 : 500}
                  height={200}
                  data={formattedWeightsData}
                  syncId="anyId"
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis ticks={[0, 0.2, 0.4, 0.6, 0.8, 1]} />
                  <Tooltip content={<CustomTooltip1 />} />
                  <Line
                    type="monotone"
                    dataKey="weight1"
                    stroke="#82ca9d"
                    fill="#82ca9d"
                    strokeWidth={2}
                  />
                  <Brush height={25} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Item>
          {account &&
            <Item sx={{ pl: 3, pr: 3, pb: 2, pt: 3 }} style={{ backgroundColor: "#12122c", textAlign: "left", borderRadius: "10px" }} className="history">
              <span style={{ textAlign: "start", color: "white" }}>History:</span>
              <hr></hr>
              <History type="exit" data={transactionsData} />
            </Item>
          }
        </Grid>
        <Modal
          open={open}
          onClose={handleClose}
        >
          <StyledModal className="bg-modal">
            <h3 className="model-title mb-6" style={{ color: "#fff" }}>Remove Liquidity</h3>
            <TextField
              autoFocus={true}
              value={query}
              onChange={filterLP}
              label="Search"
              inputProps={{
                type: "search",
                style: { color: "#bbb" },
              }}
              InputLabelProps={{
                style: { color: "#bbb" },
              }}
            />
            <hr className="my-6" />
            <ul className="flex flex-col gap-y-6" style={{ overflowY: "scroll" }}>
              {filterData.map((item, index) => {
                return (
                  <li
                    key={item["address"] + index}
                    className="flex gap-x-1"
                    style={{cursor:"pointer"}}
                    onClick={() => selectToken(item)}
                  >
                    <div className="relative flex">
                      <img src={item["logoURLs"][0]} alt="" />
                      <img
                        className="z-10 relative right-2"
                        src={item["logoURLs"][1]}
                        alt=""
                      />
                    </div>
                    <p className="text-light-primary text-lg">
                      {item["symbols"][0]} - {item["symbols"][1]} LP Token
                    </p>
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
