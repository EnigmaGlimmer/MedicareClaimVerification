import React from "react";
import './Footer.css'

class Footer extends React.Component {
    render() {
        return (
            <div>
                <div style={{ height: '100px' }}></div>
                <div id='footer'>
                    ©BlockLab at San Diego Supercomputer Center
                    </div>
            </div >
        )
    }
}

export default Footer;