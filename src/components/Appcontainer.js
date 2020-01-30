import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

import Routes from './routes';
import Home from './home';
import Login from './login';
import Register from './register';

class AppContainer extends Component {
    render() { 
        return ( 
            <Router>
                { Routes }
            </Router>
        );
    }
}
 
export default AppContainer;