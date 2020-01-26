import React, { Component } from 'react';
import '../styles/login.scss';
import firebase from './common/firebase';
import BasketballImg from './common/basketballImg';



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
        if(type === 'email' && event.target.value){
            this.setState({
                userEmail: event.target.value,
                emailChecked: true
            })
        }else if(type === 'password'){
            this.setState({
                password: event.target.value
            })
        }else{
            this.setState({
                emailChecked: false
            })
        }
    }


    handleSubmit = () => {
        const email = this.state.userEmail;
        const password = this.state.password;
        firebase.auth().signInWithEmailAndPassword(email, password).catch(e => console.log(e.message));
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