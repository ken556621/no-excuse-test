import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import firebase from './common/firebase';



import Ball from './common/ballImg';

import NavBar from './common/navbar';



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


    // initMap = () => {
    //     let map;
    //     let service;
    //     let infowindow;
    //     const sydney = new google.maps.LatLng(-33.867, 151.195);

    //     infowindow = new google.maps.InfoWindow();

    //     map = new google.maps.Map(
    //         document.getElementById('map'), {center: sydney, zoom: 15});

    //     const request = {
    //         location: sydney,
    //         radius: '1000',
    //         type: ['basketball']
    //     };

    //     // const service = new google.maps.places.PlacesService(map);
    //     // service.nearbySearch(request, this.callback);
    // }

    callback = (results, status) => {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {
            var place = results[i];
            createMarker(results[i]);
          }
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
        const db = firebase.firestore();
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
                <Link to='/placeInfo'>Information</Link>
                <div id="map">

                </div>
            </div>
        );
    }
}
 

function mapStateToProps(state){
    return {
        authenticated: state.authenticated,
        authenticating: state.authenticating
    }
}


 
export default connect(mapStateToProps)(FindPlace);
