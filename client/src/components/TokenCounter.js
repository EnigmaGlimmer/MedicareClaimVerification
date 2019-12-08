import React, { Component } from "react";
import Odometer from 'react-odometerjs';
import 'odometer/themes/odometer-theme-minimal.css';

class TokenCounter extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <span style={{ float: 'right' }}> Balance: 
            <span style={{ color: '#00e379', fontWeight: "bold" }}>
                    <Odometer format="d" duration={1000} value={this.props.tokens} />
                </span>
            </span>
        );
    }
}

export default TokenCounter;