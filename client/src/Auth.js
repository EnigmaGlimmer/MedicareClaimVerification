import auth0 from "auth0-js"

export default class Auth {
    auth0 = new auth0.WebAuth({
        domain: 'dev-dafung.auth0.com',
        clientID: '9NNjfej0lfdh1xqYOwmMaJlzOS8YAM63',
        redirectUri: 'localhost:3000/callback',
        audience: 'https://dev-dafung.auth0.com/userinfo',
        responseType: 'token id_token',
        scope: 'openid'
    });

    constructor(){
        this.login = this.login.bind(this)
    }

    login(){
        this.auth0.authorize();
    }

    handleAuthentication(){

    }

    isAuthenticated(){
        
    }
}