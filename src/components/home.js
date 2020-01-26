import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import Login from './login';
import Register from './registration';

class HomePage extends Component {
    constructor(props){
        super(props)
    }
    render() { 
        return ( 
            <div className="container">
                <h1>This is home page!</h1>
            </div>
        );
    }
}
 


class Home extends Component {
    render() { 
        return ( 
            <Router>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
                <Switch>
                    <Route path="/login" component= { Login } />
                    <Route path="/register" component= { Register } />
                    <Route path="/" component= { HomePage } />
                </Switch>
            </Router>
        );
    }
}
 
export default Home;