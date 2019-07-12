pragma solidity ^0.5.0;


import "./SafeMath.sol";


contract ServiceClaim {

    Claim claim;
    bytes32 insurerID;
    bytes32 providerID;
    bytes32 patientID;
    
    uint storedData;

    uint256 claimId;

    mapping (uint256=>Service) serviceMap;
    mapping (uint256=>Claim) claimMap;

    struct Service {
        uint256 id;
        string name;
        bytes32 providerID;
    }

    struct Claim {
        uint256 id;
        uint256 amount;
        Service service;
        bool verified;
        bool paid;
    }

    constructor(bytes32 _insID, bytes32 _proID, bytes32 _patID, uint256 _id, string memory _name, bytes32 _providerID) public {
        insurerID = _insID;
        providerID = _proID;
        patientID = _patID;
        Service memory newService = Service(_id, _name, _providerID);
        claim = new Claim(_id, 0, newService, false, false);
        //return claim;
    }


    // ------------------------------ Functionality of the Network --------------------------- //



}
