const Organizations = artifacts.require("Organizations");
const ServiceClaim = artifacts.require("ServiceClaim");
const AEECToken = artifacts.require("AEECToken");
const orgArtifact = require("./../client/src/contracts/Organizations.json");
const tokenArtifact = require("./../client/src/contracts/AEECToken.json")


let organizationsInstance;
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
      console.log(aeecToken.address);
      var organizationsInstance = await Organizations.deployed();
      console.log(organizationsInstance.address);
      
    });
  
    it('Organization Contract is properly deployed', async () => {
      const organizationsInstance = await Organizations.deployed();
      const oAddress = organizationsInstance.address; 
      assert(oAddress, "Organization address does not exist");
    });

  
    it('Correctly added Insurer to Organizations', async () => {
      const organizationsInstance = await Organizations.deployed();
      const insurerID = await organizationsInstance.addInsurer("CMS"); 
      
      const insurerStruct = await organizationsInstance.insurerMap(insurerID.logs[0].args.id);
      
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
  });
	

  describe('Service claim related features', async() => {
    before(async() =>{
      organizationsInstance = await Organizations.deployed();
      insurer =  await organizationsInstance.addInsurer("CMS");
      insurerID = insurer.logs[0].args.id;
      provider = await organizationsInstance.addProvider("Anthem Blue Cross",insurerID);
      providerID = provider.logs[0].args.id;
      patient = await organizationsInstance.addPatient("Antonio",providerID);
      patientID = await patient.logs[0].args.id;
      patientActual = await organizationsInstance.patientMap(patientID);
    });

    it('Correctly instantiate ServiceClaim', async() => {
      const serviceClaim = await organizationsInstance.provideService("Glasses",providerID,patientID);    
      const serviceClaimID = await serviceClaim.logs[0].args.addr;
      const serviceClaimActual = await organizationsInstance.serviceClaimsMap(serviceClaimID);
      assert(serviceClaimActual,"Address found");
    });

    
    it('Correctly adds a claim amount', async() => {
      const serviceClaim = await organizationsInstance.provideService("Glasses",providerID,patientID);
      const serviceClaimInfo = await serviceClaim.logs[0].args;
      //console.log("SC: ", serviceClaimInfo);
      const addServiceClaim = await organizationsInstance.fileClaim(serviceClaimInfo.ID, 100);
      //console.log("Filed the claim");
      const currService = await ServiceClaim.at(serviceClaimInfo.addr);
      //console.log("GOT SC Instance")
      const claimAmount = await currService.getAmount();
      //console.log("Claim Amount: ", claimAmount);
      assert.equal(100,claimAmount,"Claim Amount is Incorrect");
    });
  
  
  it('Correctly verifies a claim', async() => {
    const serviceClaim = await organizationsInstance.provideService("Glasses",providerID,patientID);
    const serviceClaimInfo = await serviceClaim.logs[0].args;
    const SCAddress = await organizationsInstance.serviceClaimsMap(serviceClaimInfo.ID);
    const verifyServiceClaim = await organizationsInstance.verifyClaim(SCAddress);
    const currService = await ServiceClaim.at(serviceClaimInfo.addr);
    const claimVerify = await currService.isVerified();
    assert.equal(true,claimVerify,"Claim Verification is Incorrect");
  });

  it('Confirms payment completion of the claim', async() => {
    const serviceClaim = await organizationsInstance.provideService("Glasses",providerID,patientID);
    const serviceClaimInfo = await serviceClaim.logs[0].args;
    await organizationsInstance.payProvider(serviceClaimInfo.ID);
    const currService = await ServiceClaim.at(serviceClaimInfo.addr);
    const claimPaid = await currService.isPaid();
    assert.equal(true,claimPaid,"Claim Verification is Incorrect");
  });
});

  describe('Organization Association Tests', async() => {
    before(async() =>{
      organizationsInstance = await Organizations.deployed();
      insurer =  await organizationsInstance.addInsurer("CMS");
      insurerID = insurer.logs[0].args.id;
    });

    //Insurer Provider - DONE
    it('Empty Insurer Provider  List', async () => {
      var iL = await organizationsInstance.providersOfInsurer(insurerID);
      var insurerList = iL.logs[0].args.ids.length;
      assert.equal(insurerList,0,"Insurer list is not empty");
    });

    it('Single Insurer Provider List', async () => {
      await organizationsInstance.addProvider("Anthem Blue Cross",insurerID);
      var iL = await organizationsInstance.providersOfInsurer(insurerID);
      var insurerList = iL.logs[0].args.ids.length;
      assert.equal(insurerList,1,"Insurer list should have a member here as well");
    });

    //Provider Patient - DONE
    it('Empty Provider Patient List', async () => {
      const provider = await organizationsInstance.addProvider("Anthem Blue Cross",insurerID);
      const providerID = provider.logs[0].args.id;

      var pL = await organizationsInstance.patientsOfProvider(providerID);
      var patientsList = pL.logs[0].args.ids.length;
      assert.equal(patientsList, 0, "Patients list not empty");
    });

    it('Single Provider Patient List', async () => {
      const provider = await organizationsInstance.addProvider("Anthem Blue Cross",insurerID);
      const providerID = provider.logs[0].args.id;

      await organizationsInstance.addPatient("Antonio",providerID);
      var pL = await organizationsInstance.patientsOfProvider(providerID);
      var patientsList = pL.logs[0].args.ids.length;
      assert.equal(patientsList,1,"Patients list should have a member here");
    });
  });

  describe('Service claim verified and unverified list tests',async() =>{
    before(async() =>{
      insurer =  await organizationsInstance.addInsurer("CMS");
      insurerID = insurer.logs[0].args.id;
      provider = await organizationsInstance.addProvider("Anthem Blue Cross",insurerID);
      providerID = provider.logs[0].args.id;
      patient = await organizationsInstance.addPatient("Antonio",providerID);
      patientID = await patient.logs[0].args.id;
      patientActual = await organizationsInstance.patientMap(patientID);
    });

    it('Empty Unverified Claims List', async() => {
      const organizationsInstance = await Organizations.deployed();

      const unvServices = await organizationsInstance.patientUnverifiedClaims(patientID);
      const unverifiedServices = unvServices.logs[0].args.services.length;

      assert.equal(unverifiedServices,0,"There should be no unverified services here");
    });

    //
    it('Single Unclaimed Service List', async() => {
      const organizationsInstance = await Organizations.deployed();

      await organizationsInstance.provideService("Glasses",providerID,patientID);

      const uvS = await organizationsInstance.patientUnclaimedServices(patientID);
      const unclaimedServices = uvS.logs[0].args.services.length;
      
      assert.equal(unclaimedServices,1,"There should be an unverified service here");
    });

    it('Single Unverified Claims List', async() => {
      const organizationsInstance = await Organizations.deployed();
      const serviceClaim = await organizationsInstance.provideService("Glasses",providerID,patientID);    
      const serviceClaimInfo = await serviceClaim.logs[0].args;
      //console.log("BEFORE FILE CLAIM");
      const addServiceClaim = await organizationsInstance.fileClaim(serviceClaimInfo.ID, 100);
      const uvS = await organizationsInstance.patientUnverifiedClaims(patientID);
      const unverifiedServices = uvS.logs[0].args.services.length;
      
      assert.equal(unverifiedServices,1,"There should be an unverified service here");
    });

    it('Empty Verified Claims List Test', async() => {
      const organizationsInstance = await Organizations.deployed();
      
      const vServices = await organizationsInstance.patientVerifiedClaims(patientID);
      const verifiedServices = vServices.logs[0].args.services.length;
      
      assert.equal(verifiedServices,0,"There should be no verified services here");
    });

    //
    it('Single Verified Claims List', async() =>{
      const organizationsInstance = await Organizations.deployed();

      const serviceClaim = await organizationsInstance.provideService("Glasses",providerID,patientID);    
      const serviceClaimInfo = await serviceClaim.logs[0].args;
      console.log("ID: ", serviceClaimInfo)
      const SCAddress = await organizationsInstance.serviceClaimsMap(serviceClaimInfo.ID);

      await organizationsInstance.verifyClaim(SCAddress);

      const vServices = await organizationsInstance.patientVerifiedClaims(patientID);
      const verifiedServices = vServices.logs[0].args.services.length;

      assert.equal(verifiedServices,1,"There should be a verified service here");
    });
  });

  describe('Integrates AEECToken Contract Properly', async() =>{
    before(async function(){
      organizationsInstance = await Organizations.deployed();
      tokenInstance = await AEECToken.deployed();
    });

    it('Organizations properly mints AEECToken', async() => {
      //const token = await organizationsInstance.getToken();
      const tokenBalance = await tokenInstance.balanceOf(organizationsInstance.address);
      assert.equal(tokenBalance,1000000);
    });
  });
});