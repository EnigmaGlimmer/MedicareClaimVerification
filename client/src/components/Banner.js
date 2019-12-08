import React, { Component } from "react";
import Odometer from 'react-odometerjs';
import 'odometer/themes/odometer-theme-minimal.css';

class TokenCounter extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <span> Balance: 
            <span style={{ color: '#00b05e' }}>
                    <Odometer format="d" duration={1000} value={this.props.tokens} />
                </span>
                <span style={{ float: 'right', color: '#1974bf' }}>
                    {this.props.name}
                </span>
            </span>
        );
    }
}

export default TokenCounter;