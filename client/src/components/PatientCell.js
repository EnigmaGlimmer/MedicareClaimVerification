import React, { Component } from "react";
import { Card, Button, CardTitle, CardText, CardGroup, CardBody, Col, Row, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import "./PatientCell.css"

class PatientCell extends Component {
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state = {
            dropdownOpen: false,
            claimList: [
                /*
                {
                    serviceName: 'Service',
                    claims: []
                }
                */
            ]
        };
        this.patientID = this.props.patientID;
        this.providerID = this.props.providerID;
        this.serviceName = "Service"
        this.amount = 10;
        this.csc = this.csc.bind(this);
        this.ac = this.ac.bind(this);
    }

    toggle() {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

    componentDidMount = async () => {
        await this.props.contract.methods.providerMap(this.props.sd.events.ProviderCreated.returnValues.id).send({ from: this.props.accounts[0] });
        await this.props.contract.methods.insurerMap(this.props.sd.events.InsurerCreated.returnValues.id).send({ from: this.props.accounts[0] });
    }

    csc() {
        console.log('Creating Service Claim')
        this.props.createServiceClaim(this.serviceName, this.providerID, this.patientID);
        let claimList = this.state.claimList;
        claimList.push({serviceName: this.serviceName, claims: []});
        this.setState({ claimList: claimList })
    }

    //needs work
    ac() {
        this.props.addClaim(null, this.amount, this.serviceName);
    }

    render() {
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
                                <Button color='success' onClick={this.csc}>Create Service Claim</Button>
                                <br></br>
                                <br></br>
                                {/* <button className="button" id='add_btn' style={{backgroundColor: '#f0c107'}}><span>Add Claim</span></button> */}
                                {/* <Button color='warning' onClick={this.ac}>Add Claim</Button> */}
                                <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                                    <DropdownToggle caret>
                                        Add Claim
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem header>Select Service Claim</DropdownItem>
                                        <DropdownItem divider />
                                        <DropdownItem>Another Action</DropdownItem>
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