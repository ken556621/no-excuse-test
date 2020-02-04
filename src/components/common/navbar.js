import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import firebase from './firebase';

import Button from '@material-ui/core/Button';
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
                        <img src= { Logo }/>
                    </Link>
                </Button>
                <div className="btn-wrapper">
                    <Button className="member">
                        <AccountCircleIcon />
                    </Button>
                    <Button className="login">
                        <Link to='/login'>
                            <div className={ this.props.authenticated ? 'hide' : 'show' }>
                                <i className="fas fa-sign-in-alt"></i>
                                <span>Login</span>
                            </div>
                        </Link>
                            <div className={ this.props.authenticated ? 'show' : 'hide' } onClick={ this.logout }>
                                <i className="fas fa-sign-in-alt"></i>
                                <span>Logout</span>
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

