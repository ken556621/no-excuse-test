import React, { Component } from 'react';
import { connect } from 'react-redux';
import firebase from '../common/firebase';
import { updateUser } from '../../actions/user.action';

import EmailIcon from '@material-ui/icons/Email';
import LockIcon from '@material-ui/icons/Lock';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import PersonIcon from '@material-ui/icons/Person';

class Register extends Component {
    constructor(props){
        super(props)
        this.state = {
            userName: '',
            userEmail: '',
            userPhoto: 'https://image.flaticon.com/icons/svg/23/23072.svg',
            password: '',
            comfirm: '',
            nameValid: false,
            emailValid: false,
            passwordValid: false,
            comfirmInValid: false,
            errorMessage: ''
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
        }else if(type === 'confirm'){
            this.setState({
                comfirm: event.target.value
            })
        }
    }

    isInValid = () => {
        const { password, comfirm } = this.state;
        if(password !== comfirm ){
            return true
        }
        return false
    }

    handleSubmit = () => {
        const { userName, userEmail, userPhoto } = this.state;
        const { dispatch, history } = this.props;
        const db = firebase.firestore();
        const email = this.state.userEmail;
        const password = this.state.password;
        if(this.isInValid()){   
            this.setState({
                comfirmInValid: true
            })
            return 
        }
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
                    errorMessage: 'Already used email.'
                })
            }
            if (errorCode == 'auth/invalid-email') {
                this.setState({
                    emailValid: true,
                    errorMessage: 'Email address is invalid.'
                })
            }
            if (errorCode == 'auth/operation-not-allowed') {
                this.setState({
                    emailValid: true,
                    passwordValid: true,
                    errorMessage: 'Email/password accounts are not enabled. Enable email/password accounts in the Firebase Console, under the Auth tab.'
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
                photo: "https://i.pinimg.com/564x/c9/47/dc/c947dca3a0ec0639d5f1edebb459b774.jpg"
            })
            .then(() => {
                const uid = res.user.uid;
                console.log("Document successfully written!");
                dispatch(updateUser(uid, userName, userEmail, userPhoto));
                dispatch({ type: 'LOGIN_SUCCESS' });
                history.push('/'); 
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });
        })
    }

    handleKeyPress = (event) => {
        if(event.key === 'Enter'){
            this.handleSubmit();
        }
    }

    render() { 
        const { emailValid, comfirmInValid, errorMessage } = this.state;
        return ( 
            <div className = { window.innerWidth < 523 ? "login-form login-form-bounce-up" : "login-form login-form-bounce-left" }>
                <div className="form-wrapper">
                    <div className="form-control">
                        <PersonIcon className="name-icon" />
                        <TextField className="name" label="name" color="primary" onChange={ (event) => { this.handleChange(event, 'name') }} />
                    </div>
                    <div className="form-control">
                        <EmailIcon className="email-icon" />
                        <TextField className="email" label="Email" helperText={ emailValid ? errorMessage : null } color="primary" onChange={ (event) => { this.handleChange(event, 'email') }} />
                    </div>
                    <div className="form-control">
                        <LockIcon className="password-icon"/>
                        <TextField className="password" type="password" label="Password" color="primary" onChange={ (event) => { this.handleChange(event, 'password') }} />
                    </div>
                    <div className="form-control">
                        <LockIcon className="password-icon"/>
                        <TextField className="password" type="password" label="Confirm Password" helperText={ comfirmInValid ? "Comfirm password is not correct!" : null } color="primary" onChange={ (event) => { this.handleChange(event, 'confirm') }} onKeyPress={ this.handleKeyPress } />
                    </div>
                    <div className="btn-wrapper">
                        <Button type="submit" onClick={ this.handleSubmit } className="signup-btn">
                            SIGN UP
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(store){
    return {
        authenticated: store.user.authenticated,
        authenticating: store.user.authenticating
    }
}


 
export default connect(mapStateToProps)(Register);
 
