
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract TapKarnival is Ownable {
    event GamePlayed(address indexed player, uint256 score, uint256 timestamp);
    event NewHighScore(address indexed player, uint256 score);
    event EntryFeeUpdated(uint256 fee);
    event FeesWithdrawn(address indexed to, uint256 amount);
    event PrizeClaimed(address indexed winner, uint256 amount);

    uint256 public entryFee;            // e.g., 0.01 ether on Kadena EVM [web:506]
    uint256 public feesAccrued;         // 4% commission accumulated [web:500]
    uint256 public prizePool;           // 96% prize pool [web:500]

    // Simple best-score leaderboard
    mapping(address => uint256) public bestScore;
    address public currentLeader;
    uint256 public currentTopScore;

    constructor(uint256 _entryFee, address initialOwner) Ownable(initialOwner) {
        entryFee = _entryFee;
    }

    function setEntryFee(uint256 _fee) external onlyOwner {
        entryFee = _fee;
        emit EntryFeeUpdated(_fee);
    }

    function playGame(uint256 score) external payable {
        require(msg.value >= entryFee, "Entry fee required");                          // [web:506]
        // split 4% fee / 96% prize
        uint256 feeCut = (msg.value * 4) / 100;                                        // 4% [web:500]
        uint256 toPrize = msg.value - feeCut;
        feesAccrued += feeCut;
        prizePool += toPrize;

        emit GamePlayed(msg.sender, score, block.timestamp);

        // update personal best & leader
        if (score > bestScore[msg.sender]) {
            bestScore[msg.sender] = score;
            emit NewHighScore(msg.sender, score);
        }
        if (score > currentTopScore) {
            currentTopScore = score;
            currentLeader = msg.sender;
        }
    }

    // Winner pulls prize; resets pool and top score for next round.
    function claimPrize() external {
        require(msg.sender == currentLeader && currentTopScore > 0, "Not leader");
        uint256 amount = prizePool;
        require(amount > 0, "No prize");
        // effects
        prizePool = 0;
        currentTopScore = 0;
        currentLeader = address(0);
        // interactions
        (bool ok, ) = msg.sender.call{value: amount}("");
        require(ok, "Prize transfer failed");                                         // [web:500]
        emit PrizeClaimed(msg.sender, amount);
    }

    // Owner withdraws collected fees using pull-like explicit action.
    function withdrawFees(address payable to) external onlyOwner {
        uint256 amount = feesAccrued;
        require(amount > 0, "No fees");
        feesAccrued = 0;
        (bool ok, ) = to.call{value: amount}("");
        require(ok, "Fee transfer failed");                                           // [web:500]
        emit FeesWithdrawn(to, amount);
    }

    // Views to help the frontend
    function getLeader() external view returns (address leader, uint256 topScore, uint256 pool) {
        return (currentLeader, currentTopScore, prizePool);
    }
}
