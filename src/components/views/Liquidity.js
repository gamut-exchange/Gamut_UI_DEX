import React, { useState, useMemo, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useWeb3React } from "@web3-react/core";
import { styled } from "@mui/material/styles";
import tw from "twin.macro";
import {
  Paper,
  Grid,
  useMediaQuery,
  Button,
  FormControl,
  Slider,
  Modal,
  Typography,
  InputBase,
  TextField,
  CircularProgress,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { AddCircleOutline, Settings } from "@mui/icons-material";
import {
  useWeightsData,
  useJoinTransactionsData,
} from "../../config/chartData";
import {
  getTokenBalance,
  getPoolAddress,
  getPoolData,
  joinPool,
  joinOnePool,
  tokenApproval,
  approveToken,
  calculateSwap,
} from "../../config/web3";
import { uniList } from "../../config/constants";
import { poolList } from "../../config/constants";
import { contractAddresses } from "../../config/constants";
import History from "./History";
import { createChart } from "lightweight-charts";
import SwapCmp from "./SwapCmp";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

// drop down style start
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
      color: "white",
    },
  },
  icon: {
    color: "white",
  },
}));

export default function Liquidity() {
  const grayColor = "#6d6d7d";
  const selected_chain = useSelector((state) => state.selectedChain);
  const { account, connector } = useWeb3React();

  const [setting, setSetting] = useState(false);
  const [isExist, setIsExist] = useState(false);
  const [ratio, setRatio] = useState(50);
  const [mopen, setMopen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = React.useState(0);
  const [poolAddress, setPoolAddress] = useState("");
  const [inToken, setInToken] = useState(uniList[selected_chain][0]);
  const [outToken, setOutToken] = useState(uniList[selected_chain][1]);
  const [value, setValue] = useState(0);
  const [valueEth, setValueEth] = useState(0);
  const [inBal, setInBal] = useState(0);
  const [outBal, setOutBal] = useState(0);
  // const [sliderValue, setSliderValue] = useState(50);
  const [approval, setApproval] = useState(false);
  const [filterData, setFilterData] = useState(uniList[selected_chain]);
  const [limitedout, setLimitedout] = useState(false);
  const [approval1, setApproval1] = useState(false);
  const [approval2, setApproval2] = useState(false);
  const [approvedVal1, setApprovedVal1] = useState(0);
  const [approvedVal2, setApprovedVal2] = useState(0);
  const [unlocking, setUnlocking] = useState(false);
  const [adding, setAdding] = useState(false);
  const [slippage, setSlippage] = useState(0.1);
  const [slippageFlag, setSlippageFlag] = useState(false);
  const [priceImpact, setPriceImpact] = useState(0);
  // const [deadline, setDeadline] = useState(900);
  // const [deadlineFlag, setDeadlineFlag] = useState(false);
  const [searching, setSearching] = useState(false);

  const dispatch = useDispatch();

  const weightData = useWeightsData(poolAddress.toLowerCase());
  const joinTransactionsData = useJoinTransactionsData(account);
  const isMobile = useMediaQuery("(max-width:600px)");

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

  // const handleSlider = (event, newValue) => {
  //   setSliderValue(newValue);
  //   if (inToken["address"] !== outToken["address"]) {
  //     let valEth = (ratio * (1 - newValue / 100) * value) / (newValue / 100);
  //     valEth =
  //       valEth * 1 === 0
  //         ? 0
  //         : valEth * 1 > 1
  //           ? valEth.toFixed(2)
  //           : valEth.toFixed(6);
  //     setValueEth(valEth);
  //   }
  // };

  const handleValue = async (event) => {
    let e_val = event.target.value;
    if (e_val.charAt(0) === "0" && e_val.charAt(1) !== "." && e_val.length > 1)
      e_val = e_val.substr(1);
    setValue(e_val);
    let inLimBal = inBal.toString().replaceAll(",", "");
    if (Number(e_val) <= Number(inLimBal)) setLimitedout(false);
    else setLimitedout(true);
    if (Number(e_val) === 0) {
      setRatio(0);
    } else if (Number(valueEth) === 0) {
      setRatio(100);
    } else {
      const provider = await connector.getProvider();
      const poolAddress = await getPoolAddress(
        provider,
        inToken["address"] === "0x0000000000000000000000000000000000000000"
          ? "0xc86c7C0eFbd6A49B35E8714C5f59D99De09A225b"
          : inToken["address"],
        outToken["address"] === "0x0000000000000000000000000000000000000000"
          ? "0xc86c7C0eFbd6A49B35E8714C5f59D99De09A225b"
          : outToken["address"],
        contractAddresses[selected_chain]["hedgeFactory"]
      );
      const poolData = await getPoolData(provider, poolAddress);
      calculateRatio(inToken, poolData, e_val * 1, valueEth);
    }
    if (isExist) checkApproved(inToken, outToken, e_val, valueEth);
    const provider = await connector.getProvider();
    const poolData = await getPoolData(provider, poolAddress);
    calculateImpact(
      inToken["address"] === "0x0000000000000000000000000000000000000000"
        ? "0xc86c7C0eFbd6A49B35E8714C5f59D99De09A225b"
        : inToken["address"],
      outToken["address"] === "0x0000000000000000000000000000000000000000"
        ? "0xc86c7C0eFbd6A49B35E8714C5f59D99De09A225b"
        : outToken["address"],
      poolData,
      e_val,
      valueEth
    );
  };

  const handleValueEth = async (event) => {
    let e_val = event.target.value;
    if (e_val.charAt(0) === "0" && e_val.charAt(1) !== "." && e_val.length > 1)
      e_val = e_val.substr(1);
    setValueEth(e_val);
    let outLimBal = outBal.toString().replaceAll(",", "");
    if (Number(e_val) <= Number(outLimBal)) setLimitedout(false);
    else setLimitedout(true);
    if (Number(value) === 0) {
      setRatio(0);
    } else if (Number(e_val) === 0) {
      setRatio(100);
    } else {
      const provider = await connector.getProvider();
      const poolAddress = await getPoolAddress(
        provider,
        inToken["address"] === "0x0000000000000000000000000000000000000000"
          ? "0xc86c7C0eFbd6A49B35E8714C5f59D99De09A225b"
          : inToken["address"],
        outToken["address"] === "0x0000000000000000000000000000000000000000"
          ? "0xc86c7C0eFbd6A49B35E8714C5f59D99De09A225b"
          : outToken["address"],
        contractAddresses[selected_chain]["hedgeFactory"]
      );
      const poolData = await getPoolData(provider, poolAddress);
      calculateRatio(inToken, poolData, value, e_val * 1);
    }
    if (isExist) checkApproved(inToken, outToken, value, e_val);

    const provider = await connector.getProvider();
    const poolData = await getPoolData(provider, poolAddress);
    calculateImpact(
      inToken["address"] === "0x0000000000000000000000000000000000000000"
        ? "0xc86c7C0eFbd6A49B35E8714C5f59D99De09A225b"
        : inToken["address"],
      outToken["address"] === "0x0000000000000000000000000000000000000000"
        ? "0xc86c7C0eFbd6A49B35E8714C5f59D99De09A225b"
        : outToken["address"],
      poolData,
      value,
      e_val
    );
  };

  const filterToken = (e) => {
    let search_qr = e.target.value;
    setQuery(search_qr);
    if (search_qr.length !== 0) {
      const filterDT = uniList[selected_chain].filter((item) => {
        return item["symbol"].toLowerCase().indexOf(search_qr) !== -1;
      });
      setFilterData(filterDT);
    } else {
      setFilterData(uniList[selected_chain]);
    }
  };

  const selectToken = async (token, selected) => {
    handleClose();
    var bal = 0;
    if (selected === 0) {
      setInToken(token);
    } else if (selected === 1) {
      setOutToken(token);
    }
    if (account) {
      const provider = await connector.getProvider();
      bal = await getTokenBalance(provider, token["address"], account);
      if (selected === 0) {
        setInBal(bal);
        let tempData = uniList[selected_chain].filter((item) => {
          return item["address"] !== token["address"];
        });
        setFilterData(tempData);
        try {
          setSearching(true);
          const poolAddr = await getPoolAddress(
            provider,
            token["address"] === "0x0000000000000000000000000000000000000000"
              ? "0xc86c7C0eFbd6A49B35E8714C5f59D99De09A225b"
              : token["address"],
            outToken["address"] === "0x0000000000000000000000000000000000000000"
              ? "0xc86c7C0eFbd6A49B35E8714C5f59D99De09A225b"
              : outToken["address"],
            contractAddresses[selected_chain]["hedgeFactory"]
          );
          setPoolAddress(poolAddr);
          const poolData = await getPoolData(provider, poolAddr);
          checkApproved(token, outToken, value, valueEth);
          setSearching(false);
          setIsExist(true);
          // const sliderInit = await sliderInitVal(poolData, token);
          // setSliderValue(sliderInit * 100);

          let inLimBal = bal ? bal.toString().replaceAll(",", "") : 0;
          if (Number(value) <= Number(inLimBal)) setLimitedout(false);
          else setLimitedout(true);
          if (value * 1 !== 0 || valueEth * 1 !== 0)
            calculateImpact(
              token["address"] === "0x0000000000000000000000000000000000000000"
                ? "0xc86c7C0eFbd6A49B35E8714C5f59D99De09A225b"
                : token["address"],
              outToken["address"] ===
                "0x0000000000000000000000000000000000000000"
                ? "0xc86c7C0eFbd6A49B35E8714C5f59D99De09A225b"
                : outToken["address"],
              poolData,
              value,
              valueEth
            );
        } catch (error) {
          console.log(error.message);
          setSearching(false);
          setIsExist(false);
        }
      } else if (selected === 1) {
        setOutBal(bal);
        let tempData = uniList[selected_chain].filter((item) => {
          return item["address"] !== token["address"];
        });

        setFilterData(tempData);
        setOutToken(token);

        try {
          setSearching(true);
          const poolAddr = await getPoolAddress(
            provider,
            inToken["address"] === "0x0000000000000000000000000000000000000000"
              ? "0xc86c7C0eFbd6A49B35E8714C5f59D99De09A225b"
              : inToken["address"],
            token["address"] === "0x0000000000000000000000000000000000000000"
              ? "0xc86c7C0eFbd6A49B35E8714C5f59D99De09A225b"
              : token["address"],
            contractAddresses[selected_chain]["hedgeFactory"]
          );
          setPoolAddress(poolAddr);
          const poolData = await getPoolData(provider, poolAddr);
          checkApproved(inToken, token, value, valueEth);
          setSearching(false);
          setIsExist(true);
          // const sliderInit = await sliderInitVal(poolData, inToken);
          // setSliderValue(sliderInit * 100);
          let outLimBal = bal ? bal.toString().replaceAll(",", "") : 0;
          if (Number(valueEth) <= Number(outLimBal)) setLimitedout(false);
          else setLimitedout(true);
          if (value * 1 !== 0 || valueEth * 1 !== 0)
            calculateImpact(
              inToken["address"] ===
                "0x0000000000000000000000000000000000000000"
                ? "0xc86c7C0eFbd6A49B35E8714C5f59D99De09A225b"
                : inToken["address"],
              token["address"] === "0x0000000000000000000000000000000000000000"
                ? "0xc86c7C0eFbd6A49B35E8714C5f59D99De09A225b"
                : token["address"],
              poolData,
              value,
              valueEth
            );
        } catch (error) {
          console.log(error.message);
          setSearching(false);
          setIsExist(false);
        }
      }
    }
  };

  // const sliderInitVal = async (poolData, inToken) => {
  //   // let balance_from;
  //   // let balance_to;
  //   let weight_from;
  //   // let weight_to;

  //   if (inToken["address"] === poolData.tokens[0]) {
  //     // balance_from = poolData.balances[0];
  //     // balance_to = poolData.balances[1];
  //     weight_from = poolData.weights[0];
  //     // weight_to = poolData.weights[1];
  //   } else {
  //     // balance_from = poolData.balances[1];
  //     // balance_to = poolData.balances[0];
  //     weight_from = poolData.weights[1];
  //     // weight_to = poolData.weights[0];
  //   }

  //   // let pricePool = balance_from / weight_from / (balance_to / weight_to);
  //   let x = weight_from / 10 ** 18;

  //   return x;
  // };

  const checkApproved = async (token1, token2, val1, val2) => {
    const provider = await connector.getProvider();
    let approved1 = "0";
    let approved2 = "0";
    if (token1["address"] !== "0x0000000000000000000000000000000000000000")
      approved1 = await tokenApproval(
        account,
        provider,
        token1["address"],
        contractAddresses[selected_chain]["router"]
      );
    if (token2["address"] !== "0x0000000000000000000000000000000000000000")
      approved2 = await tokenApproval(
        account,
        provider,
        token2["address"],
        contractAddresses[selected_chain]["router"]
      );

    setApproval1(
      token1["address"] === "0x0000000000000000000000000000000000000000" ||
        approved1 * 1 >= val1 * 1
    );
    setApproval2(
      token2["address"] === "0x0000000000000000000000000000000000000000" ||
        approved2 * 1 >= val2 * 1
    );
    setApprovedVal1(approved1);
    setApprovedVal2(approved2);
    setApproval(
      (token1["address"] === "0x0000000000000000000000000000000000000000" ||
        approved1 * 1 >= val1 * 1) &&
        (token2["address"] === "0x0000000000000000000000000000000000000000" ||
          approved2 * 1 >= val2 * 1)
    );
  };

  const calculateRatio = async (inToken, poolData, input, output) => {
    let weight_from;
    let weight_to;
    let balance_from;
    let balance_to;
    let decimal_from;
    let decimal_to;
    const in_token =
      inToken["address"] === "0x0000000000000000000000000000000000000000"
        ? "0xc86c7C0eFbd6A49B35E8714C5f59D99De09A225b"
        : inToken["address"];
    if (in_token.toLowerCase() === poolData.tokens[0].toLowerCase()) {
      balance_from = poolData.balances[0];
      balance_to = poolData.balances[1];
      weight_from = poolData.weights[0];
      weight_to = poolData.weights[1];
      decimal_from = poolData.decimals[0];
      decimal_to = poolData.decimals[1];
    } else {
      weight_from = poolData.weights[1];
      weight_to = poolData.weights[0];
      balance_from = poolData.balances[1];
      balance_to = poolData.balances[0];
      decimal_from = poolData.decimals[1];
      decimal_to = poolData.decimals[0];
    }
    let price =
      balance_to /
      10 ** decimal_to /
      weight_to /
      (balance_from / 10 ** decimal_from / weight_from);
    let calc_ratio = (input * price) / (input * price + output);
    setRatio(calc_ratio * 100);
  };

  const calculateImpact = async (
    in_token,
    out_token,
    poolData,
    inVal,
    outVal
  ) => {
    let weight_from;
    let weight_to;
    let balance_from;
    let balance_to;
    let decimal_from;
    let decimal_to;
    let amount1 = 0;
    let amount2 = 0;

    if (in_token.toLowerCase() === poolData.tokens[0].toLowerCase()) {
      balance_from = poolData.balances[0];
      balance_to = poolData.balances[1];
      weight_from = poolData.weights[0];
      weight_to = poolData.weights[1];
      decimal_from = poolData.decimals[0];
      decimal_to = poolData.decimals[1];
      amount1 = inVal;
      amount2 = outVal;
    } else {
      weight_from = poolData.weights[1];
      weight_to = poolData.weights[0];
      balance_from = poolData.balances[1];
      balance_to = poolData.balances[0];
      decimal_from = poolData.decimals[1];
      decimal_to = poolData.decimals[0];
      amount1 = outVal;
      amount2 = inVal;
    }

    let price =
      balance_to /
      10 ** decimal_to /
      weight_to /
      (balance_from / 10 ** decimal_from / weight_from);
    let remain_amount = 0;
    if (amount1 > amount2 * price) {
      remain_amount = (amount1 - amount2 * price) / (2 * price);
      let amountOut = await calculateSwap(
        in_token.toLowerCase() === poolData.tokens[0].toLowerCase()
          ? out_token
          : in_token,
        poolData,
        remain_amount
      );
      setPriceImpact(
        numFormat(
          (amountOut / (remain_amount * price + 0.000000000000001) - 1) * 100
        )
      );
    } else {
      remain_amount = (amount2 * price - amount1) / 2;
      let amountOut = await calculateSwap(
        in_token.toLowerCase() === poolData.tokens[0].toLowerCase()
          ? in_token
          : out_token,
        poolData,
        remain_amount
      );

      setPriceImpact(
        numFormat(
          (amountOut /
            (remain_amount / (price + 0.000000000000000001) +
              0.0000000000000001) -
            1) *
            100
        )
      );
    }
  };

  const executeAddPool = async () => {
    if (inToken["address"] !== outToken["address"]) {
      const provider = await connector.getProvider();
      setAdding(true);
      if (Number(value) !== 0 && Number(valueEth) !== 0)
        await joinPool(
          account,
          provider,
          inToken["address"] === "0x0000000000000000000000000000000000000000"
            ? "0xc86c7C0eFbd6A49B35E8714C5f59D99De09A225b"
            : inToken["address"],
          outToken["address"] === "0x0000000000000000000000000000000000000000"
            ? "0xc86c7C0eFbd6A49B35E8714C5f59D99De09A225b"
            : outToken["address"],
          value,
          valueEth,
          slippage * 0.01,
          contractAddresses[selected_chain]["router"],
          contractAddresses[selected_chain]["hedgeFactory"],
          inToken["address"] === "0x0000000000000000000000000000000000000000",
          outToken["address"] === "0x0000000000000000000000000000000000000000"
        );
      else
        await joinOnePool(
          account,
          provider,
          inToken["address"] === "0x0000000000000000000000000000000000000000"
            ? "0xc86c7C0eFbd6A49B35E8714C5f59D99De09A225b"
            : inToken["address"],
          outToken["address"] === "0x0000000000000000000000000000000000000000"
            ? "0xc86c7C0eFbd6A49B35E8714C5f59D99De09A225b"
            : outToken["address"],
          value,
          valueEth,
          slippage * 0.01,
          contractAddresses[selected_chain]["router"],
          contractAddresses[selected_chain]["hedgeFactory"],
          inToken["address"] === "0x0000000000000000000000000000000000000000",
          outToken["address"] === "0x0000000000000000000000000000000000000000"
        );
      setAdding(false);
      let n_inBal = await getTokenBalance(
        provider,
        inToken["address"],
        account
      );
      let n_outBal = await getTokenBalance(
        provider,
        outToken["address"],
        account
      );
      setInBal(n_inBal);
      setOutBal(n_outBal);
      setValue(0);
      setValueEth(0);
    }
  };

  const clickConWallet = () => {
    document.getElementById("connect_wallet_btn").click();
  };

  const approveTK1 = async (toVal) => {
    if (account) {
      const provider = await connector.getProvider();
      setUnlocking(true);
      const approved1 = await approveToken(
        account,
        provider,
        inToken["address"],
        toVal * 1.1,
        contractAddresses[selected_chain]["router"]
      );
      setUnlocking(false);
      setApproval1(approved1 * 1 > value * 1);
      setApprovedVal1(approved1);
      setApproval(approved1 > value * 1 && approval2);
    }
  };

  const approveTK2 = async (toVal) => {
    if (account) {
      const provider = await connector.getProvider();
      setUnlocking(true);
      const approved2 = await approveToken(
        account,
        provider,
        outToken["address"],
        toVal * 1.1,
        contractAddresses[selected_chain]["router"]
      );
      setUnlocking(false);
      setApproval2(approved2 * 1 > valueEth * 1);
      setApprovedVal2(approved2);
      setApproval(approval1 && approved2 > valueEth * 1);
    }
  };

  const setInLimit = async (position) => {
    if (inBal) {
      let val1 = inBal ? inBal.toString().replaceAll(",", "") : 0;
      setValue(val1 / position);
      setLimitedout(false);
      if (account && isExist)
        checkApproved(inToken, outToken, val1 / position, valueEth);
      if (Number(val1 / position) === 0) {
        setRatio(0);
      } else if (Number(valueEth) === 0) {
        setRatio(100);
      } else {
        const provider = await connector.getProvider();
        const poolAddress = await getPoolAddress(
          provider,
          inToken["address"] === "0x0000000000000000000000000000000000000000"
            ? "0xc86c7C0eFbd6A49B35E8714C5f59D99De09A225b"
            : inToken["address"],
          outToken["address"] === "0x0000000000000000000000000000000000000000"
            ? "0xc86c7C0eFbd6A49B35E8714C5f59D99De09A225b"
            : outToken["address"],
          contractAddresses[selected_chain]["hedgeFactory"]
        );
        const poolData = await getPoolData(provider, poolAddress);
        calculateRatio(inToken, poolData, val1 / position, valueEth);
        calculateImpact(
          inToken["address"] === "0x0000000000000000000000000000000000000000"
            ? "0xc86c7C0eFbd6A49B35E8714C5f59D99De09A225b"
            : inToken["address"],
          outToken["address"] === "0x0000000000000000000000000000000000000000"
            ? "0xc86c7C0eFbd6A49B35E8714C5f59D99De09A225b"
            : outToken["address"],
          poolData,
          val1 / position,
          valueEth
        );
      }
      if (isExist) checkApproved(inToken, outToken, val1 / position, valueEth);
    }
  };

  const setOutLimit = async (position) => {
    if (outBal) {
      let val2 = outBal.toString().replaceAll(",", "");
      setValueEth(val2 / position);
      setLimitedout(false);
      if (account && isExist)
        checkApproved(inToken, outToken, value, val2 / position);
      if (Number(value) === 0) {
        setRatio(0);
      } else if (Number(val2 / position) === 0) {
        setRatio(100);
      } else {
        const provider = await connector.getProvider();
        const poolAddress = await getPoolAddress(
          provider,
          inToken["address"] === "0x0000000000000000000000000000000000000000"
            ? "0xc86c7C0eFbd6A49B35E8714C5f59D99De09A225b"
            : inToken["address"],
          outToken["address"] === "0x0000000000000000000000000000000000000000"
            ? "0xc86c7C0eFbd6A49B35E8714C5f59D99De09A225b"
            : outToken["address"],
          contractAddresses[selected_chain]["hedgeFactory"]
        );
        const poolData = await getPoolData(provider, poolAddress);
        calculateRatio(inToken, poolData, value, val2 / position);
        calculateImpact(
          inToken["address"] === "0x0000000000000000000000000000000000000000"
            ? "0xc86c7C0eFbd6A49B35E8714C5f59D99De09A225b"
            : inToken["address"],
          outToken["address"] === "0x0000000000000000000000000000000000000000"
            ? "0xc86c7C0eFbd6A49B35E8714C5f59D99De09A225b"
            : outToken["address"],
          poolData,
          value,
          val2 / position
        );
      }
      if (isExist) checkApproved(inToken, outToken, value, val2 / position);
    }
  };

  const getCurrentPoolAddress = async () => {
    for (var i = 0; i < poolList[selected_chain].length; i++) {
      if (
        (poolList[selected_chain][i]["symbols"][0] === inToken["symbol"] &&
          poolList[selected_chain][i]["symbols"][1] === outToken["symbol"]) ||
        (poolList[selected_chain][i]["symbols"][1] === inToken["symbol"] &&
          poolList[selected_chain][i]["symbols"][0] === outToken["symbol"])
      ) {
        setPoolAddress(poolList[selected_chain][i]["address"].toLowerCase());
        break;
      }
    }
  };

  const getInitialInfo = async () => {
    try {
      setSearching(true);
      const provider = await connector.getProvider();
      const poolAddress = await getPoolAddress(
        provider,
        inToken["address"] === "0x0000000000000000000000000000000000000000"
          ? "0xc86c7C0eFbd6A49B35E8714C5f59D99De09A225b"
          : inToken["address"],
        outToken["address"] === "0x0000000000000000000000000000000000000000"
          ? "0xc86c7C0eFbd6A49B35E8714C5f59D99De09A225b"
          : outToken["address"],
        contractAddresses[selected_chain]["hedgeFactory"]
      );
      // const poolData = await getPoolData(provider, poolAddress);
      setSearching(false);
      setIsExist(true);
      setPoolAddress(poolAddress);
      // await calculateRatio(inToken, poolData, value);
    } catch (error) {
      setSearching(false);
      setIsExist(false);
    }
  };

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

  const numFormat = (val) => {
    console.log(val);
    if (Math.abs(val) > 1) return Number(val).toFixed(2) * 1;
    else if (Math.abs(val) > 0.001) return Number(val).toFixed(4) * 1;
    else if (Math.abs(val) > 0.00001) return Number(val).toFixed(6) * 1;
    else return Number(val).toFixed(8) * 1;
  };

  const valueLabelFormat = (value) => {
    return value + "%";
  };

  useEffect(() => {
    setFilterData(uniList[selected_chain]);
    selectToken(uniList[selected_chain][0], 0);
    selectToken(uniList[selected_chain][1], 1);
    if (account) {
      if (
        inToken["address"].toLowerCase() !== outToken["address"].toLowerCase()
      ) {
        getInitialInfo();
        const intervalId = setInterval(() => {
          getInitialInfo();
        }, 40000);
        return () => clearInterval(intervalId);
      }
    } else {
      getCurrentPoolAddress();
      const intervalId = setInterval(() => {
        getCurrentPoolAddress();
      }, 40000);
      return () => clearInterval(intervalId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, dispatch, selected_chain]);

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
      if (
        joinTransactionsData.joins &&
        joinTransactionsData.joins.length !== 0
      ) {
        let result = [];
        result = joinTransactionsData.joins.map((item) => {
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
  }, [joinTransactionsData]);

  // Chart =====================================================================>
  const [noChartData, setNoChartData] = useState(false);
  const chartOneRef = useRef();
  const chartTwoRef = useRef();
  var chartOne;
  var chartTwo;
  var areaSeriesOne = null;
  var areaSeriesTwo = null;

  const formattedWeightDataOne = useMemo(() => {
    if (weightData && weightData.weights) {
      return weightData.weights.map((item, index) => {
        var tempArr = {};
        tempArr["time"] = Number(item.timestamp);
        tempArr["value"] = Number(Number(item.weight0).toFixed(2));
        return tempArr;
      });
    } else {
      return [];
    }
  }, [weightData]);

  const formattedWeightDataTwo = useMemo(() => {
    if (weightData && weightData.weights) {
      return weightData.weights.map((item, index) => {
        var tempArr = {};
        tempArr["time"] = Number(item.timestamp);
        tempArr["value"] = Number(Number(item.weight1).toFixed(2));
        return tempArr;
      });
    } else {
      return [];
    }
  }, [weightData]);

  function syncToIntervalOne() {
    if (areaSeriesOne) {
      chartOne.removeSeries(areaSeriesOne);
      areaSeriesOne = null;
    }
    areaSeriesOne = chartOne.addAreaSeries({
      topColor: "#0580f482",
      bottomColor: "#0580f42e",
      lineColor: "#0580f4",
      lineWidth: 2,
    });
    areaSeriesOne.applyOptions({
      priceFormat: {
        type: "price",
        precision: 6,
        minMove: 0.000001,
      },
    });
    areaSeriesOne.setData(formattedWeightDataOne);
  }

  function syncToIntervalTwo() {
    if (areaSeriesTwo) {
      chartTwo.removeSeries(areaSeriesTwo);
      areaSeriesOne = null;
    }
    areaSeriesTwo = chartTwo.addAreaSeries({
      topColor: "#0580f482",
      bottomColor: "#0580f42e",
      lineColor: "#0580f4",
      lineWidth: 2,
    });
    areaSeriesTwo.applyOptions({
      priceFormat: {
        type: "price",
        precision: 6,
        minMove: 0.000001,
      },
    });
    areaSeriesTwo.setData(formattedWeightDataTwo);
  }

  const loadChart = () => {
    console.log(chartOneRef.current);
    if (chartOneRef.current !== null && chartOneRef.current !== null) {
      if (chartOneRef.current.children[0]) {
        chartOneRef.current.removeChild(chartOneRef.current.children[0]);
      }
      if (chartTwoRef.current.children[0]) {
        chartTwoRef.current.removeChild(chartTwoRef.current.children[0]);
      }
    } else return;

    chartOne = createChart(chartOneRef.current, {
      height: 250,
      layout: {
        backgroundColor: "#12122c",
        textColor: "#d1d4dc",
      },
      grid: {
        vertLines: {
          visible: false,
        },
        horzLines: {
          color: "rgba(42, 46, 57, 0.5)",
        },
      },
      priceFormat: {
        type: "price",
        precision: 5,
      },
      rightPriceScale: {
        borderVisible: false,
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderVisible: false,
      },
      crosshair: {
        horzLine: {
          visible: false,
        },
      },
    });
    chartTwo = createChart(chartTwoRef.current, {
      height: 250,
      layout: {
        backgroundColor: "#12122c",
        textColor: "#d1d4dc",
      },
      grid: {
        vertLines: {
          visible: false,
        },
        horzLines: {
          color: "rgba(42, 46, 57, 0.5)",
        },
      },
      priceFormat: {
        type: "price",
        precision: 5,
      },
      rightPriceScale: {
        borderVisible: false,
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderVisible: false,
      },
      crosshair: {
        horzLine: {
          visible: false,
        },
      },
    });
    syncToIntervalOne();
    syncToIntervalTwo();
  };

  useEffect(() => {
    if (formattedWeightsData && formattedWeightsData.length !== 0) {
      setNoChartData(false);
      loadChart();
    } else setNoChartData(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formattedWeightsData]);

  // Chart =====================================================================<

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Grid
        container
        sx={{ maxWidth: "1220px" }}
        border={0}
        columnSpacing={{ xs: 0, sm: 0, md: 2, lg: 2 }}
      >
        <SwapCmp />
        <Grid
          item
          xs={12}
          sm={12}
          md={5}
          sx={{ mt: 2 }}
          className="home__mainC"
        >
          <Item
            sx={{ pl: 3, pr: 3, pb: 2 }}
            style={{ backgroundColor: "#12122c", borderRadius: "10px" }}
            className="home__main"
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Typography
                variant="h5"
                sx={{ fontWeight: "600", color: "white" }}
                gutterBottom
                style={{ textAlign: "left", margin: "12px 0px" }}
              >
                Add Liquidity
              </Typography>
              {/* <span
                onClick={() => setSetting(!setting)}
                style={{
                  color: "white",
                  float: "right",
                  cursor: "pointer",
                  marginTop: "15px",
                }}
              >
                <Settings />
              </span> */}
            </div>
            {/* {setting ? (
              <div>
                <div className="s" style={{ float: "left", width: "100%" }}>
                  <span style={{ float: "left", color: grayColor }}>
                    Max Slippage:
                  </span>
                  <span style={{ float: "right", color: grayColor }}>
                    <span
                      onClick={() => {
                        setSlippage(0.1);
                      }}
                      style={{
                        color: slippage === 0.1 ? "lightblue" : "",
                        cursor: "pointer",
                      }}
                    >
                      0.1%
                    </span>
                    <span
                      onClick={() => {
                        setSlippage(0.5);
                      }}
                      style={{
                        paddingLeft: "5px",
                        color: slippage === 0.5 ? "lightblue" : "",
                        cursor: "pointer",
                      }}
                    >
                      0.5%
                    </span>
                    <span
                      onClick={() => {
                        setSlippage(1);
                      }}
                      style={{
                        paddingLeft: "5px",
                        color: slippage === 1 ? "lightblue" : "",
                        cursor: "pointer",
                      }}
                    >
                      1%
                    </span>
                    <span
                      onClick={() => {
                        setSlippageFlag(!slippageFlag);
                      }}
                      style={{ paddingLeft: "5px", cursor: "pointer" }}
                    >
                      custom
                    </span>
                  </span>
                  {slippageFlag && (
                    <Slider
                      size="small"
                      value={slippage}
                      aria-label="Default"
                      min={0.1}
                      max={10}
                      step={0.1}
                      valueLabelDisplay="auto"
                      getAriaValueText={valueLabelFormat}
                      valueLabelFormat={valueLabelFormat}
                      onChange={(e) => setSlippage(Number(e.target.value))}
                    />
                  )}
                </div>
                <br />
                <br />
                <br />
              </div>
            ) : null} */}
            <FormControl
              sx={{ m: 0 }}
              style={{ alignItems: "flex-start", display: "inline" }}
              variant="standard"
            >
              <span
                style={{
                  color: "white",
                  fontWeight: "500",
                  fontSize: "16px",
                  display: "block",
                  textAlign: "left",
                }}
              >
                From
              </span>
              <div style={{ backgroundColor: "#12122c" }} className="py-2">
                <Button
                  onClick={() => handleMopen(0)}
                  style={{
                    width: "30%",
                    float: "left",
                    border: "0px",
                    padding: "9px 8px",
                    fontSize: "13px",
                    backgroundColor: "#07071c",
                    minHeight: 49,
                  }}
                  startIcon={
                    <img
                      src={inToken["logoURL"]}
                      alt=""
                      style={{ height: 30 }}
                    />
                  }
                >
                  {inToken["symbol"]}
                  <KeyboardArrowDownIcon />
                </Button>
                <BootstrapInput
                  type="number"
                  value={value}
                  inputProps={{
                    min: 0,
                    max: Number(inBal.toString().replaceAll(",", "")),
                  }}
                  onChange={handleValue}
                  readOnly={!isExist || !account}
                  style={{
                    color: "#FFFFFF",
                    width: "70%",
                    float: "left",
                    borderLeft: "1px solid white",
                    borderRadius: "14px",
                  }}
                />
              </div>
              <div style={{ float: "left", width: "100%" }}>
                <span style={{ float: "left", color: grayColor }}>
                  Balance: {inBal}
                </span>
                <span style={{ float: "right", color: grayColor }}>
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() => setInLimit(4)}
                  >
                    25%
                  </span>
                  <span
                    style={{ paddingLeft: "5px", cursor: "pointer" }}
                    onClick={() => setInLimit(2)}
                  >
                    50%
                  </span>
                  <span
                    style={{ paddingLeft: "5px", cursor: "pointer" }}
                    onClick={() => setInLimit(1.3333)}
                  >
                    75%
                  </span>
                  <span
                    style={{ paddingLeft: "5px", cursor: "pointer" }}
                    onClick={() => setInLimit(1)}
                  >
                    100%
                  </span>
                </span>
              </div>
            </FormControl>
            <div style={{ padding: "10px 0px" }}>
              <AddCircleOutline
                sx={{ color: "white", fontSize: "32px", mt: 3, mb: 1 }}
              />
            </div>
            {/* Drop down Start  */}
            <FormControl
              sx={{ m: 0 }}
              style={{
                alignItems: "flex-start",
                display: "block",
                float: "left",
              }}
              variant="standard"
            >
              <span
                style={{
                  color: "white",
                  fontWeight: "500",
                  fontSize: "16px",
                  display: "block",
                  textAlign: "left",
                }}
              >
                To
              </span>
              <div
                style={{
                  backgroundColor: "#12122c",
                  display: "block",
                  float: "left",
                  width: "100%",
                }}
                className="py-1"
              >
                <Button
                  onClick={() => handleMopen(1)}
                  style={{
                    width: "30%",
                    float: "left",
                    border: "0px",
                    padding: "9px 8px",
                    fontSize: "13px",
                    backgroundColor: "#07071c",
                    minHeight: 49,
                  }}
                  startIcon={
                    <img
                      src={outToken["logoURL"]}
                      alt=""
                      style={{ height: 30 }}
                    />
                  }
                >
                  {outToken["symbol"]}
                  <KeyboardArrowDownIcon />
                </Button>
                <BootstrapInput
                  type="number"
                  inputProps={{
                    min: 0,
                    max: Number(outBal.toString().replaceAll(",", "")),
                  }}
                  onChange={handleValueEth}
                  value={valueEth}
                  readOnly={!isExist || !account}
                  style={{
                    color: "#FFFFFF",
                    width: "70%",
                    float: "left",
                    borderLeft: "1px solid white",
                    borderRadius: "14px",
                  }}
                />
              </div>
              <div style={{ float: "left", display: "block", width: "100%" }}>
                <span style={{ color: grayColor, float: "left" }}>
                  Balance: {outBal}
                </span>
                <p style={{ float: "right", color: grayColor }}>
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() => setOutLimit(4)}
                  >
                    25%
                  </span>
                  <span
                    style={{ paddingLeft: "5px", cursor: "pointer" }}
                    onClick={() => setOutLimit(2)}
                  >
                    50%
                  </span>
                  <span
                    style={{ paddingLeft: "5px", cursor: "pointer" }}
                    onClick={() => setOutLimit(1.3333)}
                  >
                    75%
                  </span>
                  <span
                    style={{ paddingLeft: "5px", cursor: "pointer" }}
                    onClick={() => setOutLimit(1)}
                  >
                    100%
                  </span>
                </p>
              </div>
              <div
                style={{
                  color: "white",
                  marginTop: "12px",
                  width: "100%",
                }}
                className="flex justify-between items-center pt-4"
              >
                <span style={{ float: "left", paddingLeft: "0px" }}>
                  Ratio {ratio.toPrecision(6)}% {inToken["symbol"]} +{" "}
                  {(100 - ratio).toPrecision(6)}% {outToken["symbol"]}
                </span>
                {/* Setting ---------------------- */}
                <span
                  onClick={() => setSetting(!setting)}
                  style={{
                    color: "white",
                    float: "right",
                    cursor: "pointer",
                  }}
                >
                  <Settings />
                </span>
              </div>
              {setting ? (
                <div className="pb-1">
                  <br />
                  <div className="s" style={{ float: "left", width: "100%" }}>
                    <span style={{ float: "left", color: grayColor }}>
                      Max Slippage:
                    </span>
                    <span style={{ float: "right", color: grayColor }}>
                      <span
                        onClick={() => {
                          setSlippage(0.1);
                        }}
                        style={{
                          color: slippage === 0.1 ? "lightblue" : "",
                          cursor: "pointer",
                        }}
                      >
                        0.1%
                      </span>
                      <span
                        onClick={() => {
                          setSlippage(0.5);
                        }}
                        style={{
                          paddingLeft: "5px",
                          color: slippage === 0.5 ? "lightblue" : "",
                          cursor: "pointer",
                        }}
                      >
                        0.5%
                      </span>
                      <span
                        onClick={() => {
                          setSlippage(1);
                        }}
                        style={{
                          paddingLeft: "5px",
                          color: slippage === 1 ? "lightblue" : "",
                          cursor: "pointer",
                        }}
                      >
                        1%
                      </span>
                      <span
                        onClick={() => {
                          setSlippageFlag(!slippageFlag);
                        }}
                        style={{ paddingLeft: "5px", cursor: "pointer" }}
                      >
                        custom
                      </span>
                    </span>
                    {slippageFlag && (
                      <Slider
                        size="small"
                        value={slippage}
                        aria-label="Default"
                        min={0.1}
                        max={10}
                        step={0.1}
                        valueLabelDisplay="auto"
                        getAriaValueText={valueLabelFormat}
                        valueLabelFormat={valueLabelFormat}
                        onChange={(e) => setSlippage(Number(e.target.value))}
                      />
                    )}
                  </div>
                  <br />
                </div>
              ) : null}
              {/* Settings ------------------------ */}
              <div style={{ float: "left", width: "100%", marginTop: "10px" }}>
                <span style={{ float: "left", color: "white" }}>
                  Price Impact:
                </span>
                <div style={{ float: "right", display: "inline" }}>
                  <span style={{ textAlign: "right", color: "white" }}>
                    {priceImpact}%
                  </span>
                </div>
              </div>
              <br />
            </FormControl>
            <div style={{ textAlign: "left" }}>
              <div>
                {account && !searching && (
                  <>
                    {isExist &&
                    !limitedout &&
                    (Number(value) > 0 || Number(valueEth) > 0) ? (
                      <>
                        {approval ? (
                          <Button
                            size={isMobile ? "small" : "large"}
                            variant="contained"
                            sx={{
                              width: "100%",
                              padding: 2,
                              fontWeight: "bold",
                              mt: 2,
                            }}
                            onClick={executeAddPool}
                            style={{
                              background: adding
                                ? "linear-gradient(to right bottom, #5e5c5c, #5f6a9d)"
                                : "linear-gradient(to right bottom, #13a8ff, #0074f0)",
                              color: adding ? "#ddd" : "#fff",
                              textAlign: "center",
                              marginRight: "8px",
                            }}
                            className={
                              adding
                                ? "btn-disabled font-bold w-full dark:text-black flex-1 mt-20"
                                : "btn-primary font-bold w-full dark:text-black flex-1 mt-20"
                            }
                            disabled={limitedout || !isExist || adding}
                          >
                            {adding ? "Adding Liquidity" : "Add Liquidity"}
                          </Button>
                        ) : (
                          <div className="">
                            <Button
                              size="large"
                              variant="contained"
                              sx={{
                                width: "100%",
                                padding: 2,
                                fontWeight: "bold",
                                mt: 2,
                              }}
                              onClick={() => {
                                !approval1
                                  ? approveTK1(Number(value))
                                  : approveTK2(Number(valueEth));
                              }}
                              style={{
                                background: unlocking
                                  ? "linear-gradient(to right bottom, #5e5c5c, #5f6a9d)"
                                  : "linear-gradient(to right bottom, #13a8ff, #0074f0)",
                                color: unlocking ? "#ddd" : "#fff",
                                textAlign: "center",
                                marginRight: "8px",
                                maxHeight: 57,
                              }}
                              className={
                                unlocking
                                  ? "btn-disabled font-bold w-full dark:text-black flex-1 mr-2"
                                  : "btn-primary font-bold w-full dark:text-black flex-1 mr-2"
                              }
                              disabled={unlocking}
                            >
                              {unlocking
                                ? "Unlocking..."
                                : !approval1
                                ? "Unlock " +
                                  numFormat(value - approvedVal1)
                                    .toString()
                                    .concat(" ", inToken["value"].toUpperCase())
                                : "Unlock " +
                                  Number(valueEth - approvedVal2)
                                    .toFixed(4)
                                    .toString()
                                    .concat(
                                      "",
                                      outToken["value"].toUpperCase()
                                    )}
                            </Button>
                            <Button
                              size="large"
                              variant="contained"
                              sx={{
                                width: "100%",
                                padding: 2,
                                fontWeight: "bold",
                                mt: 2,
                              }}
                              onClick={() => {
                                !approval1
                                  ? approveTK1(9999999)
                                  : approveTK2(9999999);
                              }}
                              style={{
                                background: unlocking
                                  ? "linear-gradient(to right bottom, #5e5c5c, #5f6a9d)"
                                  : "linear-gradient(to right bottom, #13a8ff, #0074f0)",
                                color: unlocking ? "#ddd" : "#fff",
                                textAlign: "center",
                                marginRight: "8px",
                                maxHeight: 57,
                              }}
                              className={
                                unlocking
                                  ? "btn-disabled font-bold w-full dark:text-black flex-1 mr-2"
                                  : "btn-primary font-bold w-full dark:text-black flex-1 mr-2"
                              }
                              disabled={unlocking}
                            >
                              {unlocking ? "Unlocking..." : "Infinite Unlock"}
                            </Button>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="">
                        <Button
                          size={isMobile ? "small" : "large"}
                          variant="contained"
                          sx={{
                            width: "100%",
                            padding: 2,
                            fontWeight: "bold",
                            mt: 2,
                          }}
                          className="btn-disabled font-bold w-full dark:text-black mt-20 flex-1"
                          style={{
                            background:
                              "linear-gradient(to right bottom, #5e5c5c, #5f6a9d)",
                            color: "#ddd",
                            textAlign: "center",
                            marginRight: "8px",
                            maxHeight: 57,
                          }}
                        >
                          {""}
                          {!isExist
                            ? "Invalid Pair"
                            : Number(inBal.toString().replaceAll(",", "")) <=
                                0 ||
                              Number(outBal.toString().replaceAll(",", "")) <= 0
                            ? "Insufficient Blanance"
                            : "Define your token amounts"}
                        </Button>
                      </div>
                    )}
                  </>
                )}

                {searching && (
                  <div className="">
                    <Button
                      size={isMobile ? "small" : "large"}
                      variant="contained"
                      sx={{
                        width: "100%",
                        padding: 2,
                        fontWeight: "bold",
                        mt: 2,
                      }}
                      className="btn-disabled font-bold w-full dark:text-black mt-20 flex-1"
                      style={{
                        background:
                          "linear-gradient(to right bottom, #5e5c5c, #5f6a9d)",
                        color: "#ddd",
                        textAlign: "center",
                        marginRight: "8px",
                        maxHeight: 57,
                      }}
                    >
                      {""}
                      {"Searching Liquidity Pool"}
                    </Button>
                  </div>
                )}

                {!account && (
                  <Button
                    size={isMobile ? "small" : "large"}
                    variant="contained"
                    sx={{
                      width: "100%",
                      padding: 2,
                      fontWeight: "bold",
                      mt: 2,
                    }}
                    onClick={clickConWallet}
                    style={{
                      background:
                        "linear-gradient(to right bottom, #13a8ff, #0074f0)",
                      color: "#fff",
                      textAlign: "center",
                      marginRight: "8px",
                      maxHeight: 57,
                    }}
                    className="btn-primary font-bold w-full dark:text-black flex-1"
                  >
                    {"Connect to Wallet"}
                  </Button>
                )}
              </div>
            </div>
          </Item>
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={7}
          sx={{ mt: 2 }}
          className="chart__main"
        >
          <Item
            sx={{ pt: 3, pl: 3, pr: 3, pb: 2, mb: 2 }}
            style={{ backgroundColor: "#12122c", borderRadius: "10px" }}
            className="chart"
          >
            <div className="flex-1 w-full mb-4">
              {formattedWeightsData[0] && (
                <h3
                  className="model-title mb-2"
                  style={{ fontSize: 18, color: "white" }}
                >
                  <b>{formattedWeightsData[0]["token0"]}</b> weight
                </h3>
              )}
              {!searching && (
                // Chart #1 -------------------------------------------------------------------------- tDAI weight
                <div ref={chartOneRef} className="w-full" />
                // <ResponsiveContainer width="95%" height={250}>
                //   <LineChart
                //     width={500}
                //     height={200}
                //     data={formattedWeightsData}
                //     syncId="anyId"
                //     margin={{
                //       top: 10,
                //       right: 30,
                //       left: 0,
                //       bottom: 0,
                //     }}
                //   >
                //     <CartesianGrid strokeDasharray="3 3" />
                //     {/* <XAxis dataKey="name" /> */}
                //     <YAxis ticks={[0, 0.2, 0.4, 0.6, 0.8, 1]} />
                //     <Tooltip content={<CustomTooltip0 />} />
                //     <Line
                //       type="monotone"
                //       dataKey="weight0"
                //       stroke="#8884d8"
                //       fill="#8884d8"
                //       strokeWidth={2}
                //     />
                //   </LineChart>
                // </ResponsiveContainer>
              )}
              {searching && (
                <div style={{ minHeight: "374px", textAlign: "center" }}>
                  <CircularProgress style={{ marginTop: "155px" }} />
                </div>
              )}
              {formattedWeightsData[0] && (
                <h3
                  className="model-title mb-2 mt-4"
                  style={{ fontSize: 18, color: "white" }}
                >
                  <b>{formattedWeightsData[0]["token1"]}</b> weight
                </h3>
              )}
              {!searching && (
                // Chart #2 -------------------------------------------------------------------------- tDAI weight
                <div ref={chartTwoRef} className="w-full" />
                // <ResponsiveContainer width="95%" height={250}>
                //   <LineChart
                //     width={500}
                //     height={200}
                //     data={formattedWeightsData}
                //     syncId="anyId"
                //     margin={{
                //       top: 10,
                //       right: 30,
                //       left: 0,
                //       bottom: 0,
                //     }}
                //   >
                //     <CartesianGrid strokeDasharray="3 3" />
                //     {/* <XAxis dataKey="name" /> */}
                //     <YAxis ticks={[0, 0.2, 0.4, 0.6, 0.8, 1]} />
                //     <Tooltip content={<CustomTooltip1 />} />
                //     <Line
                //       type="monotone"
                //       dataKey="weight1"
                //       stroke="#82ca9d"
                //       fill="#82ca9d"
                //       strokeWidth={2}
                //     />
                //     {/* <Brush height={25} /> */}
                //   </LineChart>
                // </ResponsiveContainer>
              )}
              {searching && (
                <div style={{ minHeight: "374px", textAlign: "center" }}>
                  <CircularProgress style={{ marginTop: "155px" }} />
                </div>
              )}
            </div>
          </Item>
          {account && (
            <Item
              sx={{ pl: 3, pr: 3, pb: 2, pt: 3 }}
              style={{
                backgroundColor: "#12122c",
                textAlign: "left",
                borderRadius: "10px",
              }}
              className="history"
            >
              <span style={{ textAlign: "start", color: "white" }}>
                History:
              </span>
              <hr></hr>
              <History type="join" data={transactionsData} />
            </Item>
          )}
        </Grid>
        <Modal
          open={mopen}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <StyledModal className="bg-modal">
            <h3
              className="model-title mb-6 text-wight"
              style={{ color: "#fff" }}
            >
              Select Token
            </h3>
            <TextField
              autoFocus={true}
              value={query}
              onChange={filterToken}
              label="Search"
              inputProps={{
                type: "search",
                style: { color: "#ddd" },
              }}
              InputLabelProps={{
                style: { color: "#ddd" },
              }}
            />
            <hr className="my-6" />
            <ul
              className="flex flex-col gap-y-2"
              style={{ overflowY: "scroll" }}
            >
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
