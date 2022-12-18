export const contractAddresses = {
	'kava': {
		'router': '0x923A7273480e73439b73b065d096c58034968504',
		'hedgeFactory': '0xbD4C56E952c238389AEE995E1ed504cA646D199B'
	}
}

export const uniList = {
	'kava': [
		{ value: "wbtc", chainId: 2222, address: "0x818ec0A7Fe18Ff94269904fCED6AE3DaE6d6dC0b", symbol: "WBTC", name: "Wrapped BTC", decimals: 8, logoURL: "/icons/wbtc.svg", tags: ["Coin"] },
		{ value: "dai", chainId: 2222, address: "0x765277EebeCA2e31912C9946eAe1021199B39C61", symbol: "DAI", name: "DAI Coin", decimals: 18, logoURL: "/icons/dai.svg", tags: ["stablecoin"] },
		{ value: "busd", chainId: 2222, address: "0x332730a4F6E03D9C55829435f10360E13cfA41Ff", symbol: "BUSD", name: "BUSD Coin", decimals: 18, logoURL: "/icons/busd.svg", tags: ["stablecoin"] },
		{ value: "wkava", chainId: 2222, address: "0xc86c7C0eFbd6A49B35E8714C5f59D99De09A225b", symbol: "WKAVA", name: "Wrapped KAVA", decimals: 18, logoURL: "/icons/wkava.svg", tags: ["Coin"] },
		{ value: "kava", chainId: 2222, address: "0x0000000000000000000000000000000000000000", symbol: "KAVA", name: "KAVA Coin", decimals: 18, logoURL: "/icons/kava.svg", tags: ["Coin"] }
	]
}

export const poolList = {
	'kava': [
		{ value: "other", address: "0x6BE57618C8832Ad25cCeAdF2745d5C92De7ab7b2", symbols: ["BUSD", "WKAVA"], logoURLs: ["/icons/busd.svg", "/icons/wkava.svg"] },
		{ value: "other", address: "0xbd3d481e308A6f2fA6714bA3dc33e68Ab3915557", symbols: ["DAI", "WBTC"], logoURLs: ["/icons/dai.svg", "/icons/btc.svg"] },
		{ value: "other", address: "0x9D102cE615ab35CEdDDa899bE47A8DA5Dc139460", symbols: ["DAI", "BUSD"], logoURLs: ["/icons/dai.svg", "/icons/busd.svg"] },
		{ value: "other", address: "0x1e34dd2F920630e6AF04519221ed9004608A6c52", symbols: ["DAI", "WKAVA"], logoURLs: ["/icons/dai.svg", "/icons/wkava.svg"] }
	]
}
