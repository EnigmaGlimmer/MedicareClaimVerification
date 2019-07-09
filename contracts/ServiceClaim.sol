pragma solidity ^0.5.0;

contract ClaimVerification {
    
    uint storedData;

    uint256 claimId;

    mapping (uint256=>Service) serviceMap;
    mapping (uint256=>Claim) claimMap;
    //mapping (bytes32=>Patient) patientMap;
    //mapping (bytes32=>Provider) providerMap;
    //mapping (bytes32=>Insurer) insurerMap;


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


    Claim claim;

    constructor(uint256 _id, string memory _name, bytes32 _providerID) public {
        Service memory newService = Service(_id, _name, _providerID);
        claim = new Claim(_id, 0, newService, false, false);
        //return claim;
    }


    // ------------------------------ Functionality of the Network --------------------------- //

    function provideService(uint256 _id, string memory _name) public returns(uint256 serviceID) {
        //string memory name = string(_name);
        Service memory newService = Service(_id, _name);
        return newService.id;
    }


    function addClaim(uint256 _amount, uint256 _service, bytes32 _patient) public returns(uint256 ClaimID) {
        Claim memory newClaim = Claim(claimId++, _amount, serviceMap[_service], false);
        Patient storage cPatient = patientMap[_patient];
        cPatient.claims.push(newClaim);
        emit ClaimCreated(claimId, _amount, _service, _patient);
        return newClaim.id;
    }

    function verifyClaim(bytes32 _pID, uint256 _cID) public {
        //Check if claim was provided to the Patient
        ClaimVerification.Claim storage claim = claimMap[_cID];
        claim.verified = true;
    }


    function payProvider(uint256 _pID, uint256 _amount) public {
        Provider storage provider = providers[_pID];
        return(provider);
    }

}
