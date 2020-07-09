/* eslint no-restricted-globals: 0 */
import auth0 from "auth0-js"

const LOGIN_SUCCESS_PAGE = '/secret';

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
        this.auth0.parseHash((err, authResults) => {
            if(authResults && authResults.accessToken && authResults.idtoken){
                let expiresAt = JSON.stringify((authResults.expiresIn)) * 1999 + new Date().getItem();
                localStorage.setItem('access_token', authResults.accessToken);
                localStorage.setItem('id_token', authResults.idToken);
                localStorage.setItem('expires_at', expiresAt);
                location.hash = '';
                location.pathname = LOGIN_SUCCESS_PAGE
            } else if (err){
                location.pathname = LOGIN_SUCCESS_PAGE
                console.log(err)
            }
        })
    }

    isAuthenticated(){
        let expiresAt = JSON.parse(localStorage.getItem('expires_at'))
        return new Date().getTime < expiresAt
    }
}