// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import {Hooks} from "v4-core/src/libraries/Hooks.sol";
import {IPoolManager} from "v4-core/src/interfaces/IPoolManager.sol";
import {Currency} from "v4-core/src/types/Currency.sol";

import {Constants} from "./base/Constants.sol";
import {AruSwapHook} from "../../src/aruSwapHook.sol";
import {HookMiner} from "../../test/utils/HookMiner.sol";
import {Config} from "./base/Config.sol";

/// @notice Mines the address and deploys the AruSwapHook contract
contract AruSwapHookScript is Script, Constants, Config {

    function setUp() public {}

    function run() public {
        // Only set AFTER_SWAP_FLAG since that's the only hook we implement
        uint160 flags = uint160(Hooks.AFTER_SWAP_FLAG);

        // Prepare constructor arguments based on the test implementation
        bytes memory constructorArgs = abi.encode(
            POOLMANAGER,
            tokenMessenger,
            token0
        );

        // Mine a salt that will produce a hook address with the correct flags
        (address hookAddress, bytes32 salt) =
            HookMiner.find(CREATE2_DEPLOYER, flags, type(AruSwapHook).creationCode, constructorArgs);

        // Deploy the hook using CREATE2
        vm.broadcast();
        AruSwapHook aruSwapHook = new AruSwapHook{salt: salt}(
            IPoolManager(POOLMANAGER),
            address(tokenMessenger),
            address(token0)
        );
        require(address(aruSwapHook) == hookAddress, "AruSwapHookScript: hook address mismatch");
    }
}
