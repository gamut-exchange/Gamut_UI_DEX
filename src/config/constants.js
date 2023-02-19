export const handleValueTime = 500 // 0.5s

export const contractAddresses = {
	'kava': {
		'router': '0x923A7273480e73439b73b065d096c58034968504',
		'hedgeFactory': '0xbD4C56E952c238389AEE995E1ed504cA646D199B'
	}
}

export const defaultTokenList = {
	'kava': [
		{ value: "kava", chainId: 2222, address: "0x0000000000000000000000000000000000000000", symbol: "KAVA", name: "KAVA Coin", decimals: 18, logoURL: "https://assets-cdn.trustwallet.com/blockchains/kava/info/logo.png", tags: ["Coin"] },
		{ value: "busd", chainId: 2222, address: "0x332730a4F6E03D9C55829435f10360E13cfA41Ff", symbol: "BUSD", name: "BUSD Coin", decimals: 18, logoURL: "https://cryptologos.cc/logos/binance-usd-busd-logo.png", tags: ["stablecoin"] },
		{ value: "wkava", chainId: 2222, address: "0xc86c7C0eFbd6A49B35E8714C5f59D99De09A225b", symbol: "WKAVA", name: "Wrapped KAVA", decimals: 18, logoURL: "https://assets-cdn.trustwallet.com/blockchains/kava/info/logo.png", tags: ["Coin"] },
	]
}

export const defaultProvider = {
	'kava': 'https://evm.kava.io'
}

export const chainIds = {
	'kava': 2222
}

export const userSettings = "Gamut_settings";
export const customList = "customList";
export const tokenListLink = "https://gateway.pinata.cloud/ipfs/QmSxSrj95qFFr4JhUshYBa17wLR7XeXETE47xjEd8TcSU4";

export const poolList = {
	'kava': [
		{ value: "other", address: "0x6BE57618C8832Ad25cCeAdF2745d5C92De7ab7b2", symbols: ["BUSD", "WKAVA"], logoURLs: ["/icons/busd.svg", "/icons/wkava.svg"] },
		{ value: "other", address: "0xbd3d481e308A6f2fA6714bA3dc33e68Ab3915557", symbols: ["DAI", "WBTC"], logoURLs: ["/icons/dai.svg", "/icons/wbtc.svg"] },
		{ value: "other", address: "0x9D102cE615ab35CEdDDa899bE47A8DA5Dc139460", symbols: ["BUSD", "DAI"], logoURLs: ["/icons/busd.svg", "/icons/dai.svg"] },
		{ value: "other", address: "0x1e34dd2F920630e6AF04519221ed9004608A6c52", symbols: ["DAI", "WKAVA"], logoURLs: ["/icons/dai.svg", "/icons/wkava.svg"] },
		{ value: "other", address: "0xBd87cD1512763EEFC14B3717ff42538022E95C95", symbols: ["USDT", "ETH"], logoURLs: ["/icons/usdt.svg", "/icons/eth.svg"] },
	]
}
