import React, { Component } from 'react';
import firebase from '../common/firebase';

import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import EmailIcon from '@material-ui/icons/Email';
import Alert from '@material-ui/lab/Alert';

import NavBar from '../common/navbar';
import './forgetPassword.scss';

class ForgetPassword extends Component {
    constructor(props){
        super(props);
        this.state = {
            userEmail: '',
            errorMessage: '',
            emailEmpty: false,
            successSending: false,
            emailInvaild: false
        }
    }

    handleChange = (event) => {
        this.setState({
            userEmail: event.target.value
        })
    } 

    handleKeyPress = (event) => {
        if(event.key === 'Enter'){
            this.handleSubmit();
        }
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
            this.setState({
                successSending: true
            })
        }).catch((error) => {
            this.setState({
                errorMessage: "查無此信箱",
                emailInvaild: true
            })
        });
    }

    render() { 
        const { errorMessage, emailEmpty, successSending, emailInvaild } = this.state;
        return ( 
            <div className="forget-password-container">
                <NavBar history={ history }/>
                <div className="forget-password-wrapper">
                    <Typography className="forget-password-title">
                        重設你的 No Excuse 密碼
                    </Typography>
                    <div className="form-control">
                        <EmailIcon className="email-icon" />
                        <TextField className="email" label="Email" color="primary" helperText={ emailEmpty ? "This should be filled" : null } onChange={ (event) => { this.handleChange(event) }} onKeyPress={ this.handleKeyPress } />
                    </div>
                    <Alert className={ successSending ? "success-sending-words" : "hide" } variant="filled" severity="success">
                        已寄出驗證信，請至信箱查收
                    </Alert>
                    <Alert  className={ emailInvaild && !successSending ? "faild-sending-words" : "hide" } variant="filled" severity="error">
                        { errorMessage ? errorMessage: null }
                    </Alert>
                    <Button className="send-email-btn" onClick={ this.handleSubmit } >
                        Send Email To Reset
                    </Button>
                </div>
            </div>
        );
    }
}
 
export default ForgetPassword;