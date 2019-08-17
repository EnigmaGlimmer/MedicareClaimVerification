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
        this.csc = this.csc.bind(this);
        this.ac = this.ac.bind(this);
        this.toggle = this.toggle.bind(this);
        this.toggleDropDown = this.toggleDropDown.bind(this);
        this.updateServiceClaimName = this.updateServiceClaimName.bind(this);
        this.toggle = this.toggle.bind(this);
        this.state = {
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
        await this.props.contract.methods.providerMap(this.props.sd.events.ProviderCreated.returnValues.id).send({ from: this.props.accounts[0] });
        await this.props.contract.methods.insurerMap(this.props.sd.events.InsurerCreated.returnValues.id).send({ from: this.props.accounts[0] });
    }

    csc() {
        this.toggle();
        this.props.provideService(this.serviceName, this.providerID, this.patientID).then((info) => {
            console.log('Creating Service Claim')
            let list = this.state.serviceList;
            list.push({ serviceClaimID: info.events.SCID.returnValues.ID, serviceName: this.serviceName, claims: [] });
            this.setState({ serviceList: list })
            console.log(this.state.serviceList)
        })
    }

    ac(serviceClaimID) {
        console.log("creating claim")
        this.props.fileClaim(serviceClaimID, this.amount).then((info) => {
            console.log('Adding Claim')
            let list = this.state.serviceList;
            this.setState({ serviceList: list })
            console.log(info.events.ClaimCreated.returnValues.id)
        })
    }

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
                                {/* <Button color='success' onClick={this.csc}>Create Service Claim</Button> */}
                                <Button color="success" onClick={this.toggle}>Create Service Claim</Button>
                                <ServiceModal modal={this.state.modal} toggle={this.toggle} className={this.props.className}
                                    updateServiceClaimName={this.updateServiceClaimName}
                                    csc={this.csc} />
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

                                        {this.state.serviceList.map((item, i) => { return <DropdownItem key={i} onClick={() => this.ac(item.serviceClaimID)}> {item.serviceName} </DropdownItem> })}
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