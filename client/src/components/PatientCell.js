import React, { Component } from "react";
import { Card, Button, CardTitle, CardText, CardGroup, CardBody, Col, Row } from 'reactstrap';
import "./PatientCell.css"

class PatientCell extends Component {
    constructor(props){
        super(props);
        this.patientID = this.props.patientID;
        this.csc = this.csc.bind(this);
        this.ac = this.ac.bind(this);
    }

    componentDidMount = async () => {
        await this.props.contract.methods.providerMap(this.props.sd.events.ProviderCreated.returnValues.id).send({ from: this.props.accounts[0] });
        await this.props.contract.methods.insurerMap(this.props.sd.events.InsurerCreated.returnValues.id).send({ from: this.props.accounts[0] });
    }

    csc(){
        this.props.createServiceClaim("Service", this.providerID, this.patientID);
    }

    ac(){
        this.props.addClaim("Service", 10);
    }

    render() {
        return (
            <CardGroup style={{padding: '10px'}}>
                <Card body outline color="primary">
                    <CardBody>
                        <Row>
                            <Col md={6}>
                                <CardTitle>{this.props.name}</CardTitle>
                                <CardText></CardText>
                            </Col>
                            <Col md={6} style={{textAlign: 'center'}}>
                                {/* <button className="button" id='create_btn' style={{backgroundColor: '#12b823'}}><span>Create Service Claim</span></button> */}
                                <Button color='success' onClick={this.csc}>Create Service Claim</Button>
                                <br></br>
                                <br></br>
                                {/* <button className="button" id='add_btn' style={{backgroundColor: '#f0c107'}}><span>Add Claim</span></button> */}
                                <Button color='warning' onClick={this.ac}>Add Claim</Button>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </CardGroup>
        );
    }
}

export default PatientCell;