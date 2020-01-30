import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import firebase from './common/firebase';

import '../styles/home.scss';




class HomePage extends Component {
    constructor(props){
        super(props)
        console.log(props)
    }

    logout = () => {
        firebase.auth().signOut()
        .then(function() {
            console.log('logout');
            <Redirect to={{ pathname: '/' }}/>
        })
        .catch(function(error) {
            console.log(error)
        });
    }

    render() { 
        return ( 
            <div className="container">
                <nav>
                    <div className="logo">
                        <Link to='/'>
                            No Excuse
                        </Link>
                    </div>
                    <div className="login">
                        <Link to='/login'>
                            <span className={ this.props.authenticated ? 'hide' : 'show' }>
                                <i className="fas fa-sign-in-alt"></i>
                                Login
                            </span>
                        </Link>
                            <span className={ this.props.authenticated ? 'show' : 'hide' } onClick={ this.logout }>
                                <i className="fas fa-sign-in-alt"></i>
                                Logout
                            </span>
                    </div>
                </nav>
                <main>
                    <div className="banner">
                        <div className="btn-wrapper">
                            <div className="find-people">
                                找人
                            </div>
                            <div className="find-place">
                                找場
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }
}
 
function mapStateToProps(store) {
    return {
        authenticated: store.authenticated,
        authenticating: store.authenticating
    };
}


 
export default connect(mapStateToProps)(HomePage);