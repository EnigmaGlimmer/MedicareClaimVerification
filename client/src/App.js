import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import { Input, Form, Button, FormGroup, Card } from 'reactstrap';
import ClaimVerification from "./contracts/Organizations.json"
import getWeb3 from "./utils/getWeb3";
import { log } from './App-unused';
import $ from 'jquery'
import PatientApp from './PatientApp'
import ProviderApp from './ProviderApp'
import './Login.css'

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            patientLoginSuccess: false,
            providerLoginSuccess: false,
            contract: null,
            accounts: null,
            web3: null
        };
        this.id = null;
        this.solidityData = null;
        this.updateID = this.updateID.bind(this)
        // this.redirectAfterLogin = this.redirectAfterLogin.bind(this);
    }

    updateID({ target }) {
        this.id = target.value;
    }

    handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            this.onFormSubmit(event);
        }
    }

    fetchData = async () => {
        const { accounts, contract } = this.state;
        const info = await contract.methods.preLoadInfo().send({ from: accounts[0] });
        this.solidityData = info;
        console.log("Fetched data", info)
    };

    // redirectAfterLogin() {
    //     if (this.state.patientLoginSuccess) {
    //         console.log('heading to patient')
    //         return (
    //             <Redirect to='/Patient'/>
    //         );
    //     }
    //     else if (this.state.providerLoginSuccess) {
    //         console.log('heading to provider')
    //         return (
    //             <Redirect to='/Provider'/>
    //         );
    //     }
    // }

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

    onFormSubmit = async (e) => {
        e.preventDefault()
        const { accounts, contract } = this.state;
        const i1 = await contract.methods.getPatient(this.id).send({ from: accounts[0] })
        const i2 = await contract.methods.getProvider(this.id).send({ from: accounts[0] })
        if (i1.events.PatientRetrieval.returnValues[0][0] === this.id) {
            log.loggedIn = true;
            this.setState({ patientLoginSuccess: true })
        }
        else if (i2.events.ProviderRetrieval.returnValues[0][0] === this.id) {
            log.loggedIn = true;
            this.setState({ providerLoginSuccess: true })
        }
    }

    render() {
        if (!this.state.web3) {
            return <div>Loading Web3, accounts, and contract...</div>;
        }
        return (
            <div>
                {
                    this.state.patientLoginSuccess ? <PatientApp 
                        sd={this.solidityData}
                        contract={this.state.contract}
                        accounts={this.state.accounts}
                        web3={this.state.web3}
                        id={this.id} /> : null
                }
                {
                    this.state.providerLoginSuccess ? <ProviderApp 
                        sd={this.solidityData}
                        contract={this.state.contract}
                        accounts={this.state.accounts}
                        web3={this.state.web3}
                        id={this.id} /> : null
                }
                {/* {this.redirectAfterLogin()} */}
                {!this.state.patientLoginSuccess && !this.state.providerLoginSuccess ?
                    <Card id='login'>
                        <Form id="form" onSubmit={this.onFormSubmit} style={{ textAlign: 'center' }}>
                            <FormGroup>
                                <Input onChange={this.updateID} />
                            </FormGroup>
                            <Button type="submit" color='success'>Enter</Button>
                        </Form>
                    </Card> : null
                }
            </div>
        );
    }
}

export default App;
