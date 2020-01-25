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
            valid: false,
            submitted: false
        }
    }

    handleChange(event){

    }

    handleSubmit(event){
        event.preventDefault();
    }


    render() { 
        return ( 
            <div className = "login-form">
                <BasketballImg />
                <form action = "" method="post">
                    <div className="form-control">
                        <span><i className={ this.state.checked ? "fas fa-user-check" :  "fas fa-user" }></i></span>
                        <input type="text" name='username' placeholder="username"/>
                        <span className={ this.state.valid ? "warning" : "hide" }>Your email is not correct</span>
                    </div>
                    <div className="form-control">
                        <span><i className="fas fa-key"></i></span>
                        <input type="text" name='password' placeholder="password"/>
                        <span className={ this.state.valid ? "warning" : "hide" }>Your password is not correct</span>
                    </div>
                    <div className="facebook">
                        Facebook
                    </div>
                    <div className="google">
                        Google
                    </div>
                    <div className="btn-wrapper">
                        <button type="submit" onClick={ this.handleSubmit.bind(this) } className="login">
                                Login
                        </button>
                        <button type="button" className="registration">
                            Register
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}


 
export default Login;