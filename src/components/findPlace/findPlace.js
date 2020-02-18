import React, { Component } from 'react';
import firebase from '../common/firebase';
import { connect } from 'react-redux';

import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import Map from './mapConfig';
import NavBar from '../common/navbar';
import Load from '../common/load';

import '../../styles/findplace.scss';

class FindPlace extends Component {
    constructor(props){
        super(props)
        this.state = {
            userLat: '',
            userLng: '',
            isLoading: true,
            allCourts: ''
        }
    }


    componentDidMount(){
        const db = firebase.firestore();
        const allCourts = [];
        //get user location
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(this.getCoordinates, this.handleLocationError);
        }else{
            console.log('Not support in this browser.');
        }
        //get all the place
        db.collection("locations").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                allCourts.push(doc.data());
            });
            this.setState({
                allCourts
            })
        });
    }

    getCoordinates = (position) => {
        this.setState({
            userLat: position.coords.latitude,
            userLng: position.coords.longitude,
            isLoading: false
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

    handleClick = (e) => {
        const targetUserName = e.target.innerText
        
    }

    handleInput = () => {

    }

    searchUser = () => {
        
    }

    render() { 
        const { isLoading, allCourts } = this.state;
        if(isLoading){
            return <Load />
        }
        return ( 
            <div className="find-place-container">
                <NavBar history={ this.props.history }/>
                <div className="search-bar-wrapper">
                    <Autocomplete
                        onChange={ (e) => this.handleClick(e) }
                        options={ allCourts }
                        getOptionLabel={ option => option.name }
                        id="disable-clearable"
                        className="search-bar"
                        renderInput={params => (
                        <TextField {...params} onKeyDown={ (e) => this.handleInput(e) } label="請輸入場地名稱" margin="normal" fullWidth />
                        )}
                    />
                    <Button className="current-position-btn" onClick={ this.searchUser }>以我位置搜尋</Button>
                </div>
                <Map initialLat={ this.state.userLat } initialLng={ this.state.userLng } history={ this.props.history } />
            </div>
        );
    }
}
 

function mapStateToProps(store){
    return {
        authenticated: store.user.authenticated,
        authenticating: store.user.authenticating
    }
}


 
export default connect(mapStateToProps)(FindPlace);
