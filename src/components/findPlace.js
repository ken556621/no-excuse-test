import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import firebase from './common/firebase';
import axios from 'axios';

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

    static defaultProps = {
        center: {
          lat: 25.0424536,
          lng: 121.562731
        },
        zoom: 15
    };

    componentDidMount(){
        console.log(GoogleMapReact);
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
        axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=籃球場&location=${position.coords.latitude},${position.coords.longitude}&radius=10000&key=AIzaSyAOCD6zBK2oD6Lrz3gN5zNxM-GNDatpE-o`)
        .then(data => {
            data.results.forEach(place => {
                    //存入 DB
                db.collection("locations").doc(place.id).set({
                    id: place.id,
                    name: place.name,
                    address: place.formatted_address,
                    lat: place.geometry.location.lat,
                    lng: place.geometry.location.lng,
                    global_code: place.plus_code.global_code
                })
                .then(function() {
                    console.log("Document successfully written!");
                    //改變狀態
                    this.setState({
                        court: {
                            id: place.id,
                            name: place.name,
                            address: place.formatted_address,
                            lat: place.geometry.location.lat,
                            lng: place.geometry.location.lng,
                            global_code: place.plus_code.global_code
                        }
                    })
                })
                .catch(function(error) {
                    console.error("Error writing document: ", error);
                });
            })
            this.setState({
                isLoading: false
            })
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
                <div style={{ height: '100vh', width: '100%' }}>
                    <GoogleMapReact
                    bootstrapURLKeys={{ key: 'AIzaSyAOCD6zBK2oD6Lrz3gN5zNxM-GNDatpE-o' }}
                    defaultCenter={this.props.center}
                    defaultZoom={this.props.zoom}
                    >
                    {   
                        this.state.court.map(place => {
                            return <Ball lat={ place.lat } lng={ place.lng } />
                        })
                    }
                    </GoogleMapReact>
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
