import React, { Component } from 'react';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';

export class MapContainer extends Component {
    constructor(props){
        super(props)
        this.state = {
            showingInfoWindow: false,  
            activeMarker: {},          
            selectedPlace: {}     
        }
    }

    style = {
        width: '100%',
        height: '100%'
    }

    displayMarker = () => {
        console.log('-----')
    }

    onMarkerClick = (props, marker, e) => {
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true
        });
    }

    onClose = props => {
        if (this.state.showingInfoWindow) {
          this.setState({
            showingInfoWindow: false,
            activeMarker: null
          });
        }
    };

    render() {
      const { initialLat, initialLng } = this.props;
      console.log(this.props)  
      return (
        <Map 
            google={this.props.google} 
            zoom={12} 
            style={this.style}
            initialCenter={{
            lat: initialLat,
            lng: initialLng 
        }}>
   
            <Marker 
                onClick={this.onMarkerClick}
                name={'Current location'} 
                position={{ lat: initialLat, lng: initialLng }}
            />
            <Marker 
                onClick={this.onMarkerClick}
                name={'Basketball'} 
                  
            />
   
            <InfoWindow onClose={(e)=>this.onInfoWindowClose}>
                <div>
                    <h1>ken</h1>
                </div>
            </InfoWindow>
        </Map>
      );
    }
  }
   
  export default GoogleApiWrapper({
    apiKey: ("AIzaSyAOCD6zBK2oD6Lrz3gN5zNxM-GNDatpE-o")
  })(MapContainer)