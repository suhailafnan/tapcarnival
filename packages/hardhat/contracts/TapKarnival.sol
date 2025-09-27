// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract TapKarnival is Ownable {
    event GamePlayed(address indexed player, uint256 score, uint256 timestamp);

    constructor() Ownable(msg.sender) {}

    function playGame(uint256 score) external payable {
        // For the hackathon, we can use a fixed stake.
        // require(msg.value == 0.01 ether, "Invalid stake amount"); 
        emit GamePlayed(msg.sender, score, block.timestamp);
    }
}
