import type { Metadata } from "next";

const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : `http://localhost:${process.env.PORT || 3000}`;
const titleTemplate = "Aru Swap";

export const getMetadata = ({
  title,
  description,
  imageRelativePath = "/thumbnail.jpg",
}: {
  title: string;
  description: string;
  imageRelativePath?: string;
}): Metadata & {
  cow_hook_dapp: {
    id: string;
    name: string;
    descriptionShort: string;
    description: string;
    version: string;
    website: string;
    image: string;
    conditions: {
      position: string;
      smartContractWalletSupported: boolean;
      supportedNetworks: number[];
    };
  };
} => {
  const imageUrl = `${baseUrl}${imageRelativePath}`;

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: title,
      template: titleTemplate,
    },
    description: description,
    openGraph: {
      title: {
        default: title,
        template: titleTemplate,
      },
      description: description,
      images: [
        {
          url: imageUrl,
        },
      ],
    },
    twitter: {
      title: {
        default: title,
        template: titleTemplate,
      },
      description: description,
      images: [imageUrl],
    },
    icons: {
      icon: [{ url: "/aruswap.ico", sizes: "32x32", type: "image/png" }],
    },
    cow_hook_dapp: {
      id: "06a2747d08f0026f47aebb91ac13172a318eb3f6116f742751e2d83cc61b8753",
      name: "Swap & Bridge dApp",
      descriptionShort: "Swap and bridge assets across chains seamlessly",
      description:
        "A dApp that enables users to swap tokens and bridge them across different chains in a single transaction using CoW Protocol",
      version: "0.0.1",
      website: "YOUR_WEBSITE_URL",
      image: "YOUR_LOGO_URL",
      conditions: {
        position: "pre",
        smartContractWalletSupported: true,
        supportedNetworks: [1, 100, 42161],
      },
    },
  };
};
