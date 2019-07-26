const Organizations = artifacts.require("Organizations");
const ServiceClaim = artifacts.require("ServiceClaim");


function bytesToString(bytes) {
    if (bytes.length && !bytes.map) bytes = [bytes]
    let arr = bytes.map(b => Array.from(ethers.utils.arrayify(b)))
    let utf8 = [].concat(...arr).filter(x => x)
    return ethers.utils.toUtf8String(utf8)
  }

function numberToBytes(number) {
    let bytes = ethers.utils.hexlify(number)
    return '0x' + ('0'.repeat(64) + bytes.substr(2)).substr(-64)
}

function stringToBytes(text, len = 0) {
    text = text || ''
    let data = ethers.utils.toUtf8Bytes(text)
    let padding = 64 - ((data.length * 2) % 64)
    data = ethers.utils.hexlify(data)
    data = data + '0'.repeat(padding)
    if (len <= 0) return data

    data = data.substring(2)
    data = data.match(/.{1,64}/g)
    data = data.map(v => '0x' + v)
    while (data.length < len) {
      data.push('0x00')
    }
    return data
}


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

  it('Correctly instantiate ServiceClaim', async() => {
    //Startup to be refactored
    const organizationsInstance = await Organizations.deployed();
    const insurer =  await organizationsInstance.addInsurer("CMS");
    const insurerID = insurer.logs[0].args.id;
    const provider = await organizationsInstance.addProvider("Anthem Blue Cross",insurerID);
    const providerID = provider.logs[0].args.id;
    const patient = await organizationsInstance.addPatient("Antonio",providerID);
    const patientID = await patient.logs[0].args.id;
    const patientActual = await organizationsInstance.patientMap(patientID);

    //Create new service claim contract
    const serviceClaim = await organizationsInstance.newServiceClaim("Glasses",providerID,patientID);
    
    const serviceClaimID = await serviceClaim.logs[0].args.addr;
    //console.log("ServiceClaimID: ", serviceClaimID);
    const serviceClaimActual = await organizationsInstance.serviceClaimsMap(serviceClaimID);

    console.log("ServiceClaim contract: ",serviceClaimActual);
    assert(serviceClaimActual,"Address found");
  });
});