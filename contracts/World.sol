//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./PerlinNoise.sol";

contract World is ERC721 {
    string private seed;
    
    struct Coords {
        int128 x;
        int128 y;
    }

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

    function mintParcel(int128 x, int128 y ) public payable{
        require(msg.value >= 1 ether, "Price for minting is 1 ETH");
        uint256 parcelId = uint256(int256(x) << 128 | y); //concat x and y into one number
        require(!_exists(parcelId), "Parcel already exists");
        _safeMint(msg.sender, parcelId);
        console.log('Parcel',parcelId,'has been minted');
    }

    function noise(int128 x, int128 y) public pure returns(int256) {
        return PerlinNoise.noise2d(x,y); // calculate noise;
    }

        // lerp, fade, grad2, ptable, ftable, noise2d debug
    function lerp(int256 x, int256 y, int256 z) public pure returns(int256) {
        return PerlinNoise.lerp(x,y,z);
    }

    function fade(int256 x) public pure returns(int256) {
        return PerlinNoise.fade(x);
    }    

    function grad2(int256 x, int256 y, int256 z) public pure returns(int256) {
        return PerlinNoise.grad2(x,y,z);
    }

    function ptable(int256 x) public pure returns(int256) {
        return PerlinNoise.ptable(x);
    }
    
    function ftable(int256 x) public pure returns(int256) {
        return PerlinNoise.ftable(x);
    }
}