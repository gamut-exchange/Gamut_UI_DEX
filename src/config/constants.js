export const contractAddresses = {
	'goerli':{
		'router': '0xEC23e1639c3CDa2c845ea1569686544AAB794270',
		'hedgeFactory': '0xDE835555399fC860122B0673d7A892aA7af2b5C3',
		'btc': '0xb0De0355020065b9C05f336B8a267B3CeF69262E',
		'usdc': '0x3346B2A939aA13e76Ce8Aa05ECCAe92E0D4F6580',
		'dai': '0x817F61606B7f073854c51ec93beF408708A5b4E4'
	},
	'fantom':{
		'router': '0xbbd5D17B9aC782709724e16B3ABafB69a4913B09',
		'hedgeFactory': '0xC19088c49DA26e8F74B28aDFD9D838ad495c3c19',
		'btc': '0x1c63A8233786C1955724A676B87B6a4f5A1E0847',		
		'eth': '0x73B0aF7A379C0126671Db09d7fAf9b8122BAe02D',
		'usdc': '0x7b4B44C987304dF194012d4Ae542629b7C2AC1D0',
		'dai': '0x2bffE1D2251Da22E31f2A769A7DfCDfB75770202',
	}
}

export const uniList = {
	'goerli': [
		{value: "btc", chainId: 5, address: "0xb0De0355020065b9C05f336B8a267B3CeF69262E", symbol: "BTC", name: "BTC Coin", decimals: 18, logoURL: "/icons/btc.svg", tags: ["stablecoin"]},
		{value: "dai", chainId: 5, address: "0x817F61606B7f073854c51ec93beF408708A5b4E4", symbol: "DAI", name: "DAI Coin", decimals: 18, logoURL: "/icons/dai.svg", tags: ["stablecoin"]},
		{value: "usdt", chainId: 5, address: "0x3346B2A939aA13e76Ce8Aa05ECCAe92E0D4F6580", symbol: "USDT", name: "USDT Coin", decimals: 12, logoURL: "/icons/usdt.svg", tags: ["stablecoin"]},
		{value: "near", chainId: 5, address: "0x2bffE1D2251Da22E31f2A769A7DfCDfB75770202", symbol: "NEAR", name: "NEAR Coin", decimals: 18, logoURL: "/icons/near.svg", tags: [""]},
		{value: "kava", chainId: 5, address: "0xB9F8D37D635cE2fEfa9dBD3348c9251c09E251C4", symbol: "KAVA", name: "KAVA Coin", decimals: 18, logoURL: "/icons/kava.svg", tags: [""]},
		{value: "matic", chainId: 5, address: "0x7d95e5Fc3DD25559D07f272689D857a4DbFf3D38", symbol: "MATIC", name: "MATIC Coin", decimals: 18, logoURL: "/icons/matic.svg", tags: [""]},
		{value: "iota", chainId: 5, address: "0x6214761B38184cFDF66ae356e91e69f0B8679488", symbol: "IOTA", name: "IOTA Coin", decimals: 18, logoURL: "/icons/iota.svg", tags: [""]},
	],
	'fantom': [
	  	{value: "btc", chainId: 4002, address: "0xE1F60643ED560a55b6aF90551c69Ec877DD105D9", symbol: "BTC", name: "BTC Coin", decimals: 18, logoURL: "/icons/btc.svg", tags: ["stablecoin"]},
		{value: "usdc", chainId: 4002, address: "0x817F61606B7f073854c51ec93beF408708A5b4E4", symbol: "USDC", name: "USDC Coin", decimals: 18, logoURL: "/icons/usdt.svg", tags: ["stablecoin"]},
		{value: "eth", chainId: 4002, address: "0x3346B2A939aA13e76Ce8Aa05ECCAe92E0D4F6580", symbol: "ETH", name: "ETH Coin", decimals: 18, logoURL: "/icons/eth.svg", tags: ["stablecoin"]},
		{value: "dai", chainId: 4002, address: "0x8CaA0072177ccEa341989F0Afd7cA5e6583390b6", symbol: "DAI", name: "DAI Coin", decimals: 18, logoURL: "/icons/dai.svg", tags: ["stablecoin"]},
	]
}

export const poolList = {
	'goerli': [
		{value: "other", address:"0x7A02Ac8ed36A89463fEedf1123d52cE35bE17e7f", symbols:["BTC", "DAI"], logoURLs:["/icons/btc.svg", "/icons/dai.svg"]},
		{value: "other", address:"0x6F06BfdbF3449Df95eb88FEcd7bA1B8d365c56c2", symbols:["BTC", "USDT"], logoURLs:["/icons/btc.svg", "/icons/usdt.svg"]},
		{value: "other", address:"0x969c9da9F09bbaDb9Fd8A9Fdeb37dC2Dd146d170", symbols:["DAI", "USDT"], logoURLs:["/icons/dai.svg", "/icons/usdt.svg"]}
	],
	'fantom': [
		{value: "btc-eth", address:"0x4D72553001fE88371aEc189455E1Ed18849b8bA2", symbols:["ETH", "BTC"], logoURLs:["/icons/eth.svg", "/icons/btc.svg"]},
		{value: "usdc-btc", address:"0x97edF4e1Aad15Ab44E4194b6E271E49d3E2e36c8", symbols:["BTC", "USDC"], logoURLs:["/icons/btc.svg", "/icons/usdc.svg"]},
		{value: "eth-dai", address:"0x758E5f4caeD36BF1d0Bb23C31387cfF11498D16D", symbols:["ETH", "DAI"], logoURLs:["/icons/eth.svg", "/icons/dai.svg"]},
		{value: "usdc-dai", address:"0xC604a85346523d4e66aBF9c215CFfb13dd154286", symbols:["USDC", "DAI"], logoURLs:["/icons/usdc.svg", "/icons/dai.svg"]}
	]
}
