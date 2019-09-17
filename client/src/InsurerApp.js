import React, { Component } from "react";
import $ from 'jquery'
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, CardBody, CardGroup, Button, CardTitle, CardText, Row, Col } from 'reactstrap';
import classnames from 'classnames';
import "./App.css";

export class InsurerApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            web3: this.props.web3,
            accounts: this.props.accounts,
            contract: this.props.contract,
            activeTab: '1',
            state: true
        };
        this.unv = []
        this.ver = []
        this.toggle = this.toggle.bind(this);
        this.getAllServices = this.getAllServices.bind(this)
    }

    componentDidMount = async () => {
        this.getAllServices();
        var _ = this;
        this.state.contract.events.ClaimCreated(function (err, res) {
            if (!err) {
                _.getAllServices();
            }
        })
        this.state.contract.events.ClaimVerified(function (err, res) {
            if (!err) {
                _.getAllServices();
            }
        })
    }

    getAllServices = async () => {
        const { accounts, contract } = this.state;
        const services = await contract.methods.getAllServices().send({ from: accounts[0] });
        console.log('calling getAllServices', services);
        let verlist = []
        let unvlist = []
        for (let i = 0; i < services.events.ServiceClaimInfo.length; i++) {
            if (services.events.ServiceClaimInfo[i].returnValues.verified === true) {
                verlist.push(services.events.ServiceClaimInfo[i])
            }
            else {
                unvlist.push(services.events.ServiceClaimInfo[i])
            }
        }
        this.ver = verlist;
        this.unv = unvlist;
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
                <h1 id='centerText'>Insurer Dashboard</h1>
                <Nav tabs style={{ justifyContent: 'center' }}>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: this.state.activeTab === '1' })}
                            onClick={() => { this.toggle('1'); }}
                        >
                            Verified Claims
            </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: this.state.activeTab === '2' })}
                            onClick={() => { this.toggle('2'); }}
                        >
                            Unverified Claims
            </NavLink>
                    </NavItem>
                </Nav>
                <TabContent activeTab={this.state.activeTab}>
                    <TabPane tabId="1">
                        {
                            this.ver.length > 0 ?
                                this.ver.map((output, i) => {
                                    return <CardGroup style={{ textAlign: 'center', padding: '50px' }}>
                                        <Card body outline color="primary" >
                                            <CardBody>
                                                {output.returnValues.id}
                                            </CardBody>
                                        </Card>
                                    </CardGroup>
                                }) : <CardGroup style={{ textAlign: 'center', padding: '50px' }}>
                                    <Card body outline color="primary" >
                                        <CardBody>
                                            No verified claims found.
                            </CardBody>
                                    </Card>
                                </CardGroup>

                        }
                    </TabPane>
                    <TabPane tabId="2">
                        {
                            this.unv.length > 0 ?
                                this.unv.map((output, i) => {
                                    return <CardGroup style={{ textAlign: 'center', padding: '50px' }}>
                                        <Card body outline color="primary" >
                                            <CardBody>
                                                {output.returnValues.id}
                                            </CardBody>
                                        </Card>
                                    </CardGroup>
                                }) :
                                <CardGroup style={{ textAlign: 'center', padding: '50px' }}>
                                    <Card body outline color="primary" >
                                        <CardBody>
                                            No unverified claims found.
                                </CardBody>
                                    </Card>
                                </CardGroup>
                        }
                    </TabPane>
                </TabContent>
            </div>
        );
    }
}

export default InsurerApp;
