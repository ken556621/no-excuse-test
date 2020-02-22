import React, { Component } from 'react';
import firebase from '../common/firebase';
import { connect } from 'react-redux';

import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import Map from './mapConfig';
import GroupList from './groupList';
import NavBar from '../common/navbar';
import Load from '../common/load';
import TaipeiDistrict from './taipeiDistrict';

import '../../styles/findplace.scss';

class FindPlace extends Component {
    constructor(props){
        super(props)
        this.state = {
            userLat: '',
            userLng: '',
            isLoading: true,
            allCourts: '',
            targetPlaceName: '',
            searhUserMode: false,
            searchPlaceMode: false,
            searchPlaceData: '',
            mapMode: true,
            listMode: false
        }
    }


    componentDidMount(){
        const db = firebase.firestore();
        const allCourts = [];

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
                searchPlaceData
            })
        }
    }

    searchUser = () => {
        this.setState({
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
        const { userLat, userLng, allCourts, searhUserMode, searchPlaceMode, searchPlaceData, mapMode, listMode } = this.state;
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
                                //fix: invalid props
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
                        <Typography className="user-explain" variant="subtitle1">
                            <img src="https://image.flaticon.com/icons/svg/140/140378.svg"/>
                            現在位置
                        </Typography>
                        <Typography className="user-explain" variant="subtitle1">
                            <img src="https://image.flaticon.com/icons/svg/2467/2467984.svg"/>
                            場地位置
                        </Typography>
                        <Typography className="user-explain" variant="subtitle1">
                            <img src="https://image.flaticon.com/icons/svg/1692/1692975.svg"/>
                            有團的場
                        </Typography>
                    </div>
                </div>
                <div className="change-map-view-btn-wrapper">
                        <Button id="map" className="map-display-btn display-btn" onClick={ (e) => this.handleMode(e) }>地圖</Button>
                        <Button id="list" className="list-display-btn display-btn" onClick={ (e) => this.handleMode(e) }>場地列表</Button>
                </div>
                { mapMode ? <Map initialLat={ userLat } initialLng={ userLng } history={ history } searhUserMode={ searhUserMode } searchPlaceMode={ searchPlaceMode } searchPlaceData={ searchPlaceData } /> : null }
                { listMode ?  <GroupList initialLat={ userLat } initialLng={ userLng } history={ history } /> : null }
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
