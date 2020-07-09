import React from 'react'
import aeec_logo from '../static/aeec.png'
import '../App.css'
import { Input, Form, Button, FormGroup, Card } from 'reactstrap';

class Register extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            roleChoice: 'Patient'
        }
        this.username = ''
        this.handleChange = this.handleChange.bind(this);
        this.updateUsername = this.updateUsername.bind(this);
    }

    handleChange(event) {
        this.setState({ roleChoice: event.target.value });
    }

    handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            this.onFormSubmit(event);
        }
    }

    updateUsername({ target }){
        this.username = target.value
    }

    onFormSubmit = async (e) => {
        e.preventDefault()
        if(this.username !== ''){
            this.props.registration();
        }
    }

    render() {
        return (
            <div style={{ textAlign: 'center' }}>
                <img src={aeec_logo} alt='AEEC' height='100' width='100' />
                <h1>Medicare Insurance Claim Tracking</h1>
                <Card id='register'>
                    <Form id="form" onSubmit={this.onFormSubmit}>
                        <h4>Register</h4>
                        <FormGroup>
                            <Input placeholder='Username' onChange={this.updateUsername} />
                            <br></br>
                            <label>
                                Select your role:
                                        <select value={this.state.roleChoice} onChange={this.handleChange}>
                                    <option value="Patient">Patient</option>
                                    <option value="Provider">Provider</option>
                                    <option value="Insurer">Insurer</option>
                                </select>
                            </label>
                        </FormGroup>
                        <Button type="submit" color='success'>Enter</Button>
                    </Form>
                </Card>
            </div>
        );
    }
}

export default Register