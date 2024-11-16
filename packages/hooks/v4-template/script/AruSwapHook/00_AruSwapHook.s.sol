// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import {Hooks} from "v4-core/src/libraries/Hooks.sol";
import {IPoolManager} from "v4-core/src/interfaces/IPoolManager.sol";
import {Currency} from "v4-core/src/types/Currency.sol";

import {Constants} from "../base/Constants.sol";
import {AruSwapHook} from "../../src/aruSwapHook.sol";
import {HookMiner} from "../../test/utils/HookMiner.sol";

/// @notice Mines the address and deploys the AruSwapHook contract
contract AruSwapHookScript is Script, Constants {
    // Address for TokenMessenger contract - should be set in Constants or configured here
    // https://developers.circle.com/stablecoins/evm-smart-contracts
    address public constant TOKEN_MESSENGER = address(0x9f3B8679c73C2Fef8b59B4f3444d4e156fb70AA5); // TODO: Replace with actual address
    address public constant USDC = address(0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238); // TODO: Replace with actual USDC address

    function setUp() public {}

    function run() public {
        // From the test file, we can see only AFTER_SWAP_FLAG is needed
        uint160 flags = uint160(Hooks.AFTER_SWAP_FLAG);

        // Prepare constructor arguments based on the test implementation
        bytes memory constructorArgs = abi.encode(
            POOLMANAGER,
            TOKEN_MESSENGER,
            USDC
        );

        // Mine a salt that will produce a hook address with the correct flags
        (address hookAddress, bytes32 salt) =
            HookMiner.find(CREATE2_DEPLOYER, flags, type(AruSwapHook).creationCode, constructorArgs);

        // Deploy the hook using CREATE2
        vm.broadcast();
        AruSwapHook aruSwapHook = new AruSwapHook{salt: salt}(
            IPoolManager(POOLMANAGER),
            TOKEN_MESSENGER,
            USDC
        );
        require(address(aruSwapHook) == hookAddress, "AruSwapHookScript: hook address mismatch");
    }
}
