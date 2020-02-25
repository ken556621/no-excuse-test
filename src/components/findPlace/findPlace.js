import React, { Component } from 'react';
import firebase from '../common/firebase';
import { connect } from 'react-redux';
import geohash from "ngeohash";

import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import Map from './mapContainer';
import GroupList from './groupList';
import NavBar from '../common/navbar';
import Load from '../common/load';
import * as geolib from 'geolib';
import TaipeiDistrict from './taipeiDistrict';

import '../../styles/findplace.scss';

class FindPlace extends Component {
    constructor(props){
        super(props)
        this.state = {
            userLat: '',
            userLng: '',
            mapCenterLat: '',
            mapCenterLng: '',
            defaultLat: 25.0424536,
            defaultLng: 121.562731,
            targetPlaces: [],
            groupLists: [],
            isLoading: true,
            allCourts: [],
            targetPlaceName: '',
            searhUserMode: false,
            searchPlaceMode: false,
            searchPlaceData: [],
            mapMode: true,
            listMode: false
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
        // db.collection("locations").get().then((querySnapshot) => {
        //     querySnapshot.forEach((doc) => {
        //         allCourts.push(doc.data().name);
        //     });
        //     this.setState({
        //         allCourts
        //     })
        // });
        db.collection("locations").orderBy("name", "desc").limit(20).get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                allCourts.push(doc.data().name);
            });
            this.setState({
                allCourts
            })
        });
    }

    getCoordinates = (position) => {
        this.getPlaces(position.coords.latitude, position.coords.longitude); 
        this.getRooms(position.coords.latitude, position.coords.longitude);
        this.setState({
            userLat: position.coords.latitude,
            userLng: position.coords.longitude
        })
    }

    handleLocationError = (error) => {
        const { defaultLat, defaultLng } = this.state;
        switch(error.code) {
          case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.")
            this.getPlaces(defaultLat, defaultLng)
            this.getRooms(defaultLat, defaultLng)
            break;
          case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.")
            this.getPlaces(defaultLat, defaultLng)
            this.getRooms(defaultLat, defaultLng)
            break;
          case error.TIMEOUT:
            alert("The request to get user location timed out.")
            this.getPlaces(defaultLat, defaultLng)
            this.getRooms(defaultLat, defaultLng)
            break;
          case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.")
            this.getPlaces(defaultLat, defaultLng)
            this.getRooms(defaultLat, defaultLng)
            break;
          default :
            this.getPlaces(defaultLat, defaultLng)
            this.getRooms(defaultLat, defaultLng)
        }
    }


    getPlaces = async (lat, lng) => {
        const { defaultLat, defaultLng } = this.state;
        const db = firebase.firestore();
        const targetPlaces = [];
        //從資料庫限制搜尋範圍
        const bounds = geolib.getBoundsOfDistance(
            { latitude: lat || defaultLat, longitude: lng || defaultLng },
            500
        );
        const lower = geohash.encode(bounds[0].latitude, bounds[0].longitude);
        const upper = geohash.encode(bounds[1].latitude, bounds[1].longitude);
        const locationsQuery = await db.collection("locations") .where(`geoHash`, '>' , lower)
        .where(`geoHash`, '<' , upper).limit(10).get();
        
        

        for (let i in locationsQuery.docs) {
            const doc = locationsQuery.docs[i];
            const locationsData = Object.assign({}, doc.data());
            console.log(locationsData)
            locationsData.rooms = [];
            const roomsQuery = await db.collection("rooms").where("place_ID", "==", doc.id).get();
            roomsQuery.forEach((room) => {
                locationsData.rooms.push(room.data())
            })
            targetPlaces.push(locationsData);
        }
        this.setState({
            targetPlaces
        })
    }

    getRooms = async (lat, lng) => {
        const { defaultLat, defaultLng } = this.state;
        const db = firebase.firestore();
        const groupLists = [];
        
        const roomSnapshot = await db.collection("rooms").get();
            for (let i in roomSnapshot.docs) {
                const doc = roomSnapshot.docs[i]
                let groupData = Object.assign({}, doc.data());
                const host_ID = groupData.host;
                const place_ID = groupData.place_ID;
                groupData.room_ID = doc.id;
                

                const hostData = await db.collection("users").doc(host_ID).get();
                groupData.hostData = hostData.data();

                const placeData = await db.collection("locations").doc(place_ID).get();

                let distance = this.getDistanceFromLatLonInKm(lat || defaultLat, lng || defaultLng, placeData.data().location.latitude, placeData.data().location.longitude);
                groupData.placeData = placeData.data();
                groupData.distance = Math.round(distance * 100) / 100;
                groupLists.push(groupData);
            }
            this.setState({
                isLoading: false,
                groupLists
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

    handleClick = (e) => {
        const targetPlaceName = e.target.innerText
        this.setState({
            targetPlaceName,
            searchPlaceMode: true
        }, this.getTargetPlace)
    }

    getTargetPlace = async () => {
        const { targetPlaceName } = this.state;
        const db = firebase.firestore();
        const searchPlaceData = [];
        const locationSnapshot = await db.collection("locations").where("name", "==", targetPlaceName).get();
        for (let i in locationSnapshot.docs) {
            const doc = locationSnapshot.docs[i]
            let locationData = Object.assign({}, doc.data());
            locationData.rooms = [];
            const roomsQuery = await db.collection("rooms").where("place_ID", "==", doc.id).get();
            roomsQuery.forEach((room) => {
                locationData.rooms.push(room.data())
            })
            searchPlaceData.push(locationData)
            this.setState({
                mapCenterLat: locationData.location.latitude,
                mapCenterLng: locationData.location.longitude,
                searchPlaceData
            })
        }
    }

    searchUser = () => {
        const { userLat, userLng } = this.state;
        this.setState({
            mapCenterLat: userLat,
            mapCenterLng: userLng,
            searhUserMode: !this.state.searhUserMode
        })
    }

    handleMode = (e) => {
        const target_ID = e.target.parentElement.id;
        if(target_ID === "map"){
            this.setState({
                mapMode: true,
                listMode: false
            })
        }else if(target_ID === "list"){
            this.setState({
                mapMode: false,
                listMode: true
            })
        }
    }
 
    render() {
        const { isLoading, userLat, userLng, defaultLat, defaultLng, mapCenterLat, mapCenterLng, allCourts, searhUserMode, searchPlaceMode, mapMode, listMode, targetPlaces, searchPlaceData, groupLists } = this.state;
        const { history } = this.props;
        if(allCourts === 0){
            return <Load />
        } 
        return ( 
            <div className="find-place-container">
                <NavBar history={ history }/>
                <div className="navi-wrapper">
                    { listMode ? 
                        <div></div> :
                        <div className="search-bar-wrapper">
                            <Autocomplete
                                onChange={ (e) => this.handleClick(e) }
                                options={ (allCourts) }
                                getOptionLabel={ option => option }
                                id="disable-clearable"
                                className="search-bar"
                                renderInput={params => (
                                <TextField {...params} label="請輸入場地名稱" margin="normal" fullWidth />
                                )}
                            />
                            <Button className="current-position-btn" onClick={ this.searchUser }>以目前位置搜尋</Button>
                        </div>
                    }
                    <div className="mark-explain">
                        <Typography className="user-explain">
                            <img src="https://image.flaticon.com/icons/svg/140/140378.svg"/>
                            現在位置
                        </Typography>
                        <Typography className="user-explain">
                            <img src="https://image.flaticon.com/icons/svg/2467/2467984.svg"/>
                            場地位置
                        </Typography>
                        <Typography className="user-explain">
                            <img src="https://image.flaticon.com/icons/svg/1692/1692975.svg"/>
                            有團的場
                        </Typography>
                    </div>
                </div>
                <div className="change-map-view-btn-wrapper">
                        <Button id="map" className="map-display-btn display-btn" onClick={ (e) => this.handleMode(e) }>地圖</Button>
                        <Button id="list" className="list-display-btn display-btn" onClick={ (e) => this.handleMode(e) }>開團列表</Button>
                </div>
                { mapMode ? <Map isLoading={ isLoading } userLat={ userLat } userLng={ userLng } mapCenterLat={ mapCenterLat } mapCenterLng = { mapCenterLng } targetPlaces = { targetPlaces } history={ history } searhUserMode={ searhUserMode } searchPlaceMode={ searchPlaceMode } searchPlaceData={ searchPlaceData } defaultLat ={ defaultLat } defaultLng={ defaultLng }/> : null }

                { listMode ?  <GroupList isLoading={ isLoading } groupLists={ groupLists } initialLat={ userLat } initialLng={ userLng } history={ history } /> : null }
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
