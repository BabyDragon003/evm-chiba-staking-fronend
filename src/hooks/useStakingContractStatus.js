import { useEffect, useState } from "react";
import StakingContractABI from "../assets/abi/stakingContract.json";
import tokenStakingContractABI from "../assets/abi/tokenStakingContract.json";
import chibaTokenContractABI from "../assets/abi/chibaTokenContract.json";
import { useAccount } from "wagmi";
import { multicall, fetchBalance } from '@wagmi/core';
import { global } from "../config/global";
import { formatUnits } from "viem";

export function useStakingContractStatus(refresh) {
    const [data, setData] = useState({
        walletBalance: 0,             // Amount of connected account's CHIBA tokens 
        totalEthRewarded_14: 0,       // Sum of totalRewards
        totalStakedAmount_14: 0,      // totalSharesDeposited of contract
        stakedAmountPerUser_14: 0,    // staked amount per user
        allowance: 0
    })
    const { address } = useAccount();

    const [refetch, setRefetch] = useState(false)

    useEffect(() => {
        const timerID = setInterval(() => {
            setRefetch((prevData) => {
                return !prevData;
            })
        }, global.REFETCH_INTERVAL);

        return () => {
            clearInterval(timerID);
        };
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const chibaTokenContractAddress = global.CHIBA_TOKEN.address;
                const stakingContractAddress = global.STAKING_CONTRACTS;
                const tokenStakingContractAddress = global.STAKING_EXTENSION_CONTRACTS;

                const contracts = [
                    // get the balance of user wallet's ChiBa token
                    {
                        address: chibaTokenContractAddress,
                        abi: chibaTokenContractABI,
                        functionName: 'balanceOf',
                        args: [address]
                    },
                    // For 14 days pool
                    {
                        address: stakingContractAddress,
                        abi: StakingContractABI,
                        functionName: 'pools',
                        args: [0]
                    },
                    {
                        address: stakingContractAddress,
                        abi: StakingContractABI,
                        functionName: 'shares',
                        args: [address, 0]
                    },
                    {
                        address: stakingContractAddress,
                        abi: StakingContractABI,
                        functionName: 'getUnpaid',
                        args: [0, address]
                    },
                    {
                        address: tokenStakingContractAddress,
                        abi: tokenStakingContractABI,
                        functionName: 'rewardOf',
                        args: [0, address]
                    },
                    // For 28 days pool
                    {
                        address: stakingContractAddress,
                        abi: StakingContractABI,
                        functionName: 'pools',
                        args: [1]
                    },
                    {
                        address: stakingContractAddress,
                        abi: StakingContractABI,
                        functionName: 'shares',
                        args: [address, 1]
                    },
                    {
                        address: stakingContractAddress,
                        abi: StakingContractABI,
                        functionName: 'getUnpaid',
                        args: [1, address]
                    },
                    {
                        address: tokenStakingContractAddress,
                        abi: tokenStakingContractABI,
                        functionName: 'rewardOf',
                        args: [1, address]
                    },
                    // For 56 days pool
                    {
                        address: stakingContractAddress,
                        abi: StakingContractABI,
                        functionName: 'pools',
                        args: [2]
                    },
                    {
                        address: stakingContractAddress,
                        abi: StakingContractABI,
                        functionName: 'shares',
                        args: [address, 2]
                    },
                    {
                        address: stakingContractAddress,
                        abi: StakingContractABI,
                        functionName: 'getUnpaid',
                        args: [2, address]
                    },
                    {
                        address: tokenStakingContractAddress,
                        abi: tokenStakingContractABI,
                        functionName: 'rewardOf',
                        args: [2, address]
                    },
                    {
                        address: chibaTokenContractAddress,
                        abi: chibaTokenContractABI,
                        functionName: 'allowance',
                        args: [address, stakingContractAddress]
                    },
                ]

                const _data = await multicall({
                    chainId: global.chain.id,
                    contracts
                })

                const ethBalance = address ? parseFloat((await fetchBalance({ address })).formatted) : 0

                console.log(_data, "data is:");
                setData({
                    walletBalance: _data[0].status === "success" ? parseFloat(formatUnits(_data[0].result, global.CHIBA_TOKEN.decimals)).toFixed(2) : 0,
                    // For 14 days pool
                    totalEthRewarded_14: _data[1].status === "success" ? parseFloat(formatUnits(_data[1].result[6], global.EthDecimals)).toFixed(5) : 0,
                    totalStakedAmount_14: _data[1].status === "success" ? parseFloat(formatUnits(_data[1].result[3], global.CHIBA_TOKEN.decimals)).toFixed(2) : 0,
                    stakedAmountPerUser_14: _data[2].status === "success" ? parseFloat(formatUnits(_data[2].result[0], global.CHIBA_TOKEN.decimals)) : 0,
                    stakedTimePerUser_14: _data[2].status === "success" ? Number(_data[2].result[1]) : 0,
                    unClaimed_14: _data[3].status === "success" ? parseFloat(formatUnits(_data[3].result, global.EthDecimals)).toFixed(10) : 0,
                    tokenRewarded_14: _data[4].status === "success" ? parseFloat(formatUnits(_data[4].result, global.CHIBA_TOKEN.decimals)).toFixed(5) : 0,
                    // For 28 days pool
                    totalEthRewarded_28: _data[5].status === "success" ? parseFloat(formatUnits(_data[5].result[6], global.EthDecimals)).toFixed(5) : 0,
                    totalStakedAmount_28: _data[5].status === "success" ? parseFloat(formatUnits(_data[5].result[3], global.CHIBA_TOKEN.decimals)).toFixed(2) : 0,
                    stakedAmountPerUser_28: _data[6].status === "success" ? parseFloat(formatUnits(_data[6].result[0], global.CHIBA_TOKEN.decimals)) : 0,
                    stakedTimePerUser_28: _data[6].status === "success" ? Number(_data[6].result[1]) : 0,
                    unClaimed_28: _data[7].status === "success" ? parseFloat(formatUnits(_data[7].result, global.EthDecimals)).toFixed(10) : 0,
                    tokenRewarded_28: _data[8].status === "success" ? parseFloat(formatUnits(_data[8].result, global.CHIBA_TOKEN.decimals)).toFixed(5) : 0,
                    // For 56 days pool
                    totalEthRewarded_56: _data[9].status === "success" ? parseFloat(formatUnits(_data[9].result[6], global.EthDecimals)).toFixed(5) : 0,
                    totalStakedAmount_56: _data[9].status === "success" ? parseFloat(formatUnits(_data[9].result[3], global.CHIBA_TOKEN.decimals)).toFixed(2) : 0,
                    stakedAmountPerUser_56: _data[10].status === "success" ? parseFloat(formatUnits(_data[10].result[0], global.CHIBA_TOKEN.decimals)) : 0,
                    stakedTimePerUser_56: _data[10].status === "success" ? Number(_data[10].result[1]) : 0,
                    unClaimed_56: _data[11].status === "success" ? parseFloat(formatUnits(_data[11].result, global.EthDecimals)).toFixed(10) : 0,
                    tokenRewarded_56: _data[12].status === "success" ? parseFloat(formatUnits(_data[12].result, global.CHIBA_TOKEN.decimals)).toFixed(5) : 0,
                    allowance: _data[13].status ==="success" ? parseFloat(formatUnits(_data[13].result, global.CHIBA_TOKEN.decimals)).toFixed(2) : 0,
                    ethBalance: ethBalance
                })
            } catch (error) {
                console.log('useStakingContractStatus err', error)
            }
        };
        fetchData();
    }, [address, refetch, refresh])

    return data
}
