import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    cow_hook_dapp: {
      id: "06a2747d08f0026f47aebb91ac13172a318eb3f6116f742751e2d83cc61b8753",
      name: "AruSwap",
      descriptionShort: "Lightning-fast cross-chain swaps with CowSwap Hooks & Circle",
      description:
        "Experience the future of DeFi with AruSwap - the first dApp combining CowSwap's powerful hooks engine with Circle's secure bridging for seamless cross-chain transactions. Trade and bridge assets across networks in one click, saving time and gas.",
      version: "0.0.1",
      website: "https://aru-swap.vercel.app",
      image: "https://aru-swap.vercel.app/logo.png",
      conditions: {
        position: "post",
        smartContractWalletSupported: true,
        supportedNetworks: [11155111, 6],
      },
    },
  });
}
