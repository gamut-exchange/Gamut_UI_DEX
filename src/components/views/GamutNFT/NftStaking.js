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
    TableCell
} from "@mui/material";
import {
    KeyboardArrowRight,
    Person,
    ArrowBack
} from "@mui/icons-material";
import { makeStyles } from "@mui/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

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
    const classes = useStyles();
    const [pageFlag, setPageFlag] = useState(0);
    const [statusFlag, setStatusFlag] = useState(false);
    const [stakedFlag, setStakedFlag] = useState(false);
    const [sortBy, setSortBy] = useState(1);
    const [query, setQuery] = useState("");

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
                        sx={{ pl: 0, borderBottom: "1px solid rgba(118, 118, 144, 0.4)" }}
                    >
                        <Grid item md={2} sm={6} xs={12} sx={{ alignItems: "center", mb: 2 }}>
                            <Item style={{ boxShadow: "0px 0px 0px 0px", padding: 12, maxWidth: "160px", margin: "0 auto" }} onClick={() => setPageFlag(2)}>
                                <img src="/samples/nft1.png" alt="nft image" width={130} style={{ borderRadius: 8 }}></img>
                                <Typography sx={{ color: "white", mt: 0.5 }}>GroupA #1</Typography>
                                <Button size="small" variant="contained" color="primary">Mint</Button>
                            </Item>
                        </Grid>
                        <Grid item md={2} sm={6} xs={12} sx={{ alignItems: "center", mb: 2 }}>
                            <Item style={{ boxShadow: "0px 0px 0px 0px", padding: 12, maxWidth: "160px", margin: "0 auto" }} onClick={() => setPageFlag(2)}>
                                <img src="/samples/nft1.png" alt="nft image" width={130} style={{ borderRadius: 8 }}></img>
                                <Typography sx={{ color: "white", mt: 0.5 }}>GroupA #2</Typography>
                                <Button size="small" variant="contained" color="primary">Mint</Button>
                            </Item>
                        </Grid>
                        <Grid item md={2} sm={6} xs={12} sx={{ alignItems: "center", mb: 2 }}>
                            <Item style={{ boxShadow: "0px 0px 0px 0px", padding: 12, maxWidth: "160px", margin: "0 auto" }} onClick={() => setPageFlag(2)}>
                                <img src="/samples/nft1.png" alt="nft image" width={130} style={{ borderRadius: 8 }}></img>
                                <Typography sx={{ color: "white", mt: 0.5 }}>GroupA #3</Typography>
                                <Button size="small" variant="contained" color="primary">Mint</Button>
                            </Item>
                        </Grid>
                        <Grid item md={2} sm={6} xs={12} sx={{ alignItems: "center", mb: 2 }}>
                            <Item style={{ boxShadow: "0px 0px 0px 0px", padding: 12, maxWidth: "160px", margin: "0 auto" }} onClick={() => setPageFlag(2)}>
                                <img src="/samples/nft1.png" alt="nft image" width={130} style={{ borderRadius: 8 }}></img>
                                <Typography sx={{ color: "white", mt: 0.5 }}>GroupA #4</Typography>
                                <Button size="small" variant="contained" color="primary">Mint</Button>
                            </Item>
                        </Grid>
                        <Grid item md={2} sm={6} xs={12} sx={{ alignItems: "center", mb: 2 }}>
                            <Item style={{ boxShadow: "0px 0px 0px 0px", padding: 12, maxWidth: "160px", margin: "0 auto" }} onClick={() => setPageFlag(2)}>
                                <img src="/samples/nft1.png" alt="nft image" width={130} style={{ borderRadius: 8 }}></img>
                                <Typography sx={{ color: "white", mt: 0.5 }}>GroupA #5</Typography>
                                <Button size="small" variant="contained" color="primary">Mint</Button>
                            </Item>
                        </Grid>
                        <Grid item md={2} sm={6} xs={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center", mb: 2 }}>
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
                        sx={{ pl: 0 }}
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
                                                Reward
                                            </TableCell>
                                            <TableCell align="center" style={{ color: "white", paddingTop: 12, paddingBottom: 12 }}>
                                                Details
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row" align="center" style={{ color: "white", paddingTop: 5, paddingBottom: 5 }}>
                                                1
                                            </TableCell>
                                            <TableCell align="center" style={{ color: "white", paddingTop: 5, paddingBottom: 5 }}>
                                                <Typography>BTC/ETH</Typography>
                                            </TableCell>
                                            <TableCell align="center" style={{ color: "white", paddingTop: 5, paddingBottom: 5 }}>
                                                <h3 className="font-medium">
                                                    GroupA #1
                                                </h3>
                                            </TableCell>
                                            <TableCell align="center" style={{ color: "white", paddingTop: 5, paddingBottom: 5 }}>
                                                23.22%
                                            </TableCell>
                                            <TableCell align="center" style={{ color: "white", paddingTop: 5, paddingBottom: 5 }}>
                                                1.4
                                            </TableCell>
                                            <TableCell align="center" style={{ paddingTop: 5, paddingBottom: 5 }}>
                                                <Button>
                                                    <KeyboardArrowRight />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row" align="center" style={{ color: "white", paddingTop: 5, paddingBottom: 5 }}>
                                                2
                                            </TableCell>
                                            <TableCell align="center" style={{ color: "white", paddingTop: 5, paddingBottom: 5 }}>
                                                <Typography>BTC/ETH</Typography>
                                            </TableCell>
                                            <TableCell align="center" style={{ color: "white", paddingTop: 5, paddingBottom: 5 }}>
                                                <h3 className="font-medium">
                                                    GroupA #2
                                                </h3>
                                            </TableCell>
                                            <TableCell align="center" style={{ color: "white", paddingTop: 5, paddingBottom: 5 }}>
                                                23.22%
                                            </TableCell>
                                            <TableCell align="center" style={{ color: "white", paddingTop: 5, paddingBottom: 5 }}>
                                                1.4
                                            </TableCell>
                                            <TableCell align="center" style={{ paddingTop: 5, paddingBottom: 5 }}>
                                                <Button>
                                                    <KeyboardArrowRight />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row" align="center" style={{ color: "white", paddingTop: 5, paddingBottom: 5 }}>
                                                3
                                            </TableCell>
                                            <TableCell align="center" style={{ color: "white", paddingTop: 5, paddingBottom: 5 }}>
                                                <Typography>BTC/ETH</Typography>
                                            </TableCell>
                                            <TableCell align="center" style={{ color: "white", paddingTop: 5, paddingBottom: 5 }}>
                                                <h3 className="font-medium">
                                                    GroupA #3
                                                </h3>
                                            </TableCell>
                                            <TableCell align="center" style={{ color: "white", paddingTop: 5, paddingBottom: 5 }}>
                                                23.22%
                                            </TableCell>
                                            <TableCell align="center" style={{ color: "white", paddingTop: 5, paddingBottom: 5 }}>
                                                1.4
                                            </TableCell>
                                            <TableCell align="center" style={{ paddingTop: 5, paddingBottom: 5 }}>
                                                <Button>
                                                    <KeyboardArrowRight />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
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
                        <Grid item md={3} sm={6} xs={12} sx={{ alignItems: "center", mb: 2 }}>
                            <Item style={{ boxShadow: "0px 0px 0px 0px", padding: 12, maxWidth: "160px", margin: "0 auto" }}>
                                <img src="/samples/nft1.png" alt="nft image" width={130} style={{ borderRadius: 8 }}></img>
                                <Typography sx={{ color: "white", mt: 0.5 }}>GroupA #1</Typography>
                            </Item>
                        </Grid>
                        <Grid item md={3} sm={6} xs={12} sx={{ alignItems: "center", mb: 2 }}>
                            <Item style={{ boxShadow: "0px 0px 0px 0px", padding: 12, maxWidth: "160px", margin: "0 auto" }}>
                                <img src="/samples/nft1.png" alt="nft image" width={130} style={{ borderRadius: 8 }}></img>
                                <Typography sx={{ color: "white", mt: 0.5 }}>GroupA #23</Typography>
                            </Item>
                        </Grid>
                        <Grid item md={3} sm={6} xs={12} sx={{ alignItems: "center", mb: 2 }}>
                            <Item style={{ boxShadow: "0px 0px 0px 0px", padding: 12, maxWidth: "160px", margin: "0 auto" }}>
                                <img src="/samples/nft1.png" alt="nft image" width={130} style={{ borderRadius: 8 }}></img>
                                <Typography sx={{ color: "white", mt: 0.5 }}>GroupC #291</Typography>
                            </Item>
                        </Grid>
                        <Grid item md={3} sm={6} xs={12} sx={{ alignItems: "center", mb: 2 }}>
                            <Item style={{ boxShadow: "0px 0px 0px 0px", padding: 12, maxWidth: "160px", margin: "0 auto" }}>
                                <img src="/samples/nft1.png" alt="nft image" width={130} style={{ borderRadius: 8 }}></img>
                                <Typography sx={{ color: "white", mt: 0.5 }}>GroupD #452</Typography>
                            </Item>
                        </Grid>
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
                            <img src="/samples/nft1.png" alt="nft image" width={isMobile?140:180} style={{ borderRadius: 8 }}></img>
                            <Paper sx={{ background:"transparent", ml:3 }}>
                                <Typography variant="h4" sx={{ color:"white", fontSize:"18px", mb:1 }}>NFT ID: 001</Typography>
                                <Typography variant="h4" sx={{ color:"white", fontSize:"18px", mb:1 }}>NFT Group: A</Typography>
                                <Typography variant="h4" sx={{ color:"white", fontSize:"18px", mb:1 }}>Mint Date: 07/23/2023</Typography>
                                <Typography variant="h4" sx={{ color:"white", fontSize:"18px", mb:1 }}>Owner: 0x294052....</Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
            }
        </div>
    );
}
