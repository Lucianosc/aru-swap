https://sepolia.etherscan.io/

- deployer: 0x81d786b35f3EA2F39Aa17cb18d9772E4EcD97206

- rpc: [sepolia.infura.io](https://eth-sepolia.public.blastapi.io)  

- etherscan api key: DAZU7EDSURMXQPW5VV8FIDY19SWF91CN53

forge create ./src/NFT.sol:NFT --rpc-url $BASE_SEPOLIA_RPC --account deployer

# Deploy hook

```sh
forge script script/AruSwapHook/00_AruSwapHook.s.sol \
    --rpc-url https://eth-sepolia.public.blastapi.io \
    --account deployer \
    --broadcast \
    --verify
```

# Create pool

```sh
forge script script/AruSwapHook/01_CreatePoolAndMintLiquidity.s.sol \
    --rpc-url https://eth-sepolia.public.blastapi.io \
    --account deployer \
    --broadcast \
    --verify
```

# Add liquidity

```sh
forge script script/AruSwapHook/02_AddLiquidity.s.sol \
    --rpc-url https://eth-sepolia.public.blastapi.io \
    --account deployer \
    --broadcast \
    --verify
```

# Swap

```sh
forge script script/AruSwapHook/03_Swap.s.sol \
    --rpc-url https://eth-sepolia.public.blastapi.io \
    --account deployer \
    --broadcast \
    --verify
```

# Swap and bridge

```sh
forge script script/AruSwapHook/04_SwapAndBridge.s.sol \
    --rpc-url https://eth-sepolia.public.blastapi.io \
    --account deployer \
    --broadcast \
    --verify
```

# Bridge CCTP

```sh
forge script script/AruSwapHook/05_bridge_cctp.s.sol \
    --rpc-url https://eth-sepolia.public.blastapi.io \
    --account deployer \
    --broadcast \
    --verify
```
