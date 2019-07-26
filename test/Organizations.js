const Organizations = artifacts.require("Organizations");
const ServiceClaim = artifacts.require("ServiceClaim");


let organizationalInstance;
let insurer; 
let insurerID; 
let provider;
let providerID; 
let patient; 
let patientID; 
let patientActual;


contract('Organizations', (accounts) => {
	//console.log(accounts);
	beforeEach(async function(){
    this.organizations = await Organizations.new();
  });

	it('Organization Contract is properly deployed', async () => {
		const organizationsInstance = await Organizations.deployed();
		const oAddress = organizationsInstance.address; 
		assert(oAddress, "Organization address does not exist");
	});


	it('Correctly added Insurer to Organizations', async () => {
		const organizationsInstance = await Organizations.deployed();
		const insurerID = await organizationsInstance.addInsurer("CMS"); 
		//console.log("INSURER ID: ", insurerID.logs[0].args.id);
		const insurerStruct = await organizationsInstance.insurerMap(insurerID.logs[0].args.id);
		//console.log("INSURER: ", insurerStruct)
		assert.equal("CMS", insurerStruct.name, "Insurer name does not matche given input");
  	});
  
  it('Correctly added Provider to Organization', async () => {
    const organizationsInstance = await Organizations.deployed();
    const insurer =  await organizationsInstance.addInsurer("CMS");
    const insurerID = insurer.logs[0].args.id;
    const provider = await organizationsInstance.addProvider("Anthem Blue Cross",insurerID);
    const providerID = provider.logs[0].args.id;
    const providerActual = await organizationsInstance.providerMap(providerID);
    //console.log(providerName);
    assert.equal("Anthem Blue Cross",providerActual.name, "provider name does not match input name");
    assert.equal(providerID,providerActual.id,"id of providers do not match here");
  })

  it('Correctly added a Patient to the Organization', async() => {
    const organizationsInstance = await Organizations.deployed();
    const insurer =  await organizationsInstance.addInsurer("CMS");
    const insurerID = insurer.logs[0].args.id;
    const provider = await organizationsInstance.addProvider("Anthem Blue Cross",insurerID);
    const providerID = provider.logs[0].args.id;
    const patient = await organizationsInstance.addPatient("Antonio",providerID);
    const patientID = await patient.logs[0].args.id;
    const patientActual = await organizationsInstance.patientMap(patientID);
    assert.equal("Antonio",patientActual.name,"patient name does not match actual name");
  });


  describe('Service claim related features', async() => {
    before(async() =>{
      organizationalInstance = await Organizations.deployed();
      insurer =  await organizationalInstance.addInsurer("CMS");
      insurerID = insurer.logs[0].args.id;
      provider = await organizationalInstance.addProvider("Anthem Blue Cross",insurerID);
      providerID = provider.logs[0].args.id;
      patient = await organizationalInstance.addPatient("Antonio",providerID);
      patientID = await patient.logs[0].args.id;
      patientActual = await organizationalInstance.patientMap(patientID);
    });

    it('Correctly instantiate ServiceClaim', async() => {
      const serviceClaim = await organizationalInstance.newServiceClaim("Glasses",providerID,patientID);    
      const serviceClaimID = await serviceClaim.logs[0].args.addr;
      const serviceClaimActual = await organizationalInstance.serviceClaimsMap(serviceClaimID);
      assert(serviceClaimActual,"Address found");
    });

    /*
    it('Correctly adds our claim', async() => {
      const serviceClaim = await organizationalInstance.newServiceClaim("Glasses",providerID,patientID);
      const serviceClaimID = await serviceClaim.logs[0].args.addr;
      const serviceClaimActual = await organizationalInstance.serviceClaimsMap(serviceClaimID);
  
      const addServiceClaim = await organizationalInstance.addClaim(serviceClaimID,100);
      //const addedClaimID = await addServiceClaim.logs[0].args.id;
      //console.log("Added claim: ", addedClaimID);
  
      assert.equal(100,100,"Address found");
    });
    
  it('Correctly verifies our claim', async() => {
    const serviceClaim = await organizationsInstance.newServiceClaim("Glasses",providerID,patientID);
    const serviceClaimID = await serviceClaim.logs[0].args.addr; 
    const serviceClaimActual = await organizationsInstance.serviceClaimsMap(serviceClaimID);

    console.log("ServiceClaim contract: ",serviceClaimActual);
    assert(serviceClaimActual,"Address found");
  });

  it('Correctly pays our provider', async() => {
    const serviceClaim = await organizationsInstance.newServiceClaim("Glasses",providerID,patientID);
    const serviceClaimID = await serviceClaim.logs[0].args.addr;
    const serviceClaimActual = await organizationsInstance.serviceClaimsMap(serviceClaimID);

    console.log("ServiceClaim contract: ",serviceClaimActual);
    assert(serviceClaimActual,"Address found");
  });
  
*/
  });
});