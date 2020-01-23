import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import '../styles/login.scss';
import BasketballImg from './basketballImg';



class Login extends Component {
    constructor(props){
        super(props)
        this.state = {
            userName: '',
            password: '',
            checked: false,
            submitted: false
        }
    }
    render() { 
        return ( 
            <div className = "login-form">
                <BasketballImg />
                <form action = "post">
                    <div className="form-control">
                        <span><i className={ this.state.checked ? "fas fa-user-check" :  "fas fa-user" }></i></span>
                        <input type="text" name='username' placeholder="username"/>
                        <span className="warning">Your email is not correct</span>          
                    </div>
                    <div className="form-control">
                        <span><i className="fas fa-key"></i></span>
                        <input type="text" name='password' placeholder="password"/>
                        <span className="warning">Your password is not correct</span>
                    </div>
                    <div className="facebook">
                        Facebook
                    </div>
                    <div className="google">
                        Google
                    </div>
                    <div className="btn-wrapper">
                        <button className="login">
                                Login
                        </button>
                        <button className="registration">
                            Register
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}


 
export default Login;