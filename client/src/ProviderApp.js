import React, { Component } from "react";
import ClaimVerification from "./contracts/Organizations.json"
import getWeb3 from "./utils/getWeb3";
import PatientCell from './components/PatientCell'
import { Row, Col, Form, Input, Button, FormGroup } from 'reactstrap';
import ReactDOM from "react-dom"
import $ from 'jquery'
import Patient from "./contracts/Patient.json";

import "./App.css";

export class ProviderApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      web3: this.props.web3,
      accounts: this.props.accounts,
      proContract: this.props.proContract,
      patContract: this.props.patContract,
      patients: [],
    };
    this.providerID = null
    this.solidityData = this.props.sd;
    this.patientname = null;
    this.serviceClaimID = null;
    this.updatePatientName = this.updatePatientName.bind(this);
    this.provideService = this.provideService.bind(this);
    this.fileClaim = this.fileClaim.bind(this);
  }

  notification_patientCellCreated(patientname) {
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

  notification_claimAdded(patientname, serviceID, service, amount) {
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

  notification_serviceClaimCreated(patientname, serviceID, service) {
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
    const { accounts, proContract } = this.state;
    try {
      const addedPatient = await proContract.methods.addPatient('Ken').send({ from: accounts[0]});
      const patientAddrs = await proContract.methods.getPatients().call();
      console.log("Patients: ", patientAddrs);
      var list = [];
      for(var i = 0; i < patientAddrs.length; i++){
        var addr = patientAddrs[i];
        var name = await proContract.methods.getPatientName(addr).call();
        list.push({name, addr})
      }
      this.setState({ patients: list })
      console.log(this.state.patients)
    }
    catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  provideService = async (serviceName, patientAddr) => {
    const { accounts, proContract } = this.state;
    const info = await proContract.methods.provideService(serviceName, patientAddr).send({ from: accounts[0] });
    this.serviceClaimAddr = info.events.SCID.returnValues.addr;
    console.log('provided service Addr ', this.serviceClaimAddr)
    // this.notification_serviceClaimCreated(this.patientname, this.serviceClaimID, serviceName);
    return info;
  }

  fileClaim = async (serviceClaimAddr, amount) => {
    const { accounts, proContract } = this.state;
    const info = await proContract.methods.fileClaim(serviceClaimAddr, amount, Date.now()).send({ from: accounts[0] });
    // this.notification_claimAdded(this.patientname, serviceClaimID, serviceName, amount);
    console.log('Adding Claim', info.events)
    return info;
  }

  onFormSubmit = async (e) => {
    e.preventDefault()
    const { accounts, contract } = this.state;
    const info = await contract.methods.addPatient(this.patientname, this.solidityData.events.ProviderCreated.returnValues.id).send({ from: accounts[0] });
    console.log("Added patient", info)
    let patientList = this.state.patients;
    const newPatient = [info.events.PatientCreated.returnValues.name, info.events.PatientCreated.returnValues.id];
    patientList.push(newPatient);
    console.log(patientList)
    this.setState({ patients: patientList })
    ReactDOM.findDOMNode(this.refs.sold).innerHTML = "<p>Added new patient! Check your list!</p>";
    ReactDOM.findDOMNode(this.refs.sold).style.color = "#acd854";
    // this.notification_patientCellCreated(this.patientname);
  }

  render() {
    let sd = this.solidityData
    console.log('Rendering ProviderApp')
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div>
        <h1 id='centerText'>Provider Dashboard</h1>
        <Row>
          <Col md={6}>
            <h2 id='centerText'>Patient List</h2>
            <ul id='cells'>
              {this.state.patients.map((o, i) => {
                return <PatientCell name={o.name}
                  key={i}
                  patientAddr={o.addr}
                  providerID={this.providerID}
                  sd={sd}
                  provideService={this.provideService}
                  fileClaim={this.fileClaim}
                  web3={this.state.web3}
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
              <div ref="sold" className="expandable" id="nav" />
            </Form>
          </Col>
        </Row>
      </div>
    );
  }
}

export default ProviderApp;
