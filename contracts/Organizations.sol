pragma solidity ^0.5.0;

contract Organizations {
    
    uint storedData;

    event ClaimCreated(uint256 id, uint256 amount, uint256 service, bytes32 patient);
    event PatientCreated();
    event ProviderCreated();
    event InsurerCreated();

    uint256 claimId;

    //Patient[] patients;
    //Provider[] providers;
    Insurer[] insurers;

    //mapping (uint256=>Service) serviceMap;
    //mapping (uint256=>Claim) claimMap;
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

}