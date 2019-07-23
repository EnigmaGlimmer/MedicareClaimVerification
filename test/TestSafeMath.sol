pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";


import "../contracts/SafeMath.sol";

contract TestSafeMath {
    using SafeMath for uint256;

    function unsafeSubtract() public returns (uint256) {
        uint256 a = 0;
        a = a-1;
        Assert.isFalse(false, "NICE");
        return(a);

    }

    function safeSubtract() public returns (uint256) {
        uint256 a = 0;
        a.sub(1);
        uint256 b = uint256(-1);
        Assert.equal(a,b, "They are equal");
        return(a);
    }
}
