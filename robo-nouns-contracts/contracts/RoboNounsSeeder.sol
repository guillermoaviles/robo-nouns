// SPDX-License-Identifier: GPL-3.0

/**
 * @title The RoboNounsToken pseudo-random seed generator
 * @author NounsDAO
 * @notice This contract generates a pseudo-random seed for a Noun using a block number and noun ID.
 * @dev This contract is used by the NounsToken contract to generate a pseudo-random seed for a Noun.
 */

pragma solidity ^0.8.6;

import "hardhat/console.sol";
import { INounsSeeder } from "contracts/interfaces/INounsSeeder.sol";
import { INounsDescriptorMinimal } from "contracts/interfaces/INounsDescriptorMinimal.sol";

contract RoboNounsSeeder is INounsSeeder {
    /**
     * @notice Generate a pseudo-random Noun seed using the previous blockhash and noun ID. Use robo nouns for custom accessories.
     */
    function generateSeed(
        uint256 nounId,
        INounsDescriptorMinimal roboDescriptor,
        INounsDescriptorMinimal nounsDescriptor,
        uint256 blockNumber
    ) external view override returns (Seed memory) {
        uint256 pseudorandomness = uint256(keccak256(abi.encodePacked(blockhash(blockNumber), nounId)));

        uint256 glassesCount = roboDescriptor.glassesCount();

        // get from robo nouns art
        uint256 headCount = roboDescriptor.headCount();
        uint256 backgroundCount = roboDescriptor.backgroundCount();
        uint256 bodyCount = roboDescriptor.bodyCount();
        uint256 accessoryCount = roboDescriptor.accessoryCount();

        return
            Seed({
                background: uint48(uint48(pseudorandomness) % backgroundCount),
                body: uint48(uint48(pseudorandomness >> 48) % bodyCount),
                accessory: uint48(uint48(pseudorandomness >> 96) % accessoryCount),
                head: uint48(uint48(pseudorandomness >> 144) % headCount),
                glasses: uint48(uint48(pseudorandomness >> 192) % glassesCount)
            });
    }
}
