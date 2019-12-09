import React, { Component } from "react";
import Odometer from 'react-odometerjs';
import 'odometer/themes/odometer-theme-default.css';

class TokenCounter extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div class="card" style={{ backgroundColor: '#fcfeff', marginBottom: '2vh' }}>
                <div class="card-body" style={{ fontSize: '200%' }}>
                    <span> AEEC Token Balance:
                        <span style={{ color: '#00b05e', marginLeft: '1rem' }}>
                            <Odometer format="d" duration={1000} value={this.props.tokens} />
                        </span>
                        <span style={{ float: 'right' }}>
                            <span style={{ color: '#1974bf' }}>
                                {this.props.name}
                            </span>
                        </span>
                    </span>
                </div>
            </div>
        );
    }
}

export default TokenCounter;