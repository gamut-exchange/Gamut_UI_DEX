import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
const POLLING_INTERVAL = 12000;
const RPC_URL1 = "https://goerli.infura.io/v3/";
const RPC_URL2 = "https://rpc.testnet.fantom.network/";

const walletConnectors = () => {

    const injected = new InjectedConnector({
        supportedChainIds: [5, 4002],
    });
    
    const walletconnect = new WalletConnectConnector({
        rpc: { 5: RPC_URL1, 4002: RPC_URL2 },
        bridge: "https://bridge.walletconnect.org",
        qrcode: true,
        pollingInterval: POLLING_INTERVAL,
    });

    return {injected, walletconnect};
}

export default walletConnectors;
