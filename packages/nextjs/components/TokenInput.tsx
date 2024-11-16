import React from "react";
import { PlaceholderIcon } from "./assets/ImgPlaceholderIcon";
import { ChevronDown } from "lucide-react";

interface TokenInputProps {
  label: "Sell" | "Buy";
  amount: string;
  setAmount: (value: string) => void;
  token: string;
  setToken: (value: string) => void;
  isSwapping?: boolean;
  defaultToken?: string;
}

export const TokenInput = ({
  label,
  amount,
  setAmount,
  token,
  setToken,
  isSwapping,
  defaultToken = "Select",
}: TokenInputProps) => (
  <div className={`bg-gray-900/80 rounded-2xl p-4 transition-all ${isSwapping ? "animate-glow" : ""}`}>
    <div className="text-gray-400 mb-2">{label}</div>
    <div className="flex items-center gap-4">
      <div className="flex-1">
        <input
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder="0"
          className="bg-transparent text-3xl w-full outline-none focus:ring-2 focus:ring-blue-500/50 rounded-lg"
        />
        <div className="text-gray-400 text-sm mt-1">≈ $0.00</div>
      </div>
      <button
        onClick={() => setToken(defaultToken)}
        className="flex items-center gap-2 bg-gray-800 hover:bg-blue-500/20 transition-colors rounded-full px-4 py-2 border border-transparent hover:border-blue-500/40"
      >
        <PlaceholderIcon />
        {token || "Select"}
        <ChevronDown size={20} />
      </button>
    </div>
  </div>
);

export interface TokenSwapProps {
  inputAmount: string;
  setInputAmount: (value: string) => void;
  outputAmount: string;
  setOutputAmount: (value: string) => void;
  inputToken: string;
  setInputToken: (value: string) => void;
  outputToken: string;
  setOutputToken: (value: string) => void;
  isSwapping: boolean;
  onSwapInputs: () => void;
}
