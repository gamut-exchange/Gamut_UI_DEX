import React, { useEffect, useState } from 'react';
import { useWeb3React } from "@web3-react/core";
import { Modal, Grid, Paper, InputBase, Typography, Button } from '@mui/material'
import tw from "twin.macro";
import { styled } from "@mui/material/styles";
import {
    numFormat,
    stakePool,
    unStakePool
} from "../../config/web3";


const StyledModal = tw.div`
  flex
  flex-col
  relative
  m-auto
  top-1/4
  p-4
  min-h-min
  transform -translate-x-1/2 -translate-y-1/2
  md:w-1/3 w-10/12
`;

const Item = styled(Paper)(() => ({
    backgroundColor: "#1A2027",
    padding: "8px",
    width: "100%",
    textAlign: "center",
    color: "lightgray",
}));

const BootstrapInput = styled(InputBase)(({ theme }) => ({
    "label + &": {
        marginTop: theme.spacing(3),
    },
    "& .MuiInputBase-input": {
        borderRadius: 4,
        position: "relative",
        fontSize: 20,
        textAlign: "start",
        padding: "10px 16px 10px 0px",
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
    },
    icon: {
        color: "white",
    },
}));

export default function StakeModal({ mopen, handleClose, mtype, poolData }) {
    const { account, connector } = useWeb3React();
    const [stakeVal, setStakeVal] = useState(0);
    const [staking, setStaking] = useState(false);

    const handleStakeVal = (event) => {
        let e_val = event.target.value;
        if (e_val.charAt(0) === "0" && e_val.charAt(1) !== "." && e_val.length > 1)
            e_val = e_val.substr(1);
        setStakeVal(Number(e_val));
    }

    const setInLimit = (userlp, position) => {
        setStakeVal(userlp / position);
    }

    const executeStake = async (farmingPoolAddr, value) => {
        const provider = await connector.getProvider();
        setStaking(true);
        if (mtype === 1)
            await stakePool(account, provider, value, farmingPoolAddr, setStaking);
        else if (mtype === 2)
            await unStakePool(account, provider, value, farmingPoolAddr, setStaking);
        setStaking(false);
    }

    useEffect(() => {
        setStakeVal(0);
    }, [mopen]);

    return (
        <Modal
            open={mopen}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <StyledModal className="bg-modal">
                {mtype === 1 &&
                    <h1 className="model-title mb-3 text-wight" style={{ color: "#fff", fontWeight: "bold", fontSize: "24px" }}>Stake LP tokens</h1>
                }
                {mtype === 2 &&
                    <h1 className="model-title mb-3 text-wight" style={{ color: "#fff", fontWeight: "bold", fontSize: "24px" }}>Unstake LP tokens</h1>
                }
                <hr />
                <Grid sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", mt: 3, mb: 1 }}>
                    <Item sx={{ pl: 3, pr: 3, pb: 2 }} style={{ backgroundColor: "#09071e", borderRadius: "10px" }}>
                        <Typography sx={{ display: "flex", justifyContent: "left", width: "100%", fontSize: 16 }}>
                            Balance: {mtype === 1 ? numFormat(poolData?.userlp) : numFormat(poolData?.stakedVal)}
                        </Typography>
                        <div style={{ width: "100%", marginTop: "5px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <BootstrapInput
                                type="number"
                                value={numFormat(stakeVal)}
                                inputProps={{ min: 0, max: mtype === 1 ? Number(poolData?.userlp) : Number(poolData?.pendingReward) }}
                                onChange={(e) => handleStakeVal(e)}
                                onKeyUp={(e) => handleStakeVal(e)}
                                style={{
                                    color: "#FFFFFF",
                                    maxWidth: "70%",
                                    minWidth: "50%",
                                    float: "left",
                                    borderRadius: "6px"
                                }}
                            />
                            <Typography sx={{ fontSize: "0.9rem", fontWeight: "bold" }}>
                                {poolData?.symbols[0]}
                                {"-"}
                                {poolData?.symbols[1]}
                                {" "}LP
                            </Typography>
                        </div>
                        <div style={{ width: "100%", marginTop: "5px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography sx={{ fontSize: 12 }}>
                                ~{numFormat(poolData?.userSupplyUSD * stakeVal / (Number(poolData?.userlp) + 0.0000000000000001))}{" "}USD
                            </Typography>
                            <p style={{ display: "flex", color: "#6d6d7d" }}>
                                <span style={{ cursor: "pointer", color: stakeVal * 4 === (mtype === 1 ? Number(poolData?.userlp) : Number(poolData?.stakedVal)) ? "lightblue" : "", fontSize: 12 }}
                                    onClick={() => setInLimit(mtype === 1 ? poolData?.userlp : poolData?.stakedVal, 4)}
                                >
                                    25%
                                </span>
                                <span
                                    style={{ paddingLeft: "5px", cursor: "pointer", color: stakeVal * 2 === (mtype === 1 ? Number(poolData?.userlp) : Number(poolData?.stakedVal)) ? "lightblue" : "", fontSize: 12 }}
                                    onClick={() => setInLimit(mtype === 1 ? poolData?.userlp : poolData?.stakedVal, 2)}
                                >
                                    50%
                                </span>
                                <span
                                    style={{
                                        paddingLeft: "5px", cursor: "pointer",
                                        color: stakeVal * 1.3333 == (mtype === 1 ? Number(poolData?.userlp) : Number(poolData?.stakedVal)) ? "lightblue" : "", fontSize: 12
                                    }}
                                    onClick={() => setInLimit(mtype === 1 ? poolData?.userlp : poolData?.stakedVal, 1.3333)}
                                >
                                    75%
                                </span>
                                <span
                                    style={{ paddingLeft: "5px", cursor: "pointer", color: stakeVal * 1 === (mtype === 1 ? Number(poolData?.userlp) : Number(poolData?.stakedVal)) ? "lightblue" : "", fontSize: 12 }}
                                    onClick={() => setInLimit(mtype === 1 ? poolData?.userlp : poolData?.stakedVal, 1)}
                                >
                                    100%
                                </span>
                            </p>
                        </div>
                    </Item>
                    <div style={{ width: "100%", marginTop: "20px", display: "flex", justifyContent: "right", alignItems: "center" }}>
                        <Button
                            size="small"
                            variant="contained"
                            sx={{
                                width: "35%",
                                padding: 1,
                                fontWeight: "bold",
                                background:
                                    "linear-gradient(to right bottom, #5e5c5c, #5f6a9d)",
                                color: "#ddd!important"
                            }}
                            disabled={staking}
                            onClick={handleClose}
                        >
                            {staking?"In Progress":"Cancel"}
                        </Button>
                        {mtype === 1 &&
                            <Button
                                size="small"
                                variant="contained"
                                disabled={staking || Number(stakeVal) === 0 || Number(stakeVal) > Number(poolData?.userlp)}
                                sx={{
                                    width: "35%",
                                    background: (staking || Number(stakeVal) === 0 || Number(stakeVal) > Number(poolData?.userlp)) ?
                                        "linear-gradient(to right bottom, #5e5c5c, #5f6a9d)" : "",
                                    marginLeft: 2,
                                    padding: 1,
                                    color: (staking || Number(stakeVal) === 0 || Number(stakeVal) > Number(poolData?.userlp)) ? "#ddd!important" : "",
                                    fontWeight: "bold",
                                }}
                                onClick={() => executeStake(poolData?.farmingPoolAddress, stakeVal)}
                            >
                                {staking?"In Progress":(Number(stakeVal) === 0 ? "Set Amount" : (Number(stakeVal) > Number(poolData?.userlp) ? "Wrong Amount" : "Confirm"))}
                            </Button>
                        }
                        {mtype === 2 &&
                            <Button
                                size="small"
                                variant="contained"
                                disabled={staking || Number(stakeVal) === 0 || Number(stakeVal) > Number(poolData?.userlp)}
                                sx={{
                                    width: "35%",
                                    background: (staking || Number(stakeVal) === 0 || Number(stakeVal) > Number(poolData?.userlp)) ?
                                        "linear-gradient(to right bottom, #5e5c5c, #5f6a9d)" : "",
                                    marginLeft: 2,
                                    padding: 1,
                                    color: (staking || Number(stakeVal) === 0 || Number(stakeVal) > Number(poolData?.userlp)) ? "#ddd!important" : "",
                                    fontWeight: "bold",
                                }}
                                onClick={() => executeStake(poolData?.farmingPoolAddress, stakeVal)}
                            >
                                {staking?"In Progress":(Number(stakeVal) === 0 ? "Set Amount" : (Number(stakeVal) > Number(poolData?.stakedVal) ? "Wrong Amount" : "Confirm"))}
                            </Button>
                        }
                    </div>
                </Grid>
            </StyledModal>
        </Modal>
    )
}
