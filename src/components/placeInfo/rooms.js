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
import Badge from '@material-ui/core/Badge';
import PersonIcon from '@material-ui/icons/Person';

import EditRoom from './editRoom';


class Groups extends Component {
    constructor(props){ 
        super(props)
        this.state = {
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
        const { place_ID } = this.props;
        const rooms = [];
        //get rooms data & get participants data
        const querySnapshot = await db.collection("rooms").where("place_ID", "==", place_ID).get();

        for (let i in querySnapshot.docs) {
            const doc = querySnapshot.docs[i];
            let roomsData = Object.assign({}, doc.data());
            roomsData.room_ID = doc.id;
            roomsData.participantsData = [];
            this.dateExpired(roomsData);

            for (let index = 0; index < roomsData.participants.length; index++) {
                let participant = roomsData.participants[index];
                const docRef = await db.collection("users").doc(participant).get();
                if (docRef.exists) {
                    roomsData.participantsData.push(docRef.data());
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

    joinGroup = async (e) => {
        const db = firebase.firestore();
        const { authenticated, uid } = this.props;
        const roomID = e.target.parentElement.id;
        let isHost = false;
        let isParticipant = false;
        if (!authenticated) {
            window.alert('You are not sign in yet!');
            return 
        } 
        
        //不能參加自己開的房間 + 已經參加過的不能重複點選
        const docRef = await db.collection("rooms").doc(roomID).get();
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
        this.storeUsersToRoom(roomID);
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

    delete = (e) => {
        const db = firebase.firestore();
        const targetID = e.target.parentElement.parentElement.parentElement.id;
        db.collection("rooms").doc(targetID).delete().then(() => {
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

    editRoom = (e) => {
        if(e){
            const targetID = e.target.parentElement.parentElement.id;
            this.setState({
                editRoom: targetID,
                isEditing: !this.state.isEditing
            })
        }else{
            this.fetchRooms();
            this.setState({
                isEditing: !this.state.isEditing
            })
        }
    }

    quitGroup = (e) => {
        const db = firebase.firestore();
        const { uid } = this.props;
        const targetID = e.target.parentElement.id;
        const docRef = db.collection("rooms").doc(targetID);
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
                                    <CardContent>
                                        <Badge className="people-need-qty" color="error" badgeContent={ room.peopleNeed - room.participantsData.length } showZero>
                                            <PersonIcon />
                                        </Badge>
                                        <Typography variant="h5" component="h2">
                                            { room.placeName }
                                        </Typography>
                                        <Typography color="textSecondary">
                                            Intensity: { room.intensity }
                                        </Typography>
                                        <Typography variant="body2" component="p">
                                            Date: { room.date } 
                                        </Typography>
                                        <Typography variant="body2" component="p">
                                            Time: { room.time } 
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        { 
                                            room.participants.length >= room.peopleNeed ? 
                                            <Button size="small" color="primary" disabled>Join Now!</Button> : 
                                            <Button id={ room.room_ID } onClick={ (e) => this.joinGroup(e) } size="small" color="primary">Join Now!
                                            </Button>
                                        }
                                        { 
                                            room.participants.find(participant => participant === uid) ? 
                                            <Button id={ room.room_ID } onClick={ (e) => this.quitGroup(e) } size="small" color="primary">Quit!</Button> :
                                            null 
                                        }
                                    </CardActions>
                                </div> 
                            }
                            <div className="col-right">
                                { 
                                    room.host === uid ?
                                    <div className="modify-btn">
                                        <IconButton id={ room.room_ID } size="small" onClick={ (e) => this.editRoom(e) }>
                                            <CreateRoundedIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton id={ room.room_ID } size="small" onClick={ (e) => this.delete(e) }>
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
 
