import React, { Component } from 'react';
import Insurer from "./contracts/Insurer.json";
import Provider from "./contracts/Provider.json";
import Patient from "./contracts/Patient.json"
import getWeb3 from "./utils/getWeb3";
import $ from 'jquery'
import Login from './components/Login'
import './Register.css'
import ReactNotification from 'react-notifications-component'
import Footer from './components/Footer'
import Portal from './Portal'
import 'react-notifications-component/dist/theme.css'

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
            redirectRef: false,
            signedInrole: ''
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
        this.checkIfUserExists = this.checkIfUserExists.bind(this)
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

    updatePassword({ target }) {
        this.password = target.value;
    }

    updateUsername({ target }) {
        this.username = target.value;
        this.id = target.value;
    }

    goTo(route) {
        this.props.history.replace(`/${route}`)
    }

    logout() {
        console.log('logout')
        this.props.auth.logout();
    }

    componentDidMount = async () => {
        try {
            const { renewSession } = this.props.auth;

            if (localStorage.getItem('isLoggedIn') === 'true') {
                renewSession();
            }
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
        } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
    };

    checkIfUserExists(em){
        let r = this.ajax_sql_login(em)
        console.log('mid function check', r)
        return r
    }

    ajax_sql_login(em) {
        console.log('ajax_sql_login', em)
        let res = null
        $.ajax({
            url: 'http://localhost:4000/profile/loginIDOnly',
            type: 'POST',
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            crossDomain: true,
            async: false,
            dataType: 'json',
            xhrFields: { withCredentials: true },
            data: {
                email: em
            },
            success: (data) => {
                console.log('Success logging in', data)
                this.sql_name = data.user.name
                this.sql_role = data.user.role
                console.log(this.sql_name, this.sql_role)
                res = { status: 'ok', role: data.user.role, name: data.user.name }
            },
            error: (data) => {
                console.log('failed login')
                res = { status: 'nok' }
            }
        })
        return res
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

    render() {
        const { isAuthenticated } = this.props.auth;
        if (!this.state.web3) {
            return <div>Loading Web3, accounts, and contract...</div>;
        }
        return (
            <div>
                {
                    isAuthenticated() && (
                        <div>
                            <ReactNotification />
                            <button onClick={() => this.logout()}>Logout</button>
                            <Portal
                                web3={this.state.web3}
                                accounts={this.state.accounts}
                                insContract={this.state.contractIns}
                                checkIfUserExists={this.checkIfUserExists}
                                auth={this.props.auth}
                            />
                        </div>
                    )
                }
                {
                    !isAuthenticated() && (
                        <Login auth={this.props.auth} />
                    )
                }
                {/* {this.state.insurerLoginSuccess ? <InsurerApp
                    username={this.username}
                    insContract={this.state.contractIns}
                    accounts={this.state.accounts}
                    web3={this.state.web3}
                    // proContract={this.state.providerContracts[this.username]}
                    addProContractAddress={this.addProContractAddress}
                /> : null}
                {this.state.providerLoginSuccess ? <ProviderApp
                    username={this.username}
                    accounts={this.state.accounts}
                    web3={this.state.web3}
                    proContractAddress={window.localStorage.getItem('proContractAddress')}
                    insContract={this.state.contractIns}
                    addPatContractAddress={this.addPatContractAddress}
                /> : null}
                {this.state.patientLoginSuccess ? <PatientApp
                    username={this.username}
                    accounts={this.state.accounts}
                    web3={this.state.web3}
                    patContractAddress={window.localStorage.getItem('patContractAddress')}
                    proContractAddress={window.localStorage.getItem('proContractAddress')}
                    proContract={this.state.providerContracts['UCSD Medical']}
                    insContract={this.state.contractIns}
                /> : null} */}
                {/* {!this.state.patientLoginSuccess && !this.state.providerLoginSuccess && !this.state.insurerLoginSuccess ?
                    <RegisterForm registration={this.registration} />
                    : null} */}
                <Footer />
            </div>
            /* 
            home page with login button
            user goes through auth0:
                    if passed auth0:
                        if registered:
                            redirect user to appropriate portal based on role from database
                        else:
                            register user and new information into database and redirect user
                    else:
                        stay in home page
            */
        );
    }
}

export default App;
