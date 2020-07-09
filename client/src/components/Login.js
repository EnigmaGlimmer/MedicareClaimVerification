import React from 'react'
import aeec_logo from '../static/aeec.png'
import '../App.css'
import { Form, Button, Card } from 'reactstrap';

class Login extends React.Component {
    //Button below should redirect user to auth0
    login() {
        this.props.auth.login();
      }
    render(){
        return (
            <div style={{ textAlign: 'center' }}>
                <img src={aeec_logo} alt='AEEC' height='100' width='100' />
                <h1>Medicare Insurance Claim Tracking</h1>
                <Form id="form">
                    <Button color='success' onClick={() => this.props.auth.login()}>Login</Button>
                </Form>
            </div>
        );
    }
}

export default Login