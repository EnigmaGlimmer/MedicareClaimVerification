    
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Login from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import InsurerApp from './InsurerApp';
import ProviderApp from './ProviderApp';
import PatientApp from './PatientApp';
import $ from 'jquery';

export const log = {
  loggedIn : false,
  authenticate(){
    this.loggedIn = true;
    localStorage.setItem('loggedIn', this.loggedIn);
  },
  signout(){
    this.loggedIn = false;
    localStorage.setItem('loggedIn', this.loggedIn);
  }
}

export default class App extends React.Component{
  render() {
    console.log(localStorage.getItem('loggedIn'));
    return (
      <BrowserRouter>
        <Switch>
          <Route  path="/Insurer"  render={() => ( localStorage.getItem('loggedIn') ? <InsurerApp/> : <Redirect to="/"/>)}/>
          <Route  path="/Provider"  render={() => ( localStorage.getItem('loggedIn') ? <ProviderApp/> : <Redirect to="/"/>)}/>
          <Route  path="/Patient"  render={() => ( localStorage.getItem('loggedIn') ? <PatientApp/> : <Redirect to="/"/>)}/>
          <Route  path="/" component={Login}/>
        </Switch>
      </BrowserRouter>
    );
  }    
}

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();