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

/*
contract('ServiceClaim', (accounts) => {
	beforeEach(async function(){
		this.serviceClaim = await ServiceClaim.new([stringToBytes("Anthem"),stringToBytes("Antonio"),numberToBytes(1234),"Antonio"]);
	});

	it('ServiceClaim Contract is properly deployed', async () => {
		const serviceClaimInstance = await ServiceClaim.deployed();
		const SCAddress = serviceClaimInstance.address;
		assert(SCAddress, "Organization address does not exist");
	});
});

*/