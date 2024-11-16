// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import {IHooks} from "v4-core/src/interfaces/IHooks.sol";
import {Hooks} from "v4-core/src/libraries/Hooks.sol";
import {TickMath} from "v4-core/src/libraries/TickMath.sol";
import {IPoolManager} from "v4-core/src/interfaces/IPoolManager.sol";
import {PoolKey} from "v4-core/src/types/PoolKey.sol";
import {BalanceDelta} from "v4-core/src/types/BalanceDelta.sol";
import {PoolId, PoolIdLibrary} from "v4-core/src/types/PoolId.sol";
import {CurrencyLibrary, Currency} from "v4-core/src/types/Currency.sol";
import {PoolSwapTest} from "v4-core/src/test/PoolSwapTest.sol";
import {AruSwapHook} from "../src/AruSwapHook.sol";
import {StateLibrary} from "v4-core/src/libraries/StateLibrary.sol";

import {LiquidityAmounts} from "v4-core/test/utils/LiquidityAmounts.sol";
import {IPositionManager} from "v4-periphery/src/interfaces/IPositionManager.sol";
import {EasyPosm} from "./utils/EasyPosm.sol";
import {Fixtures} from "./utils/Fixtures.sol";
import {AruSwapHookImplementation} from "./shared/implementation/AruSwapHookImplementation.sol";

// Mock TokenMessenger for testing
contract MockTokenMessenger {
    event DepositForBurn(
        uint256 amount,
        uint32 destinationDomain,
        bytes32 mintRecipient,
        address burnToken
    );

    function depositForBurn(
        uint256 amount,
        uint32 destinationDomain,
        bytes32 mintRecipient,
        address burnToken
    ) external returns (uint64) {
        emit DepositForBurn(amount, destinationDomain, mintRecipient, burnToken);
        return 1; // Return a dummy message sequence
    }
}

contract AruSwapHookTest is Test, Fixtures {
    using EasyPosm for IPositionManager;
    using PoolIdLibrary for PoolKey;
    using CurrencyLibrary for Currency;
    using StateLibrary for IPoolManager;

    AruSwapHook hook;
    PoolId poolId;
    MockTokenMessenger mockTokenMessenger;

    uint256 tokenId;
    int24 tickLower;
    int24 tickUpper;

    function setUp() public {
        // Deploy mock TokenMessenger
        mockTokenMessenger = new MockTokenMessenger();

        // creates the pool manager, utility routers, and test tokens
        deployFreshManagerAndRouters();
        deployMintAndApprove2Currencies();
        deployAndApprovePosm(manager);

        // Deploy the hook to an address with the correct flags
        address flags = address(uint160(Hooks.AFTER_SWAP_FLAG));

        // Deploy implementation first
        AruSwapHookImplementation impl = new AruSwapHookImplementation(
            IPoolManager(manager),
            address(mockTokenMessenger),
            Currency.unwrap(currency0), // Use currency0 as USDC
            AruSwapHook(flags)
        );

        // Get storage writes from implementation
        (, bytes32[] memory writes) = vm.accesses(address(impl));
        
        // Deploy the hook using vm.etch
        vm.etch(flags, address(impl).code);
        
        // Copy storage values from implementation to hook address
        unchecked {
            for (uint256 i = 0; i < writes.length; i++) {
                bytes32 slot = writes[i];
                vm.store(flags, slot, vm.load(address(impl), slot));
            }
        }
        
        hook = AruSwapHook(flags);

        // Create the pool with currency0 as USDC
        key = PoolKey(currency0, currency1, 3000, 60, IHooks(hook));
        poolId = key.toId();
        manager.initialize(key, SQRT_PRICE_1_1);

        // Provide liquidity
        tickLower = TickMath.minUsableTick(key.tickSpacing);
        tickUpper = TickMath.maxUsableTick(key.tickSpacing);

        uint128 liquidityAmount = 100e18;

        (uint256 amount0Expected, uint256 amount1Expected) = LiquidityAmounts.getAmountsForLiquidity(
            SQRT_PRICE_1_1,
            TickMath.getSqrtPriceAtTick(tickLower),
            TickMath.getSqrtPriceAtTick(tickUpper),
            liquidityAmount
        );

        (tokenId,) = posm.mint(
            key,
            tickLower,
            tickUpper,
            liquidityAmount,
            amount0Expected + 1,
            amount1Expected + 1,
            address(this),
            block.timestamp,
            ZERO_BYTES
        );
    }

    function testCrossChainSwap() public {
        // Prepare swap parameters
        bool zeroForOne = false; // Swap token1 for USDC (currency0)
        int256 amountSpecified = -1e18; // Exact input of token1
        
        // Prepare hookData for cross-chain transfer
        uint32 destinationDomain = 1;
        bytes32 mintRecipient = bytes32(uint256(uint160(address(this))));
        bytes memory hookData = abi.encode(destinationDomain, mintRecipient);

        // Start recording events
        vm.recordLogs();

        // Perform the swap
        BalanceDelta swapDelta = swap(key, zeroForOne, amountSpecified, hookData);

        // Get the recorded logs
        Vm.Log[] memory entries = vm.getRecordedLogs();
        
        // Find and verify the DepositForBurn event
        bool foundEvent = false;
        for (uint i = 0; i < entries.length; i++) {
            // The event signature for DepositForBurn
            if (entries[i].topics[0] == keccak256("DepositForBurn(uint256,uint32,bytes32,address)")) {
                foundEvent = true;
                // Decode the event data
                (uint256 amount, uint32 domain, bytes32 recipient, address token) = 
                    abi.decode(entries[i].data, (uint256, uint32, bytes32, address));
                
                // Verify the event parameters
                assertEq(amount, uint256(uint128(swapDelta.amount0())));
                assertEq(domain, destinationDomain);
                assertEq(recipient, mintRecipient);
                assertEq(token, Currency.unwrap(currency0));
                break;
            }
        }
        
        assertTrue(foundEvent, "DepositForBurn event not emitted");

        // Verify the swap amounts
        assertEq(int256(swapDelta.amount1()), amountSpecified);
        assertTrue(swapDelta.amount0() > 0); // Verify we received USDC
    }

    function testSwapWithoutCrossChain() public {
        // Test regular swap without cross-chain transfer
        bool zeroForOne = false; // Swap token1 for USDC (currency0)
        int256 amountSpecified = -1e18;
        
        BalanceDelta swapDelta = swap(key, zeroForOne, amountSpecified, ZERO_BYTES);

        // Verify the swap amounts
        assertEq(int256(swapDelta.amount1()), amountSpecified);
        assertTrue(swapDelta.amount0() > 0);
    }
}
