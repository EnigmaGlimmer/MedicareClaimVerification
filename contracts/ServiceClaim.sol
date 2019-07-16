pragma solidity ^0.5.0;

import "./SafeMath.sol";

contract ServiceClaim {

    bytes32 insurerID;
    bytes32 providerID;
    bytes32 patientID;

    //uint256 claimId;

    //mapping (uint256=>Service) serviceMap;
    //mapping (uint256=>Claim) claimMap;

    struct Service {
        uint256 id;
        string name;
        //bytes32 providerID;
    }

    struct Claim {
        uint256 id;
        uint256 amount;
        //Service service;
        bool verified;
        bool paid;
    }

    Service service;
    Claim claim;

    constructor(bytes32 _proID, bytes32 _patID, uint256 _id, string memory _name) public {
        providerID = _proID;
        patientID = _patID;
        service = Service(_id, _name);
    }

    // ------------------------------ Functionality of the Network --------------------------- //

    function addClaim(uint256 _claimId, uint256 _amount) public returns(uint256 ClaimID) {
        claim = Claim(_claimId, _amount, false, false);
        return claim.id;
    }

    function verifyClaim() public {
        claim.verified = true;
    }

    function payProvider() public returns(uint256 payment) {
        claim.paid = true;
        return claim.amount;
    }
}
