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
            patContract: this.props.patContract,
            proContract: this.props.proContract,
            insContract: this.props.insContract,
            unverifiedClaims: [],
            unclaimedServiecs: []
        };
        this.providerID = null
        this.unverifiedClaims = []
        this.verifiedClaims = []
        this.patientId = this.props.id
        this.patientname = this.props.username;
        this.serviceClaimID = null;
        this.updatePatientName = this.updatePatientName.bind(this);
        this.getUnverifiedClaims = this.getUnverifiedClaims.bind(this)
        this.getUnclaimedServices = this.getUnclaimedServices.bind(this)
        this.deleteClaimFromList = this.deleteClaimFromList.bind(this);
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
        this.getUnclaimedServices(this.patientId);
        console.log('provider contract: ', this.state.proContract)
        console.log('patient contract: ', this.state.patContract)
        // this.state.proContract.events.ClaimCreated(function (err, res) {
        //     if (!err) {
        //         _.getUnverifiedClaims(_.patientId);
        //     }
        // })
        this.state.patContract.events.Claims()
            .on('data', (event) => {
                console.log('detected event! ', event);
                _.getUnverifiedClaims(_.patientId);
                _.getUnclaimedServices(_.patientId);
            })
            .on('error', console.error);
    };

    deleteClaimFromList(i) {
        console.log('Deleting Claim')
        let list = this.state.unverifiedClaims;
        list.splice(i, 1)
        this.setState({ unverifiedClaims: list })
    }

    getUnverifiedClaims = async (id) => {
        const { patContract } = this.state;
        const unv = await patContract.methods.getUC().call();
        console.log('results from unverifiedClaims', unv)
        this.setState({ unverifiedClaims: unv })
        console.log("state of unv", this.state.unverifiedClaims)
    }

    getUnclaimedServices = async (id) => {
        const { patContract } = this.state;
        const unv = await patContract.methods.getUS().call();
        console.log('results from unclaimedServices', unv)
        this.setState({ unclaimedServices: unv })
        console.log("state of unc", this.state.unclaimedServices)
    }

    verifyClaim = async (serviceClaimID, confirmed) => {
        const { accounts, patContract } = this.state;
        const info = await patContract.methods.verifyClaim(serviceClaimID, Date.now(), confirmed).send({ from: accounts[0] });
        console.log('confirmation', info)
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
                <h5>Patient Name: {this.patientname}</h5>
                <ul id='cells'>
                    {
                        this.state.unverifiedClaims &&
                            this.state.unverifiedClaims.length > 0 ?
                            this.state.unverifiedClaims.map((output, i) => {
                                return <ServiceCell
                                    serviceName={output[0]}
                                    serviceAddr={output[1]}
                                    timeProvided={output[2]}
                                    timeFiled={output[3]}
                                    verifyClaim={this.verifyClaim}
                                    i={i}
                                    deleteClaimFromList={this.deleteClaimFromList}
                                    arrLength={this.state.unverifiedClaims.length}
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
