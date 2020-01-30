import React, { Component } from 'react';
import firebase from './common/firebase';
import { Link, Redirect } from 'react-router-dom';

import Basketball from './common/basketballImg';
import '../styles/register.scss';

class Register extends Component {
    constructor(props){
        super(props)
        this.state = {
            userName: '',
            userEmail: '',
            password: '',
            emailChecked: false,
            nameValid: false,
            emailValid: false,
            passwordValid: false,
            errorMessage: '',
            submitted: false
        }
    }

    handleChange = (event, type) => {
        if(type === 'name'){
            this.setState({
                userName: event.target.value
            })
        }else if(type === 'email'){
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
        const email = this.state.userEmail;
        const password = this.state.password;
        firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            if (errorCode == 'auth/weak-password') {
                this.setState({
                    passwordValid: true,
                    errorMessage: 'Your email is valid.'
                })
                return 
            }
            if (errorCode == 'auth/email-already-in-use') {
                this.setState({
                    emailValid: true,
                    errorMessage: 'already exists an account with the given email address.'
                })
                return
            }
            if (errorCode == 'auth/invalid-email') {
                this.setState({
                    emailValid: true,
                    errorMessage: 'email address is not valid.'
                })
                return
            }
            if (errorCode == 'auth/operation-not-allowed') {
                this.setState({
                    emailValid: true,
                    passwordValid: true,
                    errorMessage: ' email/password accounts are not enabled. Enable email/password accounts in the Firebase Console, under the Auth tab.'
                })
                return
            }
        })
    }

    render() { 
        return ( 
            <div className="register-form">
                <Basketball />
                <div className="name-field form-control">
                    <span><i className="fas fa-signature"></i></span>
                    <input type="text" placeholder="your name" name="name" onChange={ (event) => { this.handleChange(event, 'name') }}></input>
                    <span className={ this.state.nameValid ? "warning" : "hide" }>{ this.state.errorMessage }</span>
                </div>
                <div className="email-field form-control">
                    <span><i className="fas fa-user" ></i></span>
                    <input type="email" placeholder="your email" name="email" onChange={ (event) => { this.handleChange(event, 'email') }}></input>
                    <span className={ this.state.emailValid ? "warning" : "hide" }>{ this.state.errorMessage }</span>
                </div>
                <div className="password-field form-control">
                    <span><i className="fas fa-key"></i></span>
                    <input type="password" placeholder="your password" name="password" onChange={ (event) => { this.handleChange(event, 'password') }}></input>
                    <span className={ this.state.passwordValid ? "warning" : "hide" }>{ this.state.errorMessage }</span>
                </div>
                <div className="btn-wrapper">
                    <button onClick={ this.handleSubmit }>Submit</button>
                    <Link to='/'>
                        <button>
                            Home
                        </button>
                    </Link>
                </div>
            </div>
        );
    }
}
 
export default Register;