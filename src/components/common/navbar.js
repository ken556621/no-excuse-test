import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import firebase from './firebase';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import '../../styles/common/navbar.scss';


import Logo from '../../../img/logo.png';

class NavBar extends Component {
    constructor(props){
        super(props)
    }

    logout = () => {
        const { dispatch, history } = this.props;
        firebase.auth().signOut()
        .then(function() {
            console.log('logout');
            dispatch({ type: 'LOGOUT' });
            history.push('/login');
        })
        .catch(function(error) {
            console.log(error)
        });
    }


    render() { 
        return ( 
            <nav>
                <Button className="logo">
                    <Link to='/'>
                        <Typography>
                            No Excuse
                        </Typography>
                    </Link>
                </Button>
                <div className="btn-wrapper">
                    <Button className="member">
                        <Link to='/member'>
                            <div className={ this.props.authenticated ? 'member-wrapper show' : 'hide' }>
                                <AccountCircleIcon />
                            </div>
                        </Link>
                    </Button>
                    <Button className="login">
                        <Link to='/login'>
                            <div className={ this.props.authenticated ? 'hide' : 'login-wrapper show' }>
                                <ExitToAppIcon />
                                <Typography variant="subtitle2">
                                    Login
                                </Typography>
                            </div>
                        </Link>
                            <div className={ this.props.authenticated ? 'logout-wrapper show' : 'hide' } onClick={ this.logout }>
                                <ExitToAppIcon />
                                <Typography>
                                    Logout
                                </Typography>
                            </div>
                    </Button>
                </div>
            </nav>
        );
    }
}


function mapStateToProps(store) {
    return {
        authenticated: store.user.authenticated,
        authenticating: store.user.authenticating
    };
}


 
export default connect(mapStateToProps)(NavBar);

