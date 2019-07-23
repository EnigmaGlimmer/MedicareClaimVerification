pragma solidity ^0.5.0;

import "./SafeMath.sol";

contract ServiceClaim {

    // Entity Information
    bytes32 insurerID;
    bytes32 providerID;
    bytes32 patientID;

    // ServiceClaim Information
    bytes32 serviceClaimID;
    string name;
    uint256 amount;
    bool verified;
    bool paid;


    constructor(bytes32 _proID, bytes32 _patID, bytes32 _id, string memory _name) public {
        providerID = _proID;
        patientID = _patID;
        serviceClaimID = _id;
        name = _name;
    }

    // ------------------------------ Functionality of the Network --------------------------- //

    function addClaim(uint256 _amount) public returns(uint256) {
        amount = _amount;
        return amount;
    }

    function verifyClaim() public returns(bool verifySuccess) {
        verified = true;
        return true;
    }

    function payProvider() public returns(bool paySuccess) {
        paid = true;
        return true;
    }


    // -------------------------------- Getters ----------------------------------------- // 
    function getAmount() public view returns (uint256){
        return amount;
    }
}
