import React, { Component } from 'react';

class Register extends Component {
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
            }
            if (errorCode == 'auth/email-already-in-use') {
                this.setState({
                    emailValid: true,
                    errorMessage: 'already exists an account with the given email address.'
                })
            }
            if (errorCode == 'auth/invalid-email') {
                this.setState({
                    emailValid: true,
                    errorMessage: 'email address is not valid.'
                })
            }
            if (errorCode == 'auth/operation-not-allowed') {
                this.setState({
                    emailValid: true,
                    passwordValid: true,
                    errorMessage: ' email/password accounts are not enabled. Enable email/password accounts in the Firebase Console, under the Auth tab.'
                })
            }
            alert('login success')
        })
    }

    render() { 
        return ( 
            <div className="register-from">
                <div className="name-field">
                    <input type="text" placeholder="your name" name="name"></input>
                </div>
                <div className="email-field">
                    <input type="email" placeholder="your email" name="email"></input>
                </div>
                <div className="password-field">
                    <input type="password" placeholder="your password" name="password"></input>
                </div>
            </div>
        );
    }
}
 
export default Register;