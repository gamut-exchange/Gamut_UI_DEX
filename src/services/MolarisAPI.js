import axios from "axios";

export const getERC20 = (address) => {
  // console.log("Addresswa:", address);
  const options = {
    method: "GET",
    url: `https://deep-index.moralis.io/api/v2/${address}/erc20`,
    params: {
      chain: "goerli",
      format: "decimal",
      normalizeMetadata: "false",
    },
    headers: {
      accept: "application/json",
      "X-API-Key": process.env.REACT_APP_MORALIS_API_KEY,
    },
  };

  const data = axios
    .request(options)
    .then((response) => {
      // console.log("All DATA:", response.data);
      return response.data;
    })
    .catch((error) => {
      console.error("Get User NFT Error:", error);
    });

  return data;
};

export const getERC20Transactions = (address) => {
  // console.log("Addresswa:", address);
  const options = {
    method: "GET",
    url: `https://deep-index.moralis.io/api/v2/${address}/erc20/transfers`,
    params: {
      chain: "goerli",
      format: "decimal",
      normalizeMetadata: "false",
    },
    headers: {
      accept: "application/json",
      "X-API-Key": process.env.REACT_APP_MORALIS_API_KEY,
    },
  };

  const data = axios
    .request(options)
    .then((response) => {
      // console.log("All DATA:", response.data);
      return response.data;
    })
    .catch((error) => {
      console.error("Get User NFT Error:", error);
    });

  return data;
};
