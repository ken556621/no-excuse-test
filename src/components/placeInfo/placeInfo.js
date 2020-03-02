import React, { Component } from 'react';
import { connect } from 'react-redux';

import Button from '@material-ui/core/Button';
import MapIcon from '@material-ui/icons/Map';
import Typography from '@material-ui/core/Typography';
import WhatshotIcon from '@material-ui/icons/Whatshot';

import Navbar from '../common/navbar';
import Detail from './detail';
import Rooms from './rooms';
import './placeInfo.scss';

class PlaceInfo extends Component {
    constructor(props){
        super(props)
        this.state = {
            detailMode: false
        } 
    } 

    switchMode = (mode) => {
        if(mode === "detail"){
            this.setState({
                detailMode: true
            })
        }else if(mode === "room"){
            this.setState({
                detailMode: false
            })
        }
    }

    render() { 
        const { detailMode } = this.state;
        const place_ID = this.props.location.search.split("&")[0].slice(1);
        return ( 
            <div className="place-info-container">
                <Navbar history={ this.props.history } />
                <div className="card-board-wrapper">
                    <div className={ !detailMode ? "groups" : "groups groups-mobile" }>
                        <Rooms place_ID={ place_ID } history={ this.props.history }/>   
                    </div>
                    <div className={ detailMode ? "details details-mobile" : "details" }> 
                        <Detail place_ID={ place_ID } history={ this.props.history } />
                    </div>
                </div>
                <Button className={ detailMode ? "hide" : "detail-switch-btn" } onClick={ () => this.switchMode("detail") }>
                    <Typography className="detail-switch-word">
                        場地資訊
                        <MapIcon className="detail-switch-icon" />
                    </Typography>
                </Button>
                <Button className={ detailMode ? "room-switch-btn" : "hide" } onClick={ () => this.switchMode("room") }>
                    <Typography className="room-switch-word">
                        開房資訊
                        <WhatshotIcon className="room-switch-icon" />
                    </Typography>
                </Button>
            </div>
        );
    }
} 
 
function mapStateToProps(store){
    return {
        authenticated: store.user.authenticated,
        authenticating: store.user.authenticating,
        uid: store.user.uid
    }
}
 

 
export default connect(mapStateToProps)(PlaceInfo);
