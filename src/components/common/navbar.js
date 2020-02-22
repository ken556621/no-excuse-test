import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import firebase from './firebase';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import '../../styles/common/navbar.scss';

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
                    <Button className="find-location">
                        <Link to={{
                            pathname: "/friends"
                        }}>
                            <Typography className="find-location-words">
                                我的團
                            </Typography>
                        </Link>
                    </Button>
                    <Button className="find-location">
                        <Link to={{
                            pathname: "/place"
                        }}>
                            <Typography className="find-location-words">
                                找團
                            </Typography>
                        </Link>
                    </Button>
                    <Button className="find-location">
                        <Link to={{
                            pathname: "/friends"
                        }}>
                            <Typography className="find-location-words">
                                團友列表
                            </Typography>
                        </Link>
                    </Button>
                    <Button className="member-wrapper">
                        <Link to={{
                            pathname: "/member",
                            key: `123`
                        }}>
                            <div className={ this.props.authenticated ? 'member show' : 'hide' }>
                                <AccountCircleIcon className="member-icon"/>
                            </div>
                        </Link>
                    </Button>
                    <Button className="login-logout-wrapper">
                        <Link to='/login'>
                            <div className={ this.props.authenticated ? 'hide' : 'login-btn show' }>
                                <ExitToAppIcon className="login-icon" />
                                <Typography className="login">
                                    登入
                                </Typography>
                            </div>
                        </Link>
                            <div className={ this.props.authenticated ? 'logout-btn show' : 'hide' } onClick={ this.logout }>
                                <ExitToAppIcon className="logout-icon" />
                                <Typography className="logout">
                                    登出
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

