import * as dotenv from "dotenv";
dotenv.config();

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-chai-matchers";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "@nomicfoundation/hardhat-verify";
import "hardhat-deploy";
import "hardhat-deploy-ethers";
import generateTsAbis from "./scripts/generateTsAbis";

// Alchemy (used for some preset networks; not used by Kadena EVM)
const providerApiKey = process.env.ALCHEMY_API_KEY || "oKxs-03sij-U_N0iOlrSsZFr29-IqbuF";

// Deployer key: prefer runtime var, then DEPLOYER_PRIVATE_KEY from .env, then fallback to Hardhat account #0
const deployerPrivateKey =
  process.env.__RUNTIME_DEPLOYER_PRIVATE_KEY ??
  process.env.DEPLOYER_PRIVATE_KEY ??
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

// Etherscan key (not required for Kadena Blockscout, but keep for other networks)
const etherscanApiKey = process.env.ETHERSCAN_V2_API_KEY || "DNXJA8RX2Q3VZ4URQIWP7Z68CJXQZSC6AW";

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.20",
        settings: {
          optimizer: { enabled: true, runs: 200 },
        },
      },
    ],
  },
  defaultNetwork: "localhost",
  namedAccounts: {
    deployer: { default: 0 },
  },
  networks: {
    // Local hardhat (with optional mainnet forking)
    hardhat: {
      forking: {
        url: `https://eth-mainnet.alchemyapi.io/v2/${providerApiKey}`,
        enabled: process.env.MAINNET_FORKING_ENABLED === "true",
      },
    },

    // Kadena EVM Testnet — Chain 20
    kadenaEvmChain20: {
      url: "https://evm-testnet.chainweb.com/chainweb/0.0/evm-testnet/chain/20/evm/rpc",
      chainId: 5920,
      accounts: [deployerPrivateKey],
    },

    // Preset networks (unchanged)
    mainnet: { url: "https://mainnet.rpc.buidlguidl.com", accounts: [deployerPrivateKey] },
    sepolia: { url: `https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`, accounts: [deployerPrivateKey] },
    arbitrum: { url: `https://arb-mainnet.g.alchemy.com/v2/${providerApiKey}`, accounts: [deployerPrivateKey] },
    arbitrumSepolia: { url: `https://arb-sepolia.g.alchemy.com/v2/${providerApiKey}`, accounts: [deployerPrivateKey] },
    optimism: { url: `https://opt-mainnet.g.alchemy.com/v2/${providerApiKey}`, accounts: [deployerPrivateKey] },
    optimismSepolia: { url: `https://opt-sepolia.g.alchemy.com/v2/${providerApiKey}`, accounts: [deployerPrivateKey] },
    polygon: { url: `https://polygon-mainnet.g.alchemy.com/v2/${providerApiKey}`, accounts: [deployerPrivateKey] },
    polygonAmoy: { url: `https://polygon-amoy.g.alchemy.com/v2/${providerApiKey}`, accounts: [deployerPrivateKey] },
    // polygonZkEvm: { url: `https://polygonzkevm-mainnet.g.alchemy.com/v2/${providerApiKey}`, accounts: [deployerPrivateKey] },
    // polygonZkEvmCardona: { url: `https://polygonzkevm-cardona.g.alchemy.com/v2/${providerApiKey}`, accounts: [deployerPrivateKey] },
    gnosis: { url: "https://rpc.gnosischain.com", accounts: [deployerPrivateKey] },
    chiado: { url: "https://rpc.chiadochain.net", accounts: [deployerPrivateKey] },
    base: { url: "https://mainnet.base.org", accounts: [deployerPrivateKey] },
    baseSepolia: { url: "https://sepolia.base.org", accounts: [deployerPrivateKey] },
    scrollSepolia: { url: "https://sepolia-rpc.scroll.io", accounts: [deployerPrivateKey] },
    scroll: { url: "https://rpc.scroll.io", accounts: [deployerPrivateKey] },
    celo: { url: "https://forno.celo.org", accounts: [deployerPrivateKey] },
    celoSepolia: { url: "https://forno.celo-sepolia.celo-testnet.org/", accounts: [deployerPrivateKey] },
  },
  // Hardhat verify (for Etherscan chains; Kadena uses Blockscout UI separately)
  etherscan: { apiKey: etherscanApiKey },
  // hardhat-deploy verify settings (useful on Etherscan networks)
  verify: { etherscan: { apiKey: etherscanApiKey } },
  sourcify: { enabled: false },
};

// Extend the deploy task to also generate TS ABIs artifacts for the frontend
task("deploy").setAction(async (args, hre, runSuper) => {
  await runSuper(args);
  await generateTsAbis(hre);
});

export default config;
