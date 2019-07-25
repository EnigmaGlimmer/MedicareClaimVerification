const Organizations = artifacts.require("Organizations");

contract('Organizations', (accounts) => {
	console.log(accounts);
	beforeEach(async function(){
		this.organizations = await Organizations.new();
	});

	it('should work', async () => {
		const organizationsInstance = await Organizations.deployed();
		console.log(organizationsInstance);
		assert.equal(balance.valueOf(), 10000, "10000 wasn't in the first account");
	});
});

