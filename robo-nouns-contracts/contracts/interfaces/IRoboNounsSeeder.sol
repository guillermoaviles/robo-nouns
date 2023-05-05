// SPDX-License-Identifier: GPL-3.0

/// @title Interface for NounsSeeder

pragma solidity ^0.8.6;

import { IRoboNounsDescriptor } from "contracts/interfaces/IRoboNounsDescriptor.sol";
import { INounsDescriptor } from "contracts/interfaces/INounsDescriptor.sol";

interface IRoboNounsSeeder {
    struct Seed {
        uint48 background;
        uint48 body;
        uint48 accessory;
        uint48 head;
        uint48 glasses;
    }

    function generateSeed(
        uint256 nounId,
        IRoboNounsDescriptor descriptor,
        // INounsDescriptor nounsDescriptor, // multi descriptor
        uint256 blockNumber
    ) external view returns (Seed memory);
}
