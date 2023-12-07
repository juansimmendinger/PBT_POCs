import dotenv from "dotenv"

dotenv.config()

export type ProviderType = "DEFAULT" | "INFURA" | "ALCHEMY"

export const DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY || ""
export const ETHERSCAN_ETH_API_KEY = process.env.ETHERSCAN_ETH_API_KEY || ""
export const INFURA_ID_GOERLI = process.env.INFURA_ID

export const ALCHEMY_API_KEY_GOERLI = process.env.ALCHEMY_API_KEY
export const ALCHEMY_API_KEY_SEPOLIA = process.env.ALCHEMY_API_KEY_SEPOLIA
export const ALCHEMY_API_KEY_ETHEREUM = process.env.ALCHEMY_API_KEY_ETHEREUM

export const CONTRACT_BELLTOALANGO = "BellToAlango"
export const CONTRACT_BELLTOALANGO_PROXY = "BellToAlangoProxy"
export const CONTRACT_QUANTUM_PROXY_ADMIN = "QuantumProxyAdmin"
export const REPORT_GAS = Boolean(process.env.REPORT_GAS)
export const SELECTED_PROVIDER: ProviderType =
    (INFURA_ID_GOERLI && "INFURA") || (ALCHEMY_API_KEY_GOERLI && "ALCHEMY") || "DEFAULT"

export const PROVIDER_MAP = {
  INFURA: `https://goerli.infura.io/v3/${INFURA_ID_GOERLI}`,
  ALCHEMY: `https://eth-goerli.g.alchemy.com/v2/${ALCHEMY_API_KEY_GOERLI}`,
  DEFAULT: "https://goerli.infura.io/v3/"
}
export const RPC_URL_GOERLI = PROVIDER_MAP[SELECTED_PROVIDER]
export const RPC_URL_SEPOLIA = `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY_SEPOLIA}`
export const RPC_URL_ETHEREUM = `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY_ETHEREUM}`