import React, { Component } from 'react';
import { db } from '../common/firebase';
import { connect } from 'react-redux';
import geohash from "ngeohash";
import moment from 'moment';

import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import FilterListIcon from '@material-ui/icons/FilterList';

import Map from './mapContainer';
import GroupList from './groupList';
import NavBar from '../common/navbar';
import Load from '../common/load';
import * as geolib from 'geolib';
import TaipeiDistrict from './taipeiDistrict';
import County from './county';

import './findPlace.scss'; 

class FindPlace extends Component {
    constructor(props){
        super(props)
        this.state = {
            isLoading: true,
            zoom: null,
            userLat: '',
            userLng: '',
            mapCenterLat: '',
            mapCenterLng: '',
            defaultLat: 25.0424536,
            defaultLng: 121.562731,
            allCourts: [],
            polyData: [],
            targetPlaceName: '',
            targetPlaces: [],
            targetArea: [],
            groupLists: [],
            searchPlaceData: [],
            searchAreaData: [],
            searhUserMode: true,
            searchPlaceMode: false,
            searchAreaMode: false,
            mapMode: true,
            listMode: false,
            navOpen: false
        }
    }


    componentDidMount(){
        const allCourts = [];
        //get user location
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(this.getCoordinates, this.handleLocationError);
        }else{
            console.log('Not support in this browser.');
        }
        //get all the place
        db.collection("locations").orderBy("name", "desc").limit(5).get().then((querySnapshot) => {
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

    getDistrictPolyData = (district) => {
        const targetCounty = [];
        County.features.forEach(eachCounty => {
            const eachCountyArray = [];
            if(eachCounty.geometry && eachCounty.properties.TOWNNAME === district){
                eachCounty.geometry.coordinates[0].forEach(cordi => {
                    let formatCordi = {};
                    formatCordi.lng = cordi[0];
                    formatCordi.lat = cordi[1];
                    eachCountyArray.push(formatCordi);
                })
            }
            targetCounty.push(eachCountyArray);
        })
        this.setState({
            polyData: targetCounty
        })
    }

    getPlaces = async (lat, lng) => {
        const { defaultLat, defaultLng } = this.state;
        const targetPlaces = [];
        //從資料庫限制搜尋範圍
        const bounds = geolib.getBoundsOfDistance(
            { latitude: lat || defaultLat, longitude: lng || defaultLng },
            1000
        );
        const lower = geohash.encode(bounds[0].latitude, bounds[0].longitude);
        const upper = geohash.encode(bounds[1].latitude, bounds[1].longitude);
        const locationsQuery = await db.collection("locations") .where(`geoHash`, '>' , lower)
        .where(`geoHash`, '<' , upper).limit(8).get();
        
        for (let i in locationsQuery.docs) {
            const doc = locationsQuery.docs[i];
            const locationsData = Object.assign({}, doc.data());
            console.log(doc.data())
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
        const groupLists = [];
        
        const roomSnapshot = await db.collection("rooms").limit(8).get();
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

    searchUser = () => {
        const { userLat, userLng } = this.state;
        this.setState({
            mapCenterLat: userLat,
            mapCenterLng: userLng,
            searhUserMode: !this.state.searhUserMode,
            searchPlaceMode: false,
            searchAreaMode: false
        })
    }

    clickSearchName = (e) => {
        const targetPlaceName = e.target.innerText
        this.setState({
            targetPlaceName,
            searchPlaceMode: true,
            searchAreaMode: false
        }, this.getTargetPlace)
    }

    clickSearchArea = (e) => {
        const targetArea = e.target.innerText;
        this.setState({
            targetArea,
            searchPlaceMode: false,
            searchAreaMode: true
        }, this.getAreaPlace)
    }

    getTargetPlace = async () => {
        const { targetPlaceName } = this.state;
        const searchPlaceData = [];
        if(!targetPlaceName){
            return
        }
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

    getAreaPlace = async () => {
        const { targetArea } = this.state;
        const searchAreaData = [];

        const districtShapshot = await db.collection("districts").doc(targetArea).collection("locations").limit(5).get();
        for (let i in districtShapshot.docs) {
            const doc = districtShapshot.docs[i];
            let areaData = Object.assign({}, doc.data());
            areaData.rooms = [];
            const roomsQuery = await db.collection("rooms").where("place_ID", "==", doc.id).get();
            roomsQuery.forEach((room) => {
                areaData.rooms.push(room.data())
            })
            searchAreaData.push(areaData)
            this.setState({
                zoom: 13,
                mapCenterLat: searchAreaData[0].location.latitude,
                mapCenterLng: searchAreaData[0].location.longitude,
                searchAreaData
            })
        }
        this.getDistrictPolyData(targetArea);
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

    sortList = (content) => {
        const { groupLists } = this.state;
        if(content === "distance"){
            groupLists.sort((a, b) => {
                return a.distance - b.distance;
            });
        }else if(content === "date"){
            groupLists.sort((a, b) => {
                return Number(moment(a.date).format("YYYYMMDD") - Number(moment(b.date).format("YYYYMMDD")));
            })
        }else if(content === "intensity"){
            groupLists.sort((a, b) => {
                return a.intensity - b.intensity;
            });
        }
        this.setState({
            groupLists
        })
    }

    openNav = () => {
        this.setState({
            navOpen: !this.state.navOpen
        })
    }
 
    render() {
        const { zoom, polyData, isLoading, userLat, userLng, defaultLat, defaultLng, mapCenterLat, mapCenterLng, allCourts, searhUserMode, searchPlaceMode, searchAreaMode, mapMode, listMode, targetPlaces, searchPlaceData, searchAreaData, groupLists, navOpen } = this.state;
        const placeData = { polyData, targetPlaces, searchPlaceData, searchAreaData };
        const coordinates = { zoom, userLat, userLng, defaultLat, defaultLng, mapCenterLat, mapCenterLng };
        const mode = { searhUserMode, searchPlaceMode, searchAreaMode, mapMode, listMode };
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
                                onChange={ (e) => this.clickSearchName(e) }
                                options={ (allCourts) }
                                getOptionLabel={ option => option }
                                className="search-bar"
                                renderInput={params => (
                                <TextField {...params} label="請輸入場地名稱" margin="normal" fullWidth />
                                )}
                            />
                            <Autocomplete
                                onChange={ (e) => this.clickSearchArea(e) }
                                options={ (TaipeiDistrict) }
                                getOptionLabel={ option => option }
                                className="search-bar"
                                renderInput={params => (
                                <TextField {...params} label="以地區搜尋" margin="normal" fullWidth />
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
                <Button className="open-navi-btn" onClick={ this.openNav }>
                    <FilterListIcon />
                </Button>
                <div className="burger-navi" style={ navOpen ? {height:"100%"} : {height:"0"}}>
                    { listMode ? 
                        <div></div> :
                        <div className="search-bar-wrapper">
                            <Autocomplete
                                onChange={ (e) => this.clickSearchName(e) }
                                options={ (allCourts) }
                                getOptionLabel={ option => option }
                                className="search-bar"
                                renderInput={params => (
                                <TextField {...params} label="請輸入場地名稱" margin="normal" fullWidth />
                                )}
                            />
                            <Autocomplete
                                onChange={ (e) => this.clickSearchArea(e) }
                                options={ (TaipeiDistrict) }
                                getOptionLabel={ option => option }
                                className="search-bar"
                                renderInput={params => (
                                <TextField {...params} label="以地區搜尋" margin="normal" fullWidth />
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
                { mapMode ? <Map isLoading={ isLoading } coordinates={ coordinates } placeData={ placeData } history={ history } mode={ mode } /> : null }

                { listMode ?  <GroupList isLoading={ isLoading } groupLists={ groupLists } sortList={ this.sortList } history={ history } /> : null }
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