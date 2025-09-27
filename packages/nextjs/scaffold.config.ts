// import * as chains from "viem/chains";
// export type BaseConfig = {
//   targetNetworks: readonly chains.Chain[];
//   pollingInterval: number;
//   alchemyApiKey: string;
//   rpcOverrides?: Record<number, string>;
//   walletConnectProjectId: string;
//   onlyLocalBurnerWallet: boolean;
// };
// export type ScaffoldConfig = BaseConfig;
// export const DEFAULT_ALCHEMY_API_KEY = "oKxs-03sij-U_N0iOlrSsZFr29-IqbuF";
// const scaffoldConfig = {
//   // The networks on which your DApp is live
//   targetNetworks: [chains.hardhat],
//   // The interval at which your front-end polls the RPC servers for new data (it has no effect if you only target the local network (default is 4000))
//   pollingInterval: 30000,
//   // This is ours Alchemy's default API key.
//   // You can get your own at https://dashboard.alchemyapi.io
//   // It's recommended to store it in an env variable:
//   // .env.local for local testing, and in the Vercel/system env config for live apps.
//   alchemyApiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || DEFAULT_ALCHEMY_API_KEY,
//   // If you want to use a different RPC for a specific network, you can add it here.
//   // The key is the chain ID, and the value is the HTTP RPC URL
//   rpcOverrides: {
//     // Example:
//     // [chains.mainnet.id]: "https://mainnet.rpc.buidlguidl.com",
//   },
//   // This is ours WalletConnect's default project ID.
//   // You can get your own at https://cloud.walletconnect.com
//   // It's recommended to store it in an env variable:
//   // .env.local for local testing, and in the Vercel/system env config for live apps.
//   walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "3a8170812b534d0ff9d794f19a901d64",
//   onlyLocalBurnerWallet: true,
// } as const satisfies ScaffoldConfig;
// export default scaffoldConfig;
import { defineChain } from "viem";
import * as chains from "viem/chains";

export type BaseConfig = {
  targetNetworks: readonly chains.Chain[];
  pollingInterval: number;
  alchemyApiKey: string;
  rpcOverrides?: Record<number, string>;
  walletConnectProjectId: string;
  onlyLocalBurnerWallet: boolean;
};

export type ScaffoldConfig = BaseConfig;

export const DEFAULT_ALCHEMY_API_KEY = "oKxs-03sij-U_N0iOlrSsZFr29-IqbuF";

// Kadena EVM Testnet — Chain 20 (id: 5920)
export const kadenaChain20 = defineChain({
  id: 5920,
  name: "Kadena EVM Testnet Chain 20",
  nativeCurrency: { name: "Kadena", symbol: "KDA", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["https://evm-testnet.chainweb.com/chainweb/0.0/evm-testnet/chain/20/evm/rpc"],
    },
    public: {
      http: ["https://evm-testnet.chainweb.com/chainweb/0.0/evm-testnet/chain/20/evm/rpc"],
    },
  },
  blockExplorers: {
    default: {
      name: "Blockscout (Chain 20)",
      url: "http://chain-20.evm-testnet-blockscout.chainweb.com/",
    },
  },
});

const scaffoldConfig = {
  // Use Kadena EVM Testnet Chain 20
  targetNetworks: [kadenaChain20], // Poll slower on remote RPCs to reduce load
  pollingInterval: 30000, // Alchemy not used for Kadena; keep placeholder for other chains
  alchemyApiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || DEFAULT_ALCHEMY_API_KEY, // Force exact RPC for chain 5920 (optional but explicit)
  rpcOverrides: {
    5920: "https://evm-testnet.chainweb.com/chainweb/0.0/evm-testnet/chain/20/evm/rpc",
  }, // WalletConnect project ID (works cross-chain)
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "3a8170812b534d0ff9d794f19a901d64", // Set to false to allow WalletConnect/real wallets on testnet
  onlyLocalBurnerWallet: false,
} as const satisfies ScaffoldConfig;

export default scaffoldConfig;
