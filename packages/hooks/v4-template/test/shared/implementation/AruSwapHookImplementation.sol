// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;


import {AruSwapHook} from "../../../src/AruSwapHook.sol";
import {IPoolManager} from "v4-core/src/interfaces/IPoolManager.sol";
import {Hooks} from "v4-core/src/libraries/Hooks.sol";
import {BaseHook} from "v4-periphery/src/base/hooks/BaseHook.sol";

contract AruSwapHookImplementation is AruSwapHook {
    constructor(
        IPoolManager _poolManager,
        address _tokenMessenger,
        address _usdc,
        AruSwapHook addressToEtch
    ) AruSwapHook(_poolManager, _tokenMessenger, _usdc) {
        Hooks.validateHookPermissions(addressToEtch, getHookPermissions());
    }

    // make this a no-op in testing
    function validateHookAddress(BaseHook _this) internal pure override {}
} 