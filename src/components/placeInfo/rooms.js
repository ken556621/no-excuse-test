import React, { Component } from 'react';
import firebase from '../common/firebase';
import { connect } from 'react-redux';
import moment from 'moment';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import CreateRoundedIcon from '@material-ui/icons/CreateRounded';
import DeleteIcon from '@material-ui/icons/Delete';

import EditRoom from './editRoom';


class Groups extends Component {
    constructor(props){ 
        super(props)
        this.state = {
            place_ID: this.props.history.location.search.slice(1),
            hostersPhoto: '',
            userPhoto: '',
            rooms: '',
            editRoom: '',
            isEditing: false
        }
    }

    componentDidMount(){ 
        this.fetchRooms();
    }

    fetchRooms = async () => {
        const db = firebase.firestore();
        const { place_ID } = this.state;
        const rooms = [];
        //get rooms data & get participants data
        const querySnapshot = await db.collection("rooms").where("place_ID", "==", place_ID).get();

        for (let i in querySnapshot.docs) {
            const doc = querySnapshot.docs[i];
            let roomsData = Object.assign({}, doc.data());
            roomsData.room_ID = doc.id;
            roomsData.participantsData = [];
            roomsData.hostPhoto = '';
            this.dateExpired(roomsData);
            const hostRef = await db.collection("users").doc(roomsData.host).get();
            if (hostRef.exists) {
                roomsData.hostPhoto = hostRef.data().photo;
            } else {
                console.log("No such document!");
            }

            for (let index = 0; index < roomsData.participants.length; index++) {
                let participant = roomsData.participants[index];
                const participantRef = await db.collection("users").doc(participant).get();
                if (participantRef.exists) {
                    roomsData.participantsData.push(participantRef.data());
                } else {
                    console.log("No such document!");
                }
            }
            rooms.push(roomsData);
            this.setState({
                rooms
            })
        }
    }

    joinGroup = async (room_ID) => {
        const db = firebase.firestore();
        const { authenticated, uid } = this.props;
        let isHost = false;
        let isParticipant = false;
        if (!authenticated) {
            window.alert('You are not sign in yet!');
            return 
        } 
        
        //不能參加自己開的房間 + 已經參加過的不能重複點選
        const docRef = await db.collection("rooms").doc(room_ID).get();
        if (docRef.exists) {
            if(docRef.data().host === uid){
                isHost = true
            }
            if(docRef.data().participants.find(participant => participant === uid)){
                isParticipant = true
            }
        } else {
            console.log("No such document!");
        }

        if(isHost){
            window.alert('You can not join your own group!');
            return
        }
        
        if(isParticipant){
            window.alert('You already join this group!');
            return
        }
        this.storeUsersToRoom(room_ID);
    }

    storeUsersToRoom = (room_ID) => {
        const db = firebase.firestore();
        const { uid } = this.props;
        const docRef = db.collection("rooms").doc(room_ID);
        docRef.update({
            participants: firebase.firestore.FieldValue.arrayUnion(uid)
        }); 
        window.alert('Join success!');
        this.fetchRooms();
    }

    delete = (room_ID) => {
        const db = firebase.firestore();
        db.collection("rooms").doc(room_ID).delete().then(() => {
            console.log("Document successfully deleted!");
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
        this.fetchRooms();
    }

    dateExpired = (roomData) => {
        const db = firebase.firestore();
        if(moment(roomData.date).isBefore()){
            db.collection("rooms").doc(roomData.room_ID).delete().then(() => {
                window.alert("You can't choose the day before today!");
                this.fetchRooms();
            }).catch((error) => {
                console.error("Error removing document: ", error);
            });
        }
    }

    editRoom = (room_ID) => {
        const { history } = this.props;
        history.push(`/openGroup?${room_ID}`);
    }

    quitGroup = (room_ID) => {
        const db = firebase.firestore();
        const { uid } = this.props;
        const docRef = db.collection("rooms").doc(room_ID);
        if (window.confirm("Do you really want to quit?")) { 
            docRef.update({
                participants: firebase.firestore.FieldValue.arrayRemove(uid)
            }); 
            this.fetchRooms();
        }
    }


    render() { 
        const { rooms } = this.state;
        const { uid } = this.props;
        if(!rooms){
            return <div></div>
        }
        return ( 
            <div className="group-container">
                { rooms.map(room => {
                    return (
                        <Card key={ room.host } className="card-container">
                            {/* edit or not */}
                            { 
                                this.state.editRoom === room.room_ID && this.state.isEditing ? <EditRoom room={ room } editRoom={ this.editRoom } /> : 
                                <div className="col-left">
                                    <CardContent className="card-content">
                                        <div className="host-img-name-wrapper">
                                            <Typography className="place-name" component="p">
                                                { room.placeName }
                                            </Typography>
                                            <div className="host-img">
                                                <Avatar alt="Remy Sharp" src={ room.hostPhoto } />
                                            </div>
                                        </div>
                                        <Typography className="people-need" color="textSecondary" component="p">
                                        缺: 
                                            <Typography className="people-need-qty"component="span">
                                             { room.peopleNeed - room.participantsData.length }
                                            </Typography>
                                        </Typography>
                                        <Typography className="place-intensity place-detail" color="textSecondary">
                                            強度: { room.intensity }
                                        </Typography>
                                        <Typography className="place-date place-detail" color="textSecondary" component="p">
                                            日期: { room.date } 
                                        </Typography>
                                        <Typography className="place-time place-detail" color="textSecondary" component="p">
                                            時間: { room.time } 
                                        </Typography>
                                    </CardContent>
                                    <CardActions className="card-action">
                                        { 
                                            room.participants.length >= room.peopleNeed ? 
                                            <Button className="join-btn" size="small" color="primary" disabled>Join Now!</Button> : 
                                            <Button className="join-btn" onClick={ () => this.joinGroup(room.room_ID) } size="small" color="primary">Join Now!
                                            </Button>
                                        }
                                        { 
                                            room.participants.find(participant => participant === uid) ? 
                                            <Button className="quite-btn" onClick={ () => this.quitGroup(room.room_ID) } size="small" color="primary">Quit!</Button> :
                                            null 
                                        }
                                    </CardActions>
                                </div> 
                            }
                            <div className="col-right">
                                { 
                                    room.host === uid ?
                                    <div className="modify-btn-wrapper">
                                        <IconButton className="modify-btn" size="small" onClick={ () => this.editRoom(room.room_ID) }>
                                            <CreateRoundedIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton className="delete-btn" size="small" onClick={ () => this.delete(room.room_ID) }>
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </div> : 
                                    <div className="fake"></div>
                                }
                                <AvatarGroup className="participants-icons">
                                 { room.participantsData.length !== 0 ? room.participantsData.map(person => <Avatar key={ person.ID } className="participater" alt="Participater" sizes="10px" src={ person.photo } />) : console.log('no participater') }
                                </AvatarGroup>
                            </div>
                        </Card>
                    )
                }) }
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


 
export default connect(mapStateToProps)(Groups);
 
