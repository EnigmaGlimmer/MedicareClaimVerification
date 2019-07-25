const ServiceClaim = artifacts.require("ServiceClaim");

contract('ServiceClaim', (accounts) => {
	beforeEach(async function(){
		this.serviceClaim = await ServiceClaim.new();
	});

	it('should put 10000 ServiceClaim in the first account', async () => {
		const serviceClaimInstance = await ServiceClaim.deployed();
		const balance = await serviceClaimInstance.getBalance.call(accounts[0]);
		assert.equal(balance.valueOf(), 10000, "10000 wasn't in the first account");
	});
});
