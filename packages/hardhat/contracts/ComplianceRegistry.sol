// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract ComplianceRegistry is Ownable {
    mapping(address => bool) public isKYCd;

    event KYCUpdated(address indexed user, bool approved);

    constructor(address initialOwner) Ownable(initialOwner) {}

    function setKYC(address user, bool ok) external onlyOwner {
        isKYCd[user] = ok;
        emit KYCUpdated(user, ok);
    }

    function checkTransfer(address from, address to) external view returns (bool) {
        return isKYCd[from] && isKYCd[to];
    }
}
