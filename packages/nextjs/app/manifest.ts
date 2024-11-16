import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest & {
  cow_hook_dapp: {
    id: string;
    name: string;
    descriptionShort: string;
    description: string;
    version: string;
    website: string;
    image: string;
    conditions: {
      position: "pre" | "post";
      smartContractWalletSupported: boolean;
      supportedNetworks: number[];
    };
  };
} {
  return {
    name: "Next.js App",
    short_name: "Next.js App",
    description: "Next.js App",
    start_url: "/",
    display: "standalone",
    background_color: "#fff",
    theme_color: "#fff",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
    cow_hook_dapp: {
      id: "06a2747d08f0026f47aebb91ac13172a318eb3f6116f742751e2d83cc61b8753",
      name: "Your Hook Dapp",
      descriptionShort: "Your Hook Dapp short description",
      description: "Your Hook Dapp full description",
      version: "0.0.1",
      website: "https://your-cow-hook.dapp",
      image: "http://your-cow-hook.dapp/logo.png",
      conditions: {
        position: "pre",
        smartContractWalletSupported: false,
        supportedNetworks: [1, 100, 42161],
      },
    },
  };
}
