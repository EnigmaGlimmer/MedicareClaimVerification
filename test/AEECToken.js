/*
const AEECToken = artifacts.require("AEECToken");
const Organizations = artifacts.require("Organizations");
const ServiceClaim = artifacts.require("ServiceClaim");

let aeecToken;
let organizationsInstance;

contract ('AEECToken',(accounts) =>{
	describe('Basic AEECToken Contract Tests', async() =>{
		before(async function(){
			this.organizations = await Organizations.new();
			this.token = await AEECToken.new();
		});

		it('AEECToken Contract properly deploys', async () => {
			const tokenInstance = await AEECToken.deployed();
			const tAddress = tokenInstance.address; 
			assert(tAddress, "Error deploying AEECToken Contract");
		});
/*
		it('AEECToken is properly instantiated', async() =>{
			const organizationsInstance 
	
		it('Properly mints 1M tokens', async function() {
			const tokenInstance = await AEECToken.deployed();
			let totalSupply = await tokenInstance.totalSupply();
			assert.equal(totalSupply, 1000000);
		});
	});
})
*/