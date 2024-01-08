import React, { useState } from "react";

// import { ConnectWallet } from "./ConnectWallet";
import { toast } from "react-toastify";

import StakingOptionModal from "./StakingOptionModal";
import { useNetwork } from "wagmi";
import { isSupportedChain } from "../utils/utils";
import { global } from "../config/global";

// export const StakeBtn = function ({ setRefresh, refresh, connected = false, stakeModalOption = 0, amount = 0, allowance = 0, ethBalance = 0 }) {
export const StakeBtn = function (props) {
  const [open, setOpen] = useState(false);
  const { chain } = useNetwork()

  const handleBtn = async () => {
    if (props.connected === true) {
      if (!isSupportedChain(chain)) {
        toast.warn(`Please connect wallet to ${global.chain.name}`);
        return
      }

      if (Number(props.amount) === 0) {
        toast.warn("Insufficient CHIBA token! Please buy more CHIBA!")
        return
      }
      setOpen(true);
      return
    }
    else {
      toast.warn("Please connect wallet!");
      return
    }
  }

  return (
    <>
      <button
        className="font-medium text-center text-white text-sm rounded font-16 py-2.5 px-5 w-full"
        onClick={handleBtn}
        disabled={(props.compoundPending === true || props.claimEthPending === true || props.claimChibaPending === true || props.unstakePending === true) ? true : false}
      >
        {props.connected === true && isSupportedChain(chain) ? "Stake Now" : props.connected === true && !isSupportedChain(chain) ? "Wrong Network" : "Connect Wallet"}
      </button>

      <StakingOptionModal
        setRefresh={props.setRefresh}
        refresh={props.refresh}
        showOpen={open}
        onClose={() => setOpen(false)}
        stakeModalOption={props.stakeModalOption}
        walletBalance={props.amount}
        allowance={props.allowance}
        ethBalance={props.ethBalance}
      />
    </>
  );
};

export default StakeBtn;
