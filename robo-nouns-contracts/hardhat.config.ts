import * as dotenv from "dotenv"
import { HardhatUserConfig, task } from "hardhat/config"
import "@nomiclabs/hardhat-etherscan"
import "@typechain/hardhat"
import "hardhat-abi-exporter"
import "hardhat-gas-reporter"
import "hardhat-contract-sizer"
import "solidity-coverage"
import "hardhat-docgen"
import "hardhat-tracer"
import "hardhat-spdx-license-identifier"
import "@tenderly/hardhat-tenderly"
import "@nomicfoundation/hardhat-chai-matchers"
import "@nomiclabs/hardhat-ethers"
import "hardhat-storage-layout"
import "hardhat-finder"
import "./tasks"

dotenv.config()

function getWallet(): Array<string> {
    return process.env.DEPLOYER_WALLET_PRIVATE_KEY !== undefined
        ? [process.env.DEPLOYER_WALLET_PRIVATE_KEY]
        : []
}

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
const config: HardhatUserConfig = {
    solidity: {
        version: "0.8.17",
        settings: {
            optimizer: {
                enabled:
                    (process.env.SOLIDITY_OPTIMIZER &&
                        "true" ===
                            process.env.SOLIDITY_OPTIMIZER.toLowerCase()) ||
                    false,
                runs:
                    (process.env.SOLIDITY_OPTIMIZER_RUNS &&
                        Boolean(
                            parseInt(process.env.SOLIDITY_OPTIMIZER_RUNS)
                        ) &&
                        parseInt(process.env.SOLIDITY_OPTIMIZER_RUNS)) ||
                    200,
            },
            outputSelection: {
                "*": {
                    "*": ["storageLayout"],
                },
            },
        },
    },
    docgen: {
        path: "./docs",
        clear: true,
        runOnCompile: false,
    },
    contractSizer: {
        runOnCompile: false,
        strict: true,
    },
    spdxLicenseIdentifier: {
        runOnCompile: false,
    },
    gasReporter: {
        enabled:
            (process.env.REPORT_GAS &&
                "true" === process.env.REPORT_GAS.toLowerCase()) ||
            false,
        coinmarketcap: process.env.COINMARKETCAP_API_KEY || "",
        gasPriceApi:
            process.env.GAS_PRICE_API ||
            "https://api.etherscan.io/api?module=proxy&action=eth_gasPrice",
        token: "ETH",
        currency: "USD",
        outputFile: "gas-report.txt",
    },
    networks: {
        mainnet: {
            url: process.env.MAINNET_RPC_URL || "",
            accounts: getWallet(),
            gasPrice: 14500000000,
        },
        hardhat: {
            blockGasLimit: 15_000_000,
            // forking: {
            //     url: process.env.MAINNET_RPC_URL || "",
            // },
            allowUnlimitedContractSize:
                (process.env.ALLOW_UNLIMITED_CONTRACT_SIZE &&
                    "true" ===
                        process.env.ALLOW_UNLIMITED_CONTRACT_SIZE.toLowerCase()) ||
                false,
        },
        localhost: {
            blockGasLimit: 30_000_000,
            chainId: 31337,
            // mining: {
            //     auto: false,
            //     interval: 12000, // 12 sec
            // },
        },
        custom: {
            url: process.env.CUSTOM_NETWORK_URL || "",
            accounts: {
                count:
                    (process.env.CUSTOM_NETWORK_ACCOUNTS_COUNT &&
                        Boolean(
                            parseInt(process.env.CUSTOM_NETWORK_ACCOUNTS_COUNT)
                        ) &&
                        parseInt(process.env.CUSTOM_NETWORK_ACCOUNTS_COUNT)) ||
                    0,
                mnemonic: process.env.CUSTOM_NETWORK_ACCOUNTS_MNEMONIC || "",
                path: process.env.CUSTOM_NETWORK_ACCOUNTS_PATH || "",
            },
        },
        arbitrumTestnet: {
            url: process.env.ARBITRUM_TESTNET_RPC_URL || "",
            accounts: getWallet(),
        },
        auroraTestnet: {
            url: process.env.AURORA_TESTNET_RPC_URL || "",
            accounts: getWallet(),
        },
        avalancheFujiTestnet: {
            url: process.env.AVALANCHE_FUJI_TESTNET_RPC_URL || "",
            accounts: getWallet(),
        },
        bscTestnet: {
            url: process.env.BSC_TESTNET_RPC_URL || "",
            accounts: getWallet(),
        },
        ftmTestnet: {
            url: process.env.FTM_TESTNET_RPC_URL || "",
            accounts: getWallet(),
        },
        goerli: {
            url: process.env.GOERLI_RPC_URL || "",
            accounts: getWallet(),
            gasPrice: 3000000000,
        },
        harmonyTest: {
            url: process.env.HARMONY_TEST_RPC_URL || "",
            accounts: getWallet(),
        },
        hecoTestnet: {
            url: process.env.HECO_TESTNET_RPC_URL || "",
            accounts: getWallet(),
        },
        kovan: {
            url: process.env.KOVAN_RPC_URL || "",
            accounts: getWallet(),
        },
        moonbaseAlpha: {
            url: process.env.MOONBASE_ALPHA_RPC_URL || "",
            accounts: getWallet(),
        },
        polygonMumbai: {
            url: process.env.POLYGON_MUMBAI_RPC_URL || "",
            accounts: getWallet(),
            gasPrice: 35000000000,
        },
        rinkeby: {
            url: process.env.RINKEBY_RPC_URL || "",
            accounts: getWallet(),
        },
        ropsten: {
            url: process.env.ROPSTEN_RPC_URL || "",
            accounts: getWallet(),
        },
        sokol: {
            url: process.env.SOKOL_RPC_URL || "",
            accounts: getWallet(),
        },
    },
    typechain: {
        outDir: "./typechain",
    },
    abiExporter: {
        path: "./artifacts",
        clear: true,
    },
    etherscan: {
        apiKey: {
            mainnet: process.env.ETHERSCAN_API_KEY || "",
            arbitrumTestnet: process.env.ARBISCAN_API_KEY || "",
            auroraTestnet: process.env.AURORA_API_KEY || "",
            avalancheFujiTestnet: process.env.SNOWTRACE_API_KEY || "",
            bscTestnet: process.env.BSCSCAN_API_KEY || "",
            ftmTestnet: process.env.FTMSCAN_API_KEY || "",
            harmonyTest: process.env.HARMONY_POPS_API_KEY || "",
            hecoTestnet: process.env.HECOINFO_API_KEY || "",
            goerli: process.env.ETHERSCAN_API_KEY || "",
            kovan: process.env.ETHERSCAN_API_KEY || "",
            moonbaseAlpha: process.env.MOONSCAN_API_KEY || "",
            polygonMumbai: process.env.POLYGONSCAN_API_KEY || "",
            rinkeby: process.env.ETHERSCAN_API_KEY || "",
            ropsten: process.env.ETHERSCAN_API_KEY || "",
            sokol: process.env.BLOCKSCOUT_API_KEY || "",
            custom: process.env.CUSTOM_EXPLORER_API_KEY || "",
        },
        customChains: [
            {
                network: "custom",
                chainId:
                    (process.env.CUSTOM_NETWORK_CHAIN_ID &&
                        Boolean(
                            parseInt(process.env.CUSTOM_NETWORK_CHAIN_ID)
                        ) &&
                        parseInt(process.env.CUSTOM_NETWORK_CHAIN_ID)) ||
                    0,
                urls: {
                    apiURL: process.env.CUSTOM_NETWORK_API_URL || "",
                    browserURL: process.env.CUSTOM_NETWORK_BROWSER_URL || "",
                },
            },
        ],
    },
}

export default config
