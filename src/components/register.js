import React, { Component } from 'react';
import { connect } from 'react-redux';
import firebase from './common/firebase';
import { Link } from 'react-router-dom';

import PersonIcon from '@material-ui/icons/Person';
import EmailIcon from '@material-ui/icons/Email';
import LockIcon from '@material-ui/icons/Lock';

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
        const { dispatch, history } = this.props;
        const db = firebase.firestore();
        const email = this.state.userEmail;
        const password = this.state.password;
        firebase.auth().createUserWithEmailAndPassword(email, password)
        .catch((error) => {
            const errorCode = error.code;
            if (errorCode == 'auth/weak-password') {
                this.setState({
                    passwordValid: true,
                    errorMessage: 'Your email is valid.'
                }) 
            }
            if (errorCode == 'auth/email-already-in-use') {
                console.log(error)
                this.setState({
                    emailValid: true,
                    errorMessage: 'already used email.'
                })
            }
            if (errorCode == 'auth/invalid-email') {
                this.setState({
                    emailValid: true,
                    errorMessage: 'email address is invalid.'
                })
            }
            if (errorCode == 'auth/operation-not-allowed') {
                this.setState({
                    emailValid: true,
                    passwordValid: true,
                    errorMessage: ' email/password accounts are not enabled. Enable email/password accounts in the Firebase Console, under the Auth tab.'
                })
            }
        }).then(res => {
            if(!res){ 
                return
            }
            db.collection("users").doc(res.user.uid).set({
                ID: res.user.uid,
                email: this.state.userEmail,
                name: this.state.userName,
                photo: "https://image.flaticon.com/icons/svg/747/747376.svg"
            })
            .then(function() {
                console.log("Document successfully written!");
                dispatch({ type: 'LOGIN_SUCCESS' });
                history.push('/');
            })
            .catch(function(error) {
                console.error("Error writing document: ", error);
            });
        })
    }

    render() { 
        return ( 
            <div className="register-container">
                <div className="register-form">
                    <Basketball />
                    <div className="name-field form-control">
                        <PersonIcon style={{ fontSize: 30 }} />
                        <div className="name input-wrapper">
                            <input type="text" placeholder="your name" name="name" onChange={ (event) => { this.handleChange(event, 'name') }}></input>
                            <div className={ this.state.nameValid ? "warning" : "hide" }>
                                { this.state.errorMessage }
                            </div>
                        </div>
                    </div>
                    <div className="email-field form-control">
                        <EmailIcon style={{ fontSize: 30 }} />
                        <div className="email input-wrapper">
                            <input type="email" name='userEmail' placeholder="user-email" onChange={ (event) => { this.handleChange(event, 'email') }}  />
                            <div className={ this.state.emailValid ? "warning" : "hide" }>
                                { this.state.errorMessage }
                            </div>
                        </div>
                    </div>
                    <div className="password-field form-control">
                        <LockIcon style={{ fontSize: 30 }} />
                        <div className="password input-wrapper">
                            <input type="password" name='password' placeholder="password" onChange={ (event) => { this.handleChange(event, 'password') }} />
                            <div className={ this.state.passwordValid ? "warning" : "hide" }>
                                { this.state.errorMessage }
                            </div>
                        </div>
                    </div>
                    <div className="btn-wrapper">
                        <button onClick={ this.handleSubmit }>Submit</button>
                        <Link to='/login'>
                            <button>
                                Login
                            </button>
                        </Link>
                        <Link to='/'>
                            <button>
                                Home
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state){
    return {
        authenticated: state.authenticated,
        authenticating: state.authenticating
    }
}


 
export default connect(mapStateToProps)(Register);
 
