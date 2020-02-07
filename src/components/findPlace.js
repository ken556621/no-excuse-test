import React, { Component } from 'react';
import { connect } from 'react-redux';
import firebase from './common/firebase';

import Map from './common/mapConfig';
import NavBar from './common/navbar';
import Ball from './common/ballImg';



class FindPlace extends Component {
    constructor(props){
        super(props)
        this.state = {
            userLat: 25.0424536,
            userLng: 121.562731,
            isLoading: false,
            court: []
        }
    }


    componentDidMount(){
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(this.getCoordinates, this.handleLocationError);
        }else{
            console.log('Not support in this browser.');
        }
    }

    getCoordinates = (position) => {
        this.setState({
            userLat: position.coords.latitude,
            userLng: position.coords.longitude,
            isLoading: true
        })
    }

    handleLocationError = (error) => {
        switch(error.code) {
          case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.")
            break;
          case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.")
            break;
          case error.TIMEOUT:
            alert("The request to get user location timed out.")
            break;
          case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.")
            break;
        }
    }

      

    render() { 
        return ( 
            <div>
                <NavBar history={ this.props.history }/>
                <Map initialLat={ this.state.userLat } initialLng={ this.state.userLng } history={ this.props.history }/>
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


 
export default connect(mapStateToProps)(FindPlace);
