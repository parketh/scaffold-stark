import { HardhatUserConfig } from "hardhat/config"
import "@nomicfoundation/hardhat-toolbox"
import "@shardlabs/starknet-hardhat-plugin"

const config: HardhatUserConfig = {
    solidity: "0.8.9",
    starknet: {
        venv: "cairo_venv",
        network: "devnet",
        wallets: {
            OpenZeppelin: {
                accountName: "OpenZeppelin",
                modulePath: "starkware.starknet.wallets.open_zeppelin.OpenZeppelinAccount",
                accountPath: "~/.starknet_accounts",
            },
        },
    },
    networks: {
        devnet: {
            url: "http://127.0.0.1:5050",
            args: ["--gas-price", "2000000000"],
        },
    },
}

export default config
