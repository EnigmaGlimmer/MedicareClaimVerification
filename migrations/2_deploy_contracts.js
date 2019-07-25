var SafeMath = artifacts.require("./SafeMath.sol");
var Organizations = artifacts.require("./Organizations.sol");
var ServiceClaim = artifacts.require("./ServiceClaim.sol");

module.exports = function(deployer) {
  deployer.deploy(SafeMath);
  deployer.deploy(Organizations);
  //deployer.deploy(ServiceClaim);
};
