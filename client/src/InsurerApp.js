import React, { Component } from "react";
import $ from 'jquery'
import { Table, TabContent, TabPane, Nav, NavItem, NavLink, Card, CardBody, CardGroup, Button, CardTitle, CardText, Row, Col } from 'reactstrap';
import classnames from 'classnames';
import "./App.css";
import Banner from './components/Banner'

export class InsurerApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            web3: this.props.web3,
            accounts: this.props.accounts,
            contract: this.props.contract,
            activeTab: '1',
            tokens: 0
        };
        this.unv = []
        this.ver = []
        this.insurername = this.props.username;
        this.toggle = this.toggle.bind(this);
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
        // this.getAllVerifiedServices();
        // this.getAllUnverifiedServices();
        var _ = this;
        _.getAllServices();

        this.state.contract.events.allEvents({
            fromBlock: 'latest',
        }, function (error, e) {
            if (error) { alert('Stop') }
            if (e.event === 'ClaimVerified' || e.event === 'ClaimCreated') {
                _.getAllServices();
            }
        })
    }

    // getAllVerifiedServices = async () => {
    //     const { accounts, contract } = this.state;
    //     const services = await contract.methods.getAllVerifiedServices().send({ from: accounts[0] });
    //     console.log('calling getAllVerifiedServices', services);
    //     let list = []
    //     if (services.events.ServiceClaimInfo) {
    //         if (!services.events.ServiceClaimInfo.length) {
    //             list.push(services.events.ServiceClaimInfo)
    //         } else {
    //             for (let i = 0; i < services.events.ServiceClaimInfo.length; i++) {
    //                 list.push(services.events.ServiceClaimInfo[i])
    //             }
    //         }
    //     }
    //     this.ver = list;
    //     console.log('ver', this.ver)
    //     this.setState({ state: this.state });
    // }

    // getAllUnverifiedServices = async () => {
    //     const { accounts, contract } = this.state;
    //     const services = await contract.methods.getAllUnverifiedServices().send({ from: accounts[0] });
    //     console.log('calling getAllUnverifiedServices', services);
    //     let list = []
    //     if (services.events.ServiceClaimInfo) {
    //         if (!services.events.ServiceClaimInfo.length) {
    //             list.push(services.events.ServiceClaimInfo)
    //         } else {
    //             for (let i = 0; i < services.events.ServiceClaimInfo.length; i++) {
    //                 list.push(services.events.ServiceClaimInfo[i])
    //             }
    //         }
    //     }
    //     this.unv = list;
    //     console.log('unv', this.unv)
    //     this.setState({ state: this.state });
    // }

    getAllServices = async () => {
        const { accounts, contract } = this.state;
        const services = await contract.methods.getAllServices().send({ from: accounts[0] });
        console.log('calling getAllServices', services);
        let verlist = []
        let unvlist = []
        if (services.events.ServiceClaimInfo) {
            if (!services.events.ServiceClaimInfo.length) {
                if (services.events.ServiceClaimInfo.returnValues.timeVerified > 0) {
                    verlist.push(services.events.ServiceClaimInfo)
                }
                else {
                    unvlist.push(services.events.ServiceClaimInfo)
                }
            } else {
                for (let i = 0; i < services.events.ServiceClaimInfo.length; i++) {
                    if (services.events.ServiceClaimInfo[i].returnValues.timeVerified > 0) {
                        verlist.push(services.events.ServiceClaimInfo[i])
                    }
                    else {
                        unvlist.push(services.events.ServiceClaimInfo[i])
                    }
                }
            }
        }
        this.ver = verlist;
        this.unv = unvlist;
        console.log('ver', this.ver, 'unv', this.unv)
        const tokens = await contract.methods.getInsurerTokens().call({ from: accounts[0] });
        this.setState({ tokens: tokens });
    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    render() {
        console.log('Tokens', this.state.tokens)
        return (
            <div>
                <h1 id='centerText'>Insurer Dashboard</h1>
                <div class="card" style={{ margin: '2vh' }}>
                    <div class="card-body" style={{ fontSize: '200%' }}>
                        <Banner tokens={this.state.tokens} name={this.insurername}/>
                    </div>
                </div>
                <Nav tabs style={{ justifyContent: 'center'}}>
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
