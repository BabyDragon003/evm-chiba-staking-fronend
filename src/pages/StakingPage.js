import React, { useState, useEffect, useRef } from "react";
import { useStakingContractStatus } from "../hooks/useStakingContractStatus"
import StakeBtn from "../components/StakeBtn";
import LockRemain from "../components/LockRemain";
import { ConnectWallet } from "../components/ConnectWallet";
import ethIco from "../assets/img/eth.png"
import chibaIco from "../assets/img/chiba.png"
import giftIco from "../assets/img/gift.png"
import { global } from '../config/global';
import { useAccount } from "wagmi";
import IUniswapV2Router01ContractABI from "../assets/abi/IUniswapV2Router01ContractABI.json";
import { parseUnits, formatUnits } from 'viem';
import CommandBtnList from '../components/CommandBtnList';
import MobileCommandBtnList from '../components/MobileCommandBtnList';
import { useContractRead } from 'wagmi';

export default function StakingPage() {
    const { address } = useAccount();
    const [refresh, setRefresh] = useState(false)

    const [showButtonList_14, setShowButtonList_14] = useState(false);
    const [showButtonList_28, setShowButtonList_28] = useState(false);
    const [showButtonList_56, setShowButtonList_56] = useState(false);

    const [stakedPercent_14, setStakedPercent_14] = useState(0);
    const [stakedPercent_28, setStakedPercent_28] = useState(0);
    const [stakedPercent_56, setStakedPercent_56] = useState(0);

    const [compoundPending, setCompoundPending] = useState(false);
    const [claimEthPending, setClaimEthPending] = useState(false);
    const [claimChibaPending, setClaimChibaPending] = useState(false);
    const [unstakePending, setUnstakePending] = useState(false);

    const [walletConnected, setWalletConnected] = useState(false)

    const {
        walletBalance,             // Amount of connected account's CHIBA tokens 
        // For 14 days pool
        totalEthRewarded_14,       // totalRewards
        totalStakedAmount_14,      // totalSharesDeposited of contract, total staked chiba amount
        stakedAmountPerUser_14,    // staked amount per user
        stakedTimePerUser_14,      // staked time per user
        unClaimed_14,
        tokenRewarded_14,          // Earned $CHIBA token amount
        // For 28 days pool
        totalEthRewarded_28,       // totalRewards
        totalStakedAmount_28,      // totalSharesDeposited of contract, total staked chiba amount
        stakedAmountPerUser_28,    // staked amount per user
        stakedTimePerUser_28,      // staked time per user
        unClaimed_28,
        tokenRewarded_28,          // Earned $CHIBA token amount
        // For 56 days pool
        totalEthRewarded_56,       // totalRewards
        totalStakedAmount_56,      // totalSharesDeposited of contract, total staked chiba amount
        stakedAmountPerUser_56,    // staked amount per user
        stakedTimePerUser_56,      // staked time per user
        unClaimed_56,
        tokenRewarded_56,          // Earned $CHIBA token amount
        allowance,
        ethBalance
    } = useStakingContractStatus(refresh)

    const wrapperRef = useRef(null);
    const EthDecimals = global.EthDecimals;
    const IUniswapV2Router01Address = global.IUniswapV2Router01Address;
    const addresses = [global.WethContractAddress, global.CHIBA_TOKEN.address];

    const totalEthRewarded = Number(parseFloat(totalEthRewarded_14) + parseFloat(totalEthRewarded_28) + parseFloat(totalEthRewarded_56)).toFixed(5);

    useEffect(() => {
        document.addEventListener("click", handleClickOutside, true);
        return () => {
            document.removeEventListener("click", handleClickOutside, true);
        };
    }, []);

    useEffect(() => {
        if (stakedAmountPerUser_14 !== 0 && totalStakedAmount_14 !== 0)
            setStakedPercent_14(parseFloat((Number(stakedAmountPerUser_14) * 100) / Number(totalStakedAmount_14)).toFixed(6));
        else if (stakedAmountPerUser_14 === 0)
            setStakedPercent_14(0);
        if (stakedAmountPerUser_28 !== 0 && totalStakedAmount_28 !== 0)
            setStakedPercent_28(parseFloat((Number(stakedAmountPerUser_28) * 100) / Number(totalStakedAmount_28)).toFixed(6));
        else if (stakedAmountPerUser_28 === 0)
            setStakedPercent_28(0);
        if (stakedAmountPerUser_56 && totalStakedAmount_56 !== 0)
            setStakedPercent_56(parseFloat((Number(stakedAmountPerUser_56) * 100) / Number(totalStakedAmount_56)).toFixed(6));
        else if (stakedAmountPerUser_56 === 0)
            setStakedPercent_56(0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stakedAmountPerUser_14, stakedAmountPerUser_28, stakedAmountPerUser_56])

    // Amount of CHIBA token to swap with earned WETH as reward
    const _data1 = useContractRead({
        address: IUniswapV2Router01Address,
        abi: IUniswapV2Router01ContractABI,
        functionName: 'getAmountsOut',
        args: [parseUnits(unClaimed_14.toString(), EthDecimals), addresses],
        chainId: global.chain.id,
    })
    const _minTokensToReceive1 = _data1.status === "success" ? parseFloat(formatUnits(_data1.data[1], global.CHIBA_TOKEN.decimals)) : 0

    const _data2 = useContractRead({
        address: IUniswapV2Router01Address,
        abi: IUniswapV2Router01ContractABI,
        functionName: 'getAmountsOut',
        args: [parseUnits(unClaimed_28.toString(), EthDecimals), addresses],
        chainId: global.chain.id,
    })
    const _minTokensToReceive2 = _data2.status === "success" ? parseFloat(formatUnits(_data2.data[1], global.CHIBA_TOKEN.decimals)) : 0

    const _data3 = useContractRead({
        address: IUniswapV2Router01Address,
        abi: IUniswapV2Router01ContractABI,
        functionName: 'getAmountsOut',
        args: [parseUnits(unClaimed_56.toString(), EthDecimals), addresses],
        chainId: global.chain.id,
    })
    const _minTokensToReceive3 = _data3.status === "success" ? parseFloat(formatUnits(_data3.data[1], global.CHIBA_TOKEN.decimals)) : 0

    const handleClickOutside = (event) => {
        try {
            if (wrapperRef && wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowButtonList_14(false);
                setShowButtonList_28(false);
                setShowButtonList_56(false);
            }
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <div>
            <div className="flex md:flex-row flex-col items-start w-full min-h-screen relative font">
                <div className="flex flex-col h-full w-full md:max-w-266 max-w-none bg-violet md:py-8 py-4 px-4 items-center md:fixed relative">
                    <div className="flex items-center justify-start w-full border-b border-gray-1 border-opacity-30 pb-5">
                        <div className="flex flex-row items-center">
                            <img
                                id="logo-image"
                                src={chibaIco}
                                alt=""
                                className="lg:h-20 lg:w-22 md:h-20 md:w-22 sm:h-18 sm:w-20 h-18 w-20"
                            />
                        </div>
                        <div className='flex flex-col items-center text-white font-18'>
                            <h1 className="flex flex-row text-white font-18">ChiBa Neko</h1>
                            <h1 className="block md:hidden flex flex-row items-center text-white -ml-9 font-18">Staking</h1>
                        </div>
                    </div>
                    {address !== undefined && (
                        <div className="block lg:hidden md:hidden sm:hidden flex flex-row justify-start w-full items-center gap-1 lg:flex mt-6">
                            <img src={chibaIco} alt="" className="h-18 w-20" />
                            <div className="flex flex-col">
                                <h1 className="text-sm text-white text-opacity-75">$CHIBA Balance </h1>
                                <h2 className="text-base font-bold">{walletBalance} $CHIBA</h2>
                            </div>
                        </div>
                    )}
                    <div className="md:hidden flex justify-start font-medium text-center text-white text-sm rounded connect-button font-16 h-full mt-6 w-full">
                        <ConnectWallet
                            setWalletConnected={(val) => {
                                if (val === undefined)
                                    setWalletConnected(false)
                                else
                                    setWalletConnected(val)
                            }}
                            compoundPending={compoundPending}
                            claimEthPending={claimEthPending}
                            claimChibaPending={claimChibaPending}
                            unstakePending={unstakePending}
                        />
                    </div>
                    <div className="bg-reward rounded-xl w-full flex flex-col items-start py-4 px-2.5 gap-2.5 mt-5">
                        <div className="flex items-center gap-3">
                            <img src={ethIco} alt="" className="h-8 w-auto" />
                            <h1 className="text-lg font-bold">ETH Rewards</h1>
                        </div>
                        <p className="text-sm text-white text-opacity-75">Earn ETH by staking!</p>
                        <div className="gap-3 w-full flex items-center">
                            <div className="flex flex-col">
                                <h1 className="lg:text-lg text-base font-bold">{totalEthRewarded} ETH</h1>
                                <h2 className="lg:text-base text-sm font-medium text-white text-opacity-75">Total ETH Rewarded</h2>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col w-full min-h-screen bg-violet md:ml-[220px] ml-0" >
                    <div className="flex flex-col w-full min-h-screen lg:p-8 p-4 gap-6 sm:gap-10 md:gap-14 bg-cover" style={{ backgroundImage: "url('image/background.png')" }}>
                        <div className="md:flex hidden items-center justify-between h-full">
                            <h1 className="text-xxl font-bold">Staking</h1>
                            <div className='flex gap-4'>
                                {address !== undefined && (
                                    <div className="flex items-center gap-1 lg:flex">
                                        <img src={chibaIco} alt="" className="h-14 w-16" />
                                        <div className="flex flex-col">
                                            <h1 className="text-sm text-white text-opacity-75">$CHIBA Balance </h1>
                                            <h2 className="text-base font-bold">{walletBalance} $CHIBA</h2>
                                        </div>
                                    </div>
                                )}
                                <div className="font-medium text-center text-white text-sm rounded connect-button font-16 h-full">
                                    <ConnectWallet
                                        setWalletConnected={(val) => {
                                            if (val === undefined)
                                                setWalletConnected(false)
                                            else
                                                setWalletConnected(val)
                                        }}
                                        compoundPending={compoundPending}
                                        claimEthPending={claimEthPending}
                                        claimChibaPending={claimChibaPending}
                                        unstakePending={unstakePending}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col w-full items-start gap-5">
                            <div className="flex items-center justify-between w-full">
                                <div className="flex flex-col">
                                    <h1 className="lg:text-xxl text-lg font-bold leading-normal">Pool Size</h1>
                                    <p className="lg:text-lg text-sm font-medium">Leverage the power of compounding by staking your $CHIBA tokens and compounding rewards as they accrue.</p>
                                </div>
                            </div>
                            <div className="grid md:grid-cols-3 grid-cols-1 md:gap-10 gap-5 w-full">
                                <div className="w-full border border-gray-1 border-opacity-30 rounded-xl lg:px-6 px-3 py-5 relative bg-violet-6 flex flex-col gap-3">
                                    <div className="flex items-center justify-between">
                                        <h1 className="text-base font-bold">14 Days</h1>
                                        <h2 className="text-sm font-medium text-white text-opacity-75">1.50% ETH Rewards Share </h2>
                                    </div>
                                    <h1 className="text-violet-2">
                                        <span className="text-2xl font-bold">15%</span>
                                        <span className="ml-2 text-base font-bold">APR</span>
                                    </h1>
                                    <div className="flex flex-col gap-1.5">
                                        <div className="w-full rounded-full bg-violet-3 h-2.5">
                                            <div className={`rounded-full h-full flowing-progress`} style={{
                                                width: `${stakedPercent_14}%`
                                            }}></div>
                                        </div>
                                        <div className="flex items-center justify-between text-sm font-medium">
                                            <h1>{stakedAmountPerUser_14} $CHIBA/{stakedPercent_14}% </h1>
                                        </div>
                                    </div>
                                    <div className="font-lg text-center text-white text-sm rounded connect-button w-full">
                                        <StakeBtn
                                            setRefresh={setRefresh}
                                            refresh={refresh}
                                            connected={walletConnected}
                                            stakeModalOption={15}
                                            amount={walletBalance}
                                            allowance={allowance}
                                            ethBalance={ethBalance}
                                            compoundPending={compoundPending}
                                            claimEthPending={claimEthPending}
                                            claimChibaPending={claimChibaPending}
                                            unstakePending={unstakePending}
                                        />
                                    </div>
                                </div>
                                <div className="w-full border border-gray-1 border-opacity-30 rounded-xl lg:px-6 px-3 py-5 relative bg-violet-6 flex flex-col gap-3">
                                    <div className="flex items-center justify-between">
                                        <h1 className="text-base font-bold">28 Days</h1>
                                        <h2 className="text-sm font-medium text-white text-opacity-75">12.5% ETH Rewards Share </h2>
                                    </div>
                                    <h1 className="text-violet-2">
                                        <span className="text-2xl font-bold">40%</span>
                                        <span className="ml-2 text-base font-bold">APR</span>
                                    </h1>
                                    <div className="flex flex-col gap-1.5">
                                        <div className="w-full rounded-full bg-violet-3 h-2.5">
                                            <div className={`rounded-full h-full flowing-progress`} style={{
                                                width: `${stakedPercent_28}%`
                                            }}></div>
                                        </div>
                                        <div className="flex items-center justify-between text-sm font-medium">
                                            <h1>{stakedAmountPerUser_28} $CHIBA/{stakedPercent_28}% </h1>
                                        </div>
                                    </div>
                                    <div className="font-lg text-center text-white text-sm rounded connect-button w-full">
                                        <StakeBtn
                                            connected={walletConnected}
                                            stakeModalOption={40}
                                            amount={walletBalance}
                                            allowance={allowance}
                                            ethBalance={ethBalance}
                                            compoundPending={compoundPending}
                                            claimEthPending={claimEthPending}
                                            claimChibaPending={claimChibaPending}
                                            unstakePending={unstakePending}
                                        />
                                    </div>
                                </div>
                                <div className="w-full border border-gray-1 border-opacity-30 rounded-xl lg:px-6 px-3 py-5 relative bg-violet-6 flex flex-col gap-3">
                                    <div className="flex items-center justify-between">
                                        <h1 className="text-base font-bold">56 Days</h1>
                                        <h2 className="text-sm font-medium text-white text-opacity-75">86% ETH Rewards Share </h2>
                                    </div>
                                    <h1 className="text-violet-2">
                                        <span className="text-2xl font-bold">60%</span>
                                        <span className="ml-2 text-base font-bold">APR</span>
                                    </h1>
                                    <div className="flex flex-col gap-1.5">
                                        <div className="w-full rounded-full bg-violet-3 h-2.5">
                                            <div className={`rounded-full h-full flowing-progress`} style={{
                                                width: `${stakedPercent_56}%`
                                            }}></div>
                                        </div>
                                        <div className="flex items-center justify-between text-sm font-medium">
                                            <h1>{stakedAmountPerUser_56} $CHIBA/{stakedPercent_56}% </h1>
                                        </div>
                                    </div>
                                    <div className="font-lg text-center text-white text-sm rounded connect-button w-full">
                                        <StakeBtn
                                            connected={walletConnected}
                                            stakeModalOption={60}
                                            amount={walletBalance}
                                            allowance={allowance}
                                            ethBalance={ethBalance}
                                            compoundPending={compoundPending}
                                            claimEthPending={claimEthPending}
                                            claimChibaPending={claimChibaPending}
                                            unstakePending={unstakePending}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col w-full items-start gap-5">
                            <div className="flex items-center justify-between w-full">
                                <div className="flex flex-col">
                                    <h1 className="lg:text-xxl text-lg font-bold leading-normal">My Stakes &amp; Rewards</h1>
                                    <p className="lg:text-lg text-sm font-medium"></p>
                                </div>
                            </div>
                            <div className="w-full border border-gray-1 border-opacity-30 rounded-xl lg:px-6 px-3 py-5 relative bg-violet-6 bg-opacity-75 flex flex-col gap-5">
                                {(stakedAmountPerUser_14 === 0 && stakedAmountPerUser_28 === 0 && stakedAmountPerUser_56 === 0) && (
                                    <div className="flex flex-col items-center justify-center w-full h-full py-6 md:py-10 gap-3">
                                        <img src="/image/chiba.png" alt="" className="h-8 md:h-16 w-auto" />
                                        <h1 className="text-center text-xl font-medium">Connect your wallet</h1>
                                        <div className="font-medium text-center text-white text-sm rounded connect-button">
                                            <StakeBtn
                                                connected={walletConnected}
                                                stakeModalOption={0}
                                                amount={walletBalance}
                                                allowance={allowance}
                                                ethBalance={ethBalance}
                                                compoundPending={compoundPending}
                                                claimEthPending={claimEthPending}
                                                claimChibaPending={claimChibaPending}
                                                unstakePending={unstakePending}
                                            />
                                        </div>
                                    </div>
                                )}
                                {stakedAmountPerUser_14 !== 0 && (
                                    <div className="flex lg:flex-row flex-col lg:items-center lg:justify-between item-start lg:gap-0 gap-5 lg:p-5 p-3 rounded md:border-0 border border-gray-1 border-opacity-30 relative bg-violet-4">
                                        <div className="gap-3 w-full flex items-center">
                                            <div className="flex flex-col">
                                                <h1 className="lg:text-lg text-base font-bold">15% APR</h1>
                                                <h2 className="lg:text-base text-sm font-medium text-white text-opacity-75">14 Day Lockup</h2>
                                            </div>
                                        </div>
                                        <div className="gap-3 w-full flex flex-row lg:flex-col items-center lg:items-start">
                                            <img src={chibaIco} alt="" className="lg:h-14 lg:w-16 md:h-14 md:w-16 h-10 w-10" />
                                            <div className="flex flex-col">
                                                <h1 className="lg:text-lg text-base font-bold">{stakedAmountPerUser_14.toFixed(2)} $CHIBA</h1>
                                                <h2 className="lg:text-base text-sm font-medium text-white text-opacity-75">Staked</h2>
                                            </div>
                                        </div>
                                        <div className="gap-3 w-full flex flex-row lg:flex-col items-center lg:items-start">
                                            <img src={giftIco} alt="" className="lg:h-8 lg:w-8 w-6 h-6" />
                                            <div className="flex flex-col">
                                                <h1 className="lg:text-lg text-base font-bold">{unClaimed_14} ETH</h1>
                                                <h2 className="lg:text-base text-sm font-medium text-white text-opacity-75">Unclaimed ETH</h2>
                                            </div>
                                        </div>
                                        <div className="gap-3 w-full flex flex-row lg:flex-col items-center lg:items-start">
                                            <img src={chibaIco} alt="" className="lg:h-14 lg:w-16 md:h-14 md:w-16 h-10 w-10" />
                                            <div className="flex flex-col">
                                                <h1 className="lg:text-lg text-base font-bold">{tokenRewarded_14} $CHIBA</h1>
                                                <h2 className="lg:text-base text-sm font-medium text-white text-opacity-75">Earned $CHIBA</h2>
                                            </div>
                                        </div>
                                        <div className="gap-3 w-full flex items-center">
                                            <LockRemain stakedTimePerUser={stakedTimePerUser_14} type={14} />
                                        </div>
                                        <div className="lg:block hidden relative">
                                            <button
                                                className="outline-none"
                                                onClick={() => {
                                                    setShowButtonList_28(false);
                                                    setShowButtonList_56(false);
                                                    setShowButtonList_14(!showButtonList_14);
                                                }}
                                                disabled={(compoundPending === true || claimEthPending === true || claimChibaPending === true || unstakePending === true) ? true : false}
                                            >
                                                <svg width="16" height="29" viewBox="0 0 16 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M5.74539 25.4064C5.74539 24.6634 6.04231 23.9509 6.57082 23.4256C7.09933 22.9002 7.81615 22.6051 8.56357 22.6051C9.311 22.6051 10.0278 22.9002 10.5563 23.4256C11.0848 23.9509 11.3818 24.6634 11.3818 25.4064C11.3818 26.1493 11.0848 26.8618 10.5563 27.3872C10.0278 27.9125 9.311 28.2076 8.56357 28.2076C7.81615 28.2076 7.09933 27.9125 6.57082 27.3872C6.04231 26.8618 5.74539 26.1493 5.74539 25.4064ZM5.74539 14.2012C5.74539 13.4583 6.04231 12.7458 6.57082 12.2204C7.09933 11.6951 7.81615 11.4 8.56357 11.4C9.311 11.4 10.0278 11.6951 10.5563 12.2204C11.0848 12.7458 11.3818 13.4583 11.3818 14.2012C11.3818 14.9442 11.0848 15.6567 10.5563 16.182C10.0278 16.7074 9.311 17.0025 8.56357 17.0025C7.81615 17.0025 7.09933 16.7074 6.57082 16.182C6.04231 15.6567 5.74539 14.9442 5.74539 14.2012ZM5.74539 2.99611C5.74539 2.25316 6.04231 1.54064 6.57082 1.0153C7.09933 0.489958 7.81615 0.194824 8.56357 0.194824C9.311 0.194824 10.0278 0.489958 10.5563 1.0153C11.0848 1.54064 11.3818 2.25316 11.3818 2.99611C11.3818 3.73905 11.0848 4.45157 10.5563 4.97691C10.0278 5.50225 9.311 5.79739 8.56357 5.79739C7.81615 5.79739 7.09933 5.50225 6.57082 4.97691C6.04231 4.45157 5.74539 3.73905 5.74539 2.99611Z" fill="white"></path>
                                                </svg>
                                            </button>
                                            {showButtonList_14 === true && (
                                                <CommandBtnList
                                                    setRefresh={setRefresh}
                                                    refresh={refresh}
                                                    wrapperRef={wrapperRef}
                                                    poolOption={14}
                                                    stakedAmountPerUser_14={stakedAmountPerUser_14}
                                                    stakedAmountPerUser_28={stakedAmountPerUser_28}
                                                    stakedAmountPerUser_56={stakedAmountPerUser_56}
                                                    _minTokensToReceive1={_minTokensToReceive1}
                                                    _minTokensToReceive2={_minTokensToReceive2}
                                                    _minTokensToReceive3={_minTokensToReceive3}
                                                    setShowButtonList_14={setShowButtonList_14}
                                                    setShowButtonList_28={setShowButtonList_28}
                                                    setShowButtonList_56={setShowButtonList_56}
                                                    tokenRewarded_14={tokenRewarded_14}
                                                    tokenRewarded_28={tokenRewarded_28}
                                                    tokenRewarded_56={tokenRewarded_56}
                                                    compoundPending={compoundPending}
                                                    setCompoundPending={setCompoundPending}
                                                    claimEthPending={claimEthPending}
                                                    setClaimEthPending={setClaimEthPending}
                                                    claimChibaPending={claimChibaPending}
                                                    setClaimChibaPending={setClaimChibaPending}
                                                    unstakePending={unstakePending}
                                                    setUnstakePending={setUnstakePending}
                                                />
                                            )}
                                        </div>
                                        <div className='md:hidden relative'>
                                            <MobileCommandBtnList
                                                wrapperRef={wrapperRef}
                                                setRefresh={setRefresh}
                                                refresh={refresh}
                                                poolOption={14}
                                                stakedAmountPerUser_14={stakedAmountPerUser_14}
                                                stakedAmountPerUser_28={stakedAmountPerUser_28}
                                                stakedAmountPerUser_56={stakedAmountPerUser_56}
                                                _minTokensToReceive1={_minTokensToReceive1}
                                                _minTokensToReceive2={_minTokensToReceive2}
                                                _minTokensToReceive3={_minTokensToReceive3}
                                                tokenRewarded_14={tokenRewarded_14}
                                                tokenRewarded_28={tokenRewarded_28}
                                                tokenRewarded_56={tokenRewarded_56}
                                                compoundPending={compoundPending}
                                                setCompoundPending={setCompoundPending}
                                                claimEthPending={claimEthPending}
                                                setClaimEthPending={setClaimEthPending}
                                                claimChibaPending={claimChibaPending}
                                                setClaimChibaPending={setClaimChibaPending}
                                                unstakePending={unstakePending}
                                                setUnstakePending={setUnstakePending}
                                            />
                                        </div>
                                    </div>
                                )}
                                {stakedAmountPerUser_28 !== 0 && (
                                    // <div className="w-full border border-gray-1 border-opacity-30 rounded-xl lg:px-6 px-3 py-5 relative bg-violet-6 bg-opacity-75 flex flex-col gap-5">
                                    <div className="flex lg:flex-row flex-col lg:items-center lg:justify-between item-start lg:gap-0 gap-5 lg:p-5 p-3 rounded md:border-0 border border-gray-1 border-opacity-30 relative bg-violet-4">
                                        <div className="gap-3 w-full flex items-center">
                                            <div className="flex flex-col">
                                                <h1 className="lg:text-lg text-base font-bold">40% APR</h1>
                                                <h2 className="lg:text-base text-sm font-medium text-white text-opacity-75">28 Day Lockup</h2>
                                            </div>
                                        </div>
                                        <div className="gap-3 w-full flex flex-row lg:flex-col items-center lg:items-start">
                                            <img src={chibaIco} alt="" className="lg:h-14 lg:w-16 md:h-14 md:w-16 h-10 w-10" />
                                            <div className="flex flex-col">
                                                <h1 className="lg:text-lg text-base font-bold">{stakedAmountPerUser_28.toFixed(2)} $CHIBA</h1>
                                                <h2 className="lg:text-base text-sm font-medium text-white text-opacity-75">Staked</h2>
                                            </div>
                                        </div>
                                        <div className="gap-3 w-full flex flex-row lg:flex-col items-center lg:items-start">
                                            <img src={giftIco} alt="" className="lg:h-8 lg:w-8 w-6 h-6" />
                                            <div className="flex flex-col">
                                                <h1 className="lg:text-lg text-base font-bold">{unClaimed_28} ETH</h1>
                                                <h2 className="lg:text-base text-sm font-medium text-white text-opacity-75">Unclaimed ETH</h2>
                                            </div>
                                        </div>
                                        <div className="gap-3 w-full flex flex-row lg:flex-col items-center lg:items-start">
                                            <img src={chibaIco} alt="" className="lg:h-14 lg:w-16 md:h-14 md:w-16 h-10 w-10" />
                                            <div className="flex flex-col">
                                                <h1 className="lg:text-lg text-base font-bold">{tokenRewarded_28} $CHIBA</h1>
                                                <h2 className="lg:text-base text-sm font-medium text-white text-opacity-75">Earned $CHIBA</h2>
                                            </div>
                                        </div>
                                        <div className="gap-3 w-full flex items-center">
                                            <LockRemain stakedTimePerUser={stakedTimePerUser_28} type={28} />
                                        </div>
                                        <div className="lg:block hidden relative">
                                            <button
                                                className="outline-none"
                                                onClick={() => {
                                                    setShowButtonList_14(false);
                                                    setShowButtonList_56(false);
                                                    setShowButtonList_28(!showButtonList_28);
                                                }}
                                                disabled={(compoundPending === true || claimEthPending === true || claimChibaPending === true || unstakePending === true) ? true : false}
                                            >
                                                <svg width="16" height="29" viewBox="0 0 16 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M5.74539 25.4064C5.74539 24.6634 6.04231 23.9509 6.57082 23.4256C7.09933 22.9002 7.81615 22.6051 8.56357 22.6051C9.311 22.6051 10.0278 22.9002 10.5563 23.4256C11.0848 23.9509 11.3818 24.6634 11.3818 25.4064C11.3818 26.1493 11.0848 26.8618 10.5563 27.3872C10.0278 27.9125 9.311 28.2076 8.56357 28.2076C7.81615 28.2076 7.09933 27.9125 6.57082 27.3872C6.04231 26.8618 5.74539 26.1493 5.74539 25.4064ZM5.74539 14.2012C5.74539 13.4583 6.04231 12.7458 6.57082 12.2204C7.09933 11.6951 7.81615 11.4 8.56357 11.4C9.311 11.4 10.0278 11.6951 10.5563 12.2204C11.0848 12.7458 11.3818 13.4583 11.3818 14.2012C11.3818 14.9442 11.0848 15.6567 10.5563 16.182C10.0278 16.7074 9.311 17.0025 8.56357 17.0025C7.81615 17.0025 7.09933 16.7074 6.57082 16.182C6.04231 15.6567 5.74539 14.9442 5.74539 14.2012ZM5.74539 2.99611C5.74539 2.25316 6.04231 1.54064 6.57082 1.0153C7.09933 0.489958 7.81615 0.194824 8.56357 0.194824C9.311 0.194824 10.0278 0.489958 10.5563 1.0153C11.0848 1.54064 11.3818 2.25316 11.3818 2.99611C11.3818 3.73905 11.0848 4.45157 10.5563 4.97691C10.0278 5.50225 9.311 5.79739 8.56357 5.79739C7.81615 5.79739 7.09933 5.50225 6.57082 4.97691C6.04231 4.45157 5.74539 3.73905 5.74539 2.99611Z" fill="white"></path>
                                                </svg>
                                            </button>
                                            {showButtonList_28 === true && (
                                                <CommandBtnList
                                                    setRefresh={setRefresh}
                                                    refresh={refresh}
                                                    wrapperRef={wrapperRef}
                                                    poolOption={28}
                                                    stakedAmountPerUser_14={stakedAmountPerUser_14}
                                                    stakedAmountPerUser_28={stakedAmountPerUser_28}
                                                    stakedAmountPerUser_56={stakedAmountPerUser_56}
                                                    _minTokensToReceive1={_minTokensToReceive1}
                                                    _minTokensToReceive2={_minTokensToReceive2}
                                                    _minTokensToReceive3={_minTokensToReceive3}
                                                    setShowButtonList_14={setShowButtonList_14}
                                                    setShowButtonList_28={setShowButtonList_28}
                                                    setShowButtonList_56={setShowButtonList_56}
                                                    tokenRewarded_14={tokenRewarded_14}
                                                    tokenRewarded_28={tokenRewarded_28}
                                                    tokenRewarded_56={tokenRewarded_56}
                                                    compoundPending={compoundPending}
                                                    setCompoundPending={setCompoundPending}
                                                    claimEthPending={claimEthPending}
                                                    setClaimEthPending={setClaimEthPending}
                                                    claimChibaPending={claimChibaPending}
                                                    setClaimChibaPending={setClaimChibaPending}
                                                    unstakePending={unstakePending}
                                                    setUnstakePending={setUnstakePending}
                                                />
                                            )}
                                        </div>
                                        <div className='md:hidden relative'>
                                            <MobileCommandBtnList
                                                wrapperRef={wrapperRef}
                                                setRefresh={setRefresh}
                                                refresh={refresh}
                                                poolOption={28}
                                                stakedAmountPerUser_14={stakedAmountPerUser_14}
                                                stakedAmountPerUser_28={stakedAmountPerUser_28}
                                                stakedAmountPerUser_56={stakedAmountPerUser_56}
                                                _minTokensToReceive1={_minTokensToReceive1}
                                                _minTokensToReceive2={_minTokensToReceive2}
                                                _minTokensToReceive3={_minTokensToReceive3}
                                                tokenRewarded_14={tokenRewarded_14}
                                                tokenRewarded_28={tokenRewarded_28}
                                                tokenRewarded_56={tokenRewarded_56}
                                                compoundPending={compoundPending}
                                                setCompoundPending={setCompoundPending}
                                                claimEthPending={claimEthPending}
                                                setClaimEthPending={setClaimEthPending}
                                                claimChibaPending={claimChibaPending}
                                                setClaimChibaPending={setClaimChibaPending}
                                                unstakePending={unstakePending}
                                                setUnstakePending={setUnstakePending}
                                            />
                                        </div>
                                    </div>
                                )}
                                {stakedAmountPerUser_56 !== 0 && (
                                    <div className="flex lg:flex-row flex-col lg:items-center lg:justify-between item-start lg:gap-0 gap-5 lg:p-5 p-3 rounded md:border-0 border border-gray-1 border-opacity-30 relative bg-violet-4">
                                        <div className="gap-3 w-full flex items-center">
                                            <div className="flex flex-col">
                                                <h1 className="lg:text-lg text-base font-bold">60% APR</h1>
                                                <h2 className="lg:text-base text-sm font-medium text-white text-opacity-75">56 Day Lockup</h2>
                                            </div>
                                        </div>
                                        <div className="gap-3 w-full flex flex-row lg:flex-col items-center lg:items-start">
                                            <img src={chibaIco} alt="" className="lg:h-14 lg:w-16 md:h-14 md:w-16 h-10 w-10" />
                                            <div className="flex flex-col">
                                                <h1 className="lg:text-lg text-base font-bold">{stakedAmountPerUser_56.toFixed(2)} $CHIBA</h1>
                                                <h2 className="lg:text-base text-sm font-medium text-white text-opacity-75">Staked</h2>
                                            </div>
                                        </div>
                                        <div className="gap-3 w-full flex flex-row lg:flex-col items-center lg:items-start">
                                            <img src={giftIco} alt="" className="lg:h-8 lg:w-8 w-6 h-6" />
                                            <div className="flex flex-col">
                                                <h1 className="lg:text-lg text-base font-bold">{unClaimed_56} ETH</h1>
                                                <h2 className="lg:text-base text-sm font-medium text-white text-opacity-75">Unclaimed ETH</h2>
                                            </div>
                                        </div>
                                        <div className="gap-3 w-full flex flex-row lg:flex-col items-center lg:items-start">
                                            <img src={chibaIco} alt="" className="lg:h-14 lg:w-16 md:h-14 md:w-16 h-10 w-10" />
                                            <div className="flex flex-col">
                                                <h1 className="lg:text-lg text-base font-bold">{tokenRewarded_56} $CHIBA</h1>
                                                <h2 className="lg:text-base text-sm font-medium text-white text-opacity-75">Earned $CHIBA</h2>
                                            </div>
                                        </div>
                                        <div className="gap-3 w-full flex items-center">
                                            <LockRemain stakedTimePerUser={stakedTimePerUser_56} type={56} />
                                        </div>
                                        <div className="lg:block hidden relative">
                                            <button
                                                className="outline-none"
                                                onClick={() => {
                                                    setShowButtonList_14(false);
                                                    setShowButtonList_28(false);
                                                    setShowButtonList_56(!showButtonList_56);
                                                }}
                                                disabled={(compoundPending === true || claimEthPending === true || claimChibaPending === true || unstakePending === true) ? true : false}
                                            >
                                                <svg width="16" height="29" viewBox="0 0 16 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M5.74539 25.4064C5.74539 24.6634 6.04231 23.9509 6.57082 23.4256C7.09933 22.9002 7.81615 22.6051 8.56357 22.6051C9.311 22.6051 10.0278 22.9002 10.5563 23.4256C11.0848 23.9509 11.3818 24.6634 11.3818 25.4064C11.3818 26.1493 11.0848 26.8618 10.5563 27.3872C10.0278 27.9125 9.311 28.2076 8.56357 28.2076C7.81615 28.2076 7.09933 27.9125 6.57082 27.3872C6.04231 26.8618 5.74539 26.1493 5.74539 25.4064ZM5.74539 14.2012C5.74539 13.4583 6.04231 12.7458 6.57082 12.2204C7.09933 11.6951 7.81615 11.4 8.56357 11.4C9.311 11.4 10.0278 11.6951 10.5563 12.2204C11.0848 12.7458 11.3818 13.4583 11.3818 14.2012C11.3818 14.9442 11.0848 15.6567 10.5563 16.182C10.0278 16.7074 9.311 17.0025 8.56357 17.0025C7.81615 17.0025 7.09933 16.7074 6.57082 16.182C6.04231 15.6567 5.74539 14.9442 5.74539 14.2012ZM5.74539 2.99611C5.74539 2.25316 6.04231 1.54064 6.57082 1.0153C7.09933 0.489958 7.81615 0.194824 8.56357 0.194824C9.311 0.194824 10.0278 0.489958 10.5563 1.0153C11.0848 1.54064 11.3818 2.25316 11.3818 2.99611C11.3818 3.73905 11.0848 4.45157 10.5563 4.97691C10.0278 5.50225 9.311 5.79739 8.56357 5.79739C7.81615 5.79739 7.09933 5.50225 6.57082 4.97691C6.04231 4.45157 5.74539 3.73905 5.74539 2.99611Z" fill="white"></path>
                                                </svg>
                                            </button>
                                            {showButtonList_56 === true && (
                                                <CommandBtnList
                                                    setRefresh={setRefresh}
                                                    refresh={refresh}
                                                    wrapperRef={wrapperRef}
                                                    poolOption={56}
                                                    stakedAmountPerUser_14={stakedAmountPerUser_14}
                                                    stakedAmountPerUser_28={stakedAmountPerUser_28}
                                                    stakedAmountPerUser_56={stakedAmountPerUser_56}
                                                    _minTokensToReceive1={_minTokensToReceive1}
                                                    _minTokensToReceive2={_minTokensToReceive2}
                                                    _minTokensToReceive3={_minTokensToReceive3}
                                                    setShowButtonList_14={setShowButtonList_14}
                                                    setShowButtonList_28={setShowButtonList_28}
                                                    setShowButtonList_56={setShowButtonList_56}
                                                    tokenRewarded_14={tokenRewarded_14}
                                                    tokenRewarded_28={tokenRewarded_28}
                                                    tokenRewarded_56={tokenRewarded_56}
                                                    compoundPending={compoundPending}
                                                    setCompoundPending={setCompoundPending}
                                                    claimEthPending={claimEthPending}
                                                    setClaimEthPending={setClaimEthPending}
                                                    claimChibaPending={claimChibaPending}
                                                    setClaimChibaPending={setClaimChibaPending}
                                                    unstakePending={unstakePending}
                                                    setUnstakePending={setUnstakePending}
                                                />
                                            )}
                                        </div>
                                        <div className='md:hidden relative'>
                                            <MobileCommandBtnList
                                                wrapperRef={wrapperRef}
                                                setRefresh={setRefresh}
                                                refresh={refresh}
                                                poolOption={56}
                                                stakedAmountPerUser_14={stakedAmountPerUser_14}
                                                stakedAmountPerUser_28={stakedAmountPerUser_28}
                                                stakedAmountPerUser_56={stakedAmountPerUser_56}
                                                _minTokensToReceive1={_minTokensToReceive1}
                                                _minTokensToReceive2={_minTokensToReceive2}
                                                _minTokensToReceive3={_minTokensToReceive3}
                                                tokenRewarded_14={tokenRewarded_14}
                                                tokenRewarded_28={tokenRewarded_28}
                                                tokenRewarded_56={tokenRewarded_56}
                                                compoundPending={compoundPending}
                                                setCompoundPending={setCompoundPending}
                                                claimEthPending={claimEthPending}
                                                setClaimEthPending={setClaimEthPending}
                                                claimChibaPending={claimChibaPending}
                                                setClaimChibaPending={setClaimChibaPending}
                                                unstakePending={unstakePending}
                                                setUnstakePending={setUnstakePending}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// export default Home;
