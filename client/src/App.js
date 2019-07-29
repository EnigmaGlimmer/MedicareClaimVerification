import React, { Component } from "react";
import ClaimVerification from "./contracts/Organizations.json"
import getWeb3 from "./utils/getWeb3";
import PatientCell from './components/PatientCell'
import { Row, Col, Form, Input, Button, FormGroup } from 'reactstrap';

import "./App.css";

class App extends Component {
  state = {
    storageValue: 40,
    web3: null,
    accounts: null,
    contract: null
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = ClaimVerification.networks[networkId];
      const instance = new web3.eth.Contract(
        ClaimVerification.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.preloadInformation);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };


  preloadInformation = async () => {
    try {
      const {accounts, contract } = this.state;

      //adds an insuruser
      const insurer = await contract.methods.addInsurer("CMS").send({ from: accounts[0] });
      console.log("INSURER: ", insurer.events.InsurerCreated.returnValues.id);
      const provider = await contract.methods.addProvider("UCSD Medical", insurer.events.InsurerCreated.returnValues.id).send({ from: accounts[0] });
      console.log(provider);
      await contract.methods.addPatient("Ken", provider.events.ProviderCreated.returnValues.id).send({ from: accounts[0] });
      await contract.methods.addPatient("Danny", provider.events.ProviderCreated.returnValues.id).send({ from: accounts[0] });
      await contract.methods.addPatient("Antonio", provider.events.ProviderCreated.returnValues.id).send({ from: accounts[0] });




    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to preload information into the organizations contract.`,
      );
      console.error(error);
    }
  };


  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    await contract.methods.setAdmin(5).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.getAdmin().call();

    // Update state with the result.
    this.setState({ storageValue: response });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div>
        <h1 id='centerText'>Provider Dashboard</h1>
        <Row>
          <Col md={6}>
            <h2 id='centerText'>Patient List</h2>
            <ul>
              <PatientCell name='Ken' />
              <PatientCell name='Jim' />
              <PatientCell name='Danny' />
              <PatientCell name='Antonio' />
            </ul>
          </Col>
          <Col md={6}>
            <h2 id='centerText'>Add Patient</h2>
            <Form id='form'>
              <FormGroup>
                <Input placeholder="Name" />
              </FormGroup>
              <div className="text-right">
                <Button color='success'>Enter</Button>
              </div>
            </Form>
          </Col>
        </Row>
      </div>
    );
  }
}

export default App;
