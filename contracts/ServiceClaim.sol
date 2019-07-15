pragma solidity ^0.5.0;


import "./SafeMath.sol";


contract ServiceClaim {

    Claim claim;
    bytes32 insurerID;
    bytes32 providerID;
    bytes32 patientID;

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
        claim = Claim(_id, 0, newService, false, false);
        //return claim;
    }


    // ------------------------------ Functionality of the Network --------------------------- //

    function provideService(uint256 _id, string memory _name) public returns(uint256 serviceID) {
        //string memory name = string(_name);
        Service memory newService = Service(_id, _name);
        return newService.id;
    }

    //REMOVE THIS FUNCTION COMPLETELY???
    //This function does not do anything other than create a new claim which is already done 
    //by the constructor, I think we should turn this into a modifier type function
    function addClaim(uint256 _amount, uint256 _service, bytes32 _patient) public returns(uint256 ClaimID) {
        Claim memory newClaim = Claim(claimId++, _amount, serviceMap[_service], false, false);
        cPatient = patientMap[_patient];
        cPatient.claims.push(newClaim);
        emit ClaimCreated(claimId, _amount, _service, _patient);
        return newClaim.id;
    }

    function verifyClaim(bytes32 _pID, uint256 _cID) public {
        //Check if claim was provided to the Patient
        claim = claimMap[_cID];
        claim.verified = true;
    }
}
