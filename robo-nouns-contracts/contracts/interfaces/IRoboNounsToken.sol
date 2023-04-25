// SPDX-License-Identifier: GPL-3.0

/// @title Interface for RoboNounsToken

pragma solidity ^0.8.6;

import { IERC721 } from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import { IRoboNounsDescriptor } from "contracts/interfaces/IRoboNounsDescriptor.sol";
import { IRoboNounsSeeder } from "contracts/interfaces/IRoboNounsSeeder.sol";

interface IRoboNounsToken is IERC721 {
    event NounCreated(uint256 indexed tokenId, IRoboNounsSeeder.Seed seed);

    event NounBurned(uint256 indexed tokenId);

    event NounsDAOUpdated(address nounsDAO);

    event MinterUpdated(address minter);

    event MinterLocked();

    event DescriptorUpdated(IRoboNounsDescriptor descriptor);

    event DescriptorLocked();

    event SeederUpdated(IRoboNounsSeeder seeder);

    event SeederLocked();

    function mint(uint256 blockNumber) external returns (uint256);

    function burn(uint256 tokenId) external;

    function dataURI(uint256 tokenId) external returns (string memory);

    // function setNounsDAO(address nounsDAO) external; // for mumbai testing purposes

    function setMinter(address minter) external;

    function lockMinter() external;

    function setDescriptor(IRoboNounsDescriptor descriptor) external;

    function lockDescriptor() external;

    function setSeeder(IRoboNounsSeeder seeder) external;

    function lockSeeder() external;
}
