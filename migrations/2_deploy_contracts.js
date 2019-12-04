var SafeMath = artifacts.require("./SafeMath.sol");
var Organizations = artifacts.require("./Organizations.sol");
var ServiceClaim = artifacts.require("./ServiceClaim.sol");
var AEECToken = artifacts.require("./AEECToken.sol");
var Insurer = artifacts.require("./Insurer.sol");

module.exports = function(deployer) {
  deployer.deploy(SafeMath);
  deployer.deploy(AEECToken).then(function(){
    deployer.deploy(Organizations, AEECToken.address);
    return deployer.deploy(Insurer, AEECToken.address, "CMS");
  });
  //deployer.deploy(ServiceClaim);
};
