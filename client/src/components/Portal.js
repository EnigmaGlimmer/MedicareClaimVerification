// this file is for after the user logs in with auth0, it won't mean they'll 
// have an account on the database at first, so this file will direct users to 
// either register if they aren't already, or take the users to the interface based on their role

import React, { Component } from 'react';

class Portal extends Component {
    componentWillMount(){
        this.setState({ profile: {} })
        const { userProfile, getProfile } = this.props.auth;
        if(!userProfile) {
            getProfile((err, profile) => {
                this.setState({profile})
            })
        }
        else{
            this.setState({profile: userProfile})
        }
    }

    render(){
        const {profile} = this.state;
        console.log(profile)
        return (
            
        );
    }
}

export default Portal;