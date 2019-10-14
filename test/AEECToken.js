
const AEECToken = artifacts.require("AEECToken");
const Organizations = artifacts.require("Organizations");
const ServiceClaim = artifacts.require("ServiceClaim");

let aeecToken;
let organizationsInstance;

contract ('AEECToken',(accounts) =>{
	describe('Basic AEECToken Contract Tests', async() =>{
		before(async function(){
			token = await AEECToken.deployed();
			organizationsInstance = await Organizations.deployed();
		});

		it('AEECToken Contract properly deploys', async () => {
			const tokenInstance = await AEECToken.deployed();
			const tAddress = tokenInstance.address; 
			assert(tAddress, "Error deploying AEECToken Contract");
		});

		it('AEECToken is properly instantiated', async() =>{
			assert(organizationsInstance, "Organization Instance not is deployed...")
		});
		it('Properly mints 1M tokens', async function() {
			const tokenInstance = await AEECToken.deployed();
			const organizationsInstance = await Organizations.deployed()
			let totalSupply = await tokenInstance.totalSupply();
			//console.log(organizationsInstance);
			let orgMint = await tokenInstance.balanceOf(organizationsInstance.address);
			assert.equal(totalSupply, 1000000, "Token Supply is not 1M");
			assert.equal(orgMint,1000000, "Organization does not have 1M Tokens");
		});
	});

});
