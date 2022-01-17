//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract World is ERC721 {
    string private seed;

    constructor(string memory _seed) ERC721("World","World") {
        console.log("Deploying a World with seed:", _seed);
        seed = _seed;
    }

    // ------ Demo functions
    function getSeed() public view returns (string memory) {
        return seed;
    }

    function setSeed(string memory _seed) public {
        console.log("Changing seed from '%s' to '%s'", seed, _seed);
        seed = _seed;
    }
    // ------ End

    function mintParcel(uint256 parcelId ) public payable{
        require(!_exists(parcelId), "Parcel already exists");
        require(msg.value >= 1 ether, "Price for minting is 1 ETH");
        _safeMint(msg.sender, parcelId);
        console.log('Parcel',parcelId,'has been minted');
    }
}