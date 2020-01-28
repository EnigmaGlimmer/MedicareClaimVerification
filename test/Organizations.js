const ServiceClaim = artifacts.require("ServiceClaim");
const AEECToken = artifacts.require("AEECToken");
const orgArtifact = require("./../client/src/contracts/Organizations.json");
const tokenArtifact = require("./../client/src/contracts/AEECToken.json");
const Insurer = artifacts.require("Insurer");
const Provider = artifacts.require("Provider");
const Patient = artifacts.require("Patient");


let insurer; 
let insurerID; 
let provider;
let providerID; 
let patient; 
let patientID; 
let patientActual;


contract('Organizations', (accounts) => {
  
  describe('Basic Organization Tests', async () => {
    before(async function(){
      var aeecToken = await AEECToken.deployed(); // contract(tokenArtifact); // AEECToken.deployed();
      //console.log(aeecToken.address);
    });
    it('Insurer Contract is properly deployed', async () => {
      const insurerInstance = await Insurer.deployed();
      const insurerAddress = insurerInstance.address; 
      assert(insurerAddress, "Insurer address does not exist");
    });

    it('Provider Contract is properly deployed', async () => {
      const insurerInstance = await Insurer.deployed();
      const providerTx = await insurerInstance.addProvider("Anthem Blue Cross"); 
      //console.log("Provider Address: ", providerTx.logs[0].args.addr) 
      const providerInstance = await Provider.at(providerTx.logs[0].args.addr);
      const providerAddress = providerInstance.address; 
      assert(providerAddress, "Provider address does not exist");
    });

    it('Patient Contract is properly deployed', async () => {
      const insurerInstance = await Insurer.deployed();
      const providerTx = await insurerInstance.addProvider("Anthem Blue Cross"); 
      //console.log("Provider Address: ", providerTx.logs[0].args.addr) 
      const providerInstance = await Provider.at(providerTx.logs[0].args.addr);
      const patientTx = await providerInstance.addPatient("Ken");
      //console.log("Patient Address: ", patientTx.logs[0].args.addr);
      const patientInstance = await Patient.at(patientTx.logs[0].args.addr);
      const patientAddress = patientInstance.address;
      assert(patientAddress, "Patient address does not exist");
    });

    it('Correctly added Provider to Insurer', async () => {
      const insurerInstance = await Insurer.deployed();
      const providerTx = await insurerInstance.addProvider("Anthem Blue Cross"); 
      //console.log("Provider Address: ", providerTx.logs[0].args.addr) 
      const pName = await insurerInstance.providerMap(providerTx.logs[0].args.addr);
      assert.equal("Anthem Blue Cross", pName, "Provider name does not matche given input");
    });
  

    // TODO -- Add Patient to Provider --> May need to check depths ? 
    // it('Correctly added Insurer to Organizations', async () => {
    //   const organizationsInstance = await Organizations.deployed();
    //   const insurerID = await organizationsInstance.addInsurer("CMS"); 
      
    //   const insurerStruct = await organizationsInstance.insurerMap(insurerID.logs[0].args.id);
      
    //   assert.equal("CMS", insurerStruct.name, "Insurer name does not matche given input");
    //   });
    
    // it('Correctly added Provider to Organization', async () => {
    //   const organizationsInstance = await Organizations.deployed();
    //   const insurer =  await organizationsInstance.addInsurer("CMS");
    //   const insurerID = insurer.logs[0].args.id;
    //   const provider = await organizationsInstance.addProvider("Anthem Blue Cross",insurerID);
    //   const providerID = provider.logs[0].args.id;
    //   const providerActual = await organizationsInstance.providerMap(providerID);
    //   //console.log(providerName);
    //   assert.equal("Anthem Blue Cross",providerActual.name, "provider name does not match input name");
    //   assert.equal(providerID,providerActual.id,"id of providers do not match here");
    // })
  
  //   it('Correctly added a Patient to the Organization', async() => {
  //     const organizationsInstance = await Organizations.deployed();
  //     const insurer =  await organizationsInstance.addInsurer("CMS");
  //     const insurerID = insurer.logs[0].args.id;
  //     const provider = await organizationsInstance.addProvider("Anthem Blue Cross",insurerID);
  //     const providerID = provider.logs[0].args.id;
  //     const patient = await organizationsInstance.addPatient("Antonio",providerID);
  //     const patientID = await patient.logs[0].args.id;
  //     const patientActual = await organizationsInstance.patientMap(patientID);
  //     assert.equal("Antonio",patientActual.name,"patient name does not match actual name");
  //   });
  });
	

  describe('Service claim related features', async() => {
    before(async() =>{
      insurerInstance = await Insurer.deployed();
      provider = await insurerInstance.addProvider("Anthem Blue Cross");
      providerAddr = provider.logs[0].args.addr;
      providerInstance = await Provider.at(providerAddr);
      patient = await providerInstance.addPatient("Antonio");
      patientAddr = await patient.logs[0].args.addr;
      patientInstance = await Patient.at(patientAddr);
    });

    it('Correctly instantiate ServiceClaim', async() => {
      //console.log(providerInstance);
      const serviceClaimTx = await providerInstance.provideService("Glasses",patientInstance.address);    
      //console.log("SERVICE CLAIM LOGS: ", serviceClaimTx.logs)
      const serviceClaimInstance = await ServiceClaim.at(serviceClaimTx.logs[0].args.addr);
      //const serviceClaimID = await serviceClaimTx.logs[0].args.addr;
      //const serviceClaimActual = await organizationsInstance.serviceClaimsMap(serviceClaimID);
      //console.log("SC Instance: ", serviceClaimInstance);
      assert(serviceClaimInstance.address,"Address found");
    });
    
    it('Correctly adds a claim amount', async() => {

      //console.log(providerInstance);
      const serviceClaimTx = await providerInstance.provideService("Glasses",patientInstance.address);    
      //console.log("SERVICE CLAIM LOGS: ", serviceClaimTx.logs)
      const serviceClaimInstance = await ServiceClaim.at(serviceClaimTx.logs[0].args.addr);
      const fileClaimTx = await serviceClaimInstance.file(100, Date.now());
      const claimAmount = await serviceClaimInstance.getAmount();
      assert.equal(100,claimAmount,"Claim Amount is Incorrect");
    });
  
  
    it('Correctly verifies a claim', async() => {

      const serviceClaimTx = await providerInstance.provideService("Glasses",patientInstance.address);    
      //console.log("SERVICE CLAIM LOGS: ", serviceClaimTx.logs)
      const scAddr = serviceClaimTx.logs[0].args.addr
      const serviceClaimInstance = await ServiceClaim.at(scAddr);
      await serviceClaimInstance.file(100, Date.now());
      //const patientInstance = await Patient.at(patientInstance.address);
      const verifyTx = await patientInstance.verifyClaim(scAddr, Date.now(), true);
      const claimVerify = await serviceClaimInstance.isVerified();
      //console.log("VERIFY TX: ", claimVerify);
      assert.equal(true,claimVerify,"Claim Verification is Incorrect");
    });


  // TODO -- Implement the Payment of a Patient!!! 
  // it('Confirms payment completion of the claim', async() => {
  //   const serviceClaim = await organizationsInstance.provideService("Glasses",providerID,patientID);
  //   const serviceClaimInfo = await serviceClaim.logs[0].args;
  //   await organizationsInstance.payProvider(serviceClaimInfo.ID);
  //   const currService = await ServiceClaim.at(serviceClaimInfo.addr);
  //   const claimPaid = await currService.isPaid();
  //   assert.equal(true,claimPaid,"Claim Verification is Incorrect");
  // });
});

  describe('Integrates AEECToken Contract Properly', async() =>{
    before(async function(){
      insurerInstance = await Insurer.deployed();
      provider = await insurerInstance.addProvider("Anthem Blue Cross");
      providerAddr = provider.logs[0].args.addr;
      providerInstance = await Provider.at(providerAddr);
      patient = await providerInstance.addPatient("Antonio");
      patientAddr = await patient.logs[0].args.addr;
      patientInstance = await Patient.at(patientAddr);      
      tokenInstance = await AEECToken.deployed();
    });

    it('Insurer properly mints AEECToken', async() => {
      //const token = await organizationsInstance.getToken();
      const tokenBalance = await tokenInstance.balanceOf(insurerInstance.address);
      assert.equal(tokenBalance,1000000);
    });
  });
});