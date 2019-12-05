pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import "./SafeMath.sol";
import "./ServiceClaim.sol";
import "./AEECToken.sol";
import "./Organizations.sol";
import "./Insurer.sol";
import "./Patient.sol";


contract Provider {

    bytes32 id;
    string name;
    address[] patients;
    address[] serviceClaims;

    mapping(address=>address) serviceClaimMap; //mapping from patient address to serviceClaim address
    mapping (address=>string) SCMap;


    mapping (address=>string) public patientMap; //ID of patient to specific provider -
    event PatientCreated(address addr, string name);
    event SCID(string scName, address addr);
    event ClaimCreated(uint256 id, uint256 amount);
    event PatientRetrieval(Patient patient);

    constructor(string memory _name, bytes32 _id) public {
        // preLoadInfo();
        //token = AEECToken(_tokenAddr);
        //token._mint(address(this),1000000);
        id = _id;
        name = _name;
    }

    //addPatient
    //getPatints
    //provideService
    //fileClaim
    // getPatient
    
    function addPatient(string memory _name) public returns(bytes32 pID) {
        bytes32 pid = keccak256(abi.encodePacked(_name));
        //address[] memory uServiceList;
        //address[] memory uClaimList;
        //address[] memory vClaimList;
        Patient newPatient = new Patient(pid, _name);
        //bytes32 patientHash = keccak256(abi.encodePacked(newPatient));
        patientMap[address(newPatient)] = _name;
        patients.push(address(newPatient));
        //providerMap[_providerID].patients.push(newPatient.id);
        emit PatientCreated(address(newPatient), _name);
        return id;
    }

    function getPatients() public view returns(address[] memory _patients) {
        return patients;
    }

    function getPatient(address _addr) public returns (bool){
        //Patient memory patient = patientMap[_addr];
        Patient cP = Patient(_addr);
        emit PatientRetrieval(cP);
        return true;
    }

    function provideService(string memory _name, address _patientAddress) public
    returns(address SCAddress) {
        bytes32 sid = keccak256(abi.encodePacked(_name, id, _patientAddress));
        ServiceClaim serviceClaim = new ServiceClaim(address(this), _patientAddress, sid, _name);
        serviceClaims.push(address(serviceClaim));
        serviceClaimMap[_patientAddress] = address(serviceClaim);
        Patient cP = Patient(_patientAddress);
        cP.addService(address(serviceClaim));
        SCMap[address(serviceClaim)] = _name;
        emit SCID(_name, address(serviceClaim));
        return address(serviceClaim);
    }
    
    
    function fileClaim(bytes32 _serviceClaimID, uint256 _amount, uint256 _timeProvided) public returns(uint256 ClaimID) {
        //Patient storage cPatient = patientMap[_patient];
        ServiceClaim myServiceClaim = ServiceClaim(serviceClaimsMap[_serviceClaimID]);
        uint256 newClaimID = myServiceClaim.fileClaim(_amount, _timeProvided);
        bytes32 patID = myServiceClaim.patientID();
        Patient storage cP = patientMap[patID];
        //claimList.push(_serviceClaimID);
        serviceClaims.push(address(myServiceClaim));
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
    

    

}