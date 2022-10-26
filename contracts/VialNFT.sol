// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

// TO DO: Explain the reason/advantadge to use ERC721URIStorage instead of ERC721 itself
contract VialNFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    address private marketplaceAddress;

    event VialMinted(
        uint256 indexed tokenId,
        string tokenURI
    );

    event VialBurned(uint256 indexed tokenId);

    constructor( address _marketplaceAddress) ERC721("UnstableVials", "UVIALS") {
        marketplaceAddress = _marketplaceAddress;
    }

    function mintVial(string memory tokenURI) public returns (uint256) {
        require(msg.sender == marketplaceAddress, "Only marketplace can mint");
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);

        emit VialMinted(newItemId, tokenURI);
        return newItemId;
    }

    function burnVial(uint256 tokenId) public {
        require(msg.sender == marketplaceAddress, "Only marketplace can burn");
        _burn(tokenId);
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
