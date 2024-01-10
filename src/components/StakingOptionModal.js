/* eslint-disable react-hooks/exhaustive-deps */
import { Fragment, useRef, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import chibaIco from "../assets/img/chiba.png";
import clsx from 'clsx';
import { global } from "../config/global";
import { parseUnits } from 'viem';
import { writeContract, prepareWriteContract, waitForTransaction } from "@wagmi/core"
import { toast } from "react-toastify";
import StakingContractABI from "../assets/abi/stakingContract.json";
    const [btnMsg, setBtnMsg] = useState("Stake");
    const [errMsg, setErrMsg] = useState(false);
    const [pending, setPending] = useState(false);
    // const [btnDisabled, setBtnDisabled] = useState(false);

    const cancelButtonRef = useRef(null)

    const chibaTokenContractAddress = global.CHIBA_TOKEN.address;
    const stakingContractAddress = global.STAKING_CONTRACTS;
    const ChibaDecimals = global.CHIBA_TOKEN.decimals;

    let dataStaking = {
        chainId: global.chain.id,
    }

    useEffect(() => {
        setOpen(props.showOpen);
        // setModalOption()
    }, [props.showOpen])

    useEffect(() => {
        if (!props) {
            setBtnMsg("LOADING...")
            setErrMsg("Please wait! Loading...")
            return
        }
        if (pending) {
            setBtnMsg("Pending ")
            setErrMsg("Please wait! Pending...")
            return
        }
        if (props.ethBalance < getDefaultGas()) {
            setBtnMsg("Insufficient ETH")
            setErrMsg("Insufficient ETH for gasfee! Please buy more ETH!")
            // setBtnDisabled(true)
            return
        }
        if (!stakeAmount || Number(stakeAmount) < 0) {
            setBtnMsg("Enter amount")
            setErrMsg("Please enter valid CHIBA token amount!")
            // setBtnDisabled(true)
            return
        }
        if (Number(stakeAmount) > props.walletBalance) {
            setBtnMsg("Insufficient CHIBA")
            setErrMsg("Insufficient CHIBA token. Please buy more CHIBA!")
            // setBtnDisabled(true)
            return
        }
        if (props.allowance < Number(stakeAmount)) {
            setBtnMsg("Approve")
            setErrMsg("Insufficient allowance amount. Please increase allowance amount!");
            // setBtnDisabled(false)
            return
        }
        setBtnMsg("Stake")
        setErrMsg("Please wait! Staking...")
        // setBtnDisabled(false)
    }, [stakeAmount, pending, props.amount, props.ethBalance, props.allowance])

    const handleApprove = async () => {
        setPending(true);
        try {
            let dataApprove = {
                chainId: global.chain.id,
                address: chibaTokenContractAddress,
                abi: chibaTokenContractABI
            }
            try {
                dataApprove = {
                    ...dataApprove,
                    functionName: 'increaseAllowance',
                    args: [stakingContractAddress, staticConfig.MAX_UINT256_HALF],
                }
            } catch (error) {
                dataApprove = {
                    ...dataApprove,
                    functionName: 'approve',
                    args: [stakingContractAddress, staticConfig.MAX_UINT256],
                }
            }
            const preparedData = await prepareWriteContract(dataApprove)
            const writeData = await writeContract(preparedData)
            const txPendingData = waitForTransaction(writeData)
            toast.promise(txPendingData, {
                pending: "Waiting for pending... 👌",
            });

            const txData = await txPendingData;
            if (txData && txData.status === "success") {
                toast.success(`Successfully Approved! 👌`)
                // setApproved(true)
            } else {
                toast.error("Error! Approving is failed.");
            }
        } catch (error) {
            console.log(error);
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
        setPending(false);
        return
    }

    const handleStake = async () => {
        setPending(true);
        try {
            // if (props.allowance >= stakeAmount) {
            if (modalOption === 15) {
                dataStaking = {
                    ...dataStaking,
                    address: stakingContractAddress,
                    abi: StakingContractABI,
                    functionName: 'stake',
                    args: [0, parseUnits(stakeAmount.toString(), ChibaDecimals)]
                }
                const preparedData = await prepareWriteContract(dataStaking)
                const writeData = await writeContract(preparedData)
                const txPendingData = waitForTransaction(writeData)
                toast.promise(txPendingData, {
                    pending: "Waiting for pending... 👌",
                });

                const txData = await txPendingData;
                if (txData && txData.status === "success") {
                    toast.success(`Successfully Staked! 👌`)
                    handleClose()
                } else {
                    toast.error("Error! Staking is failed.");
                }
            } else if (modalOption === 40) {
                dataStaking = {
                    ...dataStaking,
                    address: stakingContractAddress,
                    abi: StakingContractABI,
                    functionName: 'stake',
                    args: [1, parseUnits(stakeAmount.toString(), ChibaDecimals)]
                }
                const preparedData = await prepareWriteContract(dataStaking)
                const writeData = await writeContract(preparedData)
                const txPendingData = waitForTransaction(writeData)
                toast.promise(txPendingData, {
                    pending: "Waiting for pending... 👌",
                });

                const txData = await txPendingData;
                if (txData && txData.status === "success") {
                    toast.success(`Successfully Staked! 👌`)
                    handleClose()
                } else {
                    toast.error("Error! Staking is failed.");
                }
            } else if (modalOption === 60) {
                dataStaking = {
                    ...dataStaking,
                    address: stakingContractAddress,
                    abi: StakingContractABI,
                    functionName: 'stake',
                    args: [2, parseUnits(stakeAmount.toString(), ChibaDecimals)]
                }
                const preparedData = await prepareWriteContract(dataStaking)
                const writeData = await writeContract(preparedData)
                const txPendingData = waitForTransaction(writeData)
                toast.promise(txPendingData, {
                    pending: "Waiting for pending... 👌",
                });

                const txData = await txPendingData;
                if (txData && txData.status === "success") {
                    toast.success(`Successfully Staked! 👌`)
                    handleClose()
                } else {
                    toast.error("Error! Staking is failed.");
                }
            }
        } catch (error) {
            console.log(error);
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
        setPending(false);
        return;
    }

    const handleBtn = async () => {
        if (btnMsg === "Stake") {
            await handleStake();
        } else if (btnMsg === "Approve") {
            await handleApprove();
        } else
            toast.warn(errMsg);
    }

    const handleClose = () => {
        setStakeAmount();
        setModalOption(props.stakeModalOption);
        props.onClose();
    }

    const handleChange = (val) => {
        setStakeAmount(val)
    }

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={handleClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                <div className="w-full flex h-full items-start justify-center p-4 text-center sm:items-start sm:p-0 font">
                                    <div className="relative text-left transition-all transform rounded-lg shadow-xl w-full my-auto sm:max-w-xl p-5 sm:px-5 bg-modal border border-gray-1 border-opacity-30">
                                        <div className="relative flex items-start justify-start w-full">
                                            <h1 className="font-bold text-base text-left dark:text-white">Select Staking Option</h1>
                                            <button className="absolute inset-y-0 right-0" onClick={handleClose}>
                                                <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"><g clipPath="url(#clip0_90_503)"><path d="M18.75 0.0999756H2.24998C1.81237 0.0999756 1.39268 0.273814 1.08325 0.583249C0.773814 0.892684 0.599976 1.31237 0.599976 1.74998V18.25C0.599976 18.6876 0.773814 19.1073 1.08325 19.4167C1.39268 19.7261 1.81237 19.9 2.24998 19.9H18.75C19.1876 19.9 19.6073 19.7261 19.9167 19.4167C20.2261 19.1073 20.4 18.6876 20.4 18.25V1.74998C20.4 1.31237 20.2261 0.892684 19.9167 0.583249C19.6073 0.273814 19.1876 0.0999756 18.75 0.0999756ZM16.0337 14.3663C16.1103 14.4429 16.1711 14.5339 16.2126 14.6341C16.2541 14.7342 16.2754 14.8416 16.2754 14.95C16.2754 15.0584 16.2541 15.1657 16.2126 15.2659C16.1711 15.366 16.1103 15.457 16.0337 15.5337C15.957 15.6103 15.866 15.6711 15.7659 15.7126C15.6657 15.7541 15.5584 15.7754 15.45 15.7754C15.3416 15.7754 15.2342 15.7541 15.1341 15.7126C15.0339 15.6711 14.9429 15.6103 14.8663 15.5337L10.5 11.1663L6.13366 15.5337C5.97886 15.6885 5.7689 15.7754 5.54998 15.7754C5.33105 15.7754 5.12109 15.6885 4.96629 15.5337C4.81148 15.3789 4.72452 15.1689 4.72452 14.95C4.72452 14.7311 4.81148 14.5211 4.96629 14.3663L9.33363 9.99998L4.96629 5.63366C4.81148 5.47886 4.72452 5.2689 4.72452 5.04998C4.72452 4.83105 4.81148 4.62109 4.96629 4.46629C5.12109 4.31148 5.33105 4.22452 5.54998 4.22452C5.7689 4.22452 5.97886 4.31148 6.13366 4.46629L10.5 8.83363L14.8663 4.46629C15.0211 4.31148 15.2311 4.22452 15.45 4.22452C15.6689 4.22452 15.8789 4.31148 16.0337 4.46629C16.1885 4.62109 16.2754 4.83105 16.2754 5.04998C16.2754 5.2689 16.1885 5.47886 16.0337 5.63366L11.6663 9.99998L16.0337 14.3663Z" fill="#6D28D9"></path></g><defs><clipPath id="clip0_90_503"><rect width="20" height="20" fill="white" transform="translate(0.5)"></rect></clipPath></defs></svg>
                                            </button>
                                        </div>
                                        <div className="flex flex-col pb-3">
                                            <div className="mt-4">
                                                <div className="flex flex-col gap-5">
                                                    <div className="flex lg:flex-row flex-col lg:items-center item-start gap-5 w-full">
                                                        <button onClick={() => { setModalOption(15) }} className={clsx("md:p-5 p-2.5 flex flex-col items-center justify-center w-full rounded-2xl gap-1.5 border border-gray-1 border-opacity-30", modalOption === 15 ? "bg-violet-1 text-white" : "bg-violet-4 text-violet-2")}>
                                                            <h1 className="text-base font-bold">14 Day Lockup</h1>
                                                            <h2><span className="text-xl font-bold">15%</span><span className="ml-2 text-sm font-bold">APR</span></h2>
                                                        </button>
                                                        <button onClick={() => setModalOption(40)} className={clsx("md:p-5 p-2.5 flex flex-col items-center justify-center w-full rounded-2xl gap-1.5 border border-gray-1 border-opacity-30", modalOption === 40 ? "bg-violet-1 text-white" : "bg-violet-4 text-violet-2")}>
                                                            <h1 className="text-base font-bold">28 Day Lockup</h1>
                                                            <h2><span className="text-xl font-bold">40%</span><span className="ml-2 text-sm font-bold">APR</span></h2>
                                                        </button>
                                                        <button onClick={() => setModalOption(60)} className={clsx("md:p-5 p-2.5 flex flex-col items-center justify-center w-full rounded-2xl gap-1.5 border border-gray-1 border-opacity-30", modalOption === 60 ? "bg-violet-1 text-white" : "bg-violet-4 text-violet-2")}>
                                                            <h1 className="text-base font-bold">56 Day Lockup</h1>
                                                            <h2><span className="text-xl font-bold">60%</span><span className="ml-2 text-sm font-bold">APR</span></h2>
                                                        </button>
                                                    </div>
                                                    <div className="flex flex-col gap-3">
                                                        <div className="relative">
                                                            {/* <input type="number" value={stakeAmount} onChange={(e) => setStakeAmount(e.target.value)} placeholder="Enter Amount" className="bg-violet-7 w-full rounded text-white text-base py-4 pl-5 pr-28 outline-none [&amp;::-webkit-inner-spin-button]:appearance-none" /> */}
                                                            <input
                                                                type="number"
                                                                value={stakeAmount}
                                                                onChange={(e) => handleChange(e.target.value)}
                                                                placeholder="Enter Amount"
                                                                className="bg-violet-7 w-full rounded text-white text-base py-4 pl-5 pr-28 outline-none [&amp;::-webkit-inner-spin-button]:appearance-none"
                                                                disabled={pending}
                                                            />
                                                            <button onClick={() => setStakeAmount(props.walletBalance)} className="font-medium text-center text-white px-4 py-2 text-sm rounded bg-violet-1 hover:bg-opacity-80 absolute right-5 top-3">Max</button>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <img src={chibaIco} alt="" className="lg:h-12 lg:w-14 md:h-12 md:w-14 w-10 h-10" />
                                                            <h1 className="text-white text-opacity-75 text-sm font-medium">$CHIBA Balance: </h1>
                                                            <h1 className="text-white text-sm font-medium">{props.walletBalance} $CHIBA</h1>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm font-medium text-white text-opacity-75"> You are staking {stakeAmount} $CHIBA tokens. </p>
                                                    <button onClick={handleBtn}
                                                        className={clsx("font-medium text-center text-white text-sm rounded font-16 py-2.5 px-5 w-full connect-button")}
                                                        // className={clsx("font-medium text-center text-white text-sm rounded font-16 py-2.5 px-5 w-full", btnDisabled ? "connect-button-disable" : "connect-button")}
                                                        // disabled={btnDisabled ? true : false}
                                                    >
                                                        <div>
                                                            {btnMsg}
                                                            {pending ? <FontAwesomeIcon icon={faSpinner} size="sm" className="animate-spin" /> : <></>}
                                                        </div>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}

export default StakingOptionModal;