import React, { Component } from 'react';
import firebase from '../common/firebase';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

class GroupList extends Component {
    constructor(props){
        super(props)
        this.state = {
            groupLists: ''
        }
    }

    componentDidMount(){
       this.getRooms();
    }

    getRooms = async () => {
        const db = firebase.firestore();
        const { initialLat, initialLng } = this.props;
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
                let distance = this.getDistanceFromLatLonInKm(initialLat, initialLng, placeData.data().location.latitude, placeData.data().location.longitude);
                groupData.placeData = placeData.data();
                groupData.distance = Math.round(distance * 100) / 100;
                groupLists.push(groupData);
            }
            this.setState({
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

    clickRow = (place_ID) => {
        const { history } = this.props;
        history.push(`/placeInfo?${place_ID}`);
    } 

    render() { 
        const { groupLists } = this.state;
        return ( 
            <div className="groups-lists-container">
                <TableContainer component={Paper}>
                    <Table className="table" aria-label="simple table">
                        <TableHead>
                        <TableRow>
                            <TableCell>場地名稱</TableCell>
                            <TableCell align="left">地點</TableCell>
                            <TableCell align="left">距離</TableCell>
                            <TableCell align="left">時間</TableCell>
                            <TableCell align="left">強度</TableCell>
                            <TableCell align="left">開團者</TableCell>
                            <TableCell align="left">聯絡資訊</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {
                            groupLists.length !== 0 ? groupLists.map(group => (
                                <TableRow key={ group.room_ID } id={ group.place_ID } onClick={ () => this.clickRow(group.place_ID) } hover>
                                <TableCell component="th" scope="row">
                                    {group.placeName}
                                </TableCell>
                                <TableCell align="left">{group.placeData.name}</TableCell>
                                <TableCell align="left">{group.distance}</TableCell>
                                <TableCell align="left">{group.date}</TableCell>
                                <TableCell align="left">{group.intensity}</TableCell>
                                <TableCell align="left">{group.hostData.name}</TableCell>
                                <TableCell align="left">{group.hostData.email}</TableCell>
                                </TableRow>
                            )):
                            null    
                        }
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        );
    }
}
 
export default GroupList;