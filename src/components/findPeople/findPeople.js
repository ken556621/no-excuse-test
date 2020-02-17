import React, { Component } from 'react';
import firebase from '../common/firebase';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

import NavBar from '../common/navbar';
import Load from '../common/load';

import '../../styles/findpeople.scss';

class FindPeople extends Component {
    constructor(props){
        super(props)
        this.state = {
            isLoading: true,
            allUser: '',
            friends: ''
        }
    }

    componentDidMount(){
        const { uid } = this.props;
        this.getAllUsers();
        this.getFriends(uid);
    }

    getFriends = async (uid) => {
        const db = firebase.firestore();
        const friends = [];

        //朋友 被邀請者
        const inviteeSnapshot = await db.collection("networks").where("invitee", "==", uid).where("status", "==", "accept").get();
        
        for (let i in inviteeSnapshot.docs) {
            const doc = inviteeSnapshot.docs[i]
            const user = await db.collection("users").doc(doc.data().inviter).get();
            let friendsData = Object.assign({}, user.data());
            friendsData.hostRooms = [];
            const roomSnapshot = await db.collection("rooms").where("host", "==", friendsData.ID).get();
            roomSnapshot.forEach((room) => {
                friendsData.hostRooms.push(room.data());
            })
            friends.push(friendsData);
        }

        //朋友 邀請者
        const inviterSnapshot = await db.collection("networks").where("inviter", "==", uid).where("status", "==", "accept").get();

        for (let i in inviterSnapshot.docs) {
            const doc = inviterSnapshot.docs[i]
            const user = await db.collection("users").doc(doc.data().invitee).get();
            let friendsData = Object.assign({}, user.data());
            friendsData.hostRooms = [];
            const roomSnapshot = await db.collection("rooms").where("host", "==", friendsData.ID).get();
            roomSnapshot.forEach((room) => {
                friendsData.hostRooms.push(room.data());
            })
            friends.push(friendsData);
        }
        this.setState({
            isLoading: false,
            friends
        })
    }

    getAllUsers = async () => {
        const db = firebase.firestore();
        const allUser = [];
        const userSnapshot = await db.collection("users").get();
        userSnapshot.forEach((doc) => {
            allUser.push(doc.data());
        })
        this.setState({
            allUser
        })
    }

    clickRoom = (e) => {
        const { history } = this.props;
        history.push(`/placeInfo?${e.target.id}`);
    }

    render() { 
        const { isLoading, allUser, friends } = this.state;
        const { history } = this.props;
        console.log(allUser)
        if(isLoading && allUser.length === 0){
            return <Load />
        }
        return ( 
            <div className="find-people-container">
                <NavBar history={ history }/>
                <div className="friends-list-wrapper">
                <Autocomplete
                    options={ allUser }
                    getOptionLabel={ option => option.name }
                    id="disable-clearable"
                    className="search-bar"
                    renderInput={params => (
                    <TextField {...params} label="Find Friends" margin="normal" fullWidth />
                    )}
                />
                    <List className="friends-list" dense>
                        { 
                            friends.length !== 0 ?
                            friends.map(person => {
                                const labelId = `checkbox-list-secondary-label-${person}`;
                                return (
                                <ListItem key={person.ID} button divider>
                                    <ListItemAvatar>
                                        <Link to={{
                                            pathname: "/member",
                                            search: "?lBLWRbtQAcVHMVITDODWHeFfovk1",
                                            key: `${person.ID}`
                                        }}>
                                            <Avatar
                                                className="friend-img"
                                                alt={`Avatar n°${person.name}`}
                                                src={ person.photo }
                                            />
                                        </Link>
                                    </ListItemAvatar>
                                    <ListItemText id={labelId} className="friend-name" primary={ person.name } secondary={ person.quate ? person.quate : "hi" } />
                                    { 
                                        person.hostRooms.length !== 0 ? 
                                        person.hostRooms.map((room) => {
                                            return(
                                                <ListItemSecondaryAction key={ room.place_ID } id={ room.place_ID } className="friend-groups" onClick={ (e) => this.clickRoom(e) }>
                                                   { room.placeName }
                                                </ListItemSecondaryAction>
                                            )
                                        }) :
                                        <div>No room yet!</div>
                                    }
                                </ListItem>
                                );
                            }) :
                            null
                        }
                    </List>
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


 
export default connect(mapStateToProps)(FindPeople);