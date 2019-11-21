pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import "./SafeMath.sol";
import "./ServiceClaim.sol";
import "./AEECToken.sol";
import "./Organizations.sol";


contract Insurer {

    bytes32 id;
    string name;
    address[] providers;

    AEECToken public token;

    constructor(address _tokenAddr) public {
        // preLoadInfo();
        token = AEECToken(_tokenAddr);
        token._mint(address(this),1000000);
    }

    



}