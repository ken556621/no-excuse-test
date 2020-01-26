import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import firebase from 'firebase';
import '../styles/login.scss';
import BasketballImg from './basketballImg';

const firebaseConfig = {
    apiKey: "AIzaSyBAL9WEiKUu9fO-W9-vHtLipqoJ_7pARDY",
    authDomain: "no-excuse-1579439547243.firebaseapp.com",
    databaseURL: "https://no-excuse-1579439547243.firebaseio.com",
    projectId: "no-excuse-1579439547243",
    storageBucket: "no-excuse-1579439547243.appspot.com",
    messagingSenderId: "247254955127",
    appId: "1:247254955127:web:c884850b75dc83d3cf8272",
    measurementId: "G-G4GGLVNS9Y"
};

firebase.initializeApp(firebaseConfig);

class Login extends Component {
    constructor(props){
        super(props)
        this.state = {
            userEmail: '',
            password: '',
            checked: false,
            valid: false,
            submitted: false
        }
    }

    handleChange = (event, type) => {
        if(type === 'email'){
            this.setState({
                userEmail: event.target.value
            })
        }else if(type === 'password'){
            this.setState({
                password: event.target.value
            })
        }
    }


    handleSubmit = (event) => {
        event.preventDefault();
        const email = this.state.userEmail;
        const password = this.state.password;
        firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            if (errorCode == 'auth/weak-password') {
                alert('The password is not valid.');
            }
            if (errorCode == 'auth/email-already-in-use') {
                alert('already exists an account with the given email address.');
            }
            if (errorCode == 'auth/operation-not-allowed') {
                alert(' email/password accounts are not enabled. Enable email/password accounts in the Firebase Console, under the Auth tab.');
            }
        })
    }


    render() { 
        return ( 
            <div className = "login-form">
                <BasketballImg />
                <form action = "" method="post">
                    <div className="form-control">
                        <span><i className={ this.state.checked ? "fas fa-user-check" :  "fas fa-user" }></i></span>
                        <input type="email" name='userEmail' placeholder="user-email" onChange={ (event) => { this.handleChange(event, 'email') }}  />
                        <span className={ this.state.valid ? "warning" : "hide" }>Your email is not correct</span>
                    </div>
                    <div className="form-control">
                        <span><i className="fas fa-key"></i></span>
                        <input type="password" name='password' placeholder="password" onChange={ (event) => { this.handleChange(event, 'email') }} />
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