import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import EmailIcon from '@material-ui/icons/Email';
import LockIcon from '@material-ui/icons/Lock';


import firebase from '../common/firebase';
import BasketballImg from '../common/basketballImg';
import ThirdAuth from '../common/thirdAuth';
import { updateUser } from '../../actions/user.action';
import Load from '../common/load'; 

import '../../styles/login.scss';


class Login extends Component {
    constructor(props){
        super(props)
        this.state = {
            userEmail: '',
            password: '',
            emailValid: false,
            passwordValid: false,
            errorMessage: '',
            submitted: false
        }
    } 

    componentDidUpdate(){
        const { history, authenticated, authenticating } = this.props;
        if(!authenticating){
            if(authenticated){
                history.push('/')
            }
        }
    }

    handleChange = (event, type) => {
        if(type === 'email' && event.target.value){
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
        const email = this.state.userEmail;
        const password = this.state.password;
        firebase.auth().signInWithEmailAndPassword(email, password).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            this.setState({
                emailValid: true,
                errorMessage: errorCode
            })
        }).then(res => {
            if(!res){
                return
            }
            const { uid, displayName, email, photoURL } = res.user;
            dispatch(updateUser(uid, displayName, email, photoURL));
            dispatch({ type: 'LOGIN_SUCCESS' });
            history.push('/member');
        });
    }


    render() { 
        const { authenticated, authenticating } = this.props;
        if(authenticating){
            if(!authenticated){
                <Load />
            }
        }
        return ( 
            <div className="login-container">
                <div className = "login-form">
                    <BasketballImg />
                    <div className="form-wrapper">
                        <div className="form-control">
                            <EmailIcon style={{ fontSize: 30 }} className="email-icon" />
                            <div className="email input-wrapper">
                                <input type="email" name='userEmail' placeholder="user-email" onChange={ (event) => { this.handleChange(event, 'email') }}  />
                                <div className={ this.state.emailValid ? "warning" : "hide" }>
                                    { this.state.errorMessage }
                                </div>
                            </div>
                        </div>
                        <div className="form-control">
                            <LockIcon style={{ fontSize: 30 }} className="password-icon"/>
                            <div className="password input-wrapper">
                                <input type="password" name='password' placeholder="password" onChange={ (event) => { this.handleChange(event, 'password') }} />
                                <div className={ this.state.passwordValid ? "warning" : "hide" }>
                                    { this.state.errorMessage }
                                </div>
                            </div>
                        </div>
                        <ThirdAuth history={ this.props.history }/>
                        <div className="btn-wrapper">
                            <button type="submit" onClick={ this.handleSubmit } className="login">
                                Login
                            </button>
                            <Link to='/register'>
                                <button type="button" className="registration">
                                    Register
                                </button>
                            </Link>
                            <Link to='/'>
                                <button type="button" className="home">
                                    Home
                                </button>
                            </Link>
                        </div>
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


 
export default connect(mapStateToProps)(Login);