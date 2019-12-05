import React, { Component } from 'react';
import App from './App';
import Api from './Api';
import Apps from './Apps';
import {BrowserRouter as Router, Route} from 'react-router-dom';
class RouterApp extends Component{
    render(){
        return(
            <Router>
                <Route exact path="/" component={App}/>
                <Route path="/API" component={Api}/>
                <Route path="/APPS" component={Apps}/>
            </Router>
        )
    }
}
export default RouterApp