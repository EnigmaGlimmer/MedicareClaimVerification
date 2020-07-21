// this file is for after the user logs in with auth0, it won't mean they'll 
// have an account on the database at first, so this file will direct users to 
// either register if they aren't already, or take the users to the interface based on their role

import React, { Component } from 'react';
import PatientApp from './PatientApp'
import ProviderApp from './ProviderApp'
import InsurerApp from './InsurerApp'
import RegisterForm from './components/RegisterForm'
import { check } from 'ethers/utils/wordlist';

class Portal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            profile: {},
            loaded: false,
            insContract: null,
            accounts: this.props.accounts
        }
        this.loginSuccess = false;
        this.role = 0
        this.username = ''
        this.checkIfUserExists = this.checkIfUserExists.bind(this)
        this.modifierFunc = this.modifierFunc.bind(this)
    }

    modifierFunc(status, role, username){
        console.log('calling modifierFunc in Portal.js')
        this.loginSuccess = status
        this.role = role
        this.username = username
        this.setState({ loaded: true })
    }

    componentDidMount() {
        console.log('didmount')
        console.log('insContract in Portal.js', this.props.insContract)
        const { userProfile, getProfile } = this.props.auth;
        if (!userProfile) {
            getProfile((err, profile) => {
                this.checkIfUserExists(profile.name)
                this.setState({ profile, insContract: this.props.insContract })
            })
        }
        else {
            this.setState({ profile: userProfile, insContract: this.props.insContract })
        }
    }

    checkIfUserExists(email) {
        console.log('what is the email', email)
        let res = this.props.checkIfUserExists(email)
        console.log('what is this.props.checkIfUserExists', res)
        if (res.status === 'ok') {
            this.loginSuccess = true;
            this.role = res.role
            this.username = res.name
        }
        this.setState({ loaded: true})
    }

    render() {
        const { profile } = this.state;
        console.log('rendering Portal.js', profile, this.props.insContract)
        let ui = <div>Loading...</div>
        if (this.loginSuccess && this.state.loaded) {
            if (this.role === 'Patient') {
                ui = <PatientApp
                    username={this.username}
                    accounts={this.state.accounts}
                    web3={this.props.web3}
                    insContract={this.props.insContract}
                />
            }
            else if (this.role === 'Provider') {
                ui = <ProviderApp
                    username={this.username}
                    accounts={this.state.accounts}
                    web3={this.props.web3}
                    insContract={this.props.insContract}
                    addPatContractAddress={this.addPatContractAddress}
                />
            }
            else if (this.role === 'Insurer') {
                ui = <InsurerApp
                    username={this.username}
                    insContract={this.props.insContract}
                    accounts={this.state.accounts}
                    web3={this.props.web3}
                    addProContractAddress={this.addProContractAddress}
                />
            }
        }
        else if (this.state.loaded){
            ui = <RegisterForm registration={this.props.registration} modifierFunc={this.modifierFunc} profile={this.state.profile} />
        }
        return (
            ui
        );
    }
}

export default Portal;