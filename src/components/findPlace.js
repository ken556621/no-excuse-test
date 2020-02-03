import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';

import NavBar from './common/navbar';

const AnyReactComponent = ({ text }) => <div>{ text }</div>;

class FindPlace extends Component {
    constructor(props){
        super(props)
        this.state = {
            userLat: Number,
            userLng: Number
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
            navigator.geolocation.getCurrentPosition(res => {
                this.setState({
                    userLat: res.coords.latitude,
                    userLng: res.coords.longitude
                })
            });
        }else{
            console.log('Not support in this browser.')
        }
    }

      

    render() { 
        console.log(this.state.userLat, this.state.userLng);
        return ( 
            <div>
                <NavBar />
                <div style={{ height: '100vh', width: '100%' }}>
                    <GoogleMapReact
                    bootstrapURLKeys={{ key: 'AIzaSyAOCD6zBK2oD6Lrz3gN5zNxM-GNDatpE-o' }}
                    defaultCenter={this.props.center}
                    defaultZoom={this.props.zoom}
                    >
                    <AnyReactComponent
                        lat={25.0424536}
                        lng={121.562731}
                        text="Appworks School"
                    />
                    </GoogleMapReact>
                </div>
            </div>
        );
    }
}
 
export default FindPlace;