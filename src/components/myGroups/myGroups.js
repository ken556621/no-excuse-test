import React, { Component } from 'react';
import firebase from '../common/firebase';
import { connect } from 'react-redux'; 

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';
import EventIcon from '@material-ui/icons/Event';
import PlaceIcon from '@material-ui/icons/Place';
import WhatshotIcon from '@material-ui/icons/Whatshot';
import GroupIcon from '@material-ui/icons/Group';
import NaturePeopleIcon from '@material-ui/icons/NaturePeople';

import NavBar from '../common/navbar';
import Ball from '../common/ballImg';
import Load from '../common/load';
import DefaultImage from '../../../img/default-img.png';
import '../../styles/myGroups.scss';

class MyGroups extends Component {
    constructor(props){
        super(props);
        this.state= {
            isLoading: true,
            rooms: []
        }
    }

    async componentDidMount(){
        const db = firebase.firestore();
        const { uid } = this.props;
        const rooms = [];

        //參加的房間
        const participantsSnapshot = await db.collection("rooms").where("participants", "array-contains", uid).get();
        for (let i in participantsSnapshot.docs) {
            const doc = participantsSnapshot.docs[i]
            const roomsData = Object.assign({}, doc.data());
            roomsData.room_ID = doc.id;
            roomsData.hoster = null;
            roomsData.participantsData = [];
            roomsData.placesData = [];
            roomsData.hostData = [];
            //新增參與者資料
            for (let i = 0; i < roomsData.participants.length; i++) {
                const participantsData = await db.collection("users").doc(roomsData.participants[i]).get();
                roomsData.participantsData.push(participantsData.data());
            }
            //新增開團者資訊
            const hostData = await db.collection("users").doc(roomsData.host).get();
            roomsData.hostData.push(hostData.data());
            //新增場地資訊
            const placesData = await db.collection("locations").doc(roomsData.place_ID).get();
            roomsData.placesData.push(placesData.data());
            rooms.push(roomsData);
        }

        //開的房間
        const hostSnapshot = await db.collection("rooms").where("host", "==", uid).get();
        for (let i in hostSnapshot.docs) {
            const doc = hostSnapshot.docs[i]
            const roomsData = Object.assign({}, doc.data());
            roomsData.room_ID = doc.id;
            roomsData.hoster = "hoster";
            roomsData.participantsData = [];
            roomsData.placesData = [];
            roomsData.hostData = [];
            //新增參與者資料
            for (let i = 0; i < roomsData.participants.length; i++) {
                const participantsData = await db.collection("users").doc(roomsData.participants[i]).get();
                roomsData.participantsData.push(participantsData.data());
            }
            //新增開團者資訊
            const hostData = await db.collection("users").doc(roomsData.host).get();
            roomsData.hostData.push(hostData.data());
             //新增場地資訊
             const placesData = await db.collection("locations").doc(roomsData.place_ID).get();
             roomsData.placesData.push(placesData.data());
            rooms.push(roomsData);
        }
        this.setState({
            isLoading: false,
            rooms
        })
    }

    displayParticipants = (participantsData) => {
        let morePeople = 0;
        return (
            <AvatarGroup className="participants-icons">
                { 
                    participantsData.length !== 0 ? participantsData.map((person, i) => {
                        if(i < 3){  
                            return (
                                <Avatar key={ person.ID } className="participater" alt="Participater" sizes="10px" src={ person.photo } />
                            )
                        }else{
                            morePeople++
                        }
                    }) : console.log('no participater')
                }
                { 
                    morePeople === 0 ? 
                    null : 
                    <Tooltip title="Foo • Bar • Baz">
                        <Avatar className="participater" alt="Participater" sizes="10px">+ { morePeople }</Avatar>
                    </Tooltip>
                }
            </AvatarGroup>
        )
    }

    displayNotification = (room) => {
        if(room.peopleNeed - room.participants.length === 0){
            return true
        }
    }

    handleClick = (place_ID) => {
        const { history } = this.props;
        history.push(`/placeInfo?${place_ID}`)
    }

    render() { 
        const { isLoading, rooms } = this.state;
        if(isLoading){
            return <Load />
        }
        return ( 
            <div className="mygroups-container">
                <div className="navigation-bar">
                    <NavBar history={ history }/>
                </div>
                <div className="mygroups-list-comtainer">
                    { rooms.length !== 0 ? rooms.map(room => {
                        return(
                            <Card className="each-group" key={ room.room_ID } id={ room.room_ID }>
                                <div className="col-upper-wrapper">
                                    <div className="col-left">
                                        <CardContent className="group-content">
                                            <Typography className="group-name" gutterBottom>
                                                <GroupIcon className="group-icon-name"/>
                                                名稱: { room.placeName }
                                            </Typography>
                                            <Typography className="group-date"  component="p">
                                                <EventIcon className="group-icon"/>
                                                日期: { room.date }
                                            </Typography>
                                            <Typography className="group-location">
                                                <PlaceIcon className="group-icon"/>
                                                地點: { room.placesData[0].name }
                                            </Typography>
                                            <Typography className="group-intensity">
                                                <WhatshotIcon className="group-icon"/>
                                                強度: { room.intensity }
                                            </Typography>
                                            <Typography className="group-needed">
                                                <NaturePeopleIcon className="group-icon"/>
                                                尚缺: { room.peopleNeed - room.participants.length }
                                            </Typography>
                                            <Typography className="group-participants"  component="span">
                                                { this.displayParticipants(room.participantsData) }
                                            </Typography>
                                        </CardContent>
                                    </div>
                                    <div className="col-right">
                                        <Avatar src={ room.hostData[0].photo }/>
                                    </div>
                                </div>
                                <div className="col-wrapper">
                                    <div className="col-left">
                                        <CardActions className="check-group-btn-wrapper">
                                            <Button className="check-group-btn" onClick={ () => this.handleClick(room.place_ID) }>
                                                <Typography className="check-group-btn-word">
                                                    查看該團
                                                </Typography>
                                            </Button>
                                        </CardActions>
                                    </div>
                                    <div className="col-right">
                                        { this.displayNotification(room) ?
                                            <div className="full-people-notification-wrapper">
                                                <Ball />
                                                <Typography className="full-people-notification-word" component="span">
                                                    已滿團
                                                </Typography>
                                            </div>
                                             : 
                                             <Typography className="notfull-people-notification-word" component="span">
                                                未滿團
                                             </Typography>
                                        }
                                    </div>
                                </div>
                            </Card>
                        )
                    }) : 
                    <div className="default-display">
                        <img src={ DefaultImage } />
                        <Typography className="default-display-words">
                        There is no group yet. Try to join one?
                        </Typography>
                    </div>
                    }
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


 
export default connect(mapStateToProps)(MyGroups);