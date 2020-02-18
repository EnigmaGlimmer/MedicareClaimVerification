import React, { Component } from "react";
import $ from 'jquery'
import getWeb3 from "./utils/getWeb3";
import { Table, TabContent, TabPane, Nav, NavItem, NavLink, Card, CardBody, CardGroup, Button, CardTitle, CardText, Row, Col } from 'reactstrap';
import classnames from 'classnames';
import "./App.css";
import ServiceClaim from "./contracts/ServiceClaim.json";
import Provider from "./contracts/Provider.json";
import Patient from "./contracts/Patient.json";
import Banner from './components/Banner'
import Header from './components/Header'

export class InsurerApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            web3: this.props.web3,
            accounts: this.props.accounts,
            insContract: this.props.insContract,
            serContract: this.props.serContract,
            activeTab: '1',
            tokens: 0
        };
        this.unv = []
        this.ver = []
        this.insurername = this.props.username;
        this.toggle = this.toggle.bind(this);
        this.getServiceClaims = this.getServiceClaims.bind(this)
        this.getAllServices = this.getAllServices.bind(this)
        this.copyID = this.copyID.bind(this);
    }

    copyID(val) {
        var copyhelper = document.createElement("input");
        copyhelper.className = 'copyhelper'
        document.body.appendChild(copyhelper);
        copyhelper.value = val;
        copyhelper.select();
        document.execCommand("copy");
        document.body.removeChild(copyhelper);
    }

    componentDidMount = async () => {
        console.log('rendering')
        var _ = this;
        const { insContract } = _.state;
        try {
            const providerAddrs = await insContract.methods.getProviders().call();
            console.log("Providers: ", providerAddrs);
        }
        catch (error) {
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }

        _.getInsurerInfo();
        _.getServiceClaims();
        _.getAllServices();
        setInterval(function () {
            console.log('getting info')
            _.getAllServices();
        }, 5000);
    }

    getInsurerInfo = async () => {
        const { accounts, insContract } = this.state;
        const info = await insContract.methods.getInfo().send({ from: accounts[0] });
        console.log('calling getInsurerInfo ', info.events.InsurerInfo.returnValues);
        // info.events.InsurerInfo.returnValues
    }

    getServiceClaims = async () => {
        const { insContract } = this.state;
        let ver = []
        let unv = []
        const serviceClaims = await insContract.methods.getServiceClaims().call();
        for(let serviceClaimAddr in serviceClaims){
            const instanceSer = new this.web3.eth.Contract(
                ServiceClaim.abi,
                serviceClaimAddr,
            );
            const confirmStatus = await instanceSer.methods.isVerified().call();
            let claimname = await instanceSer.name;
            let timeP = await instanceSer.timeProvided;
            let timeF = await instanceSer.timeFiled;
            let amount = await instanceSer.amount;
            let id = await instanceSer.serviceClaimID;
            let patientAddr = await instanceSer.patientAddr;
            let providerAddr = await instanceSer.providerAddr;
            let patientname = await Provider.methods.getPatientName(patientAddr);
            let providername = await insContract.method.getProvider(providerAddr);
            let timeV = await instanceSer.timeVerified;
            console.log('timeV', timeV)
            if(timeV != null){
                ver.push({
                    id: id,
                    patientname: patientname,
                    claimname: claimname,
                    providername: providername,
                    amount: amount,
                    timeProvided: timeP,
                    timeFiled: timeF,
                    timeVerified: timeV,
                    confirmed: confirmStatus
                })
            }
            else{
                unv.push({
                    id: id,
                    patientname: patientname,
                    claimname: claimname,
                    providername: providername,
                    amount: amount,
                    timeProvided: timeP,
                    timeFiled: timeF
                })
            }
        }
        this.setState({ ver, unv });
    }

    getAllServices = async () => {
        //const accounts = await web3.eth.getAccounts();
        const { insContract } = this.state;
        const services = await insContract.methods.getAllServices().call();
        console.log("Services: ", services);
        this.setState({ state: this.state });
    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    render() {
        return (
            <div>
                <Header />
                <Banner tokens={this.state.tokens} name={this.insurername} dashboard={'Insurer'} />
                <Nav tabs style={{ justifyContent: 'center', width: '90%', margin: 'auto' }}>
                    <NavItem id='navItem'>
                        <NavLink
                            className={classnames({ active: this.state.activeTab === '1' })}
                            onClick={() => { this.toggle('1'); }}>
                            Verified Claims
            </NavLink>
                    </NavItem>
                    <NavItem id='navItem'>
                        <NavLink
                            className={classnames({ active: this.state.activeTab === '2' })}
                            onClick={() => { this.toggle('2'); }}>
                            Unverified Claims
            </NavLink>
                    </NavItem>
                </Nav>
                <TabContent style={{ textAlign: 'center', padding: '50px' }} activeTab={this.state.activeTab}>
                    <TabPane tabId="1">
                        <Table responsive bordered style={this.props.style}>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Patient</th>
                                    <th>Service</th>
                                    <th>Provider</th>
                                    <th>Amount</th>
                                    <th>Time of Provision</th>
                                    <th>Time of Filing</th>
                                    <th>Time of Confirmation</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.ver.length > 0 ?
                                        this.ver.map((output, i) => {
                                            return <tr key={i}>
                                                <td><button className='link' title='Copy ID' onClick={() => this.copyID(output.returnValues.id)}>
                                                    {output.returnValues.id.substring(0, 8)}...
                                                    </button></td>
                                                <td>{output.returnValues.patientname}</td>
                                                <td>{output.returnValues.claimname}</td>
                                                <td>{output.returnValues.providername}</td>
                                                <td>{output.returnValues.amount}</td>
                                                <td>{new Date(parseInt(output.returnValues.timeProvided, 10)).toString().split('-')[0]}</td>
                                                <td>{new Date(parseInt(output.returnValues.timeFiled, 10)).toString().split('-')[0]}</td>
                                                <td>{new Date(parseInt(output.returnValues.timeVerified, 10)).toString().split('-')[0]}</td>
                                                <td>{output.returnValues.confirmed ? <span style={{ color: 'green' }}>Confirmed</span> :
                                                    <span style={{ color: 'red' }}>Disputed</span>}</td>
                                            </tr>
                                        }) : null
                                }
                            </tbody>
                        </Table>
                    </TabPane>
                    <TabPane tabId="2">
                        <Table responsive bordered style={this.props.style}>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Patient</th>
                                    <th>Service</th>
                                    <th>Provider</th>
                                    <th>Amount</th>
                                    <th>Time of Provision</th>
                                    <th>Time of Filing</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.unv.length > 0 ?
                                        this.unv.map((output, i) => {
                                            return <tr key={i}>
                                                <td><button id='link' className='link' title='Copy ID' onClick={() => this.copyID(output.returnValues.id)}>
                                                    {output.returnValues.id.substring(0, 8)}...
                                                    </button></td>
                                                <td>{output.returnValues.patientname}</td>
                                                <td>{output.returnValues.claimname}</td>
                                                <td>{output.returnValues.providername}</td>
                                                <td>{output.returnValues.amount}</td>
                                                <td>{new Date(parseInt(output.returnValues.timeProvided, 10)).toString().split('-')[0]}</td>
                                                <td>{new Date(parseInt(output.returnValues.timeFiled, 10)).toString().split('-')[0]}</td>
                                            </tr>
                                        }) : null
                                }
                            </tbody>
                        </Table>
                    </TabPane>
                </TabContent>
            </div>
        );
    }
}

export default InsurerApp;
