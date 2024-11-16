import React, { useState } from "react";
import { ArrowLeftRight, ExternalLink, Plus, Trash2, Wallet } from "lucide-react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// Mock data
const mockSwaps = [
  {
    id: 1,
    from: "ETH",
    to: "USDC",
    fromAmount: 1.5,
    toAmount: 2800,
    timestamp: "2024-03-15 14:30",
    status: "completed",
    chain: "Ethereum",
  },
  {
    id: 2,
    from: "USDC",
    to: "MATIC",
    fromAmount: 1000,
    toAmount: 850,
    timestamp: "2024-03-14 09:15",
    status: "completed",
    chain: "Polygon",
  },
  {
    id: 3,
    from: "BNB",
    to: "BUSD",
    fromAmount: 2.3,
    toAmount: 650,
    timestamp: "2024-03-13 11:45",
    status: "pending",
    chain: "BSC",
  },
];

const mockWallets = [
  { address: "0x1234...5678", chain: "Ethereum", balance: 2.5, value: 5000 },
  { address: "0x9876...4321", chain: "Polygon", balance: 1000, value: 1200 },
];

const portfolioData = [
  { name: "Jun", value: 4000 },
  { name: "Jul", value: 4500 },
  { name: "Aug", value: 4200 },
  { name: "Sep", value: 4800 },
  { name: "Oct", value: 5300 },
  { name: "Nov", value: 8900 },
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("portfolio");
  const [showAddWallet, setShowAddWallet] = useState(false);

  return (
    <section className="flex flex-col gap-2 items-center text-start w-full text-white py-6 sm:px-6">
      <div className="max-w-6xl w-full">
        {/* Tab Navigation */}
        <div className="flex gap-4 mb-6 border-b border-gray-700">
          <button
            onClick={() => setActiveTab("portfolio")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "portfolio"
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Portfolio
          </button>
          <button
            onClick={() => setActiveTab("swaps")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "swaps" ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Swaps History
          </button>
        </div>

        {/* Portfolio Tab */}
        {activeTab === "portfolio" && (
          <div className="space-y-6">
            {/* Portfolio Value Chart */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Portfolio Value</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={portfolioData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "none",
                        borderRadius: "0.5rem",
                      }}
                    />
                    <Line type="monotone" dataKey="value" stroke="rgb(87, 139, 250)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Wallets Section */}
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Connected Wallets</h2>
                <button
                  onClick={() => setShowAddWallet(true)}
                  className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg transition-colors"
                >
                  <Plus size={20} />
                  Add Wallet
                </button>
              </div>

              <div className="space-y-4">
                {mockWallets.map(wallet => (
                  <div key={wallet.address} className="bg-gray-700/50 rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <Wallet size={20} className="text-blue-500" />
                        <span className="font-mono">{wallet.address}</span>
                      </div>
                      <div className="text-sm text-gray-400 mt-1">Chain: {wallet.chain}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">${wallet.value.toLocaleString()}</div>
                      <div className="text-sm text-gray-400">
                        {wallet.balance.toLocaleString()} {wallet.chain === "Ethereum" ? "ETH" : "MATIC"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Swaps History Tab */}
        {activeTab === "swaps" && (
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Swaps</h2>
            <div className="space-y-4">
              {mockSwaps.map(swap => (
                <div key={swap.id} className="bg-gray-700/50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <ArrowLeftRight className="text-blue-500" />
                      <div>
                        <div className="font-semibold">
                          {swap.fromAmount} {swap.from} → {swap.toAmount} {swap.to}
                        </div>
                        <div className="text-sm text-gray-400">{swap.chain}</div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
                      <div className="flex gap-2">
                        <ExternalLink
                          size={18}
                          className="text-gray-400 hover:text-white cursor-pointer"
                          // onClick={() => onViewExplorer(swap.id)}
                        />
                        <Trash2
                          size={18}
                          className="text-gray-400 hover:text-red-400 cursor-pointer"
                          // onClick={() => onDelete(swap.id)}
                        />
                      </div>
                      <span
                        className={`text-sm px-2 py-1 rounded ${
                          swap.status === "completed"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {swap.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">{swap.timestamp}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Dashboard;
