import React, { Component } from 'react';
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';
import { connect } from 'react-redux';
import firebase from './firebase';

import InfoWindow from './infoWindow';
import Button from '@material-ui/core/Button';

import { storeCourts } from '../../actions/location.action';



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

    mapStyle = {
        width: '100%',
        height: 'calc(100vh - 50px)'
    }


    getPlaces = () => {
        const db = firebase.firestore();
        const { initialLat, initialLng } = this.props;
        const radius = 5; //km
        const targetPlaces = [];
        
        db.collection("locations").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                let targetLat = doc.data().location.latitude;
                let targetLng = doc.data().location.longitude;
                let distance = this.getDistanceFromLatLonInKm(initialLat, initialLng, targetLat, targetLng);
                if(distance < radius){
                    targetPlaces.push(doc.data());
                }
            });
            this.setState({
                targetPlaces
            })
        });
    }


    getDistanceFromLatLonInKm = (lat1,lon1,lat2,lon2) => {
        const radius = 6371; // Radius of the earth in km
        const distanceLat = this.deg2rad(lat2-lat1);  // deg2rad below
        const distanceLon = this.deg2rad(lon2-lon1); 
        const algorithm = 
          Math.sin(distanceLat/2) * Math.sin(distanceLat/2) +
          Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
          Math.sin(distanceLon/2) * Math.sin(distanceLon/2); 
        const c = 2 * Math.atan2(Math.sqrt(algorithm), Math.sqrt(1-algorithm)); 
        const distance = radius * c; // Distance in km
        return distance
    }
      

    deg2rad = (deg) => {
        return deg * (Math.PI/180)
    }


    displayMarker = () => {
        return (
            this.state.targetPlaces.map((place) => {
                return (
                    <Marker 
                        name={ place.name } 
                        position={{ lat: place.location.latitude, lng: place.location.longitude }}
                        address={ place.address }
                        photo={ place.photo }
                        rooms={ place.rooms }
                        key={ place.id }
                        id={ place.id }
                        onClick={ this.clickMarker }
                        icon={{
                            url: 'https://image.flaticon.com/icons/svg/2467/2467984.svg',
                            anchor: new google.maps.Point(32,32),
                            scaledSize: new google.maps.Size(40,40)
                        }}
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

    clickInfoWindow = (id, name, address, photo, rooms) => {
        const { dispatch, history } = this.props;
        //add to redux
        dispatch(storeCourts(id, name, address, photo, rooms))
        history.push(`/placeInfo?${id}`);
    }

    render() {
      const { initialLat, initialLng } = this.props;
      const { id, name, address, photo, rooms } = this.state.selectedPlace;
      return (
        <Map 
            google={ this.props.google } 
            onReady={ this.getPlaces }
            onClick={ this.onMapClicked }
            zoom={15} 
            style={ this.mapStyle }
            initialCenter={{
            lat: initialLat,
            lng: initialLng  
        }}>
            <Marker 
                name={ 'Your location' } 
                position={{ lat: initialLat, lng: initialLng }}
                onClick={ this.clickMarker }
                icon={{
                    url: 'https://image.flaticon.com/icons/svg/140/140378.svg',
                    anchor: new google.maps.Point(32,32),
                    scaledSize: new google.maps.Size(30,30)
                }}
            />

           { this.state.targetPlaces.length === 0 ? null : this.displayMarker() }

            <InfoWindow 
                marker={this.state.activeMarker}
                visible={this.state.showingInfoWindow}
                onClick={ () => this.clickInfoWindow(id, name, address, photo, rooms) }
            >
                <div className="place-container">
                    <div className="place-name">
                        { this.state.selectedPlace.name }
                    </div>
                    <div className="place-address">
                        { this.state.selectedPlace.address }
                    </div>
                    <div className="place-rooms">
                        { this.state.selectedPlace.rooms ?  <div className="groups">{ this.state.selectedPlace.rooms.map(room => <div className="group" key={ this.state.selectedPlace.id }>{ room.name }</div>) }</div> : null }
                    </div>
                </div>
            </InfoWindow>
        </Map>
      );
    }
}


function mapStateToProps(store){
    return {
        authenticated: store.user.authenticated,
        authenticating: store.user.authenticating
    }
}


 
export default connect(mapStateToProps)(GoogleApiWrapper({
    apiKey: ("AIzaSyAOCD6zBK2oD6Lrz3gN5zNxM-GNDatpE-o")
})(MapContainer))