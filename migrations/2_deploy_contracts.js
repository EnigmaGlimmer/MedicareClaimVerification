var SafeMath = artifacts.require("./SafeMath.sol");
var Organizations = artifacts.require("./Organizations.sol");
var ServiceClaim = artifacts.require("./ServiceClaim.sol");
var AEECToken = artifacts.require("./AEECToken.sol");
var Insurer = artifacts.require("./Insurer.sol");
var Provider = artifacts.require("./Provider.sol");
var Patient = artifacts.require("./Patient.sol");
var Web3 = require('web3');


var web3 = new Web3('ws://localhost:8545')
module.exports = function(deployer) {
  deployer.deploy(SafeMath);
  deployer.deploy(AEECToken).then(function(){
    //deployer.deploy(Organizations, AEECToken.address);
    deployer.deploy(Insurer, AEECToken.address, "CMS").then(function(){
      return deployer.deploy(Provider, "UCSD Medical", web3.utils.sha3(web3.utils.fromAscii("UCSD Medical")));
    });
    //return deployer.deploy(Patient, web3.utils.sha3(web3.utils.fromAscii("Ken")), "Ken");
  });
  //deployer.deploy(ServiceClaim);
};
