import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    cow_hook_dapp: {
      id: "06a2747d08f0026f47aebb91ac13172a318eb3f6116f742751e2d83cc61b8753",
      name: "Swap & Bridge dApp",
      descriptionShort: "Swap and bridge assets across chains seamlessly using COW and CIRCLE",
      description:
        "A dApp that enables users to swap tokens and bridge them across different chains in a single transaction using CoW Protocol",
      version: "0.0.1",
      website: process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000",
      image: "/logo.png", // Make sure to add a logo image in public folder
      conditions: {
        position: "pre",
        smartContractWalletSupported: true,
        supportedNetworks: [1, 100, 42161],
      },
    },
  });
}
