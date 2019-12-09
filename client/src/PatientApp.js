import React, { Component } from "react";
import ClaimVerification from "./contracts/Organizations.json"
import getWeb3 from "./utils/getWeb3";
import ServiceCell from './components/ServiceCell'
import { Card, CardBody, CardGroup } from 'reactstrap';
import ReactDOM from "react-dom"
import $ from 'jquery'
import Header from './components/Header'

import Banner from './components/Banner'
import profile from './profile.png'

import "./App.css";

export class PatientApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            web3: this.props.web3,
            accounts: this.props.accounts,
            contract: this.props.contract,
            unverifiedClaims: [],
            tokens: 0
        };
        this.providerID = null
        this.unverifiedClaims = []
        this.verifiedClaims = []
        this.patientId = this.props.id
        // this.solidityData = this.props.sd;
        this.patientname = this.props.username;
        this.serviceClaimID = null;
        this.updatePatientName = this.updatePatientName.bind(this);
        // this.getClaims = this.getClaims.bind(this)
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
        const { accounts, contract } = _.state;
        _.getUnverifiedClaims(this.patientId);
        const tokens = await contract.methods.getPatientTokens(_.patientId).call({ from: accounts[0] });
        console.log('Tokens', tokens)
        _.setState({ tokens: tokens })
        _.state.contract.events.ClaimCreated(function (err, res) {
            if (!err) {
                _.getUnverifiedClaims(_.patientId);
            }
        })
    };

    deleteClaimFromList(i) {
        console.log('Deleting Claim')
        let list = this.state.unverifiedClaims;
        list.splice(i, 1)
        this.setState({ unverifiedClaims: list })
    }

    getUnverifiedClaims = async (id) => {
        const { accounts, contract } = this.state;
        var list = []
        const unv = await contract.methods.getAllUnverifiedServices().send({ from: accounts[0] });
        console.log('results from getAllUnverifiedServices', unv)
        if (unv.events.ServiceClaimInfo) {
            if (!unv.events.ServiceClaimInfo.length) {
                if (unv.events.ServiceClaimInfo.returnValues.patient === id) {
                    list.push([unv.events.ServiceClaimInfo.returnValues.claimname,
                    unv.events.ServiceClaimInfo.returnValues.addr,
                    unv.events.ServiceClaimInfo.returnValues.timeProvided,
                    unv.events.ServiceClaimInfo.returnValues.timeFiled])
                }
            } else {
                for (let i = 0; i < unv.events.ServiceClaimInfo.length; i++) {
                    if (unv.events.ServiceClaimInfo[i].returnValues.patient === id) {
                        list.push([unv.events.ServiceClaimInfo[i].returnValues.claimname,
                        unv.events.ServiceClaimInfo[i].returnValues.addr,
                        unv.events.ServiceClaimInfo[i].returnValues.timeProvided,
                        unv.events.ServiceClaimInfo[i].returnValues.timeFiled])
                    }
                }
            }
            this.setState({ unverifiedClaims: list })
        }
        // if (unv.events.SCName) {
        //     if (!unv.events.SCName.length) {
        //         if (parseInt(unv.events.serviceList.returnValues.services[0]) !== 0) {
        //             list.push([unv.events.SCName.returnValues.name, unv.events.serviceList.returnValues.services[0]])
        //         }
        //     }
        //     else {
        //         for (let i = 0; i < unv.events.SCName.length; i++) {
        //             if (parseInt(unv.events.serviceList.returnValues.services[i]) !== 0) {
        //                 list.push([unv.events.SCName[i].returnValues.name, unv.events.serviceList.returnValues.services[i]])
        //             }
        //         }
        //     }
        //     this.setState({ unverifiedClaims: list })
        // }
        console.log("state of unv", this.state.unverifiedClaims)
    }

    verifyClaim = async (serviceClaimID, confirmed) => {
        const { accounts, contract } = this.state;
        const info = await contract.methods.verifyClaim(serviceClaimID, Date.now(), confirmed).send({ from: accounts[0] });
        console.log('confirmation', info)
        const tokens = await contract.methods.getPatientTokens(this.patientId).call({ from: accounts[0] });
        this.setState({ tokens: tokens });
        // this.getUnverifiedClaims(this.patientId);
        // const ver = await contract.methods.patientVerifiedClaims(this.patientId).send({ from: accounts[0] });
        // console.log('verifiedClaims', ver, 'confirmation', info)
    }

    render() {
        // let sd = this.solidityData
        console.log("Rendering PatientApp")
        console.log('Tokens', this.state.tokens)
        if (!this.state.web3) {
            return <div>Loading Web3, accounts, and contract...</div>;
        }
        return (
            <div>
                <Header/>
                <Banner tokens={this.state.tokens} name={this.patientname} dashboard={'Patient'}/>
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
            </div >
        );
    }
}

export default PatientApp;
