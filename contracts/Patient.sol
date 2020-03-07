pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import "./SafeMath.sol";
import "./ServiceClaim.sol";
import "./AEECToken.sol";
import "./Organizations.sol";
import "./Provider.sol";
import "./Insurer.sol";

contract Patient {
    
    AEECToken public token;

    bytes32 id;
    string name;
    //mapping (address=>string) SCMap;
    address[] public unclaimedServices;
    address[] public unverifiedClaims;
    address[] public verifiedClaims;
    event ClaimVerified(address addr, bool confirm);
    event Claims(address[] claims);
    event ClaimLength(uint256 claimLength);
    event ClaimAdded(address addr);
    event Check(address addr);

    address providerAddr;
    address insurerAddr;

    constructor(bytes32 _id, string memory _name) public {
        id = _id;
        name = _name;
        providerAddr = msg.sender;
        Provider cP = Provider(providerAddr);
        insurerAddr = cP.getInsAddr();
    }
    // use provider to get insurer address
    // pass insurer address into constructor params 


    function removeUnverified(uint index) public {
        if (index >= unverifiedClaims.length) return;

        for (uint i = index; i<unverifiedClaims.length-1; i++){
            unverifiedClaims[i] = unverifiedClaims[i+1];
        }
        unverifiedClaims.length--;
    }

    // verifyClaim
    function verifyClaim(address _serviceClaimAddress, uint256 _timeVerified, bool _confirmed) public {
        ServiceClaim myServiceClaim = ServiceClaim(_serviceClaimAddress);
        require(myServiceClaim.verify(_timeVerified, _confirmed), "Claim was not Verified");
        // Add the claim address to verified list
        // Delete the claim address from unverified list
        //bytes32 patID = myServiceClaim.patientID();
        //Patient storage cP = patientMap[patID];
        emit ClaimLength(unverifiedClaims.length);
        for(uint i = 0; i < unverifiedClaims.length; i++){
            emit Check(unverifiedClaims[i]);
            if(unverifiedClaims[i] == _serviceClaimAddress){
                removeUnverified(i);
                emit ClaimLength(unverifiedClaims.length);
                break;
            }
        }


        //string memory name = myServiceClaim.name();
        //SC memory newSC = SC(name, address(myServiceClaim));
        verifiedClaims.push(_serviceClaimAddress);
        emit ClaimVerified(_serviceClaimAddress, _confirmed);
        Insurer cI = Insurer(insurerAddr);
        cI.verifyClaim(_serviceClaimAddress);
        // Insurer cI = Insurer(insurerAddr);
        cI.transferTokens(address(this), 10);
        // cI.verifyClaim(address(myServiceClaim));
    }

    function recordService(address _addr) public returns (address[] memory) {
        unclaimedServices.push(_addr);
        emit ClaimAdded(_addr);
    }

    function getBalance() public view returns(uint256) {
        return token.balanceOf(address(this));
    }

    function fileClaim(address _serviceClaimAddress) public returns (address[] memory){
        for (uint i = 0; i < unclaimedServices.length; i++) {
            if(unclaimedServices[i] == _serviceClaimAddress){
                delete(unclaimedServices[i]);
                break;
            }
        }
        unverifiedClaims.push(_serviceClaimAddress);
        // emit ClaimLength(unverifiedClaims.length);
        emit Claims(unverifiedClaims);
        return unverifiedClaims;
    }

     // for(uint i = 0; i < cP.unclaimedServices.length; i++){
        //     if(cP.unclaimedServices[i] == address(myServiceClaim)){
        //         delete(cP.unclaimedServices[i]);
        //         break;
        //     }
        // }
        // // string memory name = myServiceClaim.name();
        // //SC memory newSC = SC(name, address(myServiceClaim));
        // cP.unverifiedClaims.push(address(myServiceClaim));


    
    function getUS() public view returns (address[] memory) {
        return unclaimedServices;
    }

    function getUC() public view returns (address[] memory) {
        return unverifiedClaims;
    }

    function getVC() public view returns (address[] memory) {
        return verifiedClaims;
    }

    function getLastSC() public view returns(address){
        return unverifiedClaims[unverifiedClaims.length-1];
    }

    function getServiceClaimName(address _serviceClaimAddress) public view returns(string memory){
        ServiceClaim myServiceClaim = ServiceClaim(_serviceClaimAddress);
        return myServiceClaim.name();
    }

    function getServiceClaimTimeProvided(address _serviceClaimAddress) public view returns(uint256){
        ServiceClaim myServiceClaim = ServiceClaim(_serviceClaimAddress);
        return myServiceClaim.timeProvided();
    }

    function getServiceClaimTimeFiled(address _serviceClaimAddress) public view returns(uint256){
        ServiceClaim myServiceClaim = ServiceClaim(_serviceClaimAddress);
        return myServiceClaim.timeFiled();
    }

    function getName() public view returns(string memory){
        return name;
    }
}