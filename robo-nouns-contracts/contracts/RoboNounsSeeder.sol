// SPDX-License-Identifier: GPL-3.0

/**
 * @title The RoboNounsToken pseudo-random seed generator
 * @author NounsDAO & @zeroxvee
 * @notice This contract generates a pseudo-random seed for a Noun using a block number and noun ID.
 * @dev This contract is used by the NounsToken contract to generate a pseudo-random seed for a Noun.
 */

pragma solidity ^0.8.6;

import { IRoboNounsSeeder } from "./interfaces/IRoboNounsSeeder.sol";
import { IRoboNounsDescriptor } from "./interfaces/IRoboNounsDescriptor.sol";

contract RoboNounsSeeder is IRoboNounsSeeder {
    /**
     * @notice Generate a pseudo-random Noun seed using the previous blockhash and noun ID.
     */
    function generateSeed(
        uint256 nounId,
        IRoboNounsDescriptor descriptor,
        uint256 blockNumber
    ) external view override returns (Seed memory) {
        uint256 pseudorandomness = uint256(keccak256(abi.encodePacked(blockhash(blockNumber), nounId)));

        uint256 backgroundCount = descriptor.backgroundCount();
        uint256 bodyCount = descriptor.bodyCount();
        uint256 accessoryCount = descriptor.accessoryCount();
        uint256 headCount = descriptor.headCount();
        uint256 glassesCount = descriptor.glassesCount();

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
