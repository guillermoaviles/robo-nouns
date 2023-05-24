// SPDX-License-Identifier: GPL-3.0

/// @title Interface for NounsSeeder

pragma solidity ^0.8.6;

import { INounsDescriptorMinimal } from "contracts/interfaces/INounsDescriptorMinimal.sol";

interface INounsSeeder {
    struct Seed {
        uint48 background;
        uint48 body;
        uint48 accessory;
        uint48 head;
        uint48 glasses;
    }

    function generateSeed(
        uint256 nounId,
        INounsDescriptorMinimal descriptor,
        // INounsDescriptorMinimal nounsDescriptor,
        uint256 blockNumber
    ) external view returns (Seed memory);
}
