import React, { Component } from 'react';
import { connect } from 'react-redux';

import Navbar from '../common/navbar';
import Detail from './detail';
import Rooms from './rooms';
import '../../styles/placeInfo.scss';

class PlaceInfo extends Component {
    constructor(props){
        super(props)
        this.state = {
            
        }
    }

    render() { 
        const place_ID = this.props.location.search.slice(1);
        return ( 
            <div className="place-info-container">
                <Navbar history={ this.props.history } />
                <div className="card-board-wrapper">
                    <div className="groups">
                        <Rooms place_ID={ place_ID } history={ this.props.history }/>   
                    </div>
                    <Detail place_ID={ place_ID } history={ this.props.history } />
                </div>
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
