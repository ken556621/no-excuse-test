import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import firebase from './common/firebase';

import Button from '@material-ui/core/Button';

import NavBar from './common/navbar';
import '../styles/home.scss';




class HomePage extends Component {
    constructor(props){
        super(props);
    }

    componentDidMount(){
        const { dispatch } = this.props;
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
              console.log('Login success');
              dispatch({ type: 'LOGIN_SUCCESS' });
            } else {
              console.log('Not login yet')
            }
        });
    }

    render() { 
        return ( 
            <div className="homepage-container">
                <NavBar history={ this.props.history }/>
                <main>
                    <div className="banner">
                        <div className="btn-wrapper">
                            <Link to='/people'>
                                <Button>
                                    <div className="find-people">
                                        找人
                                    </div>
                                </Button>
                            </Link>
                            <Link to='/place'>
                                <Button>
                                    <div className="find-place">
                                        找場
                                    </div>
                                </Button>
                            </Link>
                        </div>
                    </div>
                </main>
            </div>
        );
    }
}
 
function mapStateToProps(store) {
    return {
        authenticated: store.user.authenticated,
        authenticating: store.user.authenticating
    };
}


 
export default connect(mapStateToProps)(HomePage);