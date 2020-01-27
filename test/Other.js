const Organizations = artifacts.require("Organizations");
const ServiceClaim = artifacts.require("ServiceClaim");
const AEECToken = artifacts.require("AEECToken");
const orgArtifact = require("./../client/src/contracts/Organizations.json");
const tokenArtifact = require("./../client/src/contracts/AEECToken.json");
const Insurer = artifacts.require("Insurer");
const Provider = artifacts.require("Provider");
const Patient = artifacts.require("Patient");


let organizationsInstance;
let insurer; 
let insurerID; 
let provider;
let providerID; 
let patient; 
let patientID; 
let patientActual;



contract('Other', (accounts) => {

  describe('Organization Association Tests', async() => {
    before(async() =>{
      insurerInstance = await Insurer.deployed();
      // provider = await insurerInstance.addProvider("Anthem Blue Cross");
      // providerAddr = provider.logs[0].args.addr;
      // providerInstance = await Provider.at(providerAddr);
      // patient = await providerInstance.addPatient("Antonio");
      // patientAddr = await patient.logs[0].args.addr;
      // patientInstance = await Patient.at(patientAddr);
    });

    // //Insurer Provider - DONE
    // it('Empty Insurer Provider  List', async () => {
    //   var pL = await insurerInstance.getProviders();
    //   assert.equal(pL.length,0,"Insurer list is not empty");
    // });

    it('Single Insurer Provider List', async () => {
      // provider = await insurerInstance.addProvider("Anthem Blue Cross");
      // providerAddr = provider.logs[0].args.addr;
      // providerInstance = await Provider.at(providerAddr);
      var insurerList = await insurerInstance.getProviders();
      assert.equal(insurerList.length,1,"Insurer list should have a member here as well");
    });

    //Provider Patient - DONE
    it('Empty Provider Patient List', async () => {
      provider = await insurerInstance.addProvider("Anthem Blue Cross");
      providerAddr = provider.logs[0].args.addr;
      providerInstance = await Provider.at(providerAddr);
      var pL = await providerInstance.getPatients(); 
      assert.equal(pL.length, 0, "Patients list not empty");
    });

    it('Single Provider Patient List', async () => {
      provider = await insurerInstance.addProvider("Anthem Blue Cross");
      providerAddr = provider.logs[0].args.addr;
      providerInstance = await Provider.at(providerAddr);
      await providerInstance.addPatient("Ken")
      var pL = await providerInstance.getPatients(); 
      assert.equal(pL.length,1,"Patients list should have a member here");
    });
  });

  describe('Service claim verified and unverified list tests',async() =>{
    before(async() =>{
      insurerInstance = await Insurer.deployed();
      provider = await insurerInstance.addProvider("Anthem Blue Cross");
      providerAddr = provider.logs[0].args.addr;
      providerInstance = await Provider.at(providerAddr);
      patient = await providerInstance.addPatient("Antonio");
      patientAddr = await patient.logs[0].args.addr;
      patientInstance = await Patient.at(patientAddr);
    });

    it('Empty Unverified Claims List', async() => {
      const unvServices = await insurerInstance.getUnverifiedClaims();
      assert.equal(unvServices.length,0,"There should be no unverified services here");
    });

    //
    it('Single Unclaimed Service List', async() => {
      await providerInstance.provideService("Glasses", patientInstance.address);
      const unclaimedServices = await patientInstance.getUS();
      assert.equal(unclaimedServices.length,1,"There should be an unverified service here");
    });

    it('Single Unverified Claims List', async() => {
      await providerInstance.provideService("Glasses", patientInstance.address);
      const scAddr = await patientInstance.getUS();
      console.log("SC Address: ", scAddr[1]);
      const idk = scAddr[1]
      await providerInstance.fileClaim(idk, 100, 1);
      const unverifiedServices = await patientInstance.getUC();
      assert.equal(unverifiedServices.length,1,"There should be an unverified service here");
    });

    it('Empty Verified Claims List Test', async() => {
      await providerInstance.provideService("Glasses", patientInstance.address);
      const scAddr = await patientInstance.getLastSC();
      console.log("SC Address: ", scAddr);
      await providerInstance.fileClaim(scAddr, 100, 1);
      // await patientInstance.verifyClaim(idk, Date.now(), true);
      const verifiedServices = await patientInstance.getVC();
      
      assert.equal(verifiedServices.length,0,"There should be no verified services here");
    });

    //
    it('Single Verified Claims List', async() =>{
      await providerInstance.provideService("Glasses", patientInstance.address);
      const scAddr = await patientInstance.getUS();
      console.log("SC Address: ", scAddr[1]);
      const idk = scAddr[1]
      await providerInstance.fileClaim(idk, 100, 1);
      await patientInstance.verifyClaim(idk, Date.now(), true);
      const verifiedServices = await patientInstance.getVC();
      assert.equal(verifiedServices.length,1,"There should be a verified service here");
    });
  });

});