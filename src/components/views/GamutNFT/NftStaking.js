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
    getUserNfts,
    getAllStakingPools,
    getPoolEpochs,
    mintNft,
    executeClaimEpoch,
    numFormat,
} from "../../../config/web3";
import { poolList, boostToEpochList, contractAddresses, nftGroupList } from "../../../config/constants";
import GStakeModal from "./GStakeModal";
import GBoostMintModal from "./GBoostMintModal";

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
    const uniList = useSelector((state) => state.tokenList);
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
    const [sNft, setSNft] = useState({});
    const [sPoolInfo, setSPoolInfo] = useState({});
    const [sEpochs, setSEpochs] = useState([]);
    const [sEpochInfo, setSEpochInfo] = useState([]);
    const [mopen1, setMopen1] = useState(false);
    const [mopen2, setMopen2] = useState(false);
    const [stakingFlag, setStakingFlag] = useState(0);
    const [tboostingFlag, setTboostingFlag] = useState(0);

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
        setDisplayData1(mintedNfts.slice((p - 1) * 4, (p - 1) * 4 + 4));
    }

    const handleClose1 = () => {
        setMopen1(false);
    }

    const handleClose2 = () => {
        setMopen2(false);
    }

    const handleGNftMint = async (group) => {
        const provider = await connector.getProvider();
        await mintNft(provider, group.name, group.startTokenId, group.lastTokenId, group.mintPrice, group.mintToken, contractAddresses[selected_chain]["gamutNFT"], account);
    }

    const handleStakeModal = (flag) => {
        if (flag == 0)
            setStakingFlag(0);
        else
            setStakingFlag(1);
        setMopen1(true);
    }

    const handleTboostingModal = (flag) => {
        if (flag == 0)
            setTboostingFlag(0);
        else
            setTboostingFlag(1);
        setMopen2(true);
    }

    const activateNft = (unit) => {
        setActivatedNft(unit);
    }

    const handleNftDetail = (unit) => {
        setSNft(unit);
        setPageFlag(2);
    }

    const handleClaim = async (boost_to_epoch_id) => {
        const provider = await connector.getProvider();
        executeClaimEpoch(provider, activatedNft.tokenId, boost_to_epoch_id, contractAddresses[selected_chain]["gamutNFT"], account);
    }

    const executeClaimAll = async () => {
        for (let i = 0; i < sEpochs.length; i++) {
            if (Number(sEpochs[i].pendingReward) !== 0)
                await handleClaim(sEpochs[i].boostToEpochId);
        }
    }

    const createTokenDom = (address) => {
        let tokenItem = uniList[selected_chain].filter((item) => { return item.address.toLowerCase() === address.toLowerCase() });
        let poolItem = poolList[selected_chain].filter((item) => { return item.address.toLowerCase() === address.toLowerCase() });
        if (tokenItem.length != 0) {
            return (
                <div className="relative flex justify-center">
                    <div className="relative flex">
                        <img
                            src={
                                tokenItem[0]?.logoURL
                            }
                            alt="" className="w-[32px] h-[32px]"
                        />
                    </div>
                    <p className="text-lg font-bold" style={{ color: "#84b1e1", marginLeft: "5px", marginTop: "3px" }}>
                        {tokenItem[0]?.symbol}
                    </p>
                </div>
            );
        } else if (poolItem.length != 0) {
            return (
                <div className="relative flex justify-center">
                    <div className="relative flex">
                        <img
                            src={
                                poolItem[0]?.logoURLs[0]
                            }
                            alt="" className="w-[32px] h-[32px]"
                        />
                        <img
                            className="z-10 relative right-2 w-[32px] h-[32px]"
                            src={
                                poolItem[0]?.logoURLs[1]
                            }
                            alt=""
                        />
                    </div>
                    <p className="text-lg font-bold" style={{ color: "#84b1e1" }}>
                        {poolItem[0]?.symbols[0]}
                        {"-"}
                        {poolItem[0]?.symbols[1]}
                        {" "}LP
                    </p>
                </div>
            );
        } else {
            return (
                <Typography>Unknown</Typography>
            );
        }
    }

    const getTokenInfo = (address) => {
        let result = {};
        let tokenItem = uniList[selected_chain].filter((item) => { return item.address.toLowerCase() === address.toLowerCase() });
        let poolItem = poolList[selected_chain].filter((item) => { return item.address.toLowerCase() === address.toLowerCase() });
        if (tokenItem.length !== 0) {
            result = tokenItem[0];
            result.tokenType = 0;
        } else if (poolItem.length !== 0) {
            result = poolItem[0];
            result.tokenType = 1;
        }
        return result;
    }

    const handleStakeDetail = async (flag, unit) => {
        const provider = await connector.getProvider();
        setPageFlag(flag);
        setSPoolInfo(unit);
        const epochs = await getPoolEpochs(provider, boostToEpochList[selected_chain], unit.nftId, unit.poolId, contractAddresses[selected_chain]["gamutNFT"]);
        setSEpochs(epochs);
    }

    const moreBoostInfo = (epochInfo) => {
        setPageFlag(4);
        setSEpochInfo(epochInfo);
    }

    const getInfo = async () => {
        const provider = await connector.getProvider();
        const myNfts = await getUserNfts(provider, nftGroupList[selected_chain], contractAddresses[selected_chain]["gamutNFT"], account);
        if (myNfts) {
            setMintedNfts(myNfts[0]);
            setDisplayData1(myNfts[0].slice(0, 4));
            let cnt1 = myNfts[0].length / 4;
            cnt1 = Number(cnt1.toFixed(0));
            setCount1(cnt1);
            if (myNfts[0].length !== 0) {
                setActivatedNft(myNfts[0][0]);
                const allStakingPools = await getAllStakingPools(provider, myNfts[0][0].tokenId, boostToEpochList[selected_chain], contractAddresses[selected_chain]["gamutNFT"]);
                setAllStakes(allStakingPools);
                setDisplayData2(allStakingPools.slice(0, 4));
                let cnt2 = allStakingPools.length / 4;
                cnt2 = Number(cnt2.toFixed(0));
                setCount2(cnt2);
            } else {
                const allStakingPools = await getAllStakingPools(provider, 0, boostToEpochList[selected_chain], contractAddresses[selected_chain]["gamutNFT"]);
                setAllStakes(allStakingPools);
                setDisplayData2(allStakingPools.slice(0, 4));
                let cnt2 = allStakingPools.length / 4;
                cnt2 = Number(cnt2.toFixed(0));
                setCount2(cnt2);
            }
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
                            {nftGroupList[selected_chain].map(unit => {
                                return (
                                    <Grid item md={3} sm={6} sx={{ alignItems: "center", mb: 2 }}>
                                        <Item style={{ boxShadow: "0px 0px 0px 0px", padding: 12, maxWidth: "160px", margin: "0 auto" }}>
                                            <img src={"https://gateway.pinata.cloud/ipfs/" + unit.imageUrl + "/" + unit.startTokenId + ".png"} alt="nft image" width={130} style={{ borderRadius: 8 }} onClick={() => handleNftDetail(unit)}></img>
                                            <Typography sx={{ color: "white", mt: 0.5 }}>{"Group " + unit.name}</Typography>
                                            <Button size="small" variant="contained" color="primary" onClick={() => handleGNftMint(unit)}>Mint</Button>
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
                    <Grid
                        container
                        sx={{ pl: 0, borderTop: "1px solid rgba(118, 118, 144, 0.4)", paddingTop: "1rem", marginTop: "0.5rem" }}
                    >
                        <Grid item={true} xs={12} sm={6} md={4} sx={{ mt: 2 }} className="home__mainC">
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
                        <Grid item={true} xs={12} sm={6} md={4} sx={{ mt: 2 }} className="home__mainC">
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
                        <Grid item={true} xs={12} sm={6} md={4} sx={{ mt: 2 }} className="home__mainC">
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
                                                Staking Token
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
                                            {activatedNft.tokenId &&
                                                <TableCell align="center" style={{ color: "white", paddingTop: 12, paddingBottom: 12 }}>
                                                    Details
                                                </TableCell>
                                            }
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {allStakes.length !== 0 &&
                                            displayData2.map((unit, index) => {
                                                return (
                                                    <TableRow
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                        key={"stake_" + index}
                                                    >
                                                        <TableCell scope="row" align="center" style={{ color: "white", paddingTop: 5, paddingBottom: 5 }}>
                                                            <h3 className="font-medium text-lg">
                                                                Staking {index + 1}
                                                            </h3>
                                                        </TableCell>
                                                        <TableCell align="center" style={{ color: "white", paddingTop: 5, paddingBottom: 5 }}>
                                                            {unit.isStaked ? createTokenDom(unit?.address) : "no stake"}
                                                        </TableCell>
                                                        <TableCell align="center" style={{ color: "white", paddingTop: 5, paddingBottom: 5 }}>
                                                            <h3 className="font-medium text-lg">
                                                                {unit.isStaked ? "#" + unit.nftId : "no stake"}
                                                            </h3>
                                                        </TableCell>
                                                        <TableCell align="center" style={{ color: "white", paddingTop: 5, paddingBottom: 5 }}>
                                                            <h3 className="font-medium text-lg">
                                                                {unit.isStaked ? unit.apr : "no stake"}
                                                            </h3>
                                                        </TableCell>
                                                        <TableCell align="center" style={{ color: "white", paddingTop: 5, paddingBottom: 5 }}>
                                                            <h3 className="font-medium text-lg">
                                                                {unit.isStaked ? unit.amount : "no stake"}
                                                            </h3>
                                                        </TableCell>
                                                        {activatedNft.tokenId &&
                                                            <TableCell align="center" style={{ paddingTop: 5, paddingBottom: 5 }}>
                                                                <Button>
                                                                    <KeyboardArrowRight onClick={() => handleStakeDetail(3, { ...unit, sIndex: index })} />
                                                                </Button>
                                                            </TableCell>
                                                        }
                                                    </TableRow>
                                                )
                                            })
                                        }
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
                            {displayData1.length == 0 &&
                                <Grid>
                                    <Typography variant="h6" sx={{ color: "white" }}>There are no minted NFTs.</Typography>
                                </Grid>
                            }
                            {displayData1.length != 0 &&
                                displayData1.map(unit => {
                                    return (
                                        <Grid item md={2} sm={6} sx={{ alignItems: "center", mb: 2 }}>
                                            <Item style={{ boxShadow: "0px 0px 0px 0px", padding: 12, maxWidth: "160px", margin: "0 auto" }}>
                                                <img src={"https://gateway.pinata.cloud/ipfs/" + unit.url + "/" + unit.tokenId + ".png"} alt="nft image" width={130} style={{ borderRadius: 8 }} onClick={() => handleNftDetail(unit)}></img>
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
                        {displayData1.length != 0 &&
                            <Grid container sx={{ alignItems: "center", justifyContent: "center" }}>
                                <Pagination count={count2} sx={{ button: { color: '#ffffff' }, marginTop: "6px", marginBottom: "6px" }} color="primary" shape="rounded" onChange={handlePChange1} />
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
                            <img src={"https://gateway.pinata.cloud/ipfs/" + sNft.url + "/" + sNft.tokenId + ".png"} alt="nft image" width={isMobile ? 140 : 180} style={{ borderRadius: 8 }}></img>
                            <Paper sx={{ background: "transparent", ml: 3 }}>
                                <Typography variant="h4" sx={{ color: "white", fontSize: "18px", mb: 1 }}>NFT ID: #{sNft.tokenId}</Typography>
                                <Typography variant="h4" sx={{ color: "white", fontSize: "18px", mb: 1 }}>NFT Group: {sNft.gName}</Typography>
                                <Typography variant="h4" sx={{ color: "white", fontSize: "18px", mb: 1 }}>Mint Token: {sNft.tokenAddr.substr(0, 16)}...</Typography>
                                <Typography variant="h4" sx={{ color: "white", fontSize: "18px", mb: 1 }}>Mint Price: {sNft.price}</Typography>
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
                                    <Button variant="contained" color="success" onClick={() => handleStakeModal(0)} >stake</Button>
                                </Grid>
                            }
                            {(sPoolInfo.isStaked && sPoolInfo.nftId === activatedNft.tokenId) &&
                                <Grid item md={12} sx={{ display: "flex", justifyContent: "right", mb: 1 }}>
                                    <Button variant="contained" color="success" onClick={() => handleStakeModal(0)}>stake</Button>
                                    <Button variant="contained" color="error" sx={{ ml: 2 }} onClick={() => handleStakeModal(1)}>unstake</Button>
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
                                                    Pending Reward
                                                </TableCell>
                                                <TableCell align="center" style={{ color: "white", paddingTop: 12, paddingBottom: 12 }}>
                                                    Outstanding Reward
                                                </TableCell>
                                                {sPoolInfo.isStaked &&
                                                    <TableCell align="center" style={{ color: "white", paddingTop: 12, paddingBottom: 12 }}>
                                                        <Button variant="outlined" color="warning" size="small" onClick={executeClaimAll}>Claim All</Button>
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
                                                                        onClick={() => moreBoostInfo(item)}
                                                                    >
                                                                        More
                                                                    </Button>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell align="center" style={{ color: "white", paddingTop: 10, paddingBottom: 10 }}>
                                                                {createTokenDom(item?.rewardToken)}
                                                            </TableCell>
                                                            <TableCell align="center" style={{ color: "white", paddingTop: 10, paddingBottom: 10 }}>
                                                                {numFormat(item?.pendingReward)}
                                                            </TableCell>
                                                            <TableCell align="center" style={{ color: "white", paddingTop: 10, paddingBottom: 10 }}>
                                                                {Number(item.boost2) === 0 ? "NO" : "YES"}
                                                            </TableCell>
                                                            {sPoolInfo.isStaked &&
                                                                <TableCell align="center" style={{ color: "white", paddingTop: 10, paddingBottom: 10 }}>
                                                                    <Button variant="outlined" size="small" color="warning" sx={{ ml: 1, fontSize: "12px", padding: "4px 4px 2px", alignItems: "center" }} onClick={() => handleClaim(item.boostToEpochId)}>Claim</Button>
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
                        {/* <Grid item={true} md={3} sm={4} sx={{ mt: 0.7 }} className="home__mainC">
                            <Item
                                elevation={1}
                                style={{ backgroundColor: "transparent", boxShadow: "0px 0px 0px 0px", padding: "0px 18px", minWidth: "180px" }}
                            >
                                <Stack direction="row" spacing={1}>
                                    <AntSwitch onChange={handleStaked} inputProps={{ 'aria-label': 'ant design' }} />
                                    <Typography style={{ color: "white", fontSize: 14, display: "flex", alignItems: "center" }}>Minted Only</Typography>
                                </Stack>
                            </Item>
                        </Grid> */}
                        <Grid item md={7} sm={8} sx={{ alignItems: "left", display: "flex", alignItems: "center" }}>
                            <Typography variant="h5" sx={{ color: "white" }}>StakingPool: #{sPoolInfo?.sIndex + 1}, Epoch: #{sEpochInfo.epochId}</Typography>
                        </Grid>
                        <Divider sx={{ width: "100%", borderColor: "#76769066", mt: 2, mb: 2 }} />
                        <Grid
                            container
                            sx={{ pl: 0, borderBottom: "1px solid rgba(118, 118, 144, 0.4)" }}
                        >
                            <Grid item xs={12} sx={{ alignItems: "center", mb: 2 }}>
                                <Item style={{ boxShadow: "0px 0px 0px 0px", padding: 12, maxWidth: "160px", margin: "0 auto" }} onClick={() => setPageFlag(5)}>
                                    {Number(sEpochInfo.boostType) === 0 && <img src="/samples/nft_token.png" alt="nft image" width={130} style={{ borderRadius: 8 }}></img>}
                                    {Number(sEpochInfo.boostType) === 1 && <img src="/samples/ft_token.png" alt="nft image" width={130} style={{ borderRadius: 8 }}></img>}
                                    <Typography sx={{ color: "white", mt: 0.5 }}>Boost #{sEpochInfo.boostId}</Typography>
                                    <Typography sx={{ color: "white" }}>{(Number(sEpochInfo.boost2) / 10000).toFixed(2)}%</Typography>
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
                            <Typography variant="h5" sx={{ color: "white" }}>Boost #{sEpochInfo.boostId}</Typography>
                        </Grid>
                        <Grid item md={12} sx={{ display: "flex", alignItems: "center", mb: 2, mt: 2, flexDirection: "row" }}>
                            {Number(sEpochInfo.boostType) === 0 && <img src="/samples/nft_token.png" alt="nft image" width={isMobile ? 140 : 180} style={{ borderRadius: 8 }}></img>}
                            {Number(sEpochInfo.boostType) === 1 && <img src="/samples/ft_token.png" alt="nft image" width={isMobile ? 140 : 180} style={{ borderRadius: 8 }}></img>}
                            <Paper sx={{ background: "transparent", ml: 3, boxShadow: "0px 0px 0px 0px" }}>
                                <Typography variant="h4" sx={{ color: "white", fontSize: "18px", mb: 1 }}>Boost ID: {sEpochInfo.boostId}</Typography>
                                <Typography variant="h4" sx={{ color: "white", fontSize: "18px", mb: 1 }}>Boost Token:
                                    {Number(sEpochInfo.boostType) === 0 ? "NFT(" + sEpochInfo.tStakingToken.substr(0, 18) + "...)"
                                        :
                                        (getTokenInfo(sEpochInfo.tStakingToken).symbol ? getTokenInfo(sEpochInfo.tStakingToken).symbol : getTokenInfo(sEpochInfo.tStakingToken).symbols[0] + " " + getTokenInfo(sEpochInfo.tStakingToken).symbol[1] + " LP")}
                                </Typography>
                                <Typography variant="h4" sx={{ color: "white", fontSize: "18px", mb: 1 }}>Access: 07/23/2023 - 09/21/2023</Typography>
                                <Typography variant="h4" sx={{ color: "white", fontSize: "18px", mb: 1 }}>Max Boost: {sEpochInfo.maxBoost / 10000}%</Typography>
                                <Typography variant="h4" sx={{ color: "white", fontSize: "18px", mb: 1 }}>Your Boost: {(Number(sEpochInfo.boost2) / 10000).toFixed(2)}%</Typography>
                            </Paper>
                        </Grid>
                        <Grid item md={12} sx={{ display: "flex", justifyContent: "right", mb: 1 }}>
                            <Button variant="contained" color="success" onClick={() => handleTboostingModal(0)} >Increase Boost</Button>
                            {Number(sEpochInfo.boost2) !== 0 && <Button variant="contained" color="error" sx={{ ml: 2 }} onClick={() => handleTboostingModal(1)}>Decrease Boost</Button>}
                        </Grid>
                    </Grid>
                </Grid>
            }
            {activatedNft.tokenId &&
                <Item style={{ boxShadow: "0px 0px 0px 0px", padding: 12, maxWidth: "160px", margin: "0 auto", position: "fixed", left: 10, top: "35%" }}>
                    <Typography sx={{ color: "gold", mb: 1 }}>Activated NFT</Typography>
                    <img src={"https://gateway.pinata.cloud/ipfs/" + activatedNft.url + "/" + activatedNft.tokenId + ".png"} alt="nft image" width={130} style={{ borderRadius: 8 }} onClick={() => handleNftDetail(activatedNft)}></img>
                    <Typography sx={{ color: "white", mt: 0.5 }}>{"Group " + activatedNft.gName + " #" + activatedNft.tokenId}</Typography>
                </Item>
            }
            <GStakeModal mopen={mopen1} handleClose={handleClose1} stakingFlag={stakingFlag} activatedNft={activatedNft} sPoolInfo={sPoolInfo} contractAddr={contractAddresses[selected_chain]["gamutNFT"]} />
            <GBoostMintModal mopen={mopen2} handleClose={handleClose2} tboostingFlag={tboostingFlag} activatedNft={activatedNft} sEpochInfo={sEpochInfo} contractAddr={contractAddresses[selected_chain]["gamutNFT"]} />
        </div>
    );
}
