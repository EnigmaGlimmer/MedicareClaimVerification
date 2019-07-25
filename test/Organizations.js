const Organizations = artifacts.require("Organizations");

contract('Organizations', (accounts) => {
	//console.log(accounts);
	beforeEach(async function(){
		this.organizations = await Organizations.new();
	});

	it('Organization Contract is properly deployed', async () => {
		const organizationsInstance = await Organizations.deployed();
		const oAddress = organizationsInstance.address 
		assert(oAddress, "Organization address does not exist");
	});
});

