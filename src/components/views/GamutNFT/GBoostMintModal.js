import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useWeb3React } from "@web3-react/core";
import {
    Modal,
    Grid,
    Paper,
    InputBase,
    Typography,
    Button
} from "@mui/material";
import { styled } from "@mui/material/styles";
import tw from "twin.macro";
import {
    executeBMint
} from "../../../config/web3";
import { poolList } from "../../../config/constants";

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

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: "#12122c",
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

export default function GBoostMintModal({ mopen, handleClose, activatedNft, sEpochInfo, contractAddr }) {

    const selected_chain = useSelector((state) => state.selectedChain);
    const uniList = useSelector((state) => state.tokenList);
    const { account, connector } = useWeb3React();
    const { nftId, setNftId } = useState("");
    const [amount, setAmount] = useState(0);

    const createTokenDom = (address) => {
        if (address) {
            let tokenItem = uniList[selected_chain].filter((item) => { return item.address.toLowerCase() === address.toLowerCase() });
            let poolItem = poolList[selected_chain].filter((item) => { return item.address.toLowerCase() === address.toLowerCase() });
            if (tokenItem.length != 0) {
                return (
                    <Button
                        style={{ width: "35%", float: "left", border: "0px", padding: "10px 8px", backgroundColor: "#07071c", minHeight: "48px", fontSize: "12px" }}
                        startIcon={
                            <div style={{ float: "left" }}>
                                <img
                                    src={tokenItem[0]?.logoURL}
                                    alt=""
                                    style={{ float: "left" }}
                                    className="w-6 md:w-7"
                                />
                            </div>
                        }
                        className="w-36 sm:w-48"
                    >
                        {tokenItem[0]?.symbol}
                    </Button>
                );
            } else if (poolItem.length != 0) {
                return (
                    <Button
                        style={{ width: "35%", float: "left", border: "0px", padding: "9px 8px", backgroundColor: "#07071c", minHeight: "48px", fontSize: "10px" }}
                        startIcon={
                            <div style={{ float: "left" }}>
                                <img
                                    src={poolItem[0]?.logoURLs[0]}
                                    alt=""
                                    style={{ float: "left" }}
                                    className="w-4 md:w-5"
                                />
                                <img
                                    src={poolItem[0]?.logoURLs[1]}
                                    alt=""
                                    style={{ float: "left", marginLeft: -5 }}
                                    className="w-4 md:w-5"
                                />
                            </div>
                        }
                        className="w-36 sm:w-48"
                    >
                        {poolItem[0]?.symbols[0]} -{" "}
                        {poolItem[0]?.symbols[1]} LP
                    </Button>
                );
            } else {
                return (
                    <Typography>Unknown</Typography>
                );
            }
        }
    }

    const handleChange1 = (e) => {
        setNftId(e.target.value);
    }

    const handleChange2 = (e) => {
        setAmount(e.target.value);
    }

    const confirmBMint = async () => {
        const provider = await connector.getProvider();
        if (Number(sEpochInfo.boostType) === 0) {
            if (nftId.length !== 0)
                executeBMint(provider, sEpochInfo.boostId, nftId, 0, activatedNft.tokenId, sEpochInfo.tStakingToken, contractAddr, account);
        } else if (Number(sEpochInfo.boostType) === 1) {
            if (Number(amount) !== 0)
                executeBMint(provider, sEpochInfo.boostId, 0, amount, activatedNft.tokenId, sEpochInfo.tStakingToken, contractAddr, account);
        }
    }

    return (
        <Modal
            open={mopen}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <StyledModal className="bg-modal">
                <Typography variant="h6" sx={{ color: "white" }}>Boost #{sEpochInfo.boostId}</Typography>
                <Grid container sx={{ justifyContent: "center" }}>
                    <Item style={{ boxShadow: "0px 0px 0px 0px", padding: 12, maxWidth: "160px", margin: "0 auto" }}>
                        <Typography sx={{ color: "gold", mb: 1 }}>Activated NFT</Typography>
                        <img src={"https://gateway.pinata.cloud/ipfs/" + activatedNft.url + "/" + activatedNft.tokenId + ".png"} alt="nft image" width={130} style={{ borderRadius: 8 }}></img>
                        <Typography sx={{ color: "white", mt: 0.5 }}>{"Group " + activatedNft.gName + " #" + activatedNft.tokenId}</Typography>
                    </Item>
                </Grid>
                {Number(sEpochInfo.boostType) == 0 &&
                    <div style={{ backgroundColor: "#12122c", marginTop: "24px" }}>
                        <Typography variant="h6">{sEpochInfo.tStakingToken.substr(0, 16)}...</Typography>
                        <BootstrapInput
                            id="demo-customized-textbox"
                            type="text"
                            value={nftId}
                            style={{
                                color: "#FFFFFF",
                                width: "100%",
                                float: "left",
                                borderLeft: "1px solid white",
                                borderRadius: "14px",
                            }}
                            onChange={handleChange1}
                        />
                    </div>
                }
                {Number(sEpochInfo.boostType) == 1 &&
                    <div style={{ backgroundColor: "#12122c", marginTop: "24px" }}>
                        {createTokenDom(sEpochInfo?.tStakingToken)}
                        <BootstrapInput
                            id="demo-customized-textbox"
                            type="text"
                            value={amount}
                            min={0}
                            style={{
                                color: "#FFFFFF",
                                width: "65%",
                                float: "left",
                                borderLeft: "1px solid white",
                                borderRadius: "14px",
                            }}
                            onChange={handleChange2}
                            onKeyUp={handleChange2}
                        />
                    </div>
                }
                <Grid container sx={{ justifyContent: "end", mt: 2 }}>
                    <Button variant="contained" onClick={confirmBMint}>Confirm</Button>
                </Grid>
            </StyledModal>
        </Modal>
    )
}
