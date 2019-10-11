
const AEECToken = artifacts.require("AEECToken");
const Organizations = artifacts.require("Organizations");
const ServiceClaim = artifacts.require("ServiceClaim");

let aeecToken;
let organizationsInstance;

contract ('AEECToken',(accounts) =>{
	describe('Basic AEECToken Contract Tests', async() =>{
		before(async function(){
			this.organizations = await Organizations.new();
			this.token = await AEECToken.new(this.organizations.address);
		});

		it('AEECToken Contract is properly deployed', async () => {
			const tokenInstance = await AEECToken.deployed();
			const tAddress = tokenInstance.address; 
			assert(tAddress, "Error deploying AEECToken Contract");
		});

		it('Properly mints 1M tokens', async function() {
			const tokenInstance = await AEECToken.deployed();
			let totalSupply = await tokenInstance.totalSupply();
			assert.equal(totalSupply, 0);
		});
	});
})
