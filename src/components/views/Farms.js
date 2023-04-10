import React, { useState } from 'react';
import { useWeb3React } from "@web3-react/core";
import { AccordionDetails, AccordionSummary, Accordion, Grid, Box, CircularProgress, Popover, Typography, Button } from '@mui/material'
import { HelpOutline, DirectionsOutlined, AssignmentOutlined } from '@mui/icons-material';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { makeStyles } from "@mui/styles";
import { Link } from "react-router-dom";
import {
    numFormat,
    approvePool,
    harvestReward
} from "../../config/web3";
import StakeModal from "./StakeModal";

export const useStyles = makeStyles(() => ({
    popover: {
        "& .MuiPaper-root": {
            backgroundColor: "#07071c",
            color: "white"
        }
    }
}));

function Farms(props) {
    const { account, connector } = useWeb3React();
    const classes = useStyles();

    const [anchorEl1, setAnchorEl1] = useState(null);
    const [anchorEl2, setAnchorEl2] = useState(null);
    const open1 = Boolean(anchorEl1);
    const open2 = Boolean(anchorEl2);
    const [mopen, setMopen] = useState(false);
    const [mtype, setMtype] = useState(1);
    const [poolData, setPoolData] = useState(null);

    const handleClick1 = (event) => {
        setAnchorEl1(event.currentTarget);
    };

    const handleClick2 = (event) => {
        setAnchorEl2(event.currentTarget);
    }

    const handleClose1 = () => {
        setAnchorEl1(null);
    };

    const handleClose2 = () => {
        setAnchorEl2(null);
    }

    const handleMOpen = (cmtype, cpoolData) => {
        setMtype(cmtype);
        setPoolData(cpoolData);
        setMopen(true);
    }

    const handleMClose = () => {
        setMopen(false);
    }

    const handleApprovePool = async (poolAddr, farmingPoolAddr, userlp) => {
        if (account) {
            const provider = await connector.getProvider();
            await approvePool(
                account,
                provider,
                poolAddr,
                userlp*10,
                farmingPoolAddr
            )
        }
    }

    const executeHarvest = async (farmingPoolAddr) => {
        if (account) {
            const provider = await connector.getProvider();
            await harvestReward(
                account,
                provider,
                farmingPoolAddr
            );
        }
    }

    // const viewBlockUrl = (hash) => {
    //     window.open(`https://explorer.kava.io/tx/${hash}`);
    // };

    return (
        <>
            {props.pools.isLoad &&
                <>
                    {
                        props.filteredData.map((item, index) => {
                            return (
                                <Accordion
                                    key={item?.address}
                                    sx={{ minHeight: "20px", pr: 0, pl: 0, width: "100%", backgroundColor: "#12122c", color: "white", boxShadow: "0px 0px 0px 0px" }}
                                >
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                                        aria-controls="panel1bh-content"
                                        id="panel1bh-header"
                                        style={{ marginTop: "0px" }}
                                        sx={{ m: 0, pb: 0, pr: 2, mt: 0, mb: 0, pt: 0, pl: 2 }}
                                    >
                                        <Grid container style={{ width: "100%", display: "flex", alignItems: "center" }}>
                                            <Grid xs={12} sm={6} md={3} style={{ float: "left" }}>
                                                <div className="relative flex gap-x-1">
                                                    <div className="relative flex">
                                                        <img
                                                            src={
                                                                item?.logoURLs[0]
                                                            }
                                                            alt="" className="w-[16px] h-[16px]"
                                                        />
                                                        <img
                                                            className="z-10 relative right-2 w-[32px] h-[32px]"
                                                            src={
                                                                item?.logoURLs[1]
                                                            }
                                                            alt=""
                                                        />
                                                    </div>
                                                    <p className="text-light-primary text-lg font-bold" >
                                                        {item?.symbols[0]}
                                                        {"-"}
                                                        {item?.symbols[1]}
                                                        {" "}LP
                                                    </p>
                                                </div>
                                            </Grid>
                                            <Grid xs={4} sm={4} md={2} style={{ float: "left", display: "flex", flexDirection: "column" }}>
                                                <p>Earned</p>
                                                <p>{numFormat(item?.pendingReward)}</p>
                                            </Grid>
                                            <Grid xs={4} sm={6} md={1} style={{ float: "left", display: "flex", flexDirection: "column" }}>
                                                <p>APR</p>
                                                <p>{numFormat(item.apr)}%</p>
                                            </Grid>
                                            {!item?.allowed &&
                                                <Grid xs={4} sm={6} md={3} style={{ float: "left", display: "flex", flexDirection: "row", alignItems: "center" }}>
                                                    <div style={{ float: "left", display: "flex", flexDirection: "column" }}>
                                                        <p>Liquidity</p>
                                                        <p>${numFormat(item.totalSupplyUSD)}</p>
                                                    </div>
                                                    <HelpOutline
                                                        aria-owns={open1 ? 'mouse-over-popover' : undefined}
                                                        aria-haspopup="true"
                                                        sx={{ ml: 1 }}
                                                        onMouseEnter={handleClick1}
                                                        onMouseLeave={handleClose1}
                                                    />
                                                    <Popover
                                                        sx={{
                                                            pointerEvents: 'none'
                                                        }}
                                                        open={open1}
                                                        anchorEl={anchorEl1}
                                                        anchorOrigin={{
                                                            vertical: 'bottom',
                                                            horizontal: 'center',
                                                        }}
                                                        transformOrigin={{
                                                            vertical: 'top',
                                                            horizontal: 'center',
                                                        }}
                                                        onClose={handleClose1}
                                                        disableRestoreFocus
                                                        className={classes.popover}
                                                    >
                                                        <Typography sx={{ p: 1, fontSize: 13 }}>Total value of the funds in this farm’s <br />liquidity pair.</Typography>
                                                    </Popover>
                                                </Grid>
                                            }
                                            {item?.allowed &&
                                                <>
                                                    <Grid xs={4} sm={6} md={2} style={{ float: "left", display: "flex", flexDirection: "row", alignItems: "center" }}>
                                                        <div style={{ float: "left", display: "flex", flexDirection: "column" }}>
                                                            <p>Staked Liquidity</p>
                                                            <p>${numFormat(item.totalStakedUSD)}</p>
                                                        </div>
                                                        <HelpOutline
                                                            aria-owns={open2 ? 'mouse-over-popover' : undefined}
                                                            aria-haspopup="true"
                                                            sx={{ ml: 1 }}
                                                            onMouseEnter={handleClick2}
                                                            onMouseLeave={handleClose2}
                                                        />
                                                        <Popover
                                                            sx={{
                                                                pointerEvents: 'none'
                                                            }}
                                                            open={open2}
                                                            anchorEl={anchorEl2}
                                                            anchorOrigin={{
                                                                vertical: 'bottom',
                                                                horizontal: 'center',
                                                            }}
                                                            transformOrigin={{
                                                                vertical: 'top',
                                                                horizontal: 'center',
                                                            }}
                                                            onClose={handleClose2}
                                                            disableRestoreFocus
                                                            className={classes.popover}
                                                        >
                                                            <Typography sx={{ p: 1, fontSize: 13 }}>Total active (in-range) liquidity staked <br />in the farm.</Typography>
                                                        </Popover>
                                                    </Grid>
                                                    <Grid xs={4} sm={6} md={2} style={{ float: "left", display: "flex", flexDirection: "column" }}>
                                                        <p>Available</p>
                                                        <p style={{ color:"lightgray", fontWeight:"bold" }}>{numFormat(item?.userlp)} LP</p>
                                                    </Grid>
                                                    <Grid xs={4} sm={6} md={2} style={{ float: "left", display: "flex", flexDirection: "column" }}>
                                                        <p>Staked</p>
                                                        <p style={{ color:"lightgray", fontWeight:"bold" }}>{numFormat(item?.stakedVal)} LP</p>
                                                    </Grid>
                                                </>
                                            }
                                        </Grid>
                                    </AccordionSummary>
                                    <AccordionDetails sx={{ pt: 0, pl: 0, display: "flex", justifyContent: "center", backgroundColor: "#1b1b3c" }}>
                                        <Grid container sx={{ width: "90%", display: "flex", alignItems: "center", pt: 2 }}>
                                            <Grid xs={12} sm={4} md={2} style={{ float: "left", display: "flex", flexDirection: "column" }}>
                                                <Link to={"/add_liquidity?pool="} style={{ color: "#13a8ff", fontSize: 13 }}>
                                                    Get {" "}
                                                    {item?.symbols[0]}
                                                    {"-"}
                                                    {item?.symbols[1]}
                                                    {" "}LP
                                                    <DirectionsOutlined sx={{ fontSize: 16 }} />
                                                </Link>
                                                <Link to={"/add_liquidity?pool="} style={{ color: "#13a8ff", fontSize: 13 }}>
                                                    See Pair Info{" "}
                                                    <DirectionsOutlined sx={{ fontSize: 16 }} />
                                                </Link>
                                                <Link to={"/add_liquidity?pool="} style={{ color: "#13a8ff", fontSize: 13 }}>
                                                    View Contract{" "}
                                                    <AssignmentOutlined sx={{ fontSize: 16 }} />
                                                </Link>
                                            </Grid>
                                            <Grid xs={12} sm={4} md={5} sx={{ pr: 1 }}>
                                                <Grid item={true} sx={{ border: "1px solid lightgray", borderRadius: "4px", p: 2 }}>
                                                    <Typography sx={{ fontWeight: "bold", fontSize: 12 }}>Earned</Typography>
                                                    <Grid item={true} sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
                                                        <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>{numFormat(item?.pendingReward)}</Typography>
                                                        <Button
                                                            size="small"
                                                            variant="contained"
                                                            disabled={!item?.allowed}
                                                            sx={{
                                                                color: "white!important",
                                                                width: 150,
                                                                padding: 1,
                                                                fontWeight: "bold",
                                                            }}
                                                            onClick={() => executeHarvest(item?.farmingPoolAddress)}
                                                        >
                                                            Harvest
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid xs={12} sm={4} md={5} sx={{ pl: 1 }} >
                                                <Grid item={true} sx={{ border: "1px solid lightgray", borderRadius: "4px", p: 2 }}>
                                                    {!item?.allowed && <Typography sx={{ fontWeight: "bold", fontSize: 12 }}>Enable Farm</Typography>}
                                                    {(item?.allowed && Number(item?.stakedVal) === 0) && <Typography sx={{ fontWeight: "bold", fontSize: 12 }}>Stake Pool</Typography>}
                                                    {(item?.allowed && Number(item?.stakedVal) !== 0) &&
                                                        <Typography sx={{ fontWeight: "bold", fontSize: 12 }}>
                                                            <span style={{ color: "tomato" }}>{item?.symbols[0]}
                                                                {"-"}
                                                                {item?.symbols[1]}
                                                                {" "}LP
                                                            </span>
                                                            {" "}Staked
                                                        </Typography>}
                                                    {Number(item?.stakedVal) === 0 &&
                                                        <Grid sx={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", mt: 1 }}>
                                                            {!item?.allowed &&
                                                                <Button
                                                                    size="small"
                                                                    variant="contained"
                                                                    sx={{
                                                                        width: "100%",
                                                                        padding: 1,
                                                                        fontWeight: "bold",
                                                                    }}
                                                                    onClick={() => handleApprovePool(item?.address, item?.farmingPoolAddress, item?.userlp)}
                                                                >
                                                                    Enable
                                                                </Button>
                                                            }
                                                            {(item?.allowed && Number(item?.stakedVal) === 0) &&
                                                                <Button
                                                                    size="small"
                                                                    variant="contained"
                                                                    sx={{
                                                                        width: "100%",
                                                                        padding: 1,
                                                                        fontWeight: "bold",
                                                                    }}
                                                                    onClick={() => handleMOpen(1, item)}
                                                                >
                                                                    Stake
                                                                </Button>
                                                            }
                                                        </Grid>
                                                    }
                                                    {(item?.allowed && Number(item?.stakedVal) !== 0) &&
                                                        <Grid item={true} sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", mt: 0.5 }}>
                                                            <div style={{ display: "flex", flexDirection: "column" }}>
                                                                <Typography sx={{ fontSize: 16 }}>
                                                                    {numFormat(item?.stakedVal)}
                                                                </Typography>
                                                                <Typography sx={{ fontSize: 12 }}>
                                                                    ~{numFormat(item?.userSupplyUSD * item?.stakedVal / (Number(item?.userlp) + 0.0000000000000001))}{" "}USD
                                                                </Typography>
                                                            </div>
                                                            <div style={{ display: "flex", flexDirection: "row" }}>
                                                                <Button
                                                                    size='small'
                                                                    variant='outlined'
                                                                    sx={{ minWidth: 40, width: 40, height: 40, fontWeight: "bold", fontSize: 24 }}
                                                                    onClick={() => handleMOpen(1, item)}
                                                                >
                                                                    +
                                                                </Button>
                                                                <Button
                                                                    size='small'
                                                                    variant='outlined'
                                                                    sx={{ minWidth: 40, width: 40, height: 40, fontWeight: "bold", fontSize: 24, ml: 1 }}
                                                                    onClick={() => handleMOpen(2, item)}
                                                                >
                                                                    -
                                                                </Button>
                                                            </div>
                                                        </Grid>
                                                    }
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </AccordionDetails>
                                </Accordion>
                            )
                        })
                    }
                    <StakeModal
                        mopen={mopen} handleClose={handleMClose} mtype={mtype} poolData={poolData}
                    />
                </>
            }
            {!props.pools.isLoad &&
                <Box sx={{ width: "100%", mt: 1 }}>
                    <div style={{ minHeight: "170px", textAlign: "center" }}>
                        <CircularProgress style={{ marginTop: "65px" }} />
                    </div>
                </Box>
            }
        </>
    )
}

export default Farms
