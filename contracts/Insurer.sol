pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import "./SafeMath.sol";
import "./ServiceClaim.sol";
import "./AEECToken.sol";
import "./Organizations.sol";
import "./Provider.sol";
import "./Patient.sol"; 


contract Insurer {

    bytes32 id;
    string name;
    address[] providers;

    mapping (address=>string) public providerMap;
    mapping (string=>address) newP;

    AEECToken public token;

    event ProviderCreated(address addr, string name);
    event ProviderRetrieval(Provider provider);
    event InsurerInfo(address addr, string name);
    event Length(uint256 l);


    address[] unverifiedClaims;
    address[] verifiedClaims;
    address[] serviceClaims;

    event Claims(address[] addrList);

    constructor(address _tokenAddr, string memory _name) public {
        // preLoadInfo();
        token = AEECToken(_tokenAddr);
        token._mint(address(this),1000000);
        //id = _id;
        name = _name;
        // preloadInfo();
        emit InsurerInfo(address(this), _name);
    }


    function transferTokens(address _to, uint256 _amount) public {
        token.transfer(_to, _amount);
    }

    function getInfo() public {
        emit InsurerInfo(address(this), name);
    }

    function preloadInfo() public {
        // Insurer is already added
        address pAddr = addProvider("UCSD Medical");
        Provider provider = Provider(pAddr);
        address kenAddr = provider.addPatient("Ken");
        Patient patient = Patient(kenAddr);
        //address dannyAddr = provider.addPatient("Danny");
        //address antAddr = provider.addPatient("Antonio");
    }
    /** @dev add a provider to the network
    @param _name name of the provider
    @return the pID of the health provider -
     */
    function addProvider(string memory _name) public returns(address pAddr) {
        bytes32 idp = keccak256(abi.encodePacked(_name));
        //bytes32[] memory emptyList;
        Provider newProvider = new Provider(_name, idp, address(this));
        //bytes32 providerHash = keccak256(abi.encodePacked(newProvider));
        providers.push(address(newProvider));
        providerMap[address(newProvider)] = _name;
        //insurerMap[_insurerID].providers.push(newProvider.id);
        //providerList.push(id);
        emit ProviderCreated(address(newProvider), _name);
        newP[_name] = address(newProvider);
        return address(newProvider);
    }

    function getNewProvider(string memory _name) public view returns(address newAddr) {
        return newP[_name];
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

    function addSC(address scAddr) public {
        serviceClaims.push(scAddr);
        emit Length(serviceClaims.length);
    }

    function file(address scAddr) public {
        for (uint i = 0; i < serviceClaims.length; i++) {
            if(serviceClaims[i] == scAddr){
                delete(serviceClaims[i]);
                break;
            }
        }
        unverifiedClaims.push(scAddr);
        // emit ClaimLength(unverifiedClaims.length);
        emit Claims(unverifiedClaims);
    }


    function verifyClaim(address _scAddr) public {
        ServiceClaim myServiceClaim = ServiceClaim(_scAddr);
        for (uint i = 0; i < unverifiedClaims.length; i++) {
            if(unverifiedClaims[i] == address(myServiceClaim)){
                delete(unverifiedClaims[i]);
                break;
            }
        }
        verifiedClaims.push(address(myServiceClaim));
        // emit ClaimLength(unverifiedClaims.length);
        emit Claims(verifiedClaims);
    }
    // payProviders
    function payProvider(bytes32 _serviceClaimID) public {
        // require(_serviceClaim.claim().verified == true, "User has not verified service");
        // ServiceClaim myServiceClaim = ServiceClaim(serviceClaimsMap[_serviceClaimID]);
        // myServiceClaim.payProvider();
    }

    function getAllVerifiedClaims() public view returns (address[] memory){
        return verifiedClaims;
    }

    function getAllUnverifiedClaims() public view returns (address[] memory){
        return unverifiedClaims;
    }

    function getAllServices() public view returns (address[] memory) {
        return verifiedClaims;
    }

    function getServiceClaims() public view returns (address[] memory){
        return serviceClaims;
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

    function getServiceClaimId(address _serviceClaimAddress) public view returns (bytes32){
        ServiceClaim myServiceClaim = ServiceClaim(_serviceClaimAddress);
        return myServiceClaim.serviceClaimID();
    }

    function getServiceClaimTimeVerified(address _serviceClaimAddress) public view returns (uint256){
        ServiceClaim myServiceClaim = ServiceClaim(_serviceClaimAddress);
        return myServiceClaim.timeVerified();
    }

    function getServiceClaimConfirmed(address _serviceClaimAddress) public view returns (bool){
        ServiceClaim myServiceClaim = ServiceClaim(_serviceClaimAddress);
        return myServiceClaim.confirmed();
    }

    function getServiceClaimAmount(address _serviceClaimAddress) public view returns (uint256){
        ServiceClaim myServiceClaim = ServiceClaim(_serviceClaimAddress);
        return myServiceClaim.amount();
    }
}