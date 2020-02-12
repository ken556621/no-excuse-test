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

    componentDidMount(){
        const db = firebase.firestore();
        const { place_ID } = this.props;
        const rooms = [];
        //get rooms data
        db.collection("rooms").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                 //get participatants data
                let roomPerson = Object.assign({}, doc.data());
                
            });
        });
    }

    joinGroup = (e) => {
        const { authenticated, uid } = this.props;
        if (!authenticated) {
            window.alert('You are not sign in yet!');
            return 
        } 
        //不能參加自己開的房間
        if(e.target.parentElement.id === uid){
            window.alert('You can not join your own room!');
            return
        }
        this.storeUsersToRoom(e.target.parentElement.id, uid);
    }

    storeUsersToRoom = (hoster_uid, participant_uid) => {
        const db = firebase.firestore();
        const { uid, userName, userEmail, userPhoto, place_ID, placeName, address, placePhoto, groupName, groupTime, groupPeople, groupIntensity } = this.props;
        const docRef = db.collection("locations").doc(place_ID).collection("rooms").doc(hoster_uid).collection("participants").doc(participant_uid);
        docRef.set({
            uid,
            userName,
            userEmail,
            userPhoto
        }).then(() => {
            db.collection("users").doc(participant_uid).collection("rooms").doc(place_ID).set({
                place_ID,
                placeName,
                address,
                placePhoto,
                groupName,
                groupTime,
                groupPeople,
                groupIntensity
            })
            .then(function() {
                window.alert('Success joined!')
            })
            .catch(function(error) {
                console.error("Error writing document: ", error);
            });
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
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
                        <Card key={ room.uid } className="card-container">
                            <div className="col-left">
                                <CardContent>
                                    <Typography color="textSecondary" gutterBottom>
                                        { room.name }
                                    </Typography>
                                    <Typography variant="h5" component="h2">
                                        Need: { room.people_need } people
                                    </Typography>
                                    <Typography color="textSecondary">
                                        Intensity: { room.intensity }
                                    </Typography>
                                    <Typography variant="body2" component="p">
                                        We play at: { room.time }
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button id={ room.uid } onClick={ (e) => this.joinGroup(e) } size="small" color="primary">Join Now!</Button>
                                </CardActions>
                            </div>
                            <div className="col-right">
                                 { room.people ? room.people.map(person => <Avatar key={ person.uid } className="participater" alt="Participater" src={ person.userPhoto } />) : console.log('no participater') }
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
 
