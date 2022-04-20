//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "hardhat/console.sol";

contract Blue is Ownable, ERC721Enumerable {

    string public _baseTokenURI;
    string blueTokenURI = "https://gateway.pinata.cloud/ipfs/QmNeiZxZTZHkUuAH1EUZtgDXZcfXr9PoNk1WFYXdmCNYrx/Blue.json";

    constructor() ERC721("Complexion", "X-BLUE") {
    }

    using Strings for uint256;
    // Optional mapping for token URIs
    mapping(uint256 => string) private _tokenURIs;
    mapping(uint256 => address) private _owners;

    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
        require(_exists(tokenId), "ERC721URIStorage: URI set of nonexistent token");
        _tokenURIs[tokenId] = _tokenURI;
    }

    function tokenURI(uint256 tokenId) override public view returns (string memory) {
        return blueTokenURI;
    }

    function mintWinner(address _minter) external onlyOwner{
        uint tokenId = totalSupply();
        _safeMint(_minter, tokenId);
    }

    function burn(uint256 tokenId) public virtual {
        require(msg.sender == ownerOf(tokenId), "You are not the owner");
        _burn(tokenId);
    }
}

