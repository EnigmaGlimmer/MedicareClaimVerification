import React, { Component } from "react";
import ClaimVerification from "./contracts/Organizations.json"
import getWeb3 from "./utils/getWeb3";
import ServiceCell from './components/ServiceCell'
import { Card, CardBody, CardGroup } from 'reactstrap';
import ReactDOM from "react-dom"
import $ from 'jquery'
import Patient from "./contracts/Patient.json"
import ServiceClaim from "./contracts/ServiceClaim.json"
import Header from './components/Header'
import Footer from './components/Footer'
import Banner from './components/Banner'
import profile from './profile.png'

import "./App.css";

export class PatientApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            web3: this.props.web3,
            accounts: this.props.accounts,
            patContractAddress: this.props.patContractAddress, //this stores the address that will be used to create a contract
            patContract: null,
            proContract: this.props.proContract,
            insContract: this.props.insContract,
            unverifiedClaims: [],
            unclaimedServices: [],
            tokens: 0
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
        this.updateTokens = this.updateTokens.bind(this)
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
        // var event = _.state.patContract.Claims();
        const contract = new this.state.web3.eth.Contract(Patient.abi, this.state.patContractAddress);
        console.log('localPatientContract', contract)
        this.setState({patContract: contract})
        console.log('patientId', _.patientId)
        console.log('provider contract: ', _.state.proContract)
        // console.log('patient contract: ', _.state.patContract)
        if(_.state.patContract){
            _.getUnverifiedClaims();
            _.updateTokens();
            // _.getUnclaimedServices();
        }
        setInterval(function(){
            if(_.state.patContract){
                _.getUnverifiedClaims();
                _.updateTokens();
                // _.getUnclaimedServices();
            }
        }, 5000);
        // event.watch(function(error, result){
        //     console.log('detected event Claims!')
        //     if (!error)
        //         console.log(result);
        // });
    };

    updateTokens = async () => {
        const { accounts, patContract } = this.state;
        const balance = await patContract.methods.getBalance().call();
        this.setState({tokens: balance})
    }

    deleteClaimFromList(i) {
        console.log('Deleting Claim')
        let list = this.state.unverifiedClaims;
        list.splice(i, 1)
        this.setState({ unverifiedClaims: list })
    }

    getUnverifiedClaims = async () => {
        // console.log('method getUnverifiedClaims');
        const { patContract } = this.state;
        const unv = await patContract.methods.getUC().call();
        let list = [];
        for( let i in unv ){
            // console.log(i)
            const addr = unv[i];
            const name = await patContract.methods.getServiceClaimName(addr).call();
            const timeP = await patContract.methods.getServiceClaimTimeProvided(addr).call();
            const timeF = await patContract.methods.getServiceClaimTimeFiled(addr).call();
            list.push({name, addr, timeP, timeF})
        }
        // console.log('what is in the list:', list)
        this.setState({ unverifiedClaims: list })
    }

    getUnclaimedServices = async () => {
        // console.log('method getUnclaimedServices');
        const { patContract } = this.state;
        const unc = await patContract.methods.getUS().call();
        console.log('unc', unc)
        this.setState({ unclaimedServices: unc })
    }

    verifyClaim = async (serviceClaimID, confirmed) => {
        console.log('PatientApp verifyClaim confirm status, ', confirmed)
        const { accounts, patContract } = this.state;
        const info = await patContract.methods.verifyClaim(serviceClaimID, Date.now(), confirmed).send({ from: accounts[0] });
        console.log('confirmation', info)
    }

    render() {
        // let sd = this.solidityData
        console.log("Rendering PatientApp")
        // console.log('Tokens', this.state.tokens)
        if (!this.state.web3) {
            return <div>Loading Web3, accounts, and contract...</div>;
        }
        return (
            <div>
                <Header/>
                <div style={{marginLeft: '10%', marginRight: '10%'}}>
                <Banner tokens={this.state.tokens} name={this.patientname} dashboard={'Patient'}/>
                <ul id='cells'>
                    {
                        this.state.unverifiedClaims &&
                            this.state.unverifiedClaims.length > 0 ?
                            this.state.unverifiedClaims.map((output, i) => {
                                return <ServiceCell
                                    serviceName={output.name}
                                    serviceAddr={output.addr}
                                    timeProvided={output.timeP}
                                    timeFiled={output.timeF}
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
                <Footer />
            </div >
        );
    }
}

export default PatientApp;
