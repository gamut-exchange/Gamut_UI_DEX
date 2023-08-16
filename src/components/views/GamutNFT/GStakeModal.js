import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import {
    Modal,
    Grid,
    Paper,
    TextField,
    Typography,
    Button
} from "@mui/material";
import { styled } from "@mui/material/styles";
import tw from "twin.macro";
import {
    executeStaking
} from "../../../config/web3";

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

export default function GStakeModal({ mopen, handleClose, activatedNft, sPoolInfo, contractAddr }) {
    const { account, connector } = useWeb3React();
    // const dispatch = useDispatch();
    // const provider = defaultProvider[selected_chain];
    const [amount, setAmount] = useState(0);

    const handleChange = (e) => {
        setAmount(e.target.value);
    }

    const confirmStaking = async () => {
        const provider = await connector.getProvider();
        executeStaking(provider, sPoolInfo.poolId, amount, activatedNft.tokenId, sPoolInfo.stakingToken, contractAddr, account);
    }

    return (
        <Modal
            open={mopen}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <StyledModal className="bg-modal">
                <Typography variant="h6" sx={{ color: "white" }}>Staking Pool #{sPoolInfo?.sIndex + 1}</Typography>
                <Grid container sx={{ justifyContent: "center" }}>
                    <Item style={{ boxShadow: "0px 0px 0px 0px", padding: 12, maxWidth: "160px", margin: "0 auto" }}>
                        <Typography sx={{ color: "gold", mb: 1 }}>Activated NFT</Typography>
                        <img src={"https://gateway.pinata.cloud/ipfs/" + activatedNft.url + "/" + activatedNft.tokenId + ".png"} alt="nft image" width={130} style={{ borderRadius: 8 }}></img>
                        <Typography sx={{ color: "white", mt: 0.5 }}>{"Group " + activatedNft.gName + " #" + activatedNft.tokenId}</Typography>
                    </Item>
                </Grid>
                <Typography sx={{ color:"white", mb:2, mt:2 }}>Staking Token: {sPoolInfo?.stakingToken}</Typography>
                <TextField label="Input your staking token amount" sx={{ color:"white" }} InputLabelProps={{
                    style: { color: "#ddd" }
                }} onChange={handleChange}></TextField>
                <Grid container sx={{ justifyContent:"end", mt:2 }}>
                    <Button variant="contained" onClick={ confirmStaking }>Confirm</Button>
                    </Grid>
            </StyledModal>
        </Modal>
    )
}
