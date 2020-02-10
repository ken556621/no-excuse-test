import React, { Component } from 'react';
import firebase from './firebase';
import { connect } from 'react-redux';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { updateUser } from '../../actions/user.action';

import '../../styles/common/thirdAuth.scss';



class ThirdAuth extends Component {
    constructor(props){
        super(props);
    }


    uiConfig = {
        // Popup signin flow rather than redirect flow.
        signInFlow: 'popup',
        // We will display Google and Facebook as auth providers.
        signInOptions: [
          firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          firebase.auth.FacebookAuthProvider.PROVIDER_ID
        ],
        callbacks: {
            signInSuccessWithAuthResult: () => {
                const { dispatch, history } = this.props;
                const user = firebase.auth().currentUser;
                const { uid, email, displayName, photoURL } = user;
                const db = firebase.firestore();
                db.collection("users").doc(uid).set({
                    ID: uid,
                    email: email,
                    name: displayName,
                    photo: photoURL,
                    friends: []
                })
                .then(function() {
                    //lack of friends data
                    console.log("Document successfully written!");
                    dispatch(updateUser(uid, displayName, email, photoURL)); 
                    dispatch({ type: "LOGIN_SUCCESS" });
                    history.push('/member');
                })
                .catch(function(error) {
                    console.error("Error writing document: ", error);
                });
            }
        }
    };


    render() { 
        return ( 
            <div id="firebaseui-auth-container">
                <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={firebase.auth()}/>    
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


 
export default connect(mapStateToProps)(ThirdAuth);
