# 🦄 Uniswap V4 + Circle CCTP Bridge Hook

A powerful integration that combines Uniswap V4's hook system with Circle's Cross-Chain Transfer Protocol (CCTP) to enable seamless cross-chain USDC transfers directly from swaps.

## 🎯 Problem Statement

Currently, users need multiple transactions to:

1. Swap tokens to USDC on one chain
2. Bridge USDC to another chain

This creates friction, increases gas costs, and requires interaction with multiple protocols.

## 💡 Solution

We've built a Uniswap V4 hook that integrates Circle's CCTP, allowing users to:

- Swap any token to USDC
- Bridge that USDC to another chain
- All in a **single transaction**!

## 🏗️ Technical Architecture

### Uniswap V4 Hook Integration

Our solution leverages Uniswap V4's new hook system, which allows custom logic to be executed during the swap lifecycle. Key features used:

- Hooks for post-swap operations
- Native token support
- Flash accounting for optimized gas usage
- Singleton pool design

### Circle CCTP Integration

We integrate Circle's TokenMessenger contract to handle the cross-chain USDC transfer, providing:

- Trustless bridging (only trust Circle, the USDC issuer)
- Immediate finality
- Native USDC support

## 🔧 How It Works

1. User initiates a swap with cross-chain parameters in `hookData`
2. Hook intercepts the swap completion
3. If USDC is the output token:
   - Captures USDC from the pool
   - Calls Circle's `depositForBurn` function
   - USDC is burned on source chain
   - Circle mints equivalent USDC on destination chain

```solidity
function afterSwap(
    address,
    PoolKey calldata key,
    IPoolManager.SwapParams calldata params,
    BalanceDelta delta,
    bytes calldata hookData
) external override returns (bytes4, int128) {
    // Hook implementation details...
}
```

## 🚀 Development Progress

- ✅ Built `AruSwapHook.sol` with CCTP integration
- ✅ Implemented comprehensive test suite
- ✅ Deployed to Ethereum Sepolia testnet
- ✅ Created deployment scripts for easy replication

## 🛠️ Technical Components

1. **Smart Contracts**
   - `AruSwapHook.sol`: Main hook implementation [AruSwapHook](./src/AruSwapHook.sol)
   - Test suite: `AruSwapHook.t.sol` [AruSwapHook.t](./test/AruSwapHook.t.sol)
   - Deployment scripts in `script/AruSwapHook/` [scripts](./script/)

2. **Deployments**
   - Ethereum Sepolia hook deployment `broadcast/00_AruSwapHook.s.sol/11155111/run-latest.json`
   - Ethereum Sepolia pool deployment details in `broadcast/01_CreatePoolAndMintLiquidity.s.sol/11155111/run-latest.json`

3. **Commands**
   - Check [notes](./notes.md)

## 🔜 Future Enhancements

1. Gas optimization improvements
2. UI/UX improvements for parameter configuration
3. Implement the user interface for the solution

## 🙏 Acknowledgements

- Uniswap V4 Team for the mentoring and help
- Circle team for mentoring and help
- [Uniswap V4 Documentation](https://docs.uniswap.org/contracts/v4/overview)
- [Circle CCTP Documentation](https://developers.circle.com/stablecoins/cctp-getting-started)
