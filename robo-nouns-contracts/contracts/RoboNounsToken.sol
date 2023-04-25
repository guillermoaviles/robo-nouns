// SPDX-License-Identifier: GPL-3.0

/// @title The RoboNouns ERC-721 token

pragma solidity ^0.8.6;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { IRoboNounsDescriptor } from "contracts/interfaces/IRoboNounsDescriptor.sol";
import { IRoboNounsSeeder } from "contracts/interfaces/IRoboNounsSeeder.sol";
import { IRoboNounsToken } from "contracts/interfaces/IRoboNounsToken.sol";
import { ERC721 } from "contracts/base/ERC721.sol";
import { IERC721 } from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import { IProxyRegistry } from "contracts/external/opensea/IProxyRegistry.sol";

contract RoboNounsToken is IRoboNounsToken, Ownable, ERC721 {
    // Owners contract address;
    // address public ownersContract; removed for mumbai testing purposes

    // The OG nouns DAO address
    // address public nounsDAO;

    // An address who has permissions to mint RoboNouns
    address public minter;

    // The RoboNouns token URI descriptor
    IRoboNounsDescriptor public descriptor;

    // The RoboNouns token seeder
    IRoboNounsSeeder public seeder;

    // Whether the minter can be updated
    bool public isMinterLocked;

    // Whether the descriptor can be updated
    bool public isDescriptorLocked;

    // Whether the seeder can be updated
    bool public isSeederLocked;

    // The noun seeds
    mapping(uint256 => IRoboNounsSeeder.Seed) public seeds;

    // The internal noun ID tracker
    uint256 private _currentNounId;

    // IPFS content hash of contract-level metadata
    string private _contractURIHash = "QmNPz2kfXLJwYo1AFQnmu6EjeXraz2iExvCSbENqwr5aFy";

    // OpenSea's Proxy Registry
    // IProxyRegistry public immutable proxyRegistry; removed for mumbai testing purposes

    /**
     * @notice Require that the minter has not been locked.
     */
    modifier whenMinterNotLocked() {
        require(!isMinterLocked, "Minter is locked");
        _;
    }

    /**
     * @notice Require that the descriptor has not been locked.
     */
    modifier whenDescriptorNotLocked() {
        require(!isDescriptorLocked, "Descriptor is locked");
        _;
    }

    /**
     * @notice Require that the seeder has not been locked.
     */
    modifier whenSeederNotLocked() {
        require(!isSeederLocked, "Seeder is locked");
        _;
    }

    // removed for mumbai testing purposes
    // /**
    //  * @notice Require that the sender is the nouns DAO.
    //  */
    // modifier onlyNounsDAO() {
    //     require(msg.sender == nounsDAO, "Sender is not the nouns DAO");
    //     _;
    // }

    /**
     * @notice Require that the sender is the minter.
     */
    modifier onlyMinter() {
        require(msg.sender == minter, "Sender is not the minter");
        _;
    }

    constructor(
        // address _ownersContract, // for mumbai testing purposes
        // address _nounsDAO, // for mumbai testing purposes
        // IProxyRegistry _proxyRegistry // for mumbai testing purposes
        address _minter,
        IRoboNounsDescriptor _descriptor,
        IRoboNounsSeeder _seeder
    ) ERC721("RoboNouns", "RoboNouns") {
        // ownersContract = _ownersContract; // for mumbai testing purposes
        // nounsDAO = _nounsDAO; // for mumbai testing purposes
        // proxyRegistry = _proxyRegistry; // for mumbai testing purposes
        minter = _minter;
        descriptor = _descriptor;
        seeder = _seeder;
    }

    /**
     * @notice The IPFS URI of contract-level metadata.
     */
    function contractURI() public view returns (string memory) {
        return string(abi.encodePacked("ipfs://", _contractURIHash));
    }

    /**
     * @notice Set the _contractURIHash.
     * @dev Only callable by the owner.
     */
    function setContractURIHash(string memory newContractURIHash) external onlyOwner {
        _contractURIHash = newContractURIHash;
    }

    /**
     * @notice Override isApprovedForAll to whitelist user's OpenSea proxy accounts to enable gas-less listings.
     */
    function isApprovedForAll(address owner, address operator) public view override(IERC721, ERC721) returns (bool) {
        // Whitelist OpenSea proxy contract for easy trading.
        // if (proxyRegistry.proxies(owner) == operator) { // for mumbai testing purposes
        //     return true;
        // }
        return super.isApprovedForAll(owner, operator);
    }

    /**
     * @notice Mint a RoboNoun to the minter, along with a possible owners and NounsDAO reward.
     * Owners reward RoboNouns are minted every 10 RoboNouns,
     * @dev Call _mintTo with the to address(es).
     */
    function mint(uint256 blockNumber) public override onlyMinter returns (uint256) {
        // if (_currentNounId <= 175300 && _currentNounId % 10 == 0) {
        //     _mintTo(ownersContract, _currentNounId++, blockNumber);
        // } // for mumbai testing purposes

        // if (_currentNounId <= 175301 && _currentNounId % 10 == 1) {
        //     _mintTo(nounsDAO, _currentNounId++, blockNumber);
        // } // for mumbai testing purposes

        return _mintTo(minter, _currentNounId++, blockNumber);
    }

    /**
     * @notice Burn a roboNoun.
     */
    function burn(uint256 nounId) public override onlyMinter {
        _burn(nounId);
        emit NounBurned(nounId);
    }

    /**
     * @notice A distinct Uniform Resource Identifier (URI) for a given asset.
     * @dev See {IERC721Metadata-tokenURI}.
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "RoboNounsToken: URI query for nonexistent token");
        return descriptor.tokenURI(tokenId, seeds[tokenId]);
    }

    /**
     * @notice Similar to `tokenURI`, but always serves a base64 encoded data URI
     * with the JSON contents directly inlined.
     */
    function dataURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "RoboNounsToken: URI query for nonexistent token");
        return descriptor.dataURI(tokenId, seeds[tokenId]);
    }

    // removed for mumbai testing purposes
    // /**
    //  * @notice Set the nouns DAO.
    //  * @dev Only callable by the nouns DAO when not locked.
    //  */
    // function setNounsDAO(address _nounsDAO) external override onlyNounsDAO {
    //     nounsDAO = _nounsDAO;

    //     emit NounsDAOUpdated(_nounsDAO);
    // }

    /**
     * @notice Set the token minter.
     * @dev Only callable by the owner when not locked.
     */
    function setMinter(address _minter) external override onlyOwner whenMinterNotLocked {
        minter = _minter;

        emit MinterUpdated(_minter);
    }

    /**
     * @notice Lock the minter.
     * @dev This cannot be reversed and is only callable by the owner when not locked.
     */
    function lockMinter() external override onlyOwner whenMinterNotLocked {
        isMinterLocked = true;

        emit MinterLocked();
    }

    /**
     * @notice Set the token URI descriptor.
     * @dev Only callable by the owner when not locked.
     */
    function setDescriptor(IRoboNounsDescriptor _descriptor) external override onlyOwner whenDescriptorNotLocked {
        descriptor = _descriptor;

        emit DescriptorUpdated(_descriptor);
    }

    /**
     * @notice Lock the descriptor.
     * @dev This cannot be reversed and is only callable by the owner when not locked.
     */
    function lockDescriptor() external override onlyOwner whenDescriptorNotLocked {
        isDescriptorLocked = true;

        emit DescriptorLocked();
    }

    /**
     * @notice Set the token seeder.
     * @dev Only callable by the owner when not locked.
     */
    function setSeeder(IRoboNounsSeeder _seeder) external override onlyOwner whenSeederNotLocked {
        seeder = _seeder;

        emit SeederUpdated(_seeder);
    }

    /**
     * @notice Lock the seeder.
     * @dev This cannot be reversed and is only callable by the owner when not locked.
     */
    function lockSeeder() external override onlyOwner whenSeederNotLocked {
        isSeederLocked = true;

        emit SeederLocked();
    }

    /**
     * @notice Mint a Noun with `nounId` to the provided `to` address.
     */
    function _mintTo(address to, uint256 nounId, uint256 blockNumber) internal returns (uint256) {
        IRoboNounsSeeder.Seed memory seed = seeds[nounId] = seeder.generateSeed(nounId, descriptor, blockNumber);

        _mint(owner(), to, nounId);
        emit NounCreated(nounId, seed);

        return nounId;
    }
}
