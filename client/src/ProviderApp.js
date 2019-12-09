import React, { Component } from "react";
import ClaimVerification from "./contracts/Organizations.json"
import getWeb3 from "./utils/getWeb3";
import PatientCell from './components/PatientCell'
import Header from './components/Header'
import { Row, Col, Form, Input, Button, FormGroup } from 'reactstrap';
import ReactDOM from "react-dom"
import $ from 'jquery'

import "./App.css";

export class ProviderApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      web3: this.props.web3,
      accounts: this.props.accounts,
      contract: this.props.contract,
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
    let patientList = [];
    const patients = this.solidityData.events.PatientCreated;
    this.providerID = this.solidityData.events.ProviderCreated.returnValues.id;
    for (let i = 0; i < patients.length; i++) {
      patientList.push([patients[i].returnValues.name, patients[i].returnValues.id]);
    }
    console.log(patientList)
    this.setState({ patients: patientList })
    // const { accounts, contract } = this.state;
    // const info = await contract.methods.getPatients().send({ from: accounts[0] });
    // console.log("please work", info)
  };

  provideService = async(serviceName, providerID, patientID) => {
    const { accounts, contract } = this.state;
    const info = await contract.methods.provideService(serviceName, providerID, patientID, Date.now()).send({ from: accounts[0] });
    this.serviceClaimID = info.events.SCID.returnValues.ID;
    console.log('provided service ID ',this.serviceClaimID)
    // this.notification_serviceClaimCreated(this.patientname, this.serviceClaimID, serviceName);
    return info;
  }

  fileClaim = async(serviceClaimID, amount) => {
    const { accounts, contract } = this.state;
    const info = await contract.methods.fileClaim(serviceClaimID, amount, Date.now()).send({ from: accounts[0] });
    // this.notification_claimAdded(this.patientname, serviceClaimID, serviceName, amount);
    console.log('Adding Claim', info.events)
    return info;
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
    // this.notification_patientCellCreated(this.patientname);
  }

  // fetchData = async () => {
  //   const { accounts, contract } = this.state;
  //   let patientList = [];
  //   const info = await contract.methods.preLoadInfo().send({ from: accounts[0] });
  //   this.solidityData = info;
  //   console.log("Fetched data",info)
  //   const patients = this.solidityData.events.PatientCreated;
  //   this.providerID = this.solidityData.events.ProviderCreated.returnValues.id;
  //   for (let i = 0; i < patients.length; i++) {
  //     patientList.push([patients[i].returnValues.name, patients[i].returnValues.id]);
  //   }
  //   console.log(patientList)
  //   this.setState({ patients: patientList })
  // };

  render() {
    let sd = this.solidityData
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div>
        <Header dashboard={'Provider Dashboard'}/>
        <Row>
          <Col md={6}>
            <h2 id='centerText'>Patient List</h2>
            <ul id='cells'>
              {this.state.patients.map((o, i) => {
                return <PatientCell name={o[0]} 
                                    key={i}
                                    patientID={o[1]}
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
              <div ref="sold" className="expandable" id="nav"/>
            </Form>
          </Col>
        </Row>
      </div>
    );
  }
}

export default ProviderApp;
