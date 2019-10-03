# Medicare-Claim-Verification

This project proposes the conceptualization and prototyping of a healthcare
fraud and abuse prevention blockchain. Different from other proposals, our work
will focus on adding the patient as a participant and potential validating node to
a public and consortium based blockchain design. In traditional healthcare
claims certification and reimbursement, the healthcare provider (e.g. hospital,
clinic, group practice, individual practitioner) submits a claim after rendering
health services to a payor. The payor then verifies patient eligibility, and
reimburses for the claim. In our model, we will add the patient as a node on the
blockchain and determine whether a process of patient-centric claims
verification can be built into a blockchain consensus mechanism and smart
contract. Our model will include the use of tokens to incentivize patient
participation on the blockchain to self-report and validate claims on the
blockchain.


### Prerequisites

###### Ethereum Development Tools
```
npm i ganache-cli
npm i truffle
npm i web3
```

###### Download MetaMask
MetaMask Chrome Extension: https://metamask.io/

### Setup

###### Run Local Ethereum Blockchain
```
ganache-cli
```

###### Compile and Migrate the Solidity Smart Contracts
(In a separate terminal)
```
truffle compile
truffle migrate
```

###### Run the NodeJS Application
```
cd client
npm start
```
### Example Interaction

This is the login page, it will require only a username. The password can be any characters.

<img src="screenshots/Login.png" alt="Screenshot"/>

Any changes made to the Ethereum blockchain will evoke a Metamask call, requesting your confirmation of payment.

<img src="screenshots/Metamask.png" alt="Screenshot"/>

###### Log into Provider Dashboard

Login with "UCSD Medical" as username.

<img src="screenshots/ProviderPortal.png" alt="Screenshot"/>

###### Create a claim

Select the green button "Create Service Claim" on the patient Ken.
Fill in the fields.

<img src="screenshots/ServiceClaim.png" alt="Screenshot"/>

###### File a claim

Click on the drop down menu of the patient you have created a claim for and select the claim.

<img src="screenshots/FileClaim.png" alt="Screenshot"/>

###### Log into Patient Dashboard

Login with "Ken" as username.

<img src="screenshots/PatientPortal.png" alt="Screenshot"/>

###### Verify the claim

The green button on the bottom of the claim will verify the claim, whether the patient confirms or disputes the claim is up to them.

###### Log into Insurer Dashboard

Login with "CMS" as username.

<img src="screenshots/InsurerPortal.png" alt="Screenshot"/>

While insurers cannot modify claims, they can see their provenance as well as their statuses of verification.