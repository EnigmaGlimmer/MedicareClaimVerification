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
    event ClaimCreated(address addr, uint256 amount);
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
    
    function addPatient(string memory _name) public returns(address pAddr) {
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
        return address(newPatient);
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
    
    
    function fileClaim(address _serviceClaimAddr, uint256 _amount, uint256 _timeProvided) public returns(address ClaimAddr) {
        //Patient storage cPatient = patientMap[_patient];
        ServiceClaim myServiceClaim = ServiceClaim(_serviceClaimAddr);
        //uint256 newClaimID = myServiceClaim.fileClaim(_amount, _timeProvided);
        address patientAddr = myServiceClaim.getPatientAddress();
        Patient cP = Patient(patientAddr);
        serviceClaims.push(address(myServiceClaim));
        cP.fileClaim(address(myServiceClaim));
        emit ClaimCreated(address(myServiceClaim), _amount);
        //emit SCEvent(newSC);
        return address(myServiceClaim);
    }
    
    function getPatientName(address _addr) public view returns (string memory) {
        string memory patient = patientMap[_addr];
        return patient;
    }

}