import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import EmailIcon from '@material-ui/icons/Email';
import LockIcon from '@material-ui/icons/Lock';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import SportsBasketballIcon from '@material-ui/icons/SportsBasketball';


import firebase from '../common/firebase';
import ThirdAuth from '../common/thirdAuth';
import Register from './register';
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
            submitted: false,
            moveForm: false
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
            history.push('/');
        });
    }

    moveForm = () => {
        this.setState({
            moveForm: !this.state.moveForm
        })
    }

    render() { 
        const { moveForm } = this.state;
        const { authenticated, authenticating, history } = this.props;
        if(authenticating){
            if(!authenticated){
                <Load />
            }
        }
        return ( 
            <div className="login-container">
                <div className="over-lay">
                    { moveForm ? 
                        <Register history={ history }/> : 
                        <div className = "login-form login-form-bounce-right">
                            <div className="form-wrapper">
                                <div className="form-control">
                                    <EmailIcon className="email-icon" />
                                    <TextField className="email" label="Email" color="primary" onChange={ (event) => { this.handleChange(event, 'email') }} />
                                </div>
                                <div className="form-control">
                                    <LockIcon className="password-icon"/>
                                    <TextField className="password" type="password" label="Password" color="primary" onChange={ (event) => { this.handleChange(event, 'password') }} />
                                </div>
                                <ThirdAuth history={ this.props.history }/>
                                <div className="btn-wrapper">
                                    <Button className="login-btn" onClick={ this.handleSubmit } >
                                        Login
                                    </Button>
                                </div>
                            </div>
                        </div>
                    }
                    <div className="login-option">
                        <div className="col-left">
                            <Typography className="header">
                                沒有帳戶嗎?
                            </Typography>
                            <Typography className="content">
                                左手只是輔助。
                            </Typography>
                            <Button className="signup-btn" onClick={ this.moveForm } variant="outlined">註冊</Button>
                            <Link to='/'>
                                <Button className="home-btn" variant="outlined">
                                    首頁
                                </Button>
                            </Link>
                        </div>
                        <div className="col-right">
                            <Typography className="header">
                               有帳戶嗎?
                            </Typography>
                            <Typography className="content">
                                控制了籃板，就控制了比賽。
                            </Typography>
                            <Button className="login-btn" onClick={ this.moveForm } variant="outlined">登入</Button>
                            <Link to='/'>
                                <Button className="home-btn" variant="outlined">
                                    首頁
                                </Button>
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