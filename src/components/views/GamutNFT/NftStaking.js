import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useWeb3React } from "@web3-react/core";
import { styled } from "@mui/material/styles";
import {
    Paper,
    Grid,
    useMediaQuery,
    Typography,
    Switch,
    Stack,
    Select,
    FilledInput,
    FormControl,
    FormLabel,
    MenuItem,
    Button,
    Table,
    TableContainer,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
    Divider,
    Pagination
} from "@mui/material";
import {
    KeyboardArrowRight,
    Person,
    ArrowBack
} from "@mui/icons-material";
import { makeStyles } from "@mui/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
    getAllNfts,
    getPoolEpochs,
    mintNft,
} from "../../../config/web3";
import { boostToEpochList, contractAddresses, nftGroupList } from "../../../config/constants";
import GStakeModal from "./GStakeModal";

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: "#12122c",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
}));

const AntSwitch = styled(Switch)(({ theme }) => ({
    width: 44,
    height: 24,
    padding: 0,
    display: 'flex',
    '&:active': {
        '& .MuiSwitch-thumb': {
            width: 15,
        },
        '& .MuiSwitch-switchBase.Mui-checked': {
            transform: 'translateX(9px)',
        },
    },
    '& .MuiSwitch-switchBase': {
        padding: 1,
        '&.Mui-checked': {
            transform: 'translateX(12px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: theme.palette.mode === 'dark' ? '#177ddc' : '#1890ff',
            },
        },
    },
    '& .MuiSwitch-thumb': {
        boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
        width: 30,
        height: 22,
        borderRadius: 3,
        transition: theme.transitions.create(['width'], {
            duration: 200,
        }),
    },
    '& .MuiSwitch-track': {
        borderRadius: 4,
        opacity: 1,
        backgroundColor: 'rgba(255,255,255,.35)',
        boxSizing: 'border-box',
    },
}));

const StyledSelect = styled(Select)`
  color: white;
  & > div {
    padding-top:5px;
  },
  &:before, &:after {
    border-width:0px!important;
  },
  & > svg {
    top:3px
  }
`;

const StyledInput = styled(FilledInput)`
  color: white;
  & > input {
    padding-top:5px;
    color:white;
  },
  &:before, &:after {
    border-width:0px!important;
  },
`;

export const useStyles = makeStyles(() => ({
    paper: {
        "&.MuiPaper-root": {
            backgroundColor: "#5e5e6b",
            color: "white",
            fontWeight: "bold"
        },
    }
}));

export default function NftStaking() {

    const selected_chain = useSelector((state) => state.selectedChain);
    const { account, connector } = useWeb3React();
    const classes = useStyles();
    const [pageFlag, setPageFlag] = useState(0);
    const [statusFlag, setStatusFlag] = useState(false);
    const [stakedFlag, setStakedFlag] = useState(false);
    const [sortBy, setSortBy] = useState(1);
    const [query, setQuery] = useState("");
    const [unMintedNfts, setUnMitedNfts] = useState([]);
    const [mintedNfts, setMintedNfts] = useState([]);
    const [allStakes, setAllStakes] = useState([]);
    const [activatedNft, setActivatedNft] = useState({});
    const [count1, setCount1] = useState(0);
    const [displayData1, setDisplayData1] = useState([]);
    const [count2, setCount2] = useState(0);
    const [displayData2, setDisplayData2] = useState([]);
    const [count3, setCount3] = useState(0);
    const [displayData3, setDisplayData3] = useState([]);
    const [sPoolInfo, setSPoolInfo] = useState({});
    const [sEpochs, setSEpochs] = useState([]);
    const [mopen1, setMopen1] = useState(false);

    const isMobile = useMediaQuery("(max-width:600px)");

    const handleStatus = () => {
        setStatusFlag(!statusFlag);
        // filteringData(!statusFlag, stakedFlag, sortBy, query);
    }

    const handleStaked = () => {
        setStakedFlag(!stakedFlag);
        // filteringData(statusFlag, !stakedFlag, sortBy, query);
    }

    const handleSortBy = (event) => {
        let sorting_val = Number(event.target.value);
        setSortBy(sorting_val);
        // filteringData(statusFlag, stakedFlag, sorting_val, query);
    }

    const handleQuery = (event) => {
        let new_query = event.target.value;
        setQuery(new_query);
        // filteringData(statusFlag, stakedFlag, sortBy, new_query);
    }

    const handlePChange1 = (e, p) => {
        setDisplayData1(unMintedNfts.slice((p - 1) * 4, (p - 1) * 4 + 4));
    }

    const handlePChange2 = (e, p) => {
        setDisplayData2(mintedNfts.slice((p - 1) * 4, (p - 1) * 4 + 4));
    }

    const handleClose1 = () => {
        setMopen1(false);
    }

    const handleGNftMint = async (name, id, price, tokenAddr) => {
        const provider = await connector.getProvider();
        await mintNft(provider, name, id, price, tokenAddr, contractAddresses[selected_chain]["gamutNFT"], account);
    }

    const handleGStake = () => {
        setMopen1(true);
    }

    const activateNft = (unit) => {
        setActivatedNft(unit);
    }

    const handleStakeDetail = async (flag, unit) => {
        const provider = await connector.getProvider();
        setPageFlag(flag);
        setSPoolInfo(unit);
        console.log(unit);
        const epochs = await getPoolEpochs(provider, boostToEpochList[selected_chain], unit.poolId, contractAddresses[selected_chain]["gamutNFT"]);
        setSEpochs(epochs);
    }

    const getInfo = async () => {
        const provider = await connector.getProvider();
        const allNfts = await getAllNfts(provider, nftGroupList[selected_chain], boostToEpochList[selected_chain], contractAddresses[selected_chain]["gamutNFT"]);
        if (allNfts) {
            setUnMitedNfts(allNfts[0]);
            setMintedNfts(allNfts[1]);
            setAllStakes(allNfts[2]);
            setDisplayData1(allNfts[0].slice(0, 4));
            setDisplayData2(allNfts[1].slice(0, 4));
            setDisplayData3(allNfts[2].slice(0, 4));
            if (allNfts[1].length !== 0) {
                setActivatedNft(allNfts[1][0]);
            }
            let cnt1 = allNfts[0].length / 4;
            cnt1 = Number(cnt1.toFixed(0));
            setCount1(cnt1);
            let cnt2 = allNfts[1].length / 4;
            cnt2 = Number(cnt2.toFixed(0));
            setCount2(cnt2);
            let cnt3 = allNfts[2].length / 4;
            cnt3 = Number(cnt3.toFixed(0));
            setCount2(cnt3);
        }

    }

    useEffect(() => {
        if (account) {
            getInfo();
        }
    }, [account, selected_chain]);

    return (
        <div style={{ display: "flex", justifyContent: "center" }}>
            {pageFlag === 0 &&
                <Grid
                    sx={{ width: "1220px", justifyContent: "center", padding: isMobile ? "0px 4px" : "0px 8px" }}
                    border={0}
                    columnSpacing={{ xs: 0, sm: 0, md: 2, lg: 2 }}
                >
                    <Grid
                        container
                    >
                        <Grid md={10} sm={12} container sx={{ display: "flex", justifyContent: "center" }}>
                            {displayData1.map(unit => {
                                return (
                                    <Grid item md={3} sm={6} sx={{ alignItems: "center", mb: 2 }}>
                                        <Item style={{ boxShadow: "0px 0px 0px 0px", padding: 12, maxWidth: "160px", margin: "0 auto" }}>
                                            <img src={"https://gateway.pinata.cloud/ipfs/" + unit.url + "/" + unit.tokenId + ".png"} alt="nft image" width={130} style={{ borderRadius: 8 }} onClick={() => setPageFlag(2)}></img>
                                            <Typography sx={{ color: "white", mt: 0.5 }}>{"Group " + unit.gName + " #" + unit.tokenId}</Typography>
                                            <Button size="small" variant="contained" color="primary" onClick={() => handleGNftMint(unit.gName, unit.tokenId, unit.price, unit.tokenAddr)}>Mint</Button>
                                        </Item>
                                    </Grid>
                                )
                            })}
                        </Grid>
                        <Grid item md={2} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center", mb: 2 }}>
                            <Button
                                size="large"
                                sx={{ backgroundColor: "#12122c" }}
                                onClick={() => setPageFlag(1)}
                            >
                                <Person sx={{ fontSize: 32, fontWeight: "bold" }} />
                            </Button>
                        </Grid>
                    </Grid>
                    {unMintedNfts.length !== 0 &&
                        <Grid container sx={{ justifyContent: "center" }}>
                            <Pagination count={count1} sx={{ button: { color: '#ffffff' }, marginTop: "6px", marginBottom: "6px" }} color="primary" shape="rounded" onChange={handlePChange1} />
                        </Grid>
                    }
                    <Grid
                        container
                        sx={{ pl: 0, borderTop: "1px solid rgba(118, 118, 144, 0.4)", paddingTop: "1rem", marginTop: "0.5rem" }}
                    >
                        <Grid item={true} xs={12} sm={6} md={3} sx={{ mt: 2 }} className="home__mainC">
                            <Item
                                elevation={1}
                                style={{ backgroundColor: "transparent", boxShadow: "0px 0px 0px 0px", padding: "0px 18px", minWidth: "180px" }}
                            >
                                <Stack direction="row" spacing={1} alignItems="start">
                                    <div className="flex flex-col">
                                        <FormLabel component="legend" sx={{ fontSize: 10, display: "flex", fontWeight: "bold", color: "#1c63eb" }}>FILTER BY</FormLabel>
                                        <Stack direction="row" spacing={1} sx={{ mt: 0.4 }}>
                                            <Typography style={{ color: "white", fontSize: 14, display: "flex", alignItems: "center" }}>Finished</Typography>
                                            <AntSwitch defaultChecked onChange={handleStatus} inputProps={{ 'aria-label': 'ant design' }} />
                                            <Typography style={{ color: "white", fontSize: 14, display: "flex", alignItems: "center" }}>Live</Typography>
                                        </Stack>
                                    </div>
                                </Stack>
                            </Item>
                        </Grid>
                        <Grid item={true} xs={12} sm={6} md={3} sx={{ mt: 2 }} className="home__mainC">
                            <Item
                                elevation={1}
                                style={{ backgroundColor: "transparent", boxShadow: "0px 0px 0px 0px", padding: "0px 16px", marginLeft: 0, minWidth: "180px" }}
                            >
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <div className="flex flex-col">
                                        <FormLabel component="legend" sx={{ fontSize: 10, display: "flex", fontWeight: "bold", color: "#1c63eb" }}>FILTER BY</FormLabel>
                                        <Stack direction="row" spacing={1} sx={{ mt: 0.4 }}>
                                            <AntSwitch onChange={handleStaked} inputProps={{ 'aria-label': 'ant design' }} />
                                            <Typography style={{ color: "white", fontSize: 14, display: "flex", alignItems: "center" }}>Stacked Only</Typography>
                                        </Stack>
                                    </div>
                                </Stack>
                            </Item>
                        </Grid>
                        <Grid item={true} xs={12} sm={6} md={3} sx={{ mt: 2 }} className="home__mainC">
                            <Item
                                elevation={1}
                                style={{ backgroundColor: "transparent", boxShadow: "0px 0px 0px 0px", padding: "0px 16px", minWidth: "180px" }}
                            >
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <div className="flex flex-col">
                                        <FormLabel component="legend" sx={{ fontSize: 10, display: "flex", fontWeight: "bold", color: "#1c63eb" }}>SORT BY</FormLabel>
                                        <Stack direction="row" spacing={1}>
                                            <FormControl variant="filled" sx={{ mt: 0, minWidth: 120, fontWeight: "bold", backgroundColor: "#5e5e6b", borderRadius: 1, height: 30 }} className={classes.menu}>
                                                <StyledSelect
                                                    label="Title"
                                                    sx={{ "& .MuiSvgIcon-root": { color: "white" } }}
                                                    value={sortBy}
                                                    onChange={handleSortBy}
                                                    MenuProps={{
                                                        classes: {
                                                            paper: classes.paper
                                                        }
                                                    }}
                                                    IconComponent={ExpandMoreIcon}
                                                >
                                                    <MenuItem value={1}>Hot</MenuItem>
                                                    <MenuItem value={2}>APR</MenuItem>
                                                    <MenuItem value={3}>Earned</MenuItem>
                                                    <MenuItem value={4}>Liquidity</MenuItem>
                                                    <MenuItem value={5}>Latest</MenuItem>
                                                </StyledSelect>
                                            </FormControl>
                                        </Stack>
                                    </div>
                                </Stack>
                            </Item>
                        </Grid>
                        <Grid item={true} xs={12} sm={6} md={3} sx={{ mt: 2 }} className="home__mainC">
                            <Item
                                elevation={1}
                                style={{ backgroundColor: "transparent", boxShadow: "0px 0px 0px 0px", padding: "0px 16px", minWidth: "180px" }}
                            >
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <div className="flex flex-col">
                                        <FormLabel component="legend" sx={{ fontSize: 10, display: "flex", fontWeight: "bold", color: "#1c63eb" }}>SEARCH</FormLabel>
                                        <Stack direction="row" spacing={1}>
                                            <FormControl sx={{ width: '140px', backgroundColor: "#5e5e6b", height: 30, borderRadius: 1 }} >
                                                <StyledInput placeholder="Search Farms" value={query} onChange={handleQuery} onKeyUp={handleQuery} />
                                            </FormControl>
                                        </Stack>
                                    </div>
                                </Stack>
                            </Item>
                        </Grid>
                        <Grid
                            container
                            sx={{ width: "100%", mt: 2, mb: 2, backgroundColor: "#12122c", borderRadius: "10px" }}
                        >
                            <TableContainer component={Paper} style={{ backgroundColor: "transparent", boxShadow: "0px 0px 0px 0px" }}>
                                <Table sx={{ minWidth: 550 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow style={{ color: "white" }}>
                                            <TableCell align="center" style={{ color: "white", paddingTop: 12, paddingBottom: 12 }}>
                                                #
                                            </TableCell>
                                            <TableCell align="center" style={{ color: "white", paddingTop: 12, paddingBottom: 12 }}>
                                                Name
                                            </TableCell>
                                            <TableCell align="center" style={{ color: "white", paddingTop: 12, paddingBottom: 12 }}>
                                                NFT
                                            </TableCell>
                                            <TableCell align="center" style={{ color: "white", paddingTop: 12, paddingBottom: 12 }}>
                                                APR
                                            </TableCell>
                                            <TableCell align="center" style={{ color: "white", paddingTop: 12, paddingBottom: 12 }}>
                                                Your Stake
                                            </TableCell>
                                            <TableCell align="center" style={{ color: "white", paddingTop: 12, paddingBottom: 12 }}>
                                                Details
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {displayData3.map((unit, index) => {
                                            return (
                                                <TableRow
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                    key={"stake_" + index}
                                                >
                                                    <TableCell component="th" scope="row" align="center" style={{ color: "white", paddingTop: 5, paddingBottom: 5 }}>
                                                        {index + 1}
                                                    </TableCell>
                                                    <TableCell align="center" style={{ color: "white", paddingTop: 5, paddingBottom: 5 }}>
                                                        <Typography>{unit.stakingToken.substr(0, 16) + "..."}</Typography>
                                                    </TableCell>
                                                    <TableCell align="center" style={{ color: "white", paddingTop: 5, paddingBottom: 5 }}>
                                                        <h3 className="font-medium">
                                                            {unit.isStaked ? unit.tokenId : "no stake"}
                                                        </h3>
                                                    </TableCell>
                                                    <TableCell align="center" style={{ color: "white", paddingTop: 5, paddingBottom: 5 }}>
                                                        {unit.isStaked ? unit.apr : "no stake"}
                                                    </TableCell>
                                                    <TableCell align="center" style={{ color: "white", paddingTop: 5, paddingBottom: 5 }}>
                                                        {unit.isStaked ? unit.tokenId : "no stake"}
                                                    </TableCell>
                                                    <TableCell align="center" style={{ paddingTop: 5, paddingBottom: 5 }}>
                                                        <Button>
                                                            <KeyboardArrowRight onClick={() => handleStakeDetail(3, { ...unit, sIndex: index })} />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>
                </Grid>
            }
            {pageFlag === 1 &&
                <Grid
                    sx={{ width: "1220px", justifyContent: "center", padding: isMobile ? "0px 4px" : "0px 8px" }}
                    border={0}
                    columnSpacing={{ xs: 0, sm: 0, md: 2, lg: 2 }}
                >
                    <Grid
                        container
                        sx={{ pl: 0, borderBottom: "1px solid rgba(118, 118, 144, 0.4)" }}
                    >
                        <Grid item md={12} sx={{ alignItems: "left", mb: 2 }}>
                            <Button variant="contained" color="primary" onClick={() => setPageFlag(0)}><ArrowBack fontSize="medium" /></Button>
                        </Grid>
                        <Grid item md={12} sx={{ display: "flex", justifyContent: "center", flexDirection: "row", alignItems: "center", marginBottom: "12px" }}>
                            {displayData2.length == 0 &&
                                <Grid>
                                    <Typography variant="h6" sx={{ color: "white" }}>There are no minted NFTs.</Typography>
                                </Grid>
                            }
                            {displayData2.length != 0 &&
                                displayData2.map(unit => {
                                    return (
                                        <Grid item md={2} sm={6} sx={{ alignItems: "center", mb: 2 }}>
                                            <Item style={{ boxShadow: "0px 0px 0px 0px", padding: 12, maxWidth: "160px", margin: "0 auto" }}>
                                                <img src={"https://gateway.pinata.cloud/ipfs/" + unit.url + "/" + unit.tokenId + ".png"} alt="nft image" width={130} style={{ borderRadius: 8 }} onClick={() => setPageFlag(2)}></img>
                                                <Typography sx={{ color: "white", mt: 0.5 }}>{"Group " + unit.gName + " #" + unit.tokenId}</Typography>
                                                {activatedNft.tokenId === unit.tokenId &&
                                                    <Typography sx={{ color: "gold", mt: 0.5 }}>Activated</Typography>
                                                }
                                                {activatedNft.tokenId !== unit.tokenId &&
                                                    <Button variant="contained" size="small" color="success" onClick={() => activateNft(unit)}>Activate</Button>
                                                }
                                            </Item>
                                        </Grid>
                                    )
                                })
                            }
                        </Grid>
                        {displayData2.length != 0 &&
                            <Grid container sx={{ alignItems: "center", justifyContent: "center" }}>
                                <Pagination count={count2} sx={{ button: { color: '#ffffff' }, marginTop: "6px", marginBottom: "6px" }} color="primary" shape="rounded" onChange={handlePChange2} />
                            </Grid>
                        }
                    </Grid>
                </Grid>
            }
            {pageFlag === 2 &&
                <Grid
                    sx={{ width: "1220px", justifyContent: "center", padding: isMobile ? "0px 4px" : "0px 8px" }}
                    border={0}
                    columnSpacing={{ xs: 0, sm: 0, md: 2, lg: 2 }}
                >
                    <Grid
                        container
                        sx={{ pl: 0, borderBottom: "1px solid rgba(118, 118, 144, 0.4)" }}
                    >
                        <Grid item md={12} sx={{ alignItems: "left", mb: 2 }}>
                            <Button variant="contained" color="primary" onClick={() => setPageFlag(0)}><ArrowBack fontSize="medium" /></Button>
                        </Grid>
                        <Grid item md={12} sx={{ display: "flex", alignItems: "center", mb: 2, flexDirection: "row" }}>
                            <img src="/samples/nft1.png" alt="nft image" width={isMobile ? 140 : 180} style={{ borderRadius: 8 }}></img>
                            <Paper sx={{ background: "transparent", ml: 3 }}>
                                <Typography variant="h4" sx={{ color: "white", fontSize: "18px", mb: 1 }}>NFT ID: 001</Typography>
                                <Typography variant="h4" sx={{ color: "white", fontSize: "18px", mb: 1 }}>NFT Group: A</Typography>
                                <Typography variant="h4" sx={{ color: "white", fontSize: "18px", mb: 1 }}>Mint Date: 07/23/2023</Typography>
                                <Typography variant="h4" sx={{ color: "white", fontSize: "18px", mb: 1 }}>Owner: 0x294052....</Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
            }
            {pageFlag === 3 &&
                <Grid
                    sx={{ width: "1220px", justifyContent: "center", padding: isMobile ? "0px 4px" : "0px 8px" }}
                    border={0}
                    columnSpacing={{ xs: 0, sm: 0, md: 2, lg: 2 }}
                >
                    <Grid
                        container
                        sx={{ pl: 0, borderBottom: "1px solid rgba(118, 118, 144, 0.4)" }}
                    >
                        <Grid item md={2} sx={{ alignItems: "left" }}>
                            <Button variant="contained" color="primary" onClick={() => setPageFlag(0)}><ArrowBack fontSize="medium" /></Button>
                        </Grid>
                        <Grid item md={10} sx={{ alignItems: "left", display: "flex", alignItems: "center" }}>
                            <Typography variant="h5" sx={{ color: "white" }}>Staking Pool #{sPoolInfo.sIndex + 1}</Typography>
                        </Grid>
                        <Divider sx={{ width: "100%", borderColor: "#76769066", mt: 2, mb: 2 }} />
                        <Grid item md={12} sx={{ alignItems: "center", mb: 2 }}>
                            {!sPoolInfo.isStaked &&
                                <Grid item md={12} sx={{ display: "flex", justifyContent: "right", mb: 1 }}>
                                    <Button variant="contained" color="success" onClick={handleGStake} >stake</Button>
                                </Grid>
                            }
                            {(sPoolInfo.isStaked && sPoolInfo.tokenId === activatedNft.tokenId) &&
                                <Grid item md={12} sx={{ display: "flex", justifyContent: "right", mb: 1 }}>
                                    <Button variant="contained" color="success" onClick={handleGStake}>stake</Button>
                                    <Button variant="contained" color="error" sx={{ ml: 2 }}>unstake</Button>
                                </Grid>
                            }
                            <Item
                                sx={{ pt: 2, pl: 1, pr: 1, pb: 2 }}
                                style={{ backgroundColor: "#12122c", borderRadius: "10px" }}
                            >
                                <TableContainer component={Paper} style={{ backgroundColor: "transparent", boxShadow: "0px 0px 0px 0px" }}>
                                    <Table sx={{ minWidth: 550 }} aria-label="simple table">
                                        <TableHead>
                                            <TableRow style={{ color: "white" }}>
                                                <TableCell align="center" style={{ color: "white", paddingTop: 12, paddingBottom: 12 }}>
                                                    Epoch
                                                </TableCell>
                                                <TableCell align="center" style={{ color: "white", paddingTop: 12, paddingBottom: 12 }}>
                                                    Boost
                                                </TableCell>
                                                <TableCell align="center" style={{ color: "white", paddingTop: 12, paddingBottom: 12 }}>
                                                    Reward Token
                                                </TableCell>
                                                <TableCell align="center" style={{ color: "white", paddingTop: 12, paddingBottom: 12 }}>
                                                    Outstanding Reward
                                                </TableCell>
                                                {sPoolInfo.isStaked &&
                                                    <TableCell align="center" style={{ color: "white", paddingTop: 12, paddingBottom: 12 }}>
                                                        <Button variant="outlined" color="warning" size="small">Claim All</Button>
                                                    </TableCell>
                                                }
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {sEpochs.length === 0 &&
                                                <TableRow
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell component="th" scope="row" align="center" style={{ color: "white", paddingTop: 10, paddingBottom: 10 }}>
                                                        There are no epochs for this staking pool.
                                                    </TableCell>
                                                </TableRow>
                                            }
                                            {sEpochs.length !== 0 &&
                                                sEpochs.map((item) => {
                                                    return (
                                                        <TableRow
                                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                        >
                                                            <TableCell component="th" scope="row" align="center" style={{ color: "white", paddingTop: 10, paddingBottom: 10 }}>
                                                                Epoch #{item.epochId}
                                                            </TableCell>
                                                            <TableCell align="center" style={{ color: "white", paddingTop: 10, paddingBottom: 10 }}>
                                                                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                                                                    <Typography>Your Boost</Typography>
                                                                    <Button
                                                                        variant="outlined"
                                                                        size="small"
                                                                        color="secondary"
                                                                        sx={{ ml: 1, fontSize: "12px", padding: "4px 4px 2px", alignItems: "center" }}
                                                                        onClick={() => setPageFlag(4)}
                                                                    >
                                                                        More
                                                                    </Button>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell align="center" style={{ color: "white", paddingTop: 10, paddingBottom: 10 }}>
                                                                <h3 className="font-medium">
                                                                    {item.rewardToken.substr(0, 16)} ...
                                                                </h3>
                                                            </TableCell>
                                                            <TableCell align="center" style={{ color: "white", paddingTop: 10, paddingBottom: 10 }}>
                                                                YES
                                                            </TableCell>
                                                            {sPoolInfo.isStaked &&
                                                                <TableCell align="center" style={{ color: "white", paddingTop: 10, paddingBottom: 10 }}>
                                                                    <Button variant="outlined" size="small" color="warning" sx={{ ml: 1, fontSize: "12px", padding: "4px 4px 2px", alignItems: "center" }}>Claim</Button>
                                                                </TableCell>
                                                            }
                                                        </TableRow>
                                                    )
                                                })
                                            }
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Item>
                        </Grid>
                    </Grid>
                </Grid>
            }
            {pageFlag === 4 &&
                <Grid
                    sx={{ width: "1220px", justifyContent: "center", padding: isMobile ? "0px 4px" : "0px 8px" }}
                    border={0}
                    columnSpacing={{ xs: 0, sm: 0, md: 2, lg: 2 }}
                >
                    <Grid
                        container
                        sx={{ pl: 0, borderBottom: "1px solid rgba(118, 118, 144, 0.4)" }}
                    >
                        <Grid item md={2} sm={12} sx={{ alignItems: "left" }}>
                            <Button variant="contained" color="primary" onClick={() => setPageFlag(0)}><ArrowBack fontSize="medium" /></Button>
                        </Grid>
                        <Grid item={true} md={3} sm={4} sx={{ mt: 0.7 }} className="home__mainC">
                            <Item
                                elevation={1}
                                style={{ backgroundColor: "transparent", boxShadow: "0px 0px 0px 0px", padding: "0px 18px", minWidth: "180px" }}
                            >
                                <Stack direction="row" spacing={1}>
                                    <AntSwitch onChange={handleStaked} inputProps={{ 'aria-label': 'ant design' }} />
                                    <Typography style={{ color: "white", fontSize: 14, display: "flex", alignItems: "center" }}>Minted Only</Typography>
                                </Stack>
                            </Item>
                        </Grid>
                        <Grid item md={7} sm={8} sx={{ alignItems: "left", display: "flex", alignItems: "center" }}>
                            <Typography variant="h5" sx={{ color: "white" }}>StakingPool: Staking Pool 1, Epoch: Epoch 1</Typography>
                        </Grid>
                        <Divider sx={{ width: "100%", borderColor: "#76769066", mt: 2, mb: 2 }} />
                        <Grid
                            container
                            sx={{ pl: 0, borderBottom: "1px solid rgba(118, 118, 144, 0.4)" }}
                        >
                            <Grid item md={3} sm={6} xs={12} sx={{ alignItems: "center", mb: 2 }}>
                                <Item style={{ boxShadow: "0px 0px 0px 0px", padding: 12, maxWidth: "160px", margin: "0 auto" }} onClick={() => setPageFlag(5)}>
                                    <img src="/samples/nft1.png" alt="nft image" width={130} style={{ borderRadius: 8 }}></img>
                                    <Typography sx={{ color: "white", mt: 0.5 }}>GroupA #2</Typography>
                                    <Typography sx={{ color: "white" }}>10%</Typography>
                                </Item>
                            </Grid>
                            <Grid item md={3} sm={6} xs={12} sx={{ alignItems: "center", mb: 2 }}>
                                <Item style={{ boxShadow: "0px 0px 0px 0px", padding: 12, maxWidth: "160px", margin: "0 auto" }} onClick={() => setPageFlag(5)}>
                                    <img src="/samples/nft1.png" alt="nft image" width={130} style={{ borderRadius: 8 }}></img>
                                    <Typography sx={{ color: "white", mt: 0.5 }}>GroupA #3</Typography>
                                    <Typography sx={{ color: "white" }}>Not Minted</Typography>
                                </Item>
                            </Grid>
                            <Grid item md={3} sm={6} xs={12} sx={{ alignItems: "center", mb: 2 }}>
                                <Item style={{ boxShadow: "0px 0px 0px 0px", padding: 12, maxWidth: "160px", margin: "0 auto" }} onClick={() => setPageFlag(5)}>
                                    <img src="/samples/nft1.png" alt="nft image" width={130} style={{ borderRadius: 8 }}></img>
                                    <Typography sx={{ color: "white", mt: 0.5 }}>GroupC #1</Typography>
                                    <Typography sx={{ color: "white" }}>Not Minted</Typography>
                                </Item>
                            </Grid>
                            <Grid item md={3} sm={6} xs={12} sx={{ alignItems: "center", mb: 2 }}>
                                <Item style={{ boxShadow: "0px 0px 0px 0px", padding: 12, maxWidth: "160px", margin: "0 auto" }} onClick={() => setPageFlag(5)}>
                                    <img src="/samples/nft1.png" alt="nft image" width={130} style={{ borderRadius: 8 }}></img>
                                    <Typography sx={{ color: "white", mt: 0.5 }}>GroupC #23</Typography>
                                    <Typography sx={{ color: "white" }}>Not Minted</Typography>
                                </Item>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            }
            {pageFlag === 5 &&
                <Grid
                    sx={{ width: "1220px", justifyContent: "center", padding: isMobile ? "0px 4px" : "0px 8px" }}
                    border={0}
                    columnSpacing={{ xs: 0, sm: 0, md: 2, lg: 2 }}
                >
                    <Grid
                        container
                        sx={{ pl: 0, borderBottom: "1px solid rgba(118, 118, 144, 0.4)" }}
                    >
                        <Grid item md={2} sx={{ alignItems: "left", mb: 2 }}>
                            <Button variant="contained" color="primary" onClick={() => setPageFlag(4)}><ArrowBack fontSize="medium" /></Button>
                        </Grid>
                        <Grid item md={10} sx={{ alignItems: "left", display: "flex", alignItems: "center" }}>
                            <Typography variant="h5" sx={{ color: "white" }}>Boost #003</Typography>
                        </Grid>
                        <Grid item md={12} sx={{ display: "flex", alignItems: "center", mb: 2, mt: 2, flexDirection: "row" }}>
                            <img src="/samples/nft1.png" alt="nft image" width={isMobile ? 140 : 180} style={{ borderRadius: 8 }}></img>
                            <Paper sx={{ background: "transparent", ml: 3 }}>
                                <Typography variant="h4" sx={{ color: "white", fontSize: "18px", mb: 1 }}>Boost ID: 003</Typography>
                                <Typography variant="h4" sx={{ color: "white", fontSize: "18px", mb: 1 }}>Boost Token: NFT</Typography>
                                <Typography variant="h4" sx={{ color: "white", fontSize: "18px", mb: 1 }}>Access: 07/23/2023 - 09/21/2023</Typography>
                                <Typography variant="h4" sx={{ color: "white", fontSize: "18px", mb: 1 }}>Max Boost: 20%</Typography>
                                <Typography variant="h4" sx={{ color: "white", fontSize: "18px", mb: 1 }}>Your Boost: 0%</Typography>
                            </Paper>
                        </Grid>
                        <Grid item md={12} sx={{ display: "flex", justifyContent: "right", mb: 1 }}>
                            <Button variant="contained" color="success" >Increase Boost</Button>
                            <Button variant="contained" color="error" sx={{ ml: 2 }}>Decrease Boost</Button>
                        </Grid>
                    </Grid>
                </Grid>
            }
            <Item style={{ boxShadow: "0px 0px 0px 0px", padding: 12, maxWidth: "160px", margin: "0 auto", position: "fixed", left: 10, top: "35%" }}>
                <Typography sx={{ color: "gold", mb: 1 }}>Activated NFT</Typography>
                <img src={"https://gateway.pinata.cloud/ipfs/" + activatedNft.url + "/" + activatedNft.tokenId + ".png"} alt="nft image" width={130} style={{ borderRadius: 8 }} onClick={() => setPageFlag(2)}></img>
                <Typography sx={{ color: "white", mt: 0.5 }}>{"Group " + activatedNft.gName + " #" + activatedNft.tokenId}</Typography>
            </Item>
            <GStakeModal mopen={mopen1} handleClose={handleClose1} activatedNft={activatedNft} sPoolInfo={sPoolInfo} contractAddr={contractAddresses[selected_chain]["gamutNFT"]} />
        </div>
    );
}