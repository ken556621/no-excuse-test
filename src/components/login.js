import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

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

    handleChange = (event, type) => {
        console.log(this.props)
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
        firebase.auth().signInWithEmailAndPassword(email, password)
        .catch(e => console.log(e.message));
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
              console.log(user);
              this.props.dispatch({ type: 'LOGIN_SUCCESS' });
              window.location.href = 'http://localhost:8080/';
            } else {
              console.log('Not login yet')
            }
        });
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
                    <Link to='/register'>
                        <button type="button" className="registration">
                            Register
                        </button>
                    </Link>
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

const mapDispatchToProps = dispatch => ({
    type: 'LOGIN_SUCCESS'
})


 
export default connect(mapStateToProps, mapDispatchToProps)(Login);