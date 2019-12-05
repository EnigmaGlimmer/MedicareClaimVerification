pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import "./SafeMath.sol";
import "./ServiceClaim.sol";
import "./AEECToken.sol";
import "./Organizations.sol";
import "./Provider.sol";


contract Insurer {

    bytes32 id;
    string name;
    address[] providers;

    mapping (address=>string) public providerMap;

    AEECToken public token;

    event ProviderCreated(address addr, string name);
    event ProviderRetrieval(Provider provider);


    struct Claims {
        address provider;
        address patient;
        string service;
        bool verified;
        bool confirmed;
    }

    constructor(address _tokenAddr, string memory _name) public {
        // preLoadInfo();
        token = AEECToken(_tokenAddr);
        token._mint(address(this),1000000);
        //id = _id;
        name = _name;
    }


    /** @dev add a provider to the network
    @param _name name of the provider
    @return the pID of the health provider -
     */
    function addProvider(string memory _name) public returns(bytes32 pID) {
        bytes32 idp = keccak256(abi.encodePacked(_name));
        //bytes32[] memory emptyList;
        Provider newProvider = new Provider(_name, idp);
        //bytes32 providerHash = keccak256(abi.encodePacked(newProvider));
        providers.push(address(newProvider));
        providerMap[address(newProvider)] = _name;
        //insurerMap[_insurerID].providers.push(newProvider.id);
        //providerList.push(id);
        emit ProviderCreated(address(newProvider), _name);
        return idp;
    }




    function getProviders() public view returns (address[] memory) {
        return providers;
    }
    // getProviders
    function getProvider(address _addr) public returns (string memory){
        Provider provider = Provider(_addr);
        emit ProviderRetrieval(provider);
        return providerMap[_addr];
    }

    // payProviders
        function payProvider(bytes32 _serviceClaimID) public {
        // require(_serviceClaim.claim().verified == true, "User has not verified service");
        // ServiceClaim myServiceClaim = ServiceClaim(serviceClaimsMap[_serviceClaimID]);
        // myServiceClaim.payProvider();
    }

}