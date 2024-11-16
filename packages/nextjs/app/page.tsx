"use client";

import React, { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ArrowDownUp } from "lucide-react";
import { NextPage } from "next";
import { useAccount } from "wagmi";
import { TokenInput } from "~~/components/TokenInput";
import { generateCombinedCallData } from "~~/utils/cow-hook/cowGenerateHookData";

const Home: NextPage = () => {
  const [inputAmount, setInputAmount] = useState("");
  const [outputAmount, setOutputAmount] = useState("");
  const [inputToken, setInputToken] = useState("");
  const [outputToken, setOutputToken] = useState("");
  const [isSwapping, setIsSwapping] = useState(false);
  const { address, isConnected } = useAccount();

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

  const handleSwap = (openConnectModal: () => void, connected: boolean) => {
    if (!connected) {
      openConnectModal();
    } else if (isTokenSelected && hasAmount) {
      // Swap logic here
    }
  };

  return (
    <div className="text-white p-4">
      <div className="max-w-lg mx-auto mt-10">
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
                if (!connected) return "Connect Wallet";
                if (!isTokenSelected) return "Select a token";
                if (!hasAmount) return "Select amount";
                return "Swap";
              };

              const isButtonDisabled = connected && (!isTokenSelected || !hasAmount);

              return (
                <button
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
