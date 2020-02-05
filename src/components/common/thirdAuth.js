import React, { Component } from 'react';
import firebase from './firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

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
            // Avoid redirects after sign-in.
            signInSuccessWithAuthResult: () => {
                //狀態會自動改變？ 存入 DB
                const user = firebase.auth().currentUser;
                const db = firebase.firestore();
                const history = this.props.history;
                console.log(user);
                db.collection("users").doc(user.uid).set({
                    ID: user.uid,
                    email: user.email,
                    name: user.displayName,
                    photo: user.photoURL
                })
                .then(function() {
                    console.log("Document successfully written!");
                    dispatch({ type: 'LOGIN_SUCCESS' });
                    history.push('/');
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
 
export default ThirdAuth;