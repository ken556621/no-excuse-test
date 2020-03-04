import React, { Component } from 'react';
import firebase from '../common/firebase';

import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import EmailIcon from '@material-ui/icons/Email';

import NavBar from '../common/navbar';
import './forgetPassword.scss';

class ForgetPassword extends Component {
    constructor(props){
        super(props);
        this.state = {
            userEmail: '',
            emailEmpty: false
        }
    }

    handleChange = (event) => {
        this.setState({
            userEmail: event.target.value
        })
    }

    handleSubmit = () => {
        const auth = firebase.auth();
        const { userEmail } = this.state;
        if(!userEmail){
            this.setState({
                emailEmpty: true
            })
            return
        }
        auth.sendPasswordResetEmail(userEmail).then(() => {
            console.log("Email has been send")
        }).catch((error) => {
            console.log(error)
        });
    }

    render() { 
        const { emailEmpty } = this.state;
        return ( 
            <div className="forget-password-container">
                <NavBar history={ history }/>
                <div className="forget-password-wrapper">
                    <Typography className="forget-password-title">
                        重設你的 No Excuse 密碼
                    </Typography>
                    <div className="form-control">
                        <EmailIcon className="email-icon" />
                        <TextField className="email" label="Email" color="primary" helperText={ emailEmpty ? "This should be filled" : null } onChange={ (event) => { this.handleChange(event) }} />
                    </div>
                    <Button className="send-email-btn" onClick={ this.handleSubmit } >
                        Send Email To Reset
                    </Button>
                </div>
            </div>
        );
    }
}
 
export default ForgetPassword;