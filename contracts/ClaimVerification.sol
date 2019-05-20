pragma solidity ^0.5.0;

contract ClaimVerification {
    uint storedData;

    event ClaimCreated(uint256 id, uint256 amount, uint256 service, bytes32 patient);
    uint256 claimId = 0;

    Patient[] patients;
    Provider[] providers;
    Insurer[] insurers;

    mapping (uint256=>string) serviceMap;
    mapping (uint256=>Claim) claimMap;
    mapping (bytes32=>Patient) patientMap;

    struct Claim {
        uint256 id;
        uint256 amount;
        string service;
        bool verified;
    }

    struct Patient {
        bytes32 id;
        string name;
        uint256[] services;
    }


    struct Provider {
        bytes32 id;
        string name;
        Patient[] patients;
    }

    struct Insurer {
        bytes32 id;
        string name;
        Provider[] providers;
    }


    function addClaim(uint256 _amount, uint256 _service, bytes32 _patient) public returns(uint256 ClaimID) {
        Claim memory newClaim = Claim(claimId++, _amount, serviceMap[_service], false);
        Patient storage cPatient = patientMap[_patient];
        cPatient.services.push(newClaim.id);
        emit ClaimCreated(claimId, _amount, _service, _patient);
        return newClaim.id;
    }

    function addPatient(string memory _name) public returns(bytes32 pID) {
        bytes32 id = keccak256(abi.encodePacked(_name));
        uint256[] memory emptyList;
        Patient memory newPatient = Patient(id, _name, emptyList);
        patients.push(newPatient);
        return id;
    }

    function addProvider(string memory _name) public returns(bytes32 pID) {
        bytes32 id = keccak256(abi.encodePacked(_name));
        Patient[] memory emptyList;
        Provider memory newProvider = Provider(id, _name, emptyList);
        providers.push(newProvider);
        return id;
    }

    function addInsurer(string memory _name) public returns(bytes32 pID) {
        bytes32 id = keccak256(abi.encodePacked(_name));
        Provider[] memory emptyList;
        Insurer memory newInsurer = Insurer(id, _name, emptyList);
        insurers.push(newInsurer);
        return id;
    }


    function verifyClaim(bytes32 _pID, uint256 _cID) public {
        //Check if claim was provided to the Patient
        ClaimVerification.Claim storage claim = claimMap[_cID];
        claim.verified = true;
        //Pay Patient for verfiying
    }





}
