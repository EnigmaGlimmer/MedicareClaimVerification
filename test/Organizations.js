const Organizations = artifacts.require("Organizations");


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
		const oAddress = organizationsInstance.address 
		assert(oAddress, "Organization address does not exist");
	});


	it('Correctly added Insurer to Organizations', async () => {
		const organizationsInstance = await Organizations.deployed();
		const insurerID = await organizationsInstance.addInsurer("CMS"); 
		console.log("INSURER ID: ", insurerID.logs[0].args.id);
		const insurerStruct = await organizationsInstance.insurerMap(insurerID.logs[0].args.id);
		console.log("INSURER: ", insurerStruct)
		assert.equal("CMS", insurerStruct.name, "Insurer name does not matche given input");
  	});
  
  /*
  
  it('Correctly added Provider to Organization', async () => {
    const organizationsInstance = await Organizations.deployed();
    const insurerID =  await organizationsInstance.addInsurer("CMS");
    const providerID = await organizationsInstance.addProvider("Anthem Blue Cross",insurerID);
    const providerActual = await organizationsInstance.providerMap(providerID);
    //console.log(providerName);
    assert.equal("Anthem Blue Cross",providerActual.name, "provider name does not match input name");
    assert.equal(providerID,providerActual.id,"id of providers do not match here");
  })

  it('Correctly added a Patient to the Organization', async() => {
    const organizationsInstance = await Organizations.deployed();
    const insurerID =  await organizationsInstance.addInsurer("CMS");
    const providerID = await organizationsInstance.addProvider("Anthem Blue Cross",insurerID);
    const providerActual = await organizationsInstance.providerMap(providerID);
    const patientActual = await organizationsInstance.addPatient("Antonio",providerID);
    assert.equal("Antonio",patientActual.name,"patient name does not match actual name");
    assert.equal(organizationsInstance.patientMap(providerActual.patients[0]),);
  });
  */



});