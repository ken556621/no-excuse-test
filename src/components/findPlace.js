import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import { connect } from 'react-redux';

import NavBar from './common/navbar';

const AnyReactComponent = ({ text }) => <div>{ text }</div>;

class FindPlace extends Component {
    constructor(props){
        super(props)
        this.state = {
            userLat: 25.0424536,
            userLng: 121.562731
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
        this.setState({
            userLat: position.coords.latitude,
            userLng: position.coords.longitude
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
        console.log(this.state.userLat, this.state.userLng);
        return ( 
            <div>
                <NavBar history={ this.props.history }/>
                <div style={{ height: '100vh', width: '100%' }}>
                    <GoogleMapReact
                    bootstrapURLKeys={{ key: 'AIzaSyAOCD6zBK2oD6Lrz3gN5zNxM-GNDatpE-o' }}
                    defaultCenter={this.props.center}
                    defaultZoom={this.props.zoom}
                    >
                    <AnyReactComponent
                        lat={ this.state.userLat }
                        lng={ this.state.userLng }
                        text="Your position"
                    />
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
