import { global } from "../config/global";
import StakingContractABI from "../assets/abi/stakingContract.json";
import tokenStakingContractABI from "../assets/abi/tokenStakingContract.json";
import { parseUnits } from "viem";
import { writeContract, prepareWriteContract, waitForTransaction } from "@wagmi/core"
import { toast } from "react-toastify"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const MobileCommandBtnList = (props) => {
    const stakingContractAddress = global.STAKING_CONTRACTS;
    const tokenStakingContractAddress = global.STAKING_EXTENSION_CONTRACTS;

    let data = {
        chainId: global.chain.id,
    }
    const handleCompoundAndRelock = async (compound, poolOption) => {
        try {
            if (compound) {
                props.setCompoundPending(true)
                if (poolOption === 14) {
                    if (props.stakedAmountPerUser_14 > 0 && props._minTokensToReceive1 > 0) {
                        data = {
                            ...data,
                            address: stakingContractAddress,
                            abi: StakingContractABI,
                            functionName: 'claimReward',
                            args: [0, true, parseUnits((props._minTokensToReceive1 * 0.95).toString(), global.CHIBA_TOKEN.decimals)]
                        }
                    } else if (props._minTokensToReceive1 <= 0) {
                        toast.warn("Warning! There are not ETH Rewards!");
                        props.setCompoundPending(false)
                        return
                    }
                }
                if (poolOption === 28) {
                    if (props.stakedAmountPerUser_28 > 0 && props._minTokensToReceive2 > 0) {
                        data = {
                            ...data,
                            address: stakingContractAddress,
                            abi: StakingContractABI,
                            functionName: 'claimReward',
                            args: [1, true, parseUnits((props._minTokensToReceive2 * 0.95).toString(), global.CHIBA_TOKEN.decimals)]
                        }
                    } else if (props._minTokensToReceive2 <= 0) {
                        toast.warn("Warning! There are not ETH Rewards!");
                        props.setCompoundPending(false)
                        return
                    }
                }
                if (poolOption === 56) {
                    if (props.stakedAmountPerUser_56 > 0 && props._minTokensToReceive3 > 0) {
                        data = {
                            ...data,
                            address: stakingContractAddress,
                            abi: StakingContractABI,
                            functionName: 'claimReward',
                            args: [2, true, parseUnits((props._minTokensToReceive3 * 0.95).toString(), global.CHIBA_TOKEN.decimals)]
                        }
                    } else if (props._minTokensToReceive3 <= 0) {
                        toast.warn("Warning! There are not ETH Rewards!");
                        props.setCompoundPending(false)
                        return
                    }
                }
                const preparedData = await prepareWriteContract(data)
                const writeData = await writeContract(preparedData)
                const txPendingData = waitForTransaction(writeData)
                toast.promise(txPendingData, {
                    pending: "Waiting for pending... 👌",
                });

                const txData = await txPendingData;
                if (txData && txData.status === "success") {
                    toast.success(`Successfully Compound & Claimed! 👌`)
                } else {
                    toast.error("Error! Compound & Claiming is failed.");
                }
            } else {
                props.setClaimEthPending(true)
                if (poolOption === 14 && props._minTokensToReceive1 > 0) {
                    if (props.stakedAmountPerUser_14 > 0) {
                        data = {
                            ...data,
                            address: stakingContractAddress,
                            abi: StakingContractABI,
                            functionName: 'claimReward',
                            args: [0, false, 0]
                        }
                    }
                } else if (poolOption === 14 && props._minTokensToReceive1 <= 0) {
                    toast.warn("Warning! There are not ETH Rewards!");
                    props.setClaimEthPending(false)
                    return
                }
                if (poolOption === 28 && props._minTokensToReceive2 > 0) {
                    if (props.stakedAmountPerUser_28 > 0) {
                        data = {
                            ...data,
                            address: stakingContractAddress,
                            abi: StakingContractABI,
                            functionName: 'claimReward',
                            args: [1, false, 0]
                        }
                    }
                } else if (poolOption === 28 && props._minTokensToReceive2 <= 0) {
                    toast.warn("Warning! There are not ETH Rewards!");
                    props.setClaimEthPending(false)
                    return
                }
                if (poolOption === 56 && props._minTokensToReceive3 > 0) {
                    if (props.stakedAmountPerUser_56 > 0) {
                        data = {
                            ...data,
                            address: stakingContractAddress,
                            abi: StakingContractABI,
                            functionName: 'claimReward',
                            args: [2, false, 0]
                        }
                    }
                } else if (poolOption === 56 && props._minTokensToReceive3 <= 0) {
                    toast.warn("Warning! There are not ETH Rewards!");
                    props.setClaimEthPending(false)
                    return
                }
                const preparedData = await prepareWriteContract(data)
                const writeData = await writeContract(preparedData)
                const txPendingData = waitForTransaction(writeData)
                toast.promise(txPendingData, {
                    pending: "Waiting for pending... 👌",
                });

                const txData = await txPendingData;
                if (txData && txData.status === "success") {
                    toast.success(`Successfully Claimed! 👌`)
                } else {
                    toast.error("Error! Claiming is failed.");
                }
            }
        } catch (error) {
            try {
                if (error?.shortMessage) {
                    toast.error(error?.shortMessage);
                } else {
                    toast.error("Unknown Error! Something went wrong.");
                }
            } catch (error) {
                toast.error("Error! Something went wrong.");
            }
        }
        try {
            if (props.setRefresh !== undefined && props.refresh !== undefined) {
                props.setRefresh(!props.refresh)
            }
        } catch (error) { }
        props.setCompoundPending(false)
        props.setClaimEthPending(false)
        return
    }

    const handleClaimChibaRewards = async (poolOption) => {
        props.setClaimChibaPending(true)
        try {
            // if (props.tokenRewards_14 > 0 || props.tokenRewards_28 > 0 || props.tokenRewards_56 > 0) {
            if (poolOption === 14 && props.tokenRewarded_14 > 0) {
                if (props.stakedAmountPerUser_14 > 0) {
                    data = {
                        ...data,
                        address: tokenStakingContractAddress,
                        abi: tokenStakingContractABI,
                        functionName: 'claimRewards',
                        args: [0]
                    }
                }
            } else if (poolOption === 14 && props.tokenRewarded_14 <= 0) {
                toast.warn("Warning! There are not $CHIBA Rewards!")
                props.setClaimChibaPending(false)
                return
            }
            if (poolOption === 28 && props.tokenRewarded_28 > 0) {
                if (props.stakedAmountPerUser_28 > 0) {
                    data = {
                        ...data,
                        address: tokenStakingContractAddress,
                        abi: tokenStakingContractABI,
                        functionName: 'claimRewards',
                        args: [1]
                    }
                }
            } else if (poolOption === 28 && props.tokenRewarded_28 <= 0) {
                toast.warn("Warning! There are not $CHIBA Rewards!")
                props.setClaimChibaPending(false)
                return
            }
            if (poolOption === 56 && props.tokenRewarded_56 > 0) {
                if (props.stakedAmountPerUser_56 > 0) {
                    data = {
                        ...data,
                        address: tokenStakingContractAddress,
                        abi: tokenStakingContractABI,
                        functionName: 'claimRewards',
                        args: [2]
                    }
                }
            } else if (poolOption === 56 && props.tokenRewarded_56 <= 0) {
                toast.warn("Warning! There are not $CHIBA Rewards!")
                props.setClaimChibaPending(false)
                return
            }
            const preparedData = await prepareWriteContract(data)
            const writeData = await writeContract(preparedData)
            const txPendingData = waitForTransaction(writeData)
            toast.promise(txPendingData, {
                pending: "Waiting for pending... 👌",
            });

            const txData = await txPendingData;
            if (txData && txData.status === "success") {
                toast.success(`Successfully Chiba Token Claimed! 👌`)
            } else {
                toast.error("Error! Claiming is failed.");
            }
        } catch (error) {
            try {
                if (error?.shortMessage) {
                    toast.error(error?.shortMessage);
                } else {
                    toast.error("Unknown Error! Something went wrong.");
                }
            } catch (error) {
                toast.error("Error! Something went wrong.");
            }
        }
        try {
            if (props.setRefresh !== undefined && props.refresh !== undefined) {
                props.setRefresh(!props.refresh)
            }
        } catch (error) { }
        props.setClaimChibaPending(false);
        return
    }

    const handleUnstake = async (poolOption) => {
        props.setUnstakePending(true)
        try {
            if (props.stakedAmountPerUser_14 > 0 && poolOption === 14) {
                data = {
                    ...data,
                    address: stakingContractAddress,
                    abi: StakingContractABI,
                    functionName: 'unstake',
                    args: [0, parseUnits(props.stakedAmountPerUser_14.toString(), global.CHIBA_TOKEN.decimals)]
                }
            } else if (props.stakedAmountPerUser_14 <= 0) {
                toast.warn("Warning! There are not $CHIBA to unstake!")
                props.setUnstakePending(false)
                return
            }
            if (props.stakedAmountPerUser_28 > 0 && poolOption === 28) {
                data = {
                    ...data,
                    address: stakingContractAddress,
                    abi: StakingContractABI,
                    functionName: 'unstake',
                    args: [1, parseUnits(props.stakedAmountPerUser_28.toString(), global.CHIBA_TOKEN.decimals)]
                }
            } else if (props.stakedAmountPerUser_28 <= 0) {
                toast.warn("Warning! There are not $CHIBA to unstake!")
                props.setUnstakePending(false)
                return
            }
            if (props.stakedAmountPerUser_56 > 0 && poolOption === 56) {
                data = {
                    ...data,
                    address: stakingContractAddress,
                    abi: StakingContractABI,
                    functionName: 'unstake',
                    args: [2, parseUnits(props.stakedAmountPerUser_56.toString(), global.CHIBA_TOKEN.decimals)]
                }
            } else if (props.stakedAmountPerUser_56 <= 0) {
                toast.warn("Warning! There are not $CHIBA to unstake!")
                props.setUnstakePending(false)
                return
            }
            const preparedData = await prepareWriteContract(data)
            const writeData = await writeContract(preparedData)
            const txPendingData = waitForTransaction(writeData)
            toast.promise(txPendingData, {
                pending: "Waiting for pending... 👌",
            });

            const txData = await txPendingData;
            if (txData && txData.status === "success") {
                toast.success(`Successfully Unstaked! 👌`)
            } else {
                toast.error("Error! Unstaking is failed.");
            }
        } catch (error) {
            try {
                if (error?.shortMessage) {
                    toast.error(error?.shortMessage);
                } else {
                    toast.error("Unknown Error! Something went wrong.");
                }
            } catch (error) {
                toast.error("Error! Something went wrong.");
            }
        }
        try {
            if (props.setRefresh !== undefined && props.refresh !== undefined) {
                props.setRefresh(!props.refresh)
            }
        } catch (error) { }
        props.setUnstakePending(false);
        return
    }

    return (
        // <div ref={props.wrapperRef} className="z-10 bg-violet-4 rounded-xl shadow w-64 absolute right-0 px-3 py-5 border border-gray-1 border-opacity-30">
            <div ref={props.wrapperRef} className="flex flex-col gap-3 items-start w-full">
                <button
                    onClick={() => { handleCompoundAndRelock(true, props.poolOption) }}
                    className="font-medium text-center text-white px-5 py-2.5 text-sm rounded bg-[#3567FD] w-full"
                    disabled={(props.compoundPending === true || props.claimEthPending === true || props.claimChibaPending === true || props.unstakePending === true) ? true : false}
                >
                    <div>
                        {props.compoundPending ? "Pending " : "Compound ETH & Relock"}
                        {props.compoundPending ? <FontAwesomeIcon icon={faSpinner} size="sm" className="animate-spin" /> : <></>}
                    </div>
                </button>
                <button
                    onClick={() => handleCompoundAndRelock(false, props.poolOption)}
                    className="font-medium text-center text-white px-5 py-2.5 text-sm rounded bg-[#3567FD] w-full"
                    disabled={(props.compoundPending === true || props.claimEthPending === true || props.claimChibaPending === true || props.unstakePending === true) ? true : false}
                >
                    <div>
                        {props.claimEthPending ? "Pending " : "Claim ETH & Relock"}
                        {props.claimEthPending ? <FontAwesomeIcon icon={faSpinner} size="sm" className="animate-spin" /> : <></>}
                    </div>
                </button>
                <button
                    onClick={() => handleClaimChibaRewards(props.poolOption)}
                    className="font-medium text-center text-white px-5 py-2.5 text-sm rounded bg-[#3567FD] w-full"
                    disabled={(props.compoundPending === true || props.claimEthPending === true || props.claimChibaPending === true || props.unstakePending === true) ? true : false}
                >
                    <div>
                        {props.claimChibaPending ? "Pending " : "Claim $CHIBA Rewards"}
                        {props.claimChibaPending ? <FontAwesomeIcon icon={faSpinner} size="sm" className="animate-spin" /> : <></>}
                    </div>
                </button>
                <button
                    onClick={() => handleUnstake(props.poolOption)}
                    className="font-medium text-center text-white px-5 py-2.5 text-sm rounded bg-[#3567FD] w-full"
                    disabled={(props.compoundPending === true || props.claimEthPending === true || props.claimChibaPending === true || props.unstakePending === true) ? true : false}
                >
                    <div>
                        {props.unstakePending ? "Pending " : "Unstake"}
                        {props.unstakePending ? <FontAwesomeIcon icon={faSpinner} size="sm" className="animate-spin" /> : <></>}
                    </div>
                </button>
            </div>
        // </div>
    )
}

export default MobileCommandBtnList;