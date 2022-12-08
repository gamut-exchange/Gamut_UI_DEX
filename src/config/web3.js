import Web3 from "web3";
import { ethers } from "ethers";
import erc20ABI from "../assets/abi/erc20";
import hedgeFactoryABI from "../assets/abi/hedgeFactory";
import poolABI from "../assets/abi/pool";
import routerABI from "../assets/abi/router";
import faucetABI from "../assets/abi/faucet";

// web3 integration part
export const getTokenBalance = async (provider, tokenAddr, account) => {
    const abi = erc20ABI[0];
    let web3 = new Web3(provider);
    let contract = new web3.eth.Contract(abi, tokenAddr);
    let bal = await contract.methods["balanceOf"](account).call();
    let decimal = await contract.methods["decimals"]().call();
    let result = Number(bal / 10 ** decimal).toFixed(2);
    if (Number(result) > 999)
        result = result.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return result;
};

export const getPoolAddress = async (
    provider,
    token1Addr,
    token2Addr,
    contractAddr
) => {
    const abi = hedgeFactoryABI[0];
    let web3 = new Web3(provider);
    let contract = new web3.eth.Contract(abi, contractAddr);
    let result = await contract.methods["getPool"](token1Addr, token2Addr).call();
    debugger;
    return result;
};

export const getPoolData = async (provider, poolAddress) => {
    const abi = poolABI[0];
    const tokenAbi = erc20ABI[0];
    let web3 = new Web3(provider);
    let contract = new web3.eth.Contract(abi);
    contract.options.address = poolAddress;
    let result1 = await contract.methods["getPoolTokensAndBalances"]().call();
    let result2 = await contract.methods["getWeights"]().call();
    let tokenContract1 = new web3.eth.Contract(tokenAbi, result1["tokens"][0]);
    let tokenContract2 = new web3.eth.Contract(tokenAbi, result1["tokens"][1]);
    let decimal1 = await tokenContract1.methods["decimals"]().call();
    let decimal2 = await tokenContract2.methods["decimals"]().call();
    let result = {
        balances: result1["balances"],
        tokens: result1["tokens"],
        weights: result2,
        decimals: [decimal1, decimal2]
    };
    return result;
};

export const tokenApproval = async (account, provider, tokenAddr, contractAddr) => {
    const tokenAbi = erc20ABI[0];
    let web3 = new Web3(provider);
    let tokenContract = new web3.eth.Contract(tokenAbi, tokenAddr);
    // const owner = await contract.methods['owner']().call();
    let remain = await tokenContract.methods["allowance"](
        account,
        contractAddr
    ).call();
    let decimal = await tokenContract.methods["decimals"]().call();
    remain = remain / 10 ** decimal;
    return remain;
};

export const approveToken = async (
    account,
    provider,
    tokenAddr,
    value,
    contractAddr
) => {
    const tokenAbi = erc20ABI[0];
    let web3 = new Web3(provider);
    let token_contract = new web3.eth.Contract(tokenAbi, tokenAddr);
    const weiVal = await toWeiVal(provider, tokenAddr, value);
    try {
        await token_contract.methods["increaseAllowance"](
            contractAddr,
            weiVal
        ).send({ from: account });
    } catch (e) {
        console.log(e.message);
    }
    const result = await tokenApproval(account, provider, tokenAddr, contractAddr);
    return result;
};

export const swapTokens = async (
    provider,
    inTokenAddr,
    outTokenAddr,
    amount,
    account,
    limit,
    deadTime,
    contractAddr
) => {
    const abi = routerABI[0];
    let web3 = new Web3(provider);

    const wei_amount = await toWeiVal(provider, inTokenAddr, amount);
    const wei_limit = await toWeiVal(provider, outTokenAddr, limit);
    let deadline = new Date().getTime() + 1000 * deadTime;

    let contract = new web3.eth.Contract(abi, contractAddr);
    try {
        await contract.methods["swap"](
            [inTokenAddr, outTokenAddr, wei_amount],
            [account, account],
            wei_limit,
            deadline
        ).send({ from: account });
    } catch (e) {
        console.log(e.message);
    }
};

export const batchSwapTokens = async (
    provider,
    inTokenAddr,
    outTokenAddr,
    middleTokens,
    amount,
    account,
    limit,
    deadTime,
    contractAddr
) => {
    const abi = routerABI[0];
    let web3 = new Web3(provider);
    const wei_amount = await toWeiVal(provider, inTokenAddr, amount);
    let deadline = new Date().getTime() + 1000 * deadTime;
    const traders = [account, account];

    let swaps = [];

    if (middleTokens.length === 1)
        swaps = [
            [0, 1, wei_amount],
            [1, 2, web3.utils.toWei("0")],
        ];
    else
        swaps = [
            [0, 1, wei_amount],
            [1, 2, web3.utils.toWei("0")],
            [2, 3, web3.utils.toWei("0")],
        ];

    let assets = [];

    if (middleTokens.length === 1)
        assets = [inTokenAddr, middleTokens[0]["address"], outTokenAddr];
    else
        assets = [
            inTokenAddr,
            middleTokens[0]["address"],
            middleTokens[1]["address"],
            outTokenAddr,
        ];

    let limits = [];

    if (middleTokens.length === 1)
        limits = [wei_amount, web3.utils.toWei("0"), web3.utils.toWei("0")];
    else
        limits = [
            wei_amount,
            web3.utils.toWei("0"),
            web3.utils.toWei("0"),
            web3.utils.toWei("0"),
        ];
    if (middleTokens) {
        const contract = new web3.eth.Contract(abi, contractAddr);
        try {
            await contract.methods["batchSwap"](
                swaps,
                assets,
                traders,
                limits,
                deadline
            ).send({ from: account });
        } catch (e) {
            console.log(e.message);
        }
    }
};

export const joinPool = async (
    account,
    provider,
    token1Addr,
    token2Addr,
    amount1,
    amount2,
    slippage,
    routerContractAddr,
    factoryContractAddr
) => {
    const abi = routerABI[0];
    let web3 = new Web3(provider);
    const poolAddr = await getPoolAddress(
        provider,
        token1Addr,
        token2Addr,
        factoryContractAddr
    );

    if (poolAddr) {
        const poolData = await getPoolData(provider, poolAddr);
        let tokenA = "";
        let tokenB = "";
        let amountA = 0;
        let amountB = 0;
        if (poolData["tokens"][0] === token1Addr) {
            tokenA = token1Addr;
            tokenB = token2Addr;
            amountA = amount1;
            amountB = amount2;
        } else {
            tokenA = token2Addr;
            tokenB = token1Addr;
            amountA = amount2;
            amountB = amount1;
        }

        const inAmount = await toWeiVal(provider, tokenA, amountA);
        const inMaxAmount = await toWeiVal(provider, tokenA, (amountA * (1+slippage)));
        const outAmount = await toWeiVal(provider, tokenB, amountB);
        const outMaxAmount = await toWeiVal(provider, tokenB, amountB * (1+slippage));
        const initUserData = ethers.utils.defaultAbiCoder.encode(
            ["uint256", "uint256[]", "uint256"],
            [
                1,
                //amounts In
                [inAmount, outAmount],
                //minimum amount of Lp tokens you are willing to accept
                web3.utils.toWei("0"),
            ]
        );

        // let token1_contract = new web3.eth.Contract(tokenAbi, token1Addr);
        // await token1_contract.methods['increaseAllowance'](c_address, inAmount).send({from: account});

        // let token2_contract = new web3.eth.Contract(tokenAbi, token2Addr);
        // await token2_contract.methods['increaseAllowance'](c_address, outAmount).send({from: account});
        let contract = new web3.eth.Contract(abi, routerContractAddr);
        try {
            await contract.methods["joinPool"](account, [
                [tokenA, tokenB],
                [inMaxAmount, outMaxAmount],
                initUserData,
            ]).send({ from: account });
        } catch (e) {
            console.log(e.message);
        }
    }
};

export const getPoolBalance = async (account, provider, poolAddr) => {
    const abi = poolABI[0];
    let web3 = new Web3(provider);
    let contract = new web3.eth.Contract(abi);
    contract.options.address = poolAddr;
    const result = await contract.methods["balanceOf"](account).call();
    const decimal = await contract.methods["decimals"]().call();
    return result / 10 ** decimal;
};

export const getPoolSupply = async (provider, poolAddr) => {
    const abi = poolABI[0];
    let web3 = new Web3(provider);
    let contract = new web3.eth.Contract(abi);
    contract.options.address = poolAddr;
    const result = await contract.methods["totalSupply"]().call();
    return web3.utils.fromWei(result);
};

export const getSwapFeePercent = async (provider, poolAddr) => {
    const abi = poolABI[0];
    let web3 = new Web3(provider);
    let contract = new web3.eth.Contract(abi);
    contract.options.address = poolAddr;
    const result = await contract.methods["getSwapFeePercentage"]().call();
    return web3.utils.fromWei(result) * 100;
};

export const removePool = async (
    account,
    provider,
    amount,
    ratio,
    token1Addr,
    token2Addr,
    token1Amount,
    token2Amount,
    slippage,
    contractAddr
) => {
    const abi = routerABI[0];
    let web3 = new Web3(provider);
    const totalAmount = await web3.utils.toWei(amount.toString());
    const tokenRatio = await web3.utils.toWei(ratio.toString());

    const initUserData = ethers.utils.defaultAbiCoder.encode(
        ["uint256", "uint256"],
        [totalAmount, tokenRatio]
    );

    let contract = new web3.eth.Contract(abi, contractAddr);
    try {
        await contract.methods["exitPool"](account, [
            [token1Addr, token2Addr],
            [await toWeiVal(provider, token1Addr, (token1Amount*(1-slippage)).toString()), await toWeiVal(provider, token2Addr, (token2Amount*(1-slippage)).toString())],
            initUserData,
        ]).send({ from: account });
    } catch (e) {
        console.log(e.message);
    }
};

export const createPool = async (
    account,
    provider,
    tokenAddr1,
    tokenAddr2,
    weight1,
    weight2,
    contractAddr
) => {
    const abi = hedgeFactoryABI[0];
    let web3 = new Web3(provider);
    const contract = new web3.eth.Contract(abi, contractAddr);
    const weight1_str = web3.utils.toWei(weight1.toString());
    const weight2_str = web3.utils.toWei(weight2.toString());
    const swap_fee = web3.utils.toWei("0.001");
    try {
        await contract.methods["create"](tokenAddr1, tokenAddr2, weight1_str, weight2_str, swap_fee, true).send({ from: account });
    } catch (e) {
        console.log(e.message);
    }

}

export const initAddPool = async (
    account,
    provider,
    token1Addr,
    token2Addr,
    amountA,
    amountB,
    routerContractAddr
) => {
    const abi = routerABI[0];
    let web3 = new Web3(provider);
    let token1_wei_val = await toWeiVal(provider, token1Addr, amountA);
    let token2_wei_val = await toWeiVal(provider, token2Addr, amountB);
    const initialBalances = [token2_wei_val, token1_wei_val];
    const JOIN_KIND_INIT = "0";

    const initUserData = ethers.utils.defaultAbiCoder.encode(
        ["uint256", "uint256[]"],
        [JOIN_KIND_INIT, initialBalances]
    );

    let contract = new web3.eth.Contract(abi, routerContractAddr);
    try {
        await contract.methods["joinPool"](account, [
            [token2Addr, token1Addr],
            initialBalances,
            initUserData,
        ]).send({ from: account });
        alert(`Successfully created!`, "success");
    } catch (e) {
        console.log(e.message);
    }
}

const toWeiVal = async (provider, tokenAddr, val) => {
    const abi = erc20ABI[0];
    const web3 = new Web3(provider);

    const contract = new web3.eth.Contract(abi, tokenAddr);
    let decimal = await contract.methods["decimals"]().call();
    decimal = Number(decimal);
    let value = Number(val);
    if (decimal === 21)
        return web3.utils.toWei(value.toFixed(6), 'kether');
    else if (decimal === 18)
        return web3.utils.toWei(value.toFixed(6), 'ether');
    else if (decimal === 15)
        return web3.utils.toWei(value.toFixed(6), 'milliether');
    else if (decimal === 12)
        return web3.utils.toWei(value.toFixed(6), 'microether');
    else if (decimal === 9)
        return web3.utils.toWei(value.toFixed(6), 'nano');
    else
        return web3.utils.toWei(value.toFixed(6));
}

export const fromWeiVal = (provider, val, dec) => {
    let web3 = new Web3(provider);
    let decimal = Number(dec);
    let value = val.toString();
    if (decimal === 21)
        return web3.utils.fromWei(value, 'kether');
    else if (decimal === 18)
        return web3.utils.fromWei(value, 'ether');
    else if (decimal === 15)
        return web3.utils.fromWei(value, 'milliether');
    else if (decimal === 12)
        return web3.utils.fromWei(value, 'microether');
    else if (decimal === 9)
        return web3.utils.fromWei(value, 'nano');
    else
        return web3.utils.fromWei(value);
};

// getting faucet tokens part

export const requestToken = async (account, provider, faucetAddr) => {
    const abi = faucetABI[0];
    let web3 = new Web3(provider);

    let contract = new web3.eth.Contract(abi, faucetAddr);
    await contract.methods["requestTokens"]().send({ from: account });
};

export const allowedToWithdraw = async (account, provider, faucetAddr) => {
    const abi = faucetABI[0];
    let web3 = new Web3(provider);

    let contract = new web3.eth.Contract(abi, faucetAddr);
    let allowed = contract.methods["allowedToWithdraw"](account).call();
    return allowed;
};

// find router part

export const calculateSwap = async (inToken, poolData, input) => {
    let balance_from;
    let balance_to;
    let weight_from;
    let weight_to;
    let decimal_from;
    let decimal_to;

    if (inToken.toLowerCase() === poolData.tokens[0].toLowerCase()) {
        balance_from = poolData.balances[0];
        balance_to = poolData.balances[1];
        weight_from = poolData.weights[0];
        weight_to = poolData.weights[1];
        decimal_from = poolData.decimals[0];
        decimal_to = poolData.decimals[1];
    } else {
        balance_from = poolData.balances[1];
        balance_to = poolData.balances[0];
        weight_from = poolData.weights[1];
        weight_to = poolData.weights[0];
        decimal_from = poolData.decimals[1];
        decimal_to = poolData.decimals[0];
    }

    let ammount = input * 10 ** decimal_from;

    let bIn = ammount / 10 ** decimal_from;
    let pbA = balance_to / 10 ** decimal_to;
    let pbB = balance_from / 10 ** decimal_from;
    let wA = weight_to / 10 ** 18;
    let wB = weight_from / 10 ** 18;

    let exp =
        (wB - (wB * (1 - pbB / (pbB + bIn))) / (1 + pbB / (pbB + bIn))) /
        (wA + (wB * (1 - pbB / (pbB + bIn))) / (1 + pbB / (pbB + bIn)));
    let bOut = pbA * (1 - (pbB / (pbB + bIn)) ** exp);
    return bOut;
};

export const calcOutput = async (
    middleTokens,
    provider,
    val,
    inSToken,
    outSToken,
    factoryContractAddr,
    swapFee
) => {
    try {
        if (middleTokens.length === 1) {
            const poolAddressA = await getPoolAddress(
                provider,
                inSToken["address"],
                middleTokens[0]["address"],
                factoryContractAddr
            );
            const poolDataA = await getPoolData(
                provider,
                poolAddressA
            );
            const poolAddressB = await getPoolAddress(
                provider,
                middleTokens[0]["address"],
                outSToken["address"],
                factoryContractAddr
            );
            const poolDataB = await getPoolData(
                provider,
                poolAddressB
            );
            const middleOutput = await calculateSwap(
                inSToken["address"],
                poolDataA,
                val * (1 - swapFee)
            );
            const output = await calculateSwap(
                middleTokens[0]["address"],
                poolDataB,
                middleOutput * (1 - swapFee)
            );
            return output;
        } else {
            const poolAddressA = await getPoolAddress(
                provider,
                inSToken["address"],
                middleTokens[0]["address"],
                factoryContractAddr
            );
            const poolDataA = await getPoolData(
                provider,
                poolAddressA
            );
            const poolAddressB = await getPoolAddress(
                provider,
                middleTokens[0]["address"],
                middleTokens[1]["address"],
                factoryContractAddr
            );
            const poolDataB = await getPoolData(
                provider,
                poolAddressB
            );
            const poolAddressC = await getPoolAddress(
                provider,
                middleTokens[1]["address"],
                outSToken["address"],
                factoryContractAddr
            );
            const poolDataC = await getPoolData(
                provider,
                poolAddressC
            );
            const middleOutput1 = await calculateSwap(
                inSToken["address"],
                poolDataA,
                val * (1 - swapFee)
            );
            const middleOutput2 = await calculateSwap(
                middleTokens[0]["address"],
                poolDataB,
                middleOutput1 * (1 - swapFee)
            );
            const output = await calculateSwap(
                middleTokens[1]["address"],
                poolDataC,
                middleOutput2 * (1 - swapFee)
            );
            return output;
        }
    } catch (error) {
        return -1;
    }
};

export const getMiddleToken = async (inValue, inSToken, outSToken, tokenList, provider, factoryContractAddr, swapFee) => {
    const availableLists = tokenList.filter((item) => {
        return (
            item["address"] !== inSToken["address"] &&
            item["address"] !== outSToken["address"]
        );
    });

    let suitableRouter = [];
    // const provider = await connector.getProvider();
    for (let i = 0; i < availableLists.length; i++) {
        const calculatedOutput = await calcOutput(
            [availableLists[i]],
            provider,
            inValue,
            inSToken,
            outSToken,
            factoryContractAddr,
            swapFee
        );
        if (suitableRouter.length === 0) {
            if (Number(calculatedOutput) > 0) {
                suitableRouter[0] = [availableLists[i]];
                suitableRouter[1] = calculatedOutput;
            }
        } else {
            if (Number(calculatedOutput) > Number(suitableRouter[1])) {
                suitableRouter[0] = [availableLists[i]];
                suitableRouter[1] = calculatedOutput;
            }
        }
    }

    const allPairs = getPairs(availableLists);
    for (let i = 0; i < allPairs.length; i++) {
        const calculatedOutput = await calcOutput(
            allPairs[i],
            provider,
            inValue,
            inSToken,
            outSToken,
            factoryContractAddr,
            swapFee
        );
        if (suitableRouter.length === 0) {
            if (Number(calculatedOutput) > 0) {
                suitableRouter[0] = allPairs[i];
                suitableRouter[1] = calculatedOutput;
            }
        } else {
            if (Number(calculatedOutput) > Number(suitableRouter[1])) {
                suitableRouter[0] = allPairs[i];
                suitableRouter[1] = calculatedOutput;
            }
        }
    }

    try {
        const poolAddress = await getPoolAddress(
            provider,
            inSToken["address"],
            outSToken["address"],
            factoryContractAddr
        );
        const poolData = await getPoolData(provider, poolAddress);
        const result = await calculateSwap(
            inSToken["address"],
            poolData,
            inValue
        );
        if (suitableRouter.length !== 0) {
            if (Number(result) > Number(suitableRouter[1])) {
                return null;
            } else return suitableRouter[0];
        } else return null;
    } catch (error) {
        if (suitableRouter.length !== 0) {
            return suitableRouter[0];
        } else {
            return null;
        }
    }
};

export const getPairs = (arr) => {
    return arr.flatMap((x) => {
        return arr.flatMap((y) => {
            return x["address"] !== y["address"] ? [[x, y]] : [];
        });
    });
};
