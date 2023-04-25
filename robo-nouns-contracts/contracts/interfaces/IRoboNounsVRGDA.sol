// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.17;

import { IRoboNounsSeeder } from "contracts/interfaces/IRoboNounsSeeder.sol";

interface IRoboNounsVRGDA {
    event AuctionSettled(uint256 indexed nounId, address winner, uint256 amount);
    event AuctionReservePriceUpdated(uint256 reservePrice);
    event AuctionUpdateIntervalUpdated(uint256 updateInterval);
    event AuctionTargetPriceUpdated(int256 targetPrice);
    event AuctionPriceDecayPercentUpdated(int256 priceDecayPercent);
    event AuctionPerTimeUnitUpdated(int256 perTimeUnit);

    function settleAuction(uint256 expectedBlockNumber) external payable;

    function fetchNextNoun()
        external
        view
        returns (uint nounId, IRoboNounsSeeder.Seed memory seed, string memory svg, uint256 price, bytes32 hash);

    function pause() external;

    function unpause() external;

    function setReservePrice(uint256 reservePrice) external;
}
