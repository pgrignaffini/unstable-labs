// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

contract VialNFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    mapping(uint256 => string) public tokenURIs;
    uint vialPrice = 0.0001 ether;
    address private marketplaceAddress;

    struct NFTData {
        uint256 tokenId;
        string tokenURI;
    }

    event VialMinted(uint256 indexed tokenId, string tokenURI);
    event VialBurned(uint256 indexed tokenId);

    constructor(address _marketplaceAddress) ERC721("UnstableVials", "UVIALS") {
        marketplaceAddress = _marketplaceAddress;
    }

    function getVialPrice() public view returns (uint) {
        return vialPrice;
    }

    function mintVials(string memory tokenURI, uint256 number) public payable {
        require(msg.value >= vialPrice * number, "Not enough ETH");
        for (uint256 i = 0; i < number; i++) {
            mintVial(tokenURI);
        }
        // transfer ETH to marketplace
        payable(marketplaceAddress).transfer(msg.value);
    }

    function mintVial(string memory tokenURI) internal returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _safeMint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        tokenURIs[newItemId] = tokenURI;

        emit VialMinted(newItemId, tokenURI);
        return newItemId;
    }

    function getTokenURI(uint256 tokenId) public view returns (string memory) {
        return tokenURIs[tokenId];
    }

    function getTokenURIs(uint256[] memory tokenIds)
        public
        view
        returns (NFTData[] memory)
    {
        NFTData[] memory uris = new NFTData[](tokenIds.length);
        for (uint256 i = 0; i < tokenIds.length; i++) {
            uris[i] = NFTData(tokenIds[i], tokenURIs[tokenIds[i]]);
        }
        return uris;
    }

    function burnVial(uint256 tokenId) public {
        transferFrom(msg.sender, address(0x0000dead), tokenId);
        emit VialBurned(tokenId);
    }

    function getVialsOwnedByMe() public view returns (uint256[] memory) {
        uint256 numberOfExistingTokens = _tokenIds.current();
        uint256 numberOfTokensOwned = balanceOf(msg.sender);
        uint256[] memory ownedTokenIds = new uint256[](numberOfTokensOwned);

        uint256 currentIndex = 0;
        for (uint256 i = 0; i < numberOfExistingTokens; i++) {
            uint256 tokenId = i + 1;
            if (ownerOf(tokenId) != msg.sender) continue;
            ownedTokenIds[currentIndex] = tokenId;
            currentIndex += 1;
        }

        return ownedTokenIds;
    }
}
