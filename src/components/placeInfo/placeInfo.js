import React, { Component } from 'react';
import { connect } from 'react-redux';
import firebase from '../common/firebase';

import Navbar from '../common/navbar';
import Detail from './detail';
import Rooms from './rooms';
import ReactCardFlip from 'react-card-flip';
import '../../styles/placeInfo.scss';

class PlaceInfo extends Component {
    constructor(props){
        super(props)
        this.state = {
            isLoading: true,
            isEditing: false,
            editTarget: '',
            name: '',
            address: '',
            photo: '',
            phone: '',
            placeStatus: '',
            openState: '',
            rentState: '',
            courtStatus: '下雨天容易滑',
            light: true,
            toilet: false,
            isFlipped: false
        }
    }

    handleClick = (e) => {
        e.preventDefault();
        this.setState(prevState => ({ isFlipped: !prevState.isFlipped }));
    }

    render() { 
        const place_ID = this.props.location.search.slice(1);
        return ( 
            <div className="place-info-container">
                <Navbar history={ this.props.history } />
                <div className="card-board-wrapper">
                    <Detail place_ID={ place_ID }/>
                    <div className="groups">
                        <Rooms place_ID={ place_ID } history={ this.props.history }/>   
                    </div>
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
