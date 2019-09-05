import React, { Component } from "react";
import { Button, CardHeader, Card, Input, CardTitle, CardText, CardGroup, CardBody, Col, Row } from 'reactstrap';
import "./PatientCell.css"
import "./ToggleSwitch.css"

class ServiceCell extends Component {
    constructor(props, context) {
        super(props, context);
        this.check = null;
        this.updateChecked = this.updateChecked.bind(this)
    }

    updateChecked() {
        this.checked = !document.getElementById("togBtn").checked;
        console.log(this.checked)
    }

    render() {
        console.log("rendering")
        return (
            <CardGroup style={{ padding: '50px' }}>
                <Card body outline color="primary">
                <CardHeader>Wheelchair</CardHeader>
                    <CardBody>
                        <Row>
                            <Col md={8} style={{ maxWidth: '50%' }}>
                                <CardTitle></CardTitle>
                            </Col>
                            <Col md={8} style={{ textAlign: 'right', maxWidth: '50%' }}>
                            <CardText>Verify claim</CardText>
                                <div style={{ display: "inline-flex" }}>
                                <label className="switch"><input type="checkbox" id="togBtn" onClick={this.updateChecked}/><div className="slider round"><span className="on">Yes</span><span className="off">No</span></div></label>
                                </div>

                            </Col>
                        </Row>
                        <br></br>
                            <Input type="textarea" placeholder="(Optional) Please give us feedback, concerns, or just anything you wish to say..." />
                            <br></br>
                            <Button style={{ float: 'right'}} color="success">Submit</Button>
                    </CardBody>
                </Card>
            </CardGroup>
        );
    }
}

export default ServiceCell;