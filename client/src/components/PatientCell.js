import React, { Component } from "react";
import { Card, Button, CardTitle, CardText, CardGroup, CardBody, Col, Row, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import "./PatientCell.css"
import ServiceModal from "./ServiceModal.js";

class PatientCell extends Component {
    constructor(props, context) {
        super(props, context);
        this.patientID = this.props.patientID;
        this.providerID = this.props.providerID;
        this.serviceName = "";
        this.amount = 10;
        this.provideService = this.provideService.bind(this);
        this.fileClaim = this.fileClaim.bind(this);
        this.toggle = this.toggle.bind(this);
        this.toggleDropDown = this.toggleDropDown.bind(this);
        this.updateServiceClaimName = this.updateServiceClaimName.bind(this);
        this.toggle = this.toggle.bind(this);
        this.getServiceList = this.getServiceList.bind(this)
        this.state = {
            contract: this.props.contract,
            web3: this.props.web3,
            accounts: this.props.accounts,
            modal: false,
            dropdownOpen: false,
            serviceList: [
                /*
                    {
                        serviceClaimID: null,
                        serviceName: null,
                        claims: []
                    }
                */
            ]
        };
    }

    updateServiceClaimName({ target }) {
        this.serviceName = target.value
    }

    toggle() {
        console.log("toggling modal")
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }

    toggleDropDown() {
        console.log("toggling dropdown")
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

    componentDidMount = async () => {
        this.getServiceList();        
        // await this.props.contract.methods.getProvider(this.props.sd.events.ProviderCreated.returnValues.id).send({ from: this.props.accounts[0] });
        // await this.props.contract.methods.getPatient(this.props.sd.events.InsurerCreated.returnValues.id).send({ from: this.props.accounts[0] });
    }

    getServiceList = async () => {
        const { accounts, contract } = this.state;
        const unverifiedClaims = await contract.methods.patientUnverifiedServices(this.patientID).send({ from: accounts[0] });
        this.setState({ serviceList: unverifiedClaims.events.serviceList.returnValues.services });
        console.log(this.props.name + ': current serviceList', this.state.serviceList)
    }

    provideService() {
        this.toggle();
        this.props.provideService(this.serviceName, this.providerID, this.patientID).then((info) => {
            console.log('Creating Service Claim')
            console.log(info.events.SCID.returnValues)
            this.getServiceList();
        })
    }

    fileClaim(serviceClaimID) {
        console.log("creating claim")
        this.props.fileClaim(serviceClaimID, this.amount).then((info) => {
            console.log('Added Claim')
            console.log(info.events.ClaimCreated.returnValues)
            this.getServiceList();
        })
    }

      //Patient service claims populated in each patient cell are unverified claims
    render() {
        console.log("rendering")
        return (
            <CardGroup style={{ padding: '10px' }}>
                <Card body outline color="primary">
                    <CardBody>
                        <Row>
                            <Col md={6}>
                                <CardTitle>{this.props.name}</CardTitle>
                                <CardText></CardText>
                            </Col>
                            <Col md={6} style={{ textAlign: 'center' }}>
                                {/* <button className="button" id='create_btn' style={{backgroundColor: '#12b823'}}><span>Create Service Claim</span></button> */}
                                {/* <Button color='success' onClick={this.provideService}>Create Service Claim</Button> */}
                                <Button color="success" onClick={this.toggle}>Create Service Claim</Button>
                                <ServiceModal modal={this.state.modal} toggle={this.toggle} className={this.props.className}
                                    updateServiceClaimName={this.updateServiceClaimName}
                                    provideService={this.provideService} />
                                <br></br>
                                <br></br>
                                {/* <button className="button" id='add_btn' style={{backgroundColor: '#f0c107'}}><span>Add Claim</span></button> */}
                                {/* <Button color='warning' onClick={this.ac}>Add Claim</Button> */}
                                <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggleDropDown}>
                                    <DropdownToggle caret color="warning">
                                        File Claim
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        {this.state.serviceList.length === 0 ? (
                                            <DropdownItem header>No Services for this patient</DropdownItem>) : (
                                                <div>
                                                    <DropdownItem header>Select Service</DropdownItem>
                                                    <DropdownItem divider />
                                                </div>
                                            )}

                                        {this.state.serviceList.map((item, i) => { return <DropdownItem key={i} onClick={() => this.fileClaim(item.serviceClaimID)}> {item.serviceName} </DropdownItem> })}
                                    </DropdownMenu>
                                </ButtonDropdown>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </CardGroup>
        );
    }
}

export default PatientCell;