
const AEECToken = artifacts.require("AEECToken");
const ServiceClaim = artifacts.require("ServiceClaim");
const Insurer = artifacts.require("Insurer"); 

let aeecToken;
let insurerInstance;

contract ('AEECToken',(accounts) =>{
	describe('Basic AEECToken Contract Tests', async() =>{
		before(async function(){
			token = await AEECToken.deployed();
			insurerInstance = await Insurer.deployed();
		});

		it('AEECToken Contract properly deploys', async () => {
			const tokenInstance = await AEECToken.deployed();
			const tAddress = tokenInstance.address; 
			assert(tAddress, "Error deploying AEECToken Contract");
		});

		it('AEECToken is properly instantiated', async() =>{
			assert(insurerInstance, "Insurer Instance not is deployed...")
		});
		it('Properly mints 1M tokens', async function() {
			const tokenInstance = await AEECToken.deployed();
			const insurerInstance = await Insurer.deployed()
			let totalSupply = await tokenInstance.totalSupply();
			//console.log(organizationsInstance);
			let insMint = await tokenInstance.balanceOf(insurerInstance.address);
			//console.log("Balance of Insurer: ", insMint);
			assert.equal(totalSupply, 1000000, "Token Supply is not 1M");
			assert.equal(insMint,1000000, "Organization does not have 1M Tokens");
		});
	});

});
