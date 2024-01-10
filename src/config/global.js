import { mainnet, goerli } from "wagmi/chains";
import chiba_ic from "../assets/img/chiba.png"

export const IS_PRODUCT_MODE = false // TODO

export const staking_contract_address = { // TODO ethereum Mainnet
    mainnet: "",
    testnet: "0xCe61652B4e49A5D6eDDFEC8b6ddC551A96F99292",
};

}

export const chibaToken_testnet = {
    name: 'My Chiba Neko',
    address: '0x4f6594FbeF7890C21B177948e06890467dE4E0b7',
    decimals: 9,
    logo: chiba_ic,
    isNative: true
}

export const global = {
    STAKING_CONTRACTS: IS_PRODUCT_MODE ? staking_contract_address.mainnet : staking_contract_address.testnet,
    STAKING_EXTENSION_CONTRACTS: IS_PRODUCT_MODE ? token_staking_contract_address.mainnet : token_staking_contract_address.testnet,
    CHIBA_TOKEN: IS_PRODUCT_MODE ? chibaToken_mainnet : chibaToken_testnet,
    chain: IS_PRODUCT_MODE ? mainnet : goerli,
    defaultGas: IS_PRODUCT_MODE ? 0.0005 : 0.0004,
    REFETCH_INTERVAL: 30000,
    REFETCH_SECOND: 1000,
    EthDecimals: 18,
    IUniswapV2Router01Address: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
    WethContractAddress: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
}