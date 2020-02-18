import React, { Component } from 'react';
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';
import { connect } from 'react-redux';
import firebase from '../common/firebase';

import InfoWindow from './infoWindow';
import MapStyle from './mapStyle';
import Load from '../common/load';
import { height } from '@material-ui/system';



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

    myStyle = {
        width: "95%",
        height: "70%",
        position: "abosolute",
        top: "40%",
        left: "50%",
        transform: "translate(-50%, -50%)"
    }


    getPlaces = async () => {
        const db = firebase.firestore();
        const { initialLat, initialLng } = this.props;
        const radius = 2; //km
        const targetPlaces = [];
        
        const locationsQuery = await db.collection("locations").get();

        for (let i in locationsQuery.docs) {
            const doc = locationsQuery.docs[i];
            const locationsData = Object.assign({}, doc.data());
            const targetLat = locationsData.location.latitude;
            const targetLng = locationsData.location.longitude;
            const distance = this.getDistanceFromLatLonInKm(initialLat, initialLng, targetLat, targetLng);
            locationsData.rooms = [];
            if(distance < radius){
                const roomsQuery = await db.collection("rooms").where("place_ID", "==", doc.id).get();
                roomsQuery.forEach((room) => {
                    locationsData.rooms.push(room.data())
                })
                targetPlaces.push(locationsData);
            }
        }
        this.setState({
            targetPlaces
        })
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

    onMapClicked = () => {
        if (this.state.showingInfoWindow) {
          this.setState({
            showingInfoWindow: false,
            activeMarker: null
          })
        }
    };

    clickInfoWindow = (id) => {
        const { history } = this.props;
        history.push(`/placeInfo?${id}`);
    }

    render() {
      const { initialLat, initialLng, searhUserMode } = this.props;
      const { id, name, address, photo } = this.state.selectedPlace;
      const rooms = this.state.selectedPlace.rooms || [];
      return (
        <Map 
            google={ this.props.google } 
            onReady={ this.getPlaces }
            onClick={ this.onMapClicked }
            zoom={15} 
            styles={ MapStyle }
            style={ this.myStyle }
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

           { this.state.targetPlaces.length === 0 || !searhUserMode ? null : this.displayMarker() }

            <InfoWindow 
                marker={this.state.activeMarker}
                visible={this.state.showingInfoWindow}
                onClick={ () => this.clickInfoWindow(id, name, address, photo) }
            >
                <div className="place-container">
                    <div className="place-name">
                        { name }
                    </div>
                    <div className="place-address">
                        { address }
                    </div>
                    <div className="place-rooms">
                        <div className="groups">
                            { rooms.length !== 0 ? rooms.map(room => <div className="group" key={ id }>{ room.placeName }</div>) : null }
                        </div>
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