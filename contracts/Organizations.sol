pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import "./SafeMath.sol";
import "./ServiceClaim.sol";
import "./AEECToken.sol";

contract Organizations {
    uint admin;

    AEECToken public token;

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
    event ServiceClaimInfo(
        address addr, string patientname, string providername, string claimname, bytes32 id,
        bytes32 provider, bytes32 patient, uint256 amount, bool confirmed, uint256 timeProvided, uint256 timeFiled, uint256 timeVerified);

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
    bytes32[] patientList;
    bytes32[] providerList;
    bytes32[] insurerList;
    bytes32[] claimList;


    struct Patient {
        bytes32 id;
        string name;
        //mapping (address=>string) SCMap;
        address[] unclaimedServices;
        address[] unverifiedClaims;
        address[] verifiedClaims;
        uint256 token;
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
        uint256 token;
    }



    constructor(address _tokenAddr) public {
        //preLoadInfo();
        token = AEECToken(_tokenAddr);
        token._mint(address(this),1000000);
    }
}
