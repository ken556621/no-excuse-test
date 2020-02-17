import React, { Component } from 'react';
import firebase from '../common/firebase';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Badge from '@material-ui/core/Badge';

import Ball from '../common/ballImg';

class Groups extends Component {
    constructor(props){
        super(props)
        this.state = {
            groups: ''
        }
    }

    async componentDidMount(){
        const db = firebase.firestore();
        const { uid } = this.props;
        const groups = [];

        //參加的房間
        const participantsSnapshot = await db.collection("rooms").where("participants", "array-contains", uid).get();
        participantsSnapshot.forEach((doc) => {
            const roomsData = Object.assign({}, doc.data());
            roomsData.room_ID = doc.id;
            roomsData.hoster = "";
            groups.push(roomsData);
        });

        //開的房間
        const hostSnapshot = await db.collection("rooms").where("host", "==", uid).get();
        hostSnapshot.forEach((doc) => {
            const roomsData = Object.assign({}, doc.data());
            roomsData.room_ID = doc.id;
            roomsData.hoster = "hoster";
            groups.push(roomsData);
        });
        this.setState({
            groups
        })
    }

    render() { 
        const { groups } = this.state;
        return ( 
            <List component="div" disablePadding className="groups">
                { 
                    groups.length !== 0 ? groups.map((group) => {
                    return (
                        <ListItem button key={ group.room_ID }>
                            <ListItemIcon>
                                <Badge badgeContent={ group.participants.length } color="secondary" anchorOrigin={{ vertical: 'top',horizontal: 'left' }}>
                                    <Ball className="groups-icon" />
                                </Badge>
                            </ListItemIcon>
                            <Link to={ `/placeInfo?${group.place_ID}` }>
                                <ListItemText className="group-list" primary={ group.placeName + " " + "date:" + group.date + " " +  group.hoster } />
                            </Link>
                        </ListItem>
                    )
                    }) :  <ListItem button>
                            <ListItemIcon>
                                <Badge badgeContent={ 0 } color="secondary" anchorOrigin={{ vertical: 'top',horizontal: 'left' }}>
                                    <Ball className="groups-icon" />
                                </Badge>
                            </ListItemIcon>
                            <ListItemText className="group-list" primary="You should go and give some bucket!" />
                        </ListItem>
                }
            </List>
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
 
