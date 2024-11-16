import { Inter } from "next/font/google";
import "@rainbow-me/rainbowkit/styles.css";
import { Providers } from "~~/components/Providers";
import { ThemeProvider } from "~~/components/ThemeProvider";
import "~~/styles/globals.css";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = getMetadata({
  title: "Aru Swap",
  description: "Swap & bridge assets across chains",
});

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning className={`${inter.variable}`} lang="en">
      <body className="min-h-screen bg-gradient-to-b from-gray-900 to-black font-inter">
        <ThemeProvider enableSystem>
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default ScaffoldEthApp;
