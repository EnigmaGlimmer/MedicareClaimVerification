import React, { Component } from "react";
import ClaimVerification from "./contracts/Organizations.json"
import getWeb3 from "./utils/getWeb3";
import PatientCell from './components/PatientCell'
import { Row, Col, Form, Input, Button, FormGroup } from 'reactstrap';
import ReactDOM from "react-dom"
import $ from 'jquery'

import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      storageValue: 40,
      web3: null,
      accounts: null,
      contract: null,
      patients: [],
    };
    this.providerID = null
    this.solidityData = null;
    this.patientname = null;
    this.serviceClaimID = null;
    this.updatePatientName = this.updatePatientName.bind(this);
    this.createServiceClaim = this.createServiceClaim.bind(this);
    this.addClaim = this.addClaim.bind(this);
  }

  notification_patientCellCreated(patientname){
    $.ajax({
      url: 'http://localhost:4000/patientCellCreated',
      type: 'POST',
      contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
      crossDomain: true,
      dataType: 'json',
      xhrFields: { withCredentials: true },
      data: {
        patientname
      },
      success: (data) => {
        if (data.message === 'OK') {
          console.log('Success sending email')
        }
        else {
          console.log('ERROR sending email');
        }
      }
    });
  }

  notification_claimAdded(patientname, serviceID, service, amount){
    $.ajax({
      url: 'http://localhost:4000/claimAdded',
      type: 'POST',
      contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
      crossDomain: true,
      dataType: 'json',
      xhrFields: { withCredentials: true },
      data: {
        patientname,
        serviceID,
        service,
        amount
      },
      success: (data) => {
        if (data.message === 'OK') {
          console.log('Success sending email')
        }
        else {
          console.log('ERROR sending email');
        }
      }
    });
  }

  notification_serviceClaimCreated(patientname, serviceID, service){
    $.ajax({
      url: 'http://localhost:4000/serviceClaimCreated',
      type: 'POST',
      contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
      crossDomain: true,
      dataType: 'json',
      xhrFields: { withCredentials: true },
      data: {
        patientname,
        serviceID,
        service
      },
      success: (data) => {
        if (data.message === 'OK') {
          console.log('Success sending email')
        }
        else {
          console.log('ERROR sending email');
        }
      }
    });
  }

  updatePatientName({ target }) {
    this.patientname = target.value
  }

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
      this.setState({ web3, accounts, contract: instance }, this.fetchData);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  createServiceClaim = async(serviceName, providerID, patientID) => {
    const { accounts, contract } = this.state;
    const info = await contract.methods.newServiceClaim(serviceName, providerID, patientID).send({ from: accounts[0] });
    console.log(info)
    this.serviceClaimID = info.events.SCID.returnValues.ID;
    this.notification_serviceClaimCreated(this.patientname, this.serviceClaimID, serviceName);
  }

  addClaim = async(serviceClaimID, amount, serviceName) => {
    const { accounts, contract } = this.state;
    serviceClaimID = serviceClaimID || this.serviceClaimID;
    const info = await contract.methods.addClaim(serviceClaimID, amount).send({ from: accounts[0] });
    console.log(info)
    this.notification_claimAdded(this.patientname, serviceClaimID, serviceName, amount);
  }

  onFormSubmit = async(e) => {
    e.preventDefault()
    const { accounts, contract } = this.state;
    const info = await contract.methods.addPatient(this.patientname, this.solidityData.events.ProviderCreated.returnValues.id).send({ from: accounts[0] });
    console.log("Added patient",info)
    let patientList = this.state.patients;
    const newPatient = [info.events.PatientCreated.returnValues.name, info.events.PatientCreated.returnValues.id];
    patientList.push(newPatient);
    console.log(patientList)
    this.setState({patients: patientList})
    ReactDOM.findDOMNode(this.refs.sold).innerHTML = "<p>Added new patient! Check your list!</p>";
    ReactDOM.findDOMNode(this.refs.sold).style.color = "#acd854";
    this.notification_patientCellCreated(this.patientname);
  }

  fetchData = async () => {
    const { accounts, contract } = this.state;
    let patientList = [];
    const info = await contract.methods.preLoadInfo().send({ from: accounts[0] });
    this.solidityData = info;
    console.log("Fetched data",info)
    const patients = this.solidityData.events.PatientCreated;
    this.providerID = this.solidityData.events.ProviderCreated.returnValues.id;
    for (let i = 0; i < patients.length; i++) {
      patientList.push([patients[i].returnValues.name, patients[i].returnValues.id]);
    }
    console.log(patientList)
    this.setState({ patients: patientList })
  };

  render() {
    let sd = this.solidityData
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
              {this.state.patients.map((o, i) => {
                return <PatientCell name={o[0]} 
                                    key={i}
                                    patientID={o[1]}
                                    providerID={this.providerID}
                                    sd={sd}
                                    createServiceClaim={this.createServiceClaim}
                                    addClaim={this.addClaim}
                                    accounts={this.state.accounts}
                                    contract={this.state.contract}
                                    notification_claimAdded={this.notification_claimAdded}
                                    />
              })}
            </ul>
          </Col>
          <Col md={6}>
            <h2 id='centerText'>Add Patient</h2>
            <Form id="form" onSubmit={this.onFormSubmit}>
              <FormGroup>
                <Input onChange={this.updatePatientName} placeholder="Name" />
              </FormGroup>
              <div className="text-right">
                <Button type="submit" color='success'>Enter</Button>
              </div>
              <div ref="sold" className="expandable" id="nav"/>
            </Form>
          </Col>
        </Row>
      </div>
    );
  }
}

export default App;
