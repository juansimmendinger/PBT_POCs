import {HardhatUserConfig} from "hardhat/config"
import "hardhat-deploy"
import "@nomicfoundation/hardhat-toolbox"
import {
  DEPLOYER_PRIVATE_KEY,
  ETHERSCAN_ETH_API_KEY,
  REPORT_GAS,
  RPC_URL_ETHEREUM,
  RPC_URL_GOERLI,
  RPC_URL_SEPOLIA
} from "./utils/constants"
import "@nomiclabs/hardhat-ethers"
import "@nomiclabs/hardhat-etherscan"
import "solidity-coverage"
import "hardhat-abi-exporter"
import "hardhat-gas-reporter"

const networkConfig: any = {
  hardhat: {
    chainId: 31337,
  },
};

if (DEPLOYER_PRIVATE_KEY) {
  networkConfig["goerli"] = {
    url: RPC_URL_GOERLI,
    chainId: 5,
    accounts: [DEPLOYER_PRIVATE_KEY],
  };

  networkConfig["sepolia"] = {
    url: RPC_URL_SEPOLIA,
    chainId: 11155111,
    accounts: [DEPLOYER_PRIVATE_KEY],
  };
}
const namedAccounts = {
  deployer: {
    default: 0,
  },
  defaultAdmin: {
    default: 0,
    5: "0xA0d1e1d80C6fc72b304f1cd867F4171B3702a20c",
    11155111: "0xA0d1e1d80C6fc72b304f1cd867F4171B3702a20c",
    1: "0xA0d1e1d80C6fc72b304f1cd867F4171B3702a20c",
}
};
const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.0",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.13",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  networks: networkConfig,
  namedAccounts: namedAccounts,
  etherscan: {
    apiKey: {
      goerli: ETHERSCAN_ETH_API_KEY,
      sepolia: ETHERSCAN_ETH_API_KEY,
      mainnet: ETHERSCAN_ETH_API_KEY,
    },
  },
  abiExporter: {
    runOnCompile: true,
    flat: true,
    only: ["BellToAlango.sol", "RedemptionKey.sol", "PBTSimple.sol", "QuantumProxyAdmin.sol", "BellToAlangoProxy.sol"],
    spacing: 2,
    pretty: true,
  },
  gasReporter: {
    enabled: REPORT_GAS,
  },
};

export default config;
