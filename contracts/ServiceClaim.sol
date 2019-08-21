pragma solidity ^0.5.0;

import "./SafeMath.sol";

contract ServiceClaim {

    // Entity Information
    bytes32 public insurerID;
    bytes32 public providerID;
    bytes32 public patientID;

    // ServiceClaim Information
    bytes32 serviceClaimID;
    string name;
    uint256 amount;
    bool verified;
    bool paid;


    event ClaimAdded(uint256 amount);


    constructor(bytes32 _proID, bytes32 _patID, bytes32 _id, string memory _name) public {
        providerID = _proID;
        patientID = _patID;
        serviceClaimID = _id;
        name = _name;
    }

    // ------------------------------ Functionality of the Network --------------------------- //

    function fileClaim(uint256 _amount) public returns(uint256) {
        amount = _amount;
        emit ClaimAdded(amount);
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

    function isVerified() public view returns (bool){
        return verified;
    }

    function isPaid() public view returns (bool){
        return paid;
    }


    // -------------------------------- Update ----------------------------------------- //
    function updateAmount(uint256 _amount) public returns (uint256) {
        amount = _amount;
        return amount;
    }

    function updateInsurer(bytes32 _id) public returns (bytes32) {
        insurerID = _id;
        return insurerID;
    }
    function updateProvider(bytes32 _id) public returns (bytes32) {
        providerID = _id;
        return providerID;
    }
    function updatePatient(bytes32 _id) public returns (bytes32) {
        patientID = _id;
        return patientID;
    }
}
