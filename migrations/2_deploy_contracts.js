var ClaimVerification = artifacts.require("./ClaimVerification.sol");

module.exports = function(deployer) {
  deployer.deploy(ClaimVerification);
};
