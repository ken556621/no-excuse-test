import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';

import Ball from './common/ballImg';

import NavBar from './common/navbar';



class FindPlace extends Component {
    constructor(props){
        super(props)
        this.state = {
            userLat: 25.0424536,
            userLng: 121.562731,
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
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(this.getCoordinates, this.handleLocationError);
        }else{
            console.log('Not support in this browser.');
        }
    }

    getCoordinates = (position) => {
        const api_key = 'AIzaSyAOCD6zBK2oD6Lrz3gN5zNxM-GNDatpE-o';
        this.setState({
            userLat: position.coords.latitude,
            userLng: position.coords.longitude
        })
        axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=籃球場&location=25.0424536,121.562731&radius=10000&key=${api_key}`).then(res => console.log(res));
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
                        <Ball
                            lat={ this.state.userLat }
                            lng={ this.state.userLng }
                        />
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
