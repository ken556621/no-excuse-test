import React, { Component } from 'react';
import firebase from '../common/firebase';
import { connect } from 'react-redux';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';


class Groups extends Component {
    constructor(props){ 
        super(props)
        this.state = {
            hostersPhoto: '',
            userPhoto: '',
            rooms: ''
        }
    }

    async componentDidMount(){
        const db = firebase.firestore();
        const rooms = [];
        //get rooms data & get participants data
        const querySnapshot = await db.collection("rooms").get();

        for (let i in querySnapshot.docs) {
            const doc = querySnapshot.docs[i];
            let roomsData = Object.assign({}, doc.data());
            roomsData.room_ID = doc.id;
            roomsData.participantsData = [];

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
                            <div className="col-left">
                                <CardContent>
                                    <Typography color="textSecondary" gutterBottom>
                                        { room.placeName }
                                    </Typography>
                                    <Typography variant="h5" component="h2">
                                        Need: { room.peopleNeed } people
                                    </Typography>
                                    <Typography color="textSecondary">
                                        Intensity: { room.intensity }
                                    </Typography>
                                    <Typography variant="body2" component="p">
                                        We play at: { room.time }
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button id={ room.room_ID } onClick={ (e) => this.joinGroup(e) } size="small" color="primary">Join Now!</Button>
                                </CardActions>
                            </div>
                            <div className="col-right">
                                 { room.participantsData.length !== 0 ? room.participantsData.map(person => <Avatar key={ person.ID } className="participater" alt="Participater" src={ person.photo } />) : console.log('no participater') }
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
 
