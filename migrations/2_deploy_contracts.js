var SafeMath = artifacts.require("./SafeMath.sol");
var Organizations = artifacts.require("./Organizations.sol");
var ServiceClaim = artifacts.require("./ServiceClaim.sol");
var AEECToken = artifacts.require("./AEECToken.sol");
var Insurer = artifacts.require("./Insurer.sol");
var Provider = artifacts.require("./Provider.sol");
var Patient = artifacts.require("./Patient.sol");

module.exports = function(deployer) {
  deployer.deploy(SafeMath);
  deployer.deploy(AEECToken).then(function(){
    deployer.deploy(Organizations, AEECToken.address);
    deployer.deploy(Insurer, AEECToken.address, "CMS").then(function () {
      deployer.deploy(Provider, keccak256(abi.encodePacked("UCSD Medical")), "UCSD Medical").then(function(){
        return deployer.deploy(Patient, keccak256(abi.encodePacked("Ken")), "Ken");
      });
    });
  });
  //deployer.deploy(ServiceClaim);
};
