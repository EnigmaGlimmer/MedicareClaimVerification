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
        this.amount = null;
        this.provideService = this.provideService.bind(this);
        this.fileClaim = this.fileClaim.bind(this);
        this.toggle = this.toggle.bind(this);
        this.toggleDropDown = this.toggleDropDown.bind(this);
        this.updateServiceClaimName = this.updateServiceClaimName.bind(this);
        this.updateAmount = this.updateAmount.bind(this);
        this.toggle = this.toggle.bind(this);
        this.state = {
            modal: false,
            contract: this.props.contract,
            dropdownOpen: false,
            serviceList: [
                /*
                    {
                        serviceClaimID: null,
                        serviceName: null,
                        amount: null
                    }
                */
            ]
        };
    }

    updateServiceClaimName({ target }) {
        this.serviceName = target.value
    }

    updateAmount({ target }) {
        this.amount = target.value
    }

    toggle() {
        // console.log("toggling modal")
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }

    toggleDropDown() {
        // console.log("toggling dropdown")
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

    componentDidMount = async () => {
        // const unv = await this.props.contract.methods.patientUnverifiedClaims(this.patientID).send({ from: this.props.accounts[0] });
        // await this.props.contract.methods.providerMap(this.props.sd.events.ProviderCreated.returnValues.id).send({ from: this.props.accounts[0] });
        // await this.props.contract.methods.insurerMap(this.props.sd.events.InsurerCreated.returnValues.id).send({ from: this.props.accounts[0] });
    }

    provideService() {
        if(this.amount === null || this.amount < 0){
            this.amount = 0;
        }
        this.toggle();
        this.props.provideService(this.serviceName, this.providerID, this.patientID).then((info) => {
            console.log('provideService timestamp', info.Timestamp)
            let list = this.state.serviceList;
            list.push({ serviceClaimID: info.events.SCID.returnValues.ID, serviceName: this.serviceName, amount: this.amount });
            this.setState({ serviceList: list })
            console.log('Creating Service Claim', this.state.serviceList)
        })
    }

    fileClaim(serviceClaimID, amount) {
        this.props.fileClaim(serviceClaimID, amount).then((info) => {
            console.log('fileClaim timestamp', info.Timestamp)
            let list = this.state.serviceList;
            for(let i = 0; i < list.length; i++){
                if(list[i].serviceClaimID === serviceClaimID){
                    list.splice(i, 1); 
                }
            }
            this.setState({ serviceList: list })
        })
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
                                {/* <Button color='success' onClick={this.provideService}>Create Service Claim</Button> */}
                                <Button color="success" onClick={this.toggle}>Create Service Claim</Button>
                                <ServiceModal modal={this.state.modal} toggle={this.toggle} className={this.props.className}
                                    updateServiceClaimName={this.updateServiceClaimName}
                                    updateAmount={this.updateAmount}
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

                                        {this.state.serviceList.map((item, i) => { return <DropdownItem key={i} onClick={() => this.fileClaim(item.serviceClaimID, item.amount)}> {item.serviceName} </DropdownItem> })}
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