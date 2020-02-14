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
            hostersPhoto: '',
            userPhoto: '',
            rooms: '',
            editStatus: false
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
        const { uid, history } = this.props;
        const docRef = db.collection("rooms").doc(room_ID);
        docRef.update({
            participants: firebase.firestore.FieldValue.arrayUnion(uid)
        }); 
        window.alert('Join success!');
        history.push('/place');       
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
                console.log("Document successfully deleted!");
            }).catch((error) => {
                console.error("Error removing document: ", error);
            });
        }
    }

    editRoom = () => {
        this.setState({
            editStatus: !this.state.editStatus
        })
    }


    render() { 
        const { rooms } = this.state;
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
                                this.state.editStatus ? <EditRoom room={ room } editRoom={ this.editRoom } /> : 
                                <div className="col-left">
                                    <CardContent>
                                        <Typography color="textSecondary" gutterBottom>
                                            Need: { room.peopleNeed } people
                                        </Typography>
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
                                        { room.participants.length >= room.peopleNeed ? <Button size="small" color="primary" disabled>Join Now!</Button> : <Button id={ room.room_ID } onClick={ (e) => this.joinGroup(e) } size="small" color="primary">Join Now!</Button> }
                                    </CardActions>
                                </div> 
                            }
                            <div className="col-right">
                                <div className="modify-btn">
                                    <IconButton size="small" onClick={ this.editRoom }>
                                        <CreateRoundedIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton id={ room.room_ID } size="small" onClick={ (e) => this.delete(e) }>
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </div>
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
        uid: store.user.uid,
        userName: store.user.name,
        userEmail: store.user.email,
        userPhoto: store.user.photo,
        id: store.location.id,
        placeName: store.location.name,
        address: store.location.address,
        placePhoto: store.location.photo,
        groupName: store.group.name,
        groupTime: store.group.time,
        groupPeople: store.group.people,
        groupIntensity: store.group.intensity
    }
}


 
export default connect(mapStateToProps)(Groups);
 
