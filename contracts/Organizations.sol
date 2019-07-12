pragma solidity ^0.5.0;

import "./SafeMath.sol";
import "./ServiceClaim.sol";

contract Organizations {
    
    uint storedData;

    event ClaimCreated(uint256 id, uint256 amount, uint256 service, bytes32 patient);
    event PatientCreated(bytes32 id, string name);
    event ProviderCreated(bytes32 id, string name);
    event InsurerCreated(bytes32 id, string name);

    uint256 claimId;

    //Patient[] patients;
    //Provider[] providers;
    Insurer[] insurers;

    mapping (bytes32=>Patient) patientMap;
    mapping (bytes32=>Provider) providerMap;
    mapping (bytes32=>Insurer) insurerMap;

    mapping (bytes32=>address) claimsMap;

    struct Patient {
        bytes32 id;
        string name;
        address[] claimsList;
        //Service[] services;
        //Claim[] claims;
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


    // ------------------------------ Adds Users to Network --------------------------- //
    function addPatient(string memory _name) public returns(bytes32 pID) {
        bytes32 id = keccak256(abi.encodePacked(_name));
        //Service[] memory serviceList;
        address[] memory claimList;
        Patient memory newPatient = Patient(id, _name, claimList);
        bytes32 patientHash = keccak256(abi.encodePacked(newPatient));
        patientMap[patientHash] = newPatient;
        //patients.push(newPatient);
        emit PatientCreated(id, _name);
        return id;
    }

    function addProvider(string memory _name) public returns(bytes32 pID) {
        bytes32 id = keccak256(abi.encodePacked(_name));
        Patient[] memory emptyList;
        Provider memory newProvider = Provider(id, _name, emptyList);
        providers.push(newProvider);
        emit ProviderCreated(id, _name);
        return id;
    }

    function addInsurer(string memory _name) public returns(bytes32 pID) {
        bytes32 id = keccak256(abi.encodePacked(_name));
        Provider[] memory emptyList;
        Insurer memory newInsurer = Insurer(id, _name, emptyList);
        insurers.push(newInsurer);
        emit InsurerCreated(id, _name);
        return id;
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

    // insurer, provider, patient, serviceProvided
    // put address in claimsMap and patients claimList
    function newServiceClaim(string _name, bytes32 _insurerID, bytes32 _providerID, bytes32 _patientID) public {
        uint256 id = uint(keccak256(abi.encodePacked(_name)));
        ServiceClaim storage serviceClaim = ServiceClaim(_insurerID, _providerID, _patientID, id, _name, _providerID);
        bytes32 serviceClaimHash = keccak256(abi.encodePacked(serviceClaim));
        claimsMap[serviceClaimHash] = address(serviceClaim);
    }

    //REMOVE THIS FUNCTION AND ADD TO ORGANIZATIONS.SOL????
    function verifyClaim(bytes32 _pID, uint256 _cID) public {
        //Check if claim was provided to the Patient
        ClaimVerification.Claim storage claim = claimMap[_cID];
        claim.verified = true;
    }

    //REMOVE THIS FUNCTION AND ADD TO ORGANIZATIONS.SOL????
    function payProvider(uint256 _pID, uint256 _amount) public {
        Provider storage provider = providers[_pID];
        return(provider);
    }

}