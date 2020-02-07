import React, { Component } from 'react';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import firebase from './firebase';

import Typography from '@material-ui/core/Typography';

export class MapContainer extends Component {
    constructor(props){
        super(props)
        this.state = {
            targetPlaces: '',     
            showingInfoWindow: false,
            activeMarker: {},
            selectedPlace: {},    
        }
    }

    style = {
        width: '100%',
        height: '100%'
    }


    fetchPlaces = (mapProps, map) => {
        const { initialLat, initialLng } = this.props;
        const { google } = mapProps;
        const service = new google.maps.places.PlacesService(map);
        const currentPosition = new google.maps.LatLng(initialLat,initialLng);
        const request = {
            location: currentPosition,
            radius: '500',
            query: 'basketball'
        };
        const placesArray = [];
        service.textSearch(request, data => {
            data.forEach(place => {
                let id = place.place_id;
                let name = place.name;
                let placeLat = place.geometry.location.lat();
                let placeLng = place.geometry.location.lng();
                placesArray.push({
                    id,
                    name,
                    placeLat,
                    placeLng
                })
            })
            this.setState({
                targetPlaces: placesArray
            })
        });
    }

    displayMarker = () => {
        return (
            this.state.targetPlaces.map((place) => {
                return (
                    <Marker 
                        name={ place.name } 
                        position={{ lat: place.placeLat, lng: place.placeLng }}
                        onClick={ this.clickMarker }
                        key={ place.id }
                        id={ place.id }
                    />
                )
            })
        )
    }

    clickMarker = (props, marker, e) => {
        return (
            this.setState({
                selectedPlace: props,
                activeMarker: marker,
                showingInfoWindow: true
            })
        )
    }

    onMapClicked = (props) => {
        if (this.state.showingInfoWindow) {
          this.setState({
            showingInfoWindow: false,
            activeMarker: null
          })
        }
    };

    clickInfoWindow = () => {
        console.log('-------------')
    }

    render() {
      const { initialLat, initialLng } = this.props;
      return (
        <Map 
            google={this.props.google} 
            onReady={this.fetchPlaces}
            onClick={this.onMapClicked}
            zoom={15} 
            style={this.style}
            initialCenter={{
            lat: initialLat,
            lng: initialLng 
        }}>
            <Marker 
                name={ 'Your location' } 
                position={{ lat: initialLat, lng: initialLng }}
                onClick={ this.clickMarker }
            />

           { this.state.targetPlaces.length === 0 ? null : this.displayMarker() }
   
            <InfoWindow 
                marker={this.state.activeMarker}
                visible={this.state.showingInfoWindow}
                onOpen={ this.clickInfoWindow }
            >
                <Typography>
                    { this.state.selectedPlace.name }
                </Typography>
            </InfoWindow>
        </Map>
      );
    }
  }

function mapStateToProps(state){
    return {
        authenticated: state.authenticated,
        authenticating: state.authenticating
    }
}


 

   
export default GoogleApiWrapper({
    apiKey: ("AIzaSyAOCD6zBK2oD6Lrz3gN5zNxM-GNDatpE-o")
})(MapContainer)