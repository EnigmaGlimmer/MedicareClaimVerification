const ServiceClaim = artifacts.require("ServiceClaim");

contract('ServiceClaim', (accounts) => {
	beforeEach(async function(){
		this.serviceClaim = await ServiceClaim.new();
	});

	it('Contract exists', async () => {
		const serviceClaimInstance = await ServiceClaim.deployed();
		const oAddress = organizationsInstance.address 
		assert(oAddress, "Organization address does not exist");
	});
});
