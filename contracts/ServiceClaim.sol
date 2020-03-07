pragma solidity ^0.5.0;

import "./SafeMath.sol";
import "./Patient.sol";

contract ServiceClaim {

    // Entity Information
    address public insurerAddr;
    address public providerAddr;
    address public patientAddr;

    // ServiceClaim Information
    bytes32 public serviceClaimID;
    string public name;
    uint256 public amount;
    bool public confirmed;
    // bool public paid;
    uint256 public timeProvided;
    uint256 public timeFiled;
    uint256 public timeVerified;

    event Instantiated(bool);


    event ClaimAdded(uint256 amount, uint256 _timeFiled);


    constructor(address _insAddr, address _proAddr, address _patAddr, bytes32 _id, string memory _name, uint256 _timeProvided) public {
        insurerAddr = _insAddr;
        providerAddr = _proAddr;
        patientAddr = _patAddr;
        serviceClaimID = _id;
        name = _name;
        emit Instantiated(true);
        timeProvided = _timeProvided;
    }

    // ------------------------------ Functionality of the Network --------------------------- //

    function file(uint256 _amount, uint256 _timeFiled) public returns(uint256) {
        timeFiled = _timeFiled;
        amount = _amount;
        emit ClaimAdded(amount, timeFiled);
        return amount;
    }

    function verify(uint256 _timeVerified, bool _confirmed) public returns(bool verifySuccess) {
        timeVerified = _timeVerified;
        confirmed = _confirmed;
        return true;
    }

    // function payProvider() public returns(bool paySuccess) {
    //     paid = true;
    //     return true;
    // }


    // -------------------------------- Getters ----------------------------------------- //
    function getAmount() public view returns (uint256){
        return amount;
    }

    function isVerified() public view returns (bool) {
        return confirmed;
    }

    function getPatientAddress() public view returns (address) {
        return patientAddr;
    }

    function getProv() public view returns (address){
        return providerAddr;
    }

    function getPat() public view returns (address){
        return patientAddr;
    }
    function getIns() public view returns (address){
        return insurerAddr;
    }
    function getName() public view returns (string memory){
        return name;
    }

    function getPatName() public view returns(string memory) {
        Patient p = Patient(patientAddr);
        string memory n = p.getName();
        return n;
    }

    // function isVerified() public view returns (bool){
    //     return verified;
    // }

    // function isPaid() public view returns (bool){
    //     return paid;
    // }


    // -------------------------------- Update ----------------------------------------- //
    // function updateAmount(uint256 _amount) public returns (uint256) {
    //     amount = _amount;
    //     return amount;
    // }

    // function updateInsurer(bytes32 _id) public returns (bytes32) {
    //     insurerID = _id;
    //     return insurerID;
    // }
    // function updateProvider(bytes32 _id) public returns (bytes32) {
    //     providerID = _id;
    //     return providerID;
    // }
    // function updatePatient(bytes32 _id) public returns (bytes32) {
    //     patientID = _id;
    //     return patientID;
    // }
}