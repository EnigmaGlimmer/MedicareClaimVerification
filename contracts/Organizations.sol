pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;


import "./SafeMath.sol";
import "./ServiceClaim.sol";

contract Organizations {

    uint admin;


    uint256 claimId; //Max value of the number of claims made
    uint storedData; //Miscellaneous data

    mapping (bytes32=>Patient) public patientMap; //ID of patient to specific provider -
    mapping (bytes32=>Provider) public providerMap; //ID of provider to specific provider -
    mapping (bytes32=>Insurer) public insurerMap; //ID of insurance provider to specific insurer
    mapping (bytes32=>address) public serviceClaimsMap; //ID of serviceClaim to the specific ServiceClaim contract instance
    mapping (address=>string) public serviceName;

    //Events for organization creation    event ServiceCreated(address serviceClaimAddr);
    event SCID(bytes32 ID, address addr);
    event ClaimCreated(uint256 id, uint256 amount);
    event ClaimVerified(address addr);
    event PatientCreated(bytes32 id, string name);
    event ProviderCreated(bytes32 id, string name);
    event InsurerCreated(bytes32 id, string name);
    event PatientRetrieval(Patient patient);
    event ProviderRetrieval(Provider provider);
    event ServiceClaimInfo(address addr, bytes32 id, bytes32 provider, bytes32 patient, uint256 amount, bool verified, bool payed);

    //event patientList(Patient[] patients);
    //event providerList(Provider[] providers);
    //event insurerList(Insurer[] insurers);

    event idList(bytes32[] ids);
    event serviceList(address[] services);
    event SCName(string name);
    event SCEvent(SC);

    struct SC {
        address scAddr;
        bytes32 id;
        bytes32 insurerID;
        bytes32 providerID;
        bytes32 patientID;
        string name;
        uint256 amount;
        bool verified;
        bool paid;
    }

    bytes32 globalInsurerID;
  
    SC[] scs;

    mapping (address=>string) SCMap;
    address[] SCList;


    struct Patient {
        bytes32 id;
        string name;
        //mapping (address=>string) SCMap;
        address[] unclaimedServices;
        address[] unverifiedClaims;
        address[] verifiedClaims;
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

    constructor() public {
        preLoadInfo();
    }

    // function stringToBytes32(string memory source) public returns (bytes32 result) {
    //     bytes memory tempEmptyStringTest = bytes(source);
    //     if (tempEmptyStringTest.length == 0) {
    //         return 0x0;
    //     }

    //     assembly {
    //         result := mload(add(source, 32))
    //     }
    // }



    function preLoadInfo() public{
        bytes32 insurerID = addInsurer("CMS");
        bytes32 providerID = addProvider("UCSD Medical", insurerID);
        addPatient("Ken", providerID);
        addPatient("Danny", providerID);
        addPatient("Antonio", providerID);
    }
    // ------------------------------ Adds Users to Network --------------------------- //

    /** @dev add a patient to the network
    @param _name is the name of the patient
    @param _providerID is the current provider of the patient
    @return pID is a bytes32 represented id number for the patient
    */
    function addPatient(string memory _name, bytes32 _providerID) public returns(bytes32 pID) {
        bytes32 id = keccak256(abi.encodePacked(_name));
        address[] memory uServiceList;
        address[] memory uClaimList;
        address[] memory vClaimList;
        Patient memory newPatient = Patient(id, _name, uServiceList, uClaimList, vClaimList);
        //bytes32 patientHash = keccak256(abi.encodePacked(newPatient));
        patientMap[id] = newPatient;
        providerMap[_providerID].patients.push(newPatient.id);
        emit PatientCreated(id, _name);
        return id;
    }

    /** @dev add a provider to the network
    @param _name name of the provider
    @param _insurerID id of insurance provider
    @return the pID of the health provider -
     */
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

    /** @dev add an insurnace provider to the network
    @param _name the name of the insurance provider
    @return pID of the insurance provider
    */
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

    /** @dev create an instance of a ServiceClaim contract
    @param _name name of the service
    @param _providerID provider ID
    @param _patientID patient ID
    @return serviceContractHash is the id of the ServiceClaim contract
    */
    function provideService(string memory _name, bytes32 _providerID, bytes32 _patientID) public returns(bytes32 serviceContractHash) {
        bytes32 id = keccak256(abi.encodePacked(_name, _providerID, _patientID));
        ServiceClaim serviceClaim = new ServiceClaim(_providerID, _patientID, id, _name);
        bytes32 serviceClaimID = keccak256(abi.encodePacked(address(serviceClaim)));
        SC memory scObj = SC(address(serviceClaim), serviceClaimID, globalInsurerID, _providerID, _patientID, _name, 0, false, false);
        scs.push(scObj);
        serviceClaimsMap[serviceClaimID] = address(serviceClaim);
        Patient storage patient = patientMap[_patientID];
        //patient.unverifiedClaims.push(address(serviceClaim));
        //SC memory newSC = SC(_name, address(serviceClaim));
        patient.unclaimedServices.push(address(serviceClaim));
        serviceName[address(serviceClaim)] = _name;
        SCMap[address(serviceClaim)] = _name;
        SCList.push(address(serviceClaim));
        emit SCID(serviceClaimID, address(serviceClaim));
        return serviceClaimID;
    }

    /** @dev add a claim to a ServiceClaim contract i.e. the provider wants to file a claim for a service rendered
    @param _serviceClaimID the ID of the ServiceClaim contract
    @param _amount the amount to be claimed by the provider
    @return ClaimID the ID of the claim
    */
    function fileClaim(bytes32 _serviceClaimID, uint256 _amount) public returns(uint256 ClaimID) {
        //Patient storage cPatient = patientMap[_patient];
        ServiceClaim myServiceClaim = ServiceClaim(serviceClaimsMap[_serviceClaimID]);
        uint256 newClaimID = myServiceClaim.fileClaim(_amount);

        bytes32 patID = myServiceClaim.patientID();
        Patient storage cP = patientMap[patID];

        for(uint i = 0; i < cP.unclaimedServices.length; i++){
            if(cP.unclaimedServices[i] == address(myServiceClaim)){
                delete(cP.unclaimedServices[i]);
                break;
            }
        }
        // string memory name = myServiceClaim.name();
        //SC memory newSC = SC(name, address(myServiceClaim));
        cP.unverifiedClaims.push(address(myServiceClaim));
        emit ClaimCreated(newClaimID, _amount);
        //emit SCEvent(newSC);
        return newClaimID;
    }
 
    /** @dev invoke the verifyClaim function in the ServiceClaim contract
    @param _serviceClaimID the id of the ServiceClaim contract
    */
    /** @dev invoke the verifyClaim function in the ServiceClaim contract
    @param _serviceClaimAddress the address of the ServiceClaim contract
    */
    function verifyClaim(address _serviceClaimAddress) public {
        ServiceClaim myServiceClaim = ServiceClaim(_serviceClaimAddress);
        require(myServiceClaim.verifyClaim(), "Claim was not Verified");
        // Add the claim address to verified list
        // Delete the claim address from unverified list
        bytes32 patID = myServiceClaim.patientID();
        Patient storage cP = patientMap[patID];

        for(uint i = 0; i < cP.unverifiedClaims.length; i++){
            if(cP.unverifiedClaims[i] == address(myServiceClaim)){
                delete(cP.unverifiedClaims[i]);
                break;
            }
        }
        //string memory name = myServiceClaim.name();
        //SC memory newSC = SC(name, address(myServiceClaim));
        cP.verifiedClaims.push(address(myServiceClaim));
        emit ClaimVerified(_serviceClaimAddress);
    }

    /** @dev invoke the payProvider function in the ServiceClaim contract
    @param _serviceClaimID the id of the ServiceClaim contract
    */
    function payProvider(bytes32 _serviceClaimID) public {
        //require(_serviceClaim.claim().verified == true, "User has not verified service");
        ServiceClaim myServiceClaim = ServiceClaim(serviceClaimsMap[_serviceClaimID]);
        myServiceClaim.payProvider();
    }



    // ------------------------------ Getters of Network Data --------------------------- //


    function patientsOfProvider(bytes32 _id) public returns (bytes32[] memory) {
        Provider storage cP = providerMap[_id];
        emit idList(cP.patients);
        return(cP.patients);
    }

    function providersOfInsurer(bytes32 _id) public returns (bytes32[] memory) {
        Insurer storage cI = insurerMap[_id];
        emit idList(cI.providers);
        return(cI.providers);
    }

    function getPatient(bytes32 _id) public returns (bool){
        Patient memory patient = patientMap[_id];
        emit PatientRetrieval(patient);
        return true;
    }

    function getProvider(bytes32 _id) public returns (Provider memory){
        Provider memory provider = providerMap[_id];
        emit ProviderRetrieval(provider);
        return providerMap[_id];
    }


    function patientUnclaimedServices(bytes32 _id) public returns (address[] memory){
        Patient storage cP = patientMap[_id];
        emit serviceList(cP.unclaimedServices);
        for(uint i = 0; i < cP.unclaimedServices.length; i++){
            emit SCName(SCMap[cP.unclaimedServices[i]]);
        }
        return(cP.unclaimedServices);
        // address[] memory a;
        // return a;
    }

    function patientUnverifiedClaims(bytes32 _id) public returns (address[] memory){
        Patient storage cP = patientMap[_id];
        //bytes32[] memory claimNames = new bytes32[](cP.unverifiedClaims.length);
        for(uint i = 0; i < cP.unverifiedClaims.length; i++){
            emit SCName(SCMap[cP.unverifiedClaims[i]]);
        }
        emit serviceList(cP.unverifiedClaims);
        return(cP.unverifiedClaims);
        // address[] memory a;
        // return a;

    }

    function patientVerifiedClaims(bytes32 _id) public returns (address[] memory){
        Patient storage cP = patientMap[_id];
        emit serviceList(cP.verifiedClaims);

        for(uint i = 0; i < cP.verifiedClaims.length; i++){
            emit SCName(SCMap[cP.verifiedClaims[i]]);
        }
        return(cP.verifiedClaims);
        // address[] memory a;
        // return a;
    }



    function setAdmin(uint _num) public {
        admin = _num;
    }


    function getAdmin() public view returns (uint) {
        return admin;
    }


    //   event ServiceClaimInfo(address addr, bytes32 id, bytes32 provider, bytes32 patient, uint256 amount, bool verified, bool payed);

    function getAllServices() public {
        for (uint i = 0; i < SCList.length; i++) {
            ServiceClaim sc = ServiceClaim(SCList[i]);
            emit ServiceClaimInfo(address(sc), sc.serviceClaimID(), sc.providerID(), sc.patientID(), sc.amount(), sc.verified(), sc.paid());
        }
    }


    function getAllVerifiedServices() public {
        for (uint i = 0; i < SCList.length; i++) {
            ServiceClaim sc = ServiceClaim(SCList[i]);
            if (sc.verified() == true) {
                emit ServiceClaimInfo(address(sc), sc.serviceClaimID(), sc.providerID(), sc.patientID(), sc.amount(), sc.verified(), sc.paid());
            }
        }
    }

    function getAllUnverifiedServices() public {
        for (uint i = 0; i < SCList.length; i++) {
            ServiceClaim sc = ServiceClaim(SCList[i]);
            if (sc.verified() == false) {
                emit ServiceClaimInfo(address(sc), sc.serviceClaimID(), sc.providerID(), sc.patientID(), sc.amount(), sc.verified(), sc.paid());
            }
        }
    }



// TODO
    // function insurerUnpaidClaims(bytes32 _id) public {
    // }
    // function insurerPaidClaims(bytes32 _id) public {

    // }

    // function providerUnpaidClaims(bytes32 _id) public {

    // }

    //  function providerPaidClaims(bytes32 _id) public {
    // }
}
