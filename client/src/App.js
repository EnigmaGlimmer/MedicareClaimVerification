import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import { Input, Form, Button, FormGroup, Card } from 'reactstrap';
// import ClaimVerification from "./contracts/Organizations.json"; 
import Insurer from "./contracts/Insurer.json";
import Provider from "./contracts/Provider.json";
import Patient from "./contracts/Patient.json"
import getWeb3 from "./utils/getWeb3";
import $ from 'jquery'
import PatientApp from './PatientApp'
import ProviderApp from './ProviderApp'
import InsurerApp from './InsurerApp'
import './Login.css'
import aeec_logo from './aeec.png'
import Footer from './components/Footer'
import ReactNotification from 'react-notifications-component'
import { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css'
import { log } from './App-unused.js';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            patientLoginSuccess: false,
            providerLoginSuccess: false,
            insurerLoginSuccess: false,
            loginSuccess: false,
            insurerContract: null,
            providerContracts: {},
            patientContracts: {},
            accounts: null,
            web3: null,
            redirectRef: false
        };
        this.web3 = null;
        this.role = 'Patient';
        this.sql_role = null;
        this.username = null;
        this.sql_name = null;
        this.id = null;
        this.password = null;
        this.updateUsername = this.updateUsername.bind(this)
        this.updatePassword = this.updatePassword.bind(this)
        this.addPatContractAddress = this.addPatContractAddress.bind(this)
        this.addProContractAddress = this.addProContractAddress.bind(this)
        // this.redirect = this.redirect.bind(this)
    }

    addPatContractAddress = async (patContractAddress) => {
        console.log('New Patient Contract found')
        window.localStorage.setItem('patContractAddress', patContractAddress);

        /*TODO- Window Storage is storing only one patient address, 
        meaning multiple different patient accounts will share the same personal 
        information from the same patient contract, need to fix */
        console.log('added localPatientContract address:', window.localStorage.getItem('patContractAddress'))
    }

    addProContractAddress = async (proContractAddress) => {
        console.log('New Provider Contract found')
        window.localStorage.setItem('proContractAddress', proContractAddress);
        console.log('added localProviderContract address:', window.localStorage.getItem('proContractAddress'))
    }

    updatePassword({ target }){
        this.password = target.value;
    }

    updateUsername({ target }) {
        this.username = target.value;
        this.id = target.value;
    }

    handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            this.onFormSubmit(event);
        }
    }

    componentDidMount = async () => {
        try {
            console.log('localPatientContract', window.localStorage.getItem('patContractAddress'))
            console.log('localProviderContract', window.localStorage.getItem('proContractAddress'))
            // Get network provider and web3 instance.
            this.web3 = await getWeb3();

            // Use web3 to get the user's accounts.
            const accounts = await this.web3.eth.getAccounts();

            // Get the contract instance.
            const networkId = await this.web3.eth.net.getId();

            console.log('networkId', networkId)
            console.log('Insurer Networks', Insurer.networks)
            console.log('Provider Networks', Provider.networks)

            const deployedNetworkIns = Insurer.networks[networkId];
            console.log('what is Insurer.networks[networkId]', deployedNetworkIns)
            const instanceIns = new this.web3.eth.Contract(
                Insurer.abi,
                deployedNetworkIns && deployedNetworkIns.address,
            );

            // const deployedNetworkPro = Provider.networks[networkId];
            // console.log('what is Provider.networks[networkId]', deployedNetworkPro)
            // const instancePro = new this.web3.eth.Contract(
            //     Provider.abi,
            //     deployedNetworkPro && deployedNetworkPro.address,
            // );

            // const deployedNetworkPat = Patient.networks[networkId];
            // console.log('what is deployedNetwork', deployedNetworkPat)
            // const instancePat = new web3.eth.Contract(
            //     Patient.abi,
            //     deployedNetworkPat && deployedNetworkPat.address,
            // );

            // this.addProContract('UCSD Medical', instancePro)
            // this.addPatContract('Ken', instancePat)

            // Set web3, accounts, and contract to the state, and then proceed with an
            // example of interacting with the contract's methods.
            this.setState({ web3: this.web3, accounts, contractIns: instanceIns });
            $.ajax({
                url:'http://localhost:4000/profile/loggedin',
                type:'GET',
                contentType: "application/json; charset=utf-8",
                crossDomain: true,
                dataType: 'json',
                xhrFields: { withCredentials: true },
                success: (data) => {
                    if (data.message === 'OK'){
                        this.sql_id = data.result.id
                        this.sql_role = data.result.role
                        this.setState({redirectRef: true});
                    } else {
                        this.setState({redirectRef: false});
                    }
                }
            });
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
        this.ajax_sql_login()
    }

    ajax_sql_login() {
        console.log(this.id)
        console.log(this.password)
        $.ajax({
            url: 'http://localhost:4000/profile/login',
            type: 'POST',
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            crossDomain: true,
            dataType: 'json',
            xhrFields: { withCredentials: true },
            data: {
                id: this.id,
                password: this.password
            },
            success: async (data) => {
                    console.log('Success logging in', data)
                    this.sql_name = data.user.name
                    this.sql_role = data.user.role
                    console.log(this.sql_name, this.sql_role)
                    if (data.user.role === 'Patient') {
                        this.setState({ patientLoginSuccess: true })
                    }
                    else if (data.user.role === 'Provider') {
                        // this.fetchData().then(()=> {
                        this.setState({ providerLoginSuccess: true })
                        // })
                    }
                    else {
                        this.setState({ insurerLoginSuccess: true })
                    }
                    // this.setState({ loginSuccess: true });
                    // log.authenticate();
                },
            error: async (data) => {
                alert('invalid credentials')
            }
        });
    }

    ajax_login() {
        $.ajax({
            url: 'http://localhost:4000/login',
            type: 'POST',
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            crossDomain: true,
            dataType: 'json',
            xhrFields: { withCredentials: true },
            data: {
                username: this.username
            },
            success: async (data) => {
                if (data.message === 'OK') {
                    console.log('Success logging in', data.result)
                    // this.id = data.result.id;
                    // log.loggedIn = true;
                    if (data.result.role === 'Patient') {
                        this.setState({ patientLoginSuccess: true })
                    }
                    else if (data.result.role === 'Provider') {
                        // this.fetchData().then(()=> {
                        this.setState({ providerLoginSuccess: true })
                        // })
                    }
                    else {
                        this.setState({ insurerLoginSuccess: true })
                    }
                }
                else {
                    console.log('ERROR logging in');
                }
            }
        });
    }

    // redirect(){
    //     if(this.state.loginSuccess){
    //         if(this.sql_role === 'Patient'){
    //             return(
    //                 <Redirect to='/Patient' />
    //             );
    //         }
    //         if(this.sql_role === 'Provider'){
    //             return(
    //                 <Redirect to='/Provider' />
    //             );
    //         }
    //         if(this.sql_role === 'Insurer'){
    //             return(
    //                 <Redirect to='/Insurer' />
    //             );
    //         }
    //     }
    // }

    render() {
        if (!this.state.web3) {
            return <div>Loading Web3, accounts, and contract...</div>;
        }
        // if(this.state.redirectRef){
        //     if(this.role === 'patient'){
        //         return(
        //             <Redirect to='/Patient' />
        //         );
        //     }
        //     if(this.role === 'provider'){
        //         return(
        //             <Redirect to='/Provider' />
        //         );
        //     }
        //     if(this.role === 'insurer'){
        //         return(
        //             <Redirect to='/Insurer' />
        //         );
        //     }      
        // }
        return (
            <div>
                {/* {this.redirect()} */}
                <ReactNotification />
                {
                    this.state.patientLoginSuccess ? <PatientApp
                        username={this.username}
                        accounts={this.state.accounts}
                        web3={this.state.web3}
                        patContractAddress={window.localStorage.getItem('patContractAddress')}
                        proContractAddress={window.localStorage.getItem('proContractAddress')}
                        // proContract={this.state.providerContracts['UCSD Medical']}
                        insContract={this.state.contractIns}
                    /> : null
                }
                {
                    this.state.providerLoginSuccess ? <ProviderApp
                        username={this.username}
                        accounts={this.state.accounts}
                        web3={this.state.web3}
                        proContractAddress={window.localStorage.getItem('proContractAddress')}
                        insContract={this.state.contractIns}
                        addPatContractAddress={this.addPatContractAddress}
                    /> : null
                }
                {
                    this.state.insurerLoginSuccess ? <InsurerApp
                        username={this.username}
                        insContract={this.state.contractIns}
                        accounts={this.state.accounts}
                        web3={this.state.web3}
                        // proContract={this.state.providerContracts[this.username]}
                        addProContractAddress={this.addProContractAddress}
                    /> : null
                } */}
                {/* {!this.state.patientLoginSuccess && !this.state.providerLoginSuccess && !this.state.insurerLoginSuccess ?
                    <div style={{ textAlign: 'center' }}>
                        <img src={aeec_logo} alt='AEEC' height='100' width='100' />
                        <h1>Medicare Insurance Claim Tracking</h1>
                        <Card id='login'>
                            <Form id="form" onSubmit={this.onFormSubmit}>
                                <h4>Login</h4>
                                <FormGroup>
                                    <Input placeholder='Username' onChange={this.updateUsername} />
                                    <br></br>
                                    <Input type='password' placeholder='Password' onChange={this.updatePassword} />
                                </FormGroup>
                                <Button type="submit" color='success'>Enter</Button>
                            </Form>
                        </Card>
                    </div> 
                    {/* : null } */}
                <Footer />
            </div>
        );
    }
}

export default App;
