import React from 'react'
import aeec_logo from '../static/aeec.png'
import '../App.css'
import $ from 'jquery'
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
        this.setSession = this.setSession.bind(this);
        this.registration = this.registration.bind(this)
    }

    registration(username, role, email, callback) {
        console.log('registering', username, role, email)
        //todo write to the database a new user, including email, username, and role
        $.ajax({
            url: 'http://localhost:4000/profile/register',
            type: 'POST',
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            crossDomain: true,
            dataType: 'json',
            xhrFields: { withCredentials: true },
            data: {
                username: username,
                role: role,
                email: email
            },
            success: async (data) => {
                //registered
                console.log('success ajax:', data)
                callback(true)
            },
            error: async (data) => {
                callback(false)
            }
        })
    }

    handleChange(event) {
        this.setState({ roleChoice: event.target.value });
    }

    handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            this.onFormSubmit(event);
        }
    }

    updateUsername({ target }) {
        this.username = target.value
    }

    setSession(loginStatus, role, username){
        this.props.modifierFunc(loginStatus, role, username);
    }

    onFormSubmit = async (e) => {
        e.preventDefault()
        if (this.username !== '') {
            console.log(this.props.profile)
            let _ = this
            this.registration(this.username, this.state.roleChoice, this.props.profile.name, function (returned) {
                console.log('returned: ', returned)
                if (returned) {
                    _.setSession(true, _.state.roleChoice, _.username)
                }
                else {
                    alert('Registration seems to have failed')
                }
            });
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