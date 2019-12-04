pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import "./SafeMath.sol";
import "./ServiceClaim.sol";
import "./AEECToken.sol";
import "./Organizations.sol";
import "./Provider.sol";
import "./Insurer.sol";

contract Patient {


    bytes32 id;
    string name;
    //mapping (address=>string) SCMap;
    address[] public unclaimedServices;
    address[] public unverifiedClaims;
    address[] public verifiedClaims;
    event ClaimVerified(address addr, bool confirm);

    constructor(bytes32 _id, string memory _name) public {
        id = _id;
        name = _name;
    }

    // verifyClaim
    function verifyClaim(address _serviceClaimAddress, uint256 _timeVerified, bool _confirmed) public {
        ServiceClaim myServiceClaim = ServiceClaim(_serviceClaimAddress);
        require(myServiceClaim.verifyClaim(_timeVerified, _confirmed), "Claim was not Verified");
        // Add the claim address to verified list
        // Delete the claim address from unverified list
        //bytes32 patID = myServiceClaim.patientID();
        //Patient storage cP = patientMap[patID];
        for(uint i = 0; i < unverifiedClaims.length; i++){
            if(unverifiedClaims[i] == address(myServiceClaim)){
                delete(unverifiedClaims[i]);
                break;
            }
        }
        //string memory name = myServiceClaim.name();
        //SC memory newSC = SC(name, address(myServiceClaim));
        verifiedClaims.push(address(myServiceClaim));
        emit ClaimVerified(_serviceClaimAddress, _confirmed);
    }


    function addService(address _addr) public {
        unclaimedServices.push(_addr);
    }

}