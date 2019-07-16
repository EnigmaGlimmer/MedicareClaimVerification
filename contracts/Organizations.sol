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

    mapping (bytes32=>Patient) patientMap;
    mapping (bytes32=>Provider) providerMap;
    mapping (bytes32=>Insurer) insurerMap;

    mapping (bytes32=>address) serviceClaimsMap;

    struct Patient {
        bytes32 id;
        string name;
        address[] serviceClaimsList;
    }

    struct Provider {
        bytes32 id;
        string name;
        bytes32[] patients;
    }

    struct Insurer {
        bytes32 id;
        string name;
        bytes32[] providers;
    }

    // ------------------------------ Adds Users to Network --------------------------- //
    function addPatient(string memory _name, bytes32 _providerID) public returns(bytes32 pID) {
        bytes32 id = keccak256(abi.encodePacked(_name));
        address[] memory claimList;
        Patient memory newPatient = Patient(id, _name, claimList);
        //bytes32 patientHash = keccak256(abi.encodePacked(newPatient));
        patientMap[id] = newPatient;
        providerMap[_providerID].patients.push(newPatient.id);
        emit PatientCreated(id, _name);
        return id;
    }

    function addProvider(string memory _name, bytes32 _insurerID) public returns(bytes32 pID) {
        bytes32 id = keccak256(abi.encodePacked(_name));
        bytes32[] memory emptyList;
        Provider memory newProvider = Provider(id, _name, emptyList);
        //bytes32 providerHash = keccak256(abi.encodePacked(newProvider));
        providerMap[id] = newProvider;
        insurerMap[_insurerID].providers.push(newProvider.id);
        emit ProviderCreated(id, _name);
        return id;
    }

    function addInsurer(string memory _name) public returns(bytes32 pID) {
        bytes32 id = keccak256(abi.encodePacked(_name));
        bytes32[] memory emptyList;
        Insurer memory newInsurer = Insurer(id, _name, emptyList);
        //bytes32 insurerHash = keccak256(abi.encodePacked(newInsurer));
        insurerMap[id] = newInsurer;
        emit InsurerCreated(id, _name);
        return id;
    }

    // ------------------------------ Functionality of the Network --------------------------- //

    function addClaim(bytes32 _serviceClaimID, uint256 _amount, uint256 _service, bytes32 _patient) public returns(uint256 ClaimID) {
        Patient storage cPatient = patientMap[_patient];
        ServiceClaim myServiceClaim = ServiceClaim(serviceClaimsMap[_serviceClaimID]);
        uint256 newClaimID = myServiceClaim.addClaim(claimId++,_amount);
        emit ClaimCreated(newClaimID, _amount, _service, _patient);
        return newClaimID;
    }

    function newServiceClaim(string memory _name, bytes32 _providerID, bytes32 _patientID) public returns(bytes32 serviceContractHash) {
        uint256 id = uint(keccak256(abi.encodePacked(_name)));
        ServiceClaim serviceClaim = new ServiceClaim(_providerID, _patientID, id, _name);
        bytes32 serviceClaimID = keccak256(abi.encodePacked(address(serviceClaim)));
        serviceClaimsMap[serviceClaimID] = address(serviceClaim);
        Patient storage patient = patientMap[_patientID];
        patient.serviceClaimsList.push(address(serviceClaim));
        return serviceClaimID;
    }

    function payProvider(ServiceClaim _serviceClaim) internal {
        //require(_serviceClaim.claim().verified == true, "User has not verified service");
        _serviceClaim.payProvider();
    }

    function verifyClaim(bytes32 _serviceClaimID) public {
        ServiceClaim myServiceClaim = ServiceClaim(serviceClaimsMap[_serviceClaimID]);
        myServiceClaim.verifyClaim();
        payProvider(myServiceClaim);
    }
    
}