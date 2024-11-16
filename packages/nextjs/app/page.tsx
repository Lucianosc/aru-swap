"use client";

import React, { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ArrowDownUp } from "lucide-react";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { TokenInput } from "~~/components/TokenInput";
import { generateCombinedCallData } from "~~/utils/cow-hook/cowGenerateHookData";
import CowHookDappComponent from "../components/cowSwap"


const Home: NextPage = () => {
  const [inputAmount, setInputAmount] = useState("");
  const [outputAmount, setOutputAmount] = useState("");
  const [inputToken, setInputToken] = useState("");
  const [outputToken, setOutputToken] = useState("");
  const [isSwapping, setIsSwapping] = useState(false);
  const { address, isConnected } = useAccount();
  //const { context, addHook, updateTokens } = useCowHook();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isTokenSelected = inputToken && outputToken;
  const hasAmount = inputAmount && outputAmount;

  const triggerSwapAnimation = () => {
    setIsSwapping(true);
    setTimeout(() => setIsSwapping(false), 200);
  };

  const handleInputSwap = () => {
    triggerSwapAnimation();
    setInputAmount(outputAmount);
    setOutputAmount(inputAmount);
    setInputToken(outputToken);
    setOutputToken(inputToken);
  };

  useEffect(() => {
    if (inputToken && outputToken) {
      updateTokens(inputToken, outputToken);
    }
  }, [inputToken, outputToken, updateTokens]);

  const handleSwap = async (openConnectModal: () => void, connected: boolean) => {
    if (!connected) {
      openConnectModal();
    } else if (isTokenSelected && hasAmount) {
      try {
        setIsLoading(true);
        setError(null);

        const hookData = await generateCombinedCallData(
          inputToken,
          outputToken,
          inputAmount,
          Number(outputAmount),
          address || "",
        );

        addHook({
          hook: {
            target: inputToken,
            callData: hookData,
            gasLimit: "300000",
          },
        });
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
        console.error("Error creating swap hook:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="text-white p-4">
      <div className="max-w-lg mx-auto mt-10">
        <div>
          <CowHookDappComponent />
        </div>
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-2">Swap & bridge,</h1>
          <h2 className="text-4xl font-bold mb-2">the hell out of everything.</h2>
        </div>
        <div className="bg-gray-800/50 rounded-3xl p-4 backdrop-blur-sm">
          <>
            <TokenInput
              label="Sell"
              amount={inputAmount}
              setAmount={setInputAmount}
              token={inputToken}
              setToken={setInputToken}
              isSwapping={isSwapping}
              defaultToken="ETH"
            />

            {/* Swap Input Button */}
            <div className="flex justify-center -my-3 relative z-10">
              <div className="bg-gray-800/50 p-2 rounded-2xl">
                <button
                  type="button"
                  title="Swap"
                  onClick={handleInputSwap}
                  className="bg-blue-500/20 hover:bg-blue-500/30 p-2 rounded-xl border border-blue-500/40"
                >
                  <ArrowDownUp size={20} className="text-blue-400" />
                </button>
              </div>
            </div>

            <TokenInput
              label="Buy"
              amount={outputAmount}
              setAmount={setOutputAmount}
              token={outputToken}
              setToken={setOutputToken}
              isSwapping={isSwapping}
              defaultToken="USDC"
            />
          </>

          {/* Swap Button */}
          <ConnectButton.Custom>
            {({ account, chain, openConnectModal }) => {
              const connected = account && chain;

              const getButtonText = () => {
                if (isLoading) return "Processing...";
                if (error) return "Error - Try Again";
                if (!connected) return "Connect Wallet";
                if (!isTokenSelected) return "Select a token";
                if (!hasAmount) return "Select amount";
                return "Swap";
              };

              const isButtonDisabled = connected && (!isTokenSelected || !hasAmount);

              return (
                <button
                  type="button"
                  onClick={() => handleSwap(openConnectModal, !!connected)}
                  disabled={isButtonDisabled}
                  className={`w-full py-4 mt-5 rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-lg transition
                    ${
                      !isButtonDisabled
                        ? "bg-blue-500 hover:bg-blue-600 shadow-blue-500/25"
                        : "bg-gray-700 cursor-not-allowed"
                    }`}
                >
                  {getButtonText()}
                </button>
              );
            }}
          </ConnectButton.Custom>
        </div>
        <p className="text-gray-400 mt-8 text-lg mb-0">Swap your assets securely across chains</p>
        <p className="text-gray-400 text-lg mt-0">with a bridgeless experience.</p>
      </div>
    </div>
  );
};

export default Home;
