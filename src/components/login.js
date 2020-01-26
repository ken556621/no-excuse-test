import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import firebase from 'firebase';
import '../styles/login.scss';
import BasketballImg from './common/basketballImg';
import Register from './registration';

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
            emailChecked: false,
            emailValid: false,
            passwordValid: false,
            errorMessage: '',
            submitted: false
        }
    }

    componentDidMount(){
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
              console.log(user)
            } else {
              console.log('Not login yet')
            }
        });
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


    handleSubmit = () => {
        const auth = firebase.auth();
        const email = this.state.userEmail;
        const password = this.state.password;
        const promise = auth.signInWithEmailAndPassword(email, password);
        promise.catch(e => console.log(e.message));
    }


    render() { 
        return ( 
            <div className = "login-form">
                <BasketballImg />
                    <div className="form-control">
                        <span><i className={ this.state.emailChecked ? "fas fa-user-check" :  "fas fa-user" }></i></span>
                        <input type="email" name='userEmail' placeholder="user-email" onChange={ (event) => { this.handleChange(event, 'email') }}  />
                        <span className={ this.state.emailValid ? "warning" : "hide" }>{ this.state.errorMessage }</span>
                    </div>
                    <div className="form-control">
                        <span><i className="fas fa-key"></i></span>
                        <input type="password" name='password' placeholder="password" onChange={ (event) => { this.handleChange(event, 'password') }} />
                        <span className={ this.state.passwordValid ? "warning" : "hide" }>{ this.state.errorMessage }</span>
                    </div>
                    <div className="facebook">
                        Facebook
                    </div>
                    <div className="google">
                        Google
                    </div>
                    <div className="btn-wrapper">
                        <button type="submit" onClick={ this.handleSubmit } className="login">
                            Login
                        </button>
                        <button type="button" className="registration">
                            Register
                        </button>
                    </div>
            </div>
        );
    }
}


 
export default Login;