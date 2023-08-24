const nftABI = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "pool_id",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "epoch_id",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "boost_id",
				"type": "uint256"
			}
		],
		"name": "addBoostToEpoch",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "symbol",
				"type": "string"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "approved",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "ApprovalForAll",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "token_id",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "boost_to_epoch_id",
				"type": "uint256"
			}
		],
		"name": "claimEpoch",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "group_name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "start_token_id",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "last_token_id",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "mint_price",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "payment_token",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "image_url",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "backing_value",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "backing_token",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "backing_unlock_timestamp",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "multiplier",
				"type": "uint256"
			}
		],
		"name": "createGroup",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "reward_token",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "reward_per_block",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "total_reward",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "reward_start_block",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "reward_end_block",
				"type": "uint256"
			}
		],
		"name": "createStakingEpoch",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "staking_token",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "group_multiplier",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "time_multiplier",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "time_boost_length",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "max_time_boost",
				"type": "uint256"
			}
		],
		"name": "createStakingPool",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "token_address",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "boost_per_token",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "boost_type",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "max_boost",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "boost_deposit_start_block",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "boost_deposit_end_block",
				"type": "uint256"
			}
		],
		"name": "createStakingTBoost",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "groupName",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "mintNFT",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "token_id",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "boost_id",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "nft_id",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "mintTBoost",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "data",
				"type": "bytes"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "setApprovalForAll",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "pool_id",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "token_id",
				"type": "uint256"
			}
		],
		"name": "stake",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "token_id",
				"type": "uint256"
			}
		],
		"name": "transferNFT",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "token_id",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "boost_id",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "nft_id",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "unMintTBoost",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "pool_id",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "token_id",
				"type": "uint256"
			}
		],
		"name": "unstake",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "token_id",
				"type": "uint256"
			}
		],
		"name": "withdrawBackingToken",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "_backingBalances",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "_gnftExists",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"name": "_groups",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "startTokenId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "lastTokenId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "mintPrice",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "paymentToken",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "imageUrl",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "backingValue",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "backingToken",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "backingUnlockTimestamp",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "multiplier",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "_tokenIdToName",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "boostToEpochs",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "boostToEpochId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "poolId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "epochId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "boostId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalBoostStake",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "accTokenPerShare",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "token_id",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "boost_to_epoch_id",
				"type": "uint256"
			}
		],
		"name": "calcBoost",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "getApproved",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "token_id",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "boost_to_epoch_id",
				"type": "uint256"
			}
		],
		"name": "getPoolInfo",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "boostToEpochId",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "lastRewardBlock",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "boost1",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "amount",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "rewardDebt",
						"type": "uint256"
					}
				],
				"internalType": "struct GamutNFT.StakingInfo",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "token_id",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "boost_id",
				"type": "uint256"
			}
		],
		"name": "getTBoostInfo",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "boostId",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "amount",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "boost2",
						"type": "uint256"
					}
				],
				"internalType": "struct GamutNFT.TBoostInfo",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "gtbInfo",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "gtpInfo",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "holdingTokenAmounts",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			}
		],
		"name": "isApprovedForAll",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "ownerOf",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "token_id",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "boost_to_epoch_id",
				"type": "uint256"
			}
		],
		"name": "pendingReward",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "stakingEpochs",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "epochId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "rewardToken",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "decimal",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "precisionFactor",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "rewardPerBlock",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalReward",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "rewardStartBlock",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "rewardEndBlock",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "stakingPools",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "poolId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "stakingToken",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "groupMultiplier",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "timeMultiplier",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "timeBoostLength",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "maxTimeBoost",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalStake",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "stakingTBoosts",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "boostId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "tStakingToken",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "boostPerToken",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "boostType",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "maxBoost",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "tBoostDepositStartBlock",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "tBoostDepositEndBlock",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes4",
				"name": "interfaceId",
				"type": "bytes4"
			}
		],
		"name": "supportsInterface",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "tokenURI",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

export default nftABI;
