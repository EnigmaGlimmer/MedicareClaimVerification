pragma solidity ^0.5.0;

import "./SafeMath.sol";

contract ServiceClaim {

    // Entity Information
    bytes32 public insurerID;
    bytes32 public providerID;
    bytes32 public patientID;

    // ServiceClaim Information
    bytes32 public serviceClaimID;
    string public name;
    uint256 public amount;
    bool public verified;
    bool public paid;
    uint256 public timeProvided;
    uint256 public timeFiled;
    uint256 public timeVerified;


    event ClaimAdded(uint256 amount, uint256 _timeProvided);


    constructor(bytes32 _proID, bytes32 _patID, bytes32 _id, string memory _name, uint256 _timeProvided) public {
        providerID = _proID;
        patientID = _patID;
        serviceClaimID = _id;
        name = _name;
        timeProvided = _timeProvided;
    }

    // ------------------------------ Functionality of the Network --------------------------- //

    function fileClaim(uint256 _amount, uint256 _timeFiled) public returns(uint256) {
        timeFiled = _timeFiled;
        amount = _amount;
        emit ClaimAdded(amount, timeFiled);
        return amount;
    }

    function verifyClaim(uint256 _timeVerified) public returns(bool verifySuccess) {
        timeVerified = _timeVerified;
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
