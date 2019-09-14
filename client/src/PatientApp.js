import React, { Component } from "react";
import ClaimVerification from "./contracts/Organizations.json"
import getWeb3 from "./utils/getWeb3";
import ServiceCell from './components/ServiceCell'
import { Card, CardBody, CardGroup } from 'reactstrap';
import ReactDOM from "react-dom"
import $ from 'jquery'

import "./App.css";

export class PatientApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            web3: this.props.web3,
            accounts: this.props.accounts,
            contract: this.props.contract,
            unverifiedClaims: []
        };
        this.providerID = null
        this.unverifiedClaims = []
        this.verifiedClaims = []
        this.patientId = this.props.id
        // this.solidityData = this.props.sd;
        this.patientname = null;
        this.serviceClaimID = null;
        this.updatePatientName = this.updatePatientName.bind(this);
        this.getClaims = this.getClaims.bind(this)
        this.getUnverifiedClaims = this.getUnverifiedClaims.bind(this)
        this.deleteClaimFromList = this.deleteClaimFromList.bind(this);
        // this.provideService = this.provideService.bind(this);
        // this.fileClaim = this.fileClaim.bind(this);
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
        var _ = this;
        this.getUnverifiedClaims(this.patientId);
        this.state.contract.events.ClaimCreated(function(err, res) {
            if(!err){
                _.getUnverifiedClaims(_.patientId);
            }
        })
        // var _ = this;
        // setInterval(function () {
        //     _.getUnverifiedClaims(_.patientId);
        // }, 10000);
    };

    deleteClaimFromList(i) {
        console.log('Deleting Claim')
        let list = this.state.unverifiedClaims;
        list.splice(i, 1)
        this.setState({ unverifiedClaims: list })
    }

    getClaims = async (id) => {
        const { accounts, contract } = this.state;
        const unverifiedClaims = await contract.methods.patientUnverifiedClaims(id).send({ from: accounts[0] });
        this.unverifiedClaims = unverifiedClaims;
        console.log('unv', this.unverifiedClaims)
        const verifiedClaims = await contract.methods.patientVerifiedClaims(id).send({ from: accounts[0] });
        this.verifiedClaims = verifiedClaims;
        console.log('ver', this.verifiedClaims)
    }

    getUnverifiedClaims = async (id) => {
        const { accounts, contract } = this.state;
        var list = []
        const unv = await contract.methods.patientUnverifiedClaims(id).send({ from: accounts[0] });
        console.log('results from patientUnverifiedClaims', unv)
        if (unv.events.SCName) {
            if (!unv.events.SCName.length) {
                if (parseInt(unv.events.serviceList.returnValues.services[0]) !== 0) {
                    list.push([unv.events.SCName.returnValues.name, unv.events.serviceList.returnValues.services[0]])
                }
            }
            else {
                for (let i = 0; i < unv.events.SCName.length; i++) {
                    if (parseInt(unv.events.serviceList.returnValues.services[i]) !== 0) {
                        list.push([unv.events.SCName[i].returnValues.name, unv.events.serviceList.returnValues.services[i]])
                    }
                }
            }
            this.setState({ unverifiedClaims: list })
        }
        console.log("state of unv", this.state.unverifiedClaims)
    }

    verifyClaim = async (serviceClaimID) => {
        const { accounts, contract } = this.state;
        const info = await contract.methods.verifyClaim(serviceClaimID).send({ from: accounts[0] });
        console.log('confirmation', info)
        // this.getUnverifiedClaims(this.patientId);
        // const ver = await contract.methods.patientVerifiedClaims(this.patientId).send({ from: accounts[0] });
        // console.log('verifiedClaims', ver, 'confirmation', info)
    }

    render() {
        // let sd = this.solidityData
        console.log("Rendering PatientApp")
        if (!this.state.web3) {
            return <div>Loading Web3, accounts, and contract...</div>;
        }
        return (
            <div>
                <h1 id='centerText'>Patient Dashboard</h1>

                <ul id='cells'>
                    {
                        this.state.unverifiedClaims &&
                            this.state.unverifiedClaims.length > 0 ?
                            this.state.unverifiedClaims.map((output, i) => {
                                return <ServiceCell
                                    contract={this.state.contract}
                                    accounts={this.state.accounts}
                                    serviceName={output[0]}
                                    serviceAddr={output[1]}
                                    verifyClaim={this.verifyClaim}
                                    i={i}
                                    deleteClaimFromList={this.deleteClaimFromList}
                                    arrLength ={this.state.unverifiedClaims.length}
                                />
                            }) :
                            <CardGroup style={{ textAlign: 'center', padding: '50px' }}>
                                <Card body outline color="primary" >
                                    <CardBody>
                                        You do not have any unverified claims yet.
                                </CardBody>
                                </Card>
                            </CardGroup>
                    }
                </ul>
            </div>
        );
    }
}

export default PatientApp;
