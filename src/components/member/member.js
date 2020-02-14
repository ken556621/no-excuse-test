import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import firebase from '../common/firebase';

import Avatar from '@material-ui/core/Avatar';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ListSubheader from '@material-ui/core/ListSubheader';
import Badge from '@material-ui/core/Badge';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Divider from '@material-ui/core/Divider';
import PersonIcon from '@material-ui/icons/Person';
import EmailIcon from '@material-ui/icons/Email';
import WhatshotIcon from '@material-ui/icons/Whatshot';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';


import NavBar from '../common/navbar';
import Ball from '../common/ballImg';
import '../../styles/member.scss';

class Member extends Component {
    constructor(props){
        super(props)
        this.state = {
            openFriends: false,
            openGroups: false,
            groups: ''
        }
    }

    componentDidMount(){
        const { uid, history } = this.props;
        const db = firebase.firestore();
        const groups = [];
        if(!uid){
            console.log('Not log in yet!');
            history.push('/');
            return
        }
        //參加的房間
        db.collection("rooms").where("participants", "array-contains", uid)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const roomsData = Object.assign({}, doc.data());
                roomsData.room_ID = doc.id;
                roomsData.hoster = "";
                groups.push(roomsData);
            });
            this.setState({
                groups
            })
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
        //開的房間
        db.collection("rooms").where("host", "==", uid)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const roomsData = Object.assign({}, doc.data());
                roomsData.room_ID = doc.id;
                roomsData.hoster = "hoster";
                groups.push(roomsData);
            });
            this.setState({
                groups
            })
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
    }

    openFriendsList = () => {
        this.setState({
            openFriends: !this.state.openFriends
        })
    }

    openGroupsList = () => {
        this.setState({
            openGroups: !this.state.openGroups
        })
    }

    render() { 
        const { history, userPhoto, userName, userEmail } = this.props;
        const { groups } = this.state;
        return ( 
            <div className="member-container">
                <NavBar history={ history }/>
                <div className="user-info">
                    <Avatar className="user-img" alt="Oh no!" src={ userPhoto }>
                        
                    </Avatar>
                    <List className="list-container"
                        aria-labelledby="nested-list-subheader" subheader={
                        <ListSubheader component="div" id="nested-list-subheader">
                            Personal Information
                        </ListSubheader>
                        }
                    >
                        <ListItem button>
                            <ListItemAvatar>
                                <Avatar>
                                    <PersonIcon color="action" />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={ userName ? userName : "You don't have a name right now" } />
                        </ListItem>
                        <Divider variant="inset" component="li" className="line" />
                        <ListItem button>
                            <ListItemAvatar>
                                <Avatar>
                                    <EmailIcon color="action" />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={ userEmail } />
                        </ListItem>
                        <Divider variant="inset" component="li" className="line" />
                        <ListItem button>
                            <ListItemAvatar>
                                <Avatar>
                                    <WhatshotIcon color="action" />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Injuries are a part of the game. Every athlete knows that." />
                        </ListItem>
                        <Divider variant="inset" component="li" className="line" />
                        <ListItem button onClick={ this.openFriendsList }>
                            <ListItemAvatar>
                                <Avatar>
                                    <PeopleAltIcon color="action" />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Friends list" />
                            { this.state.openFriends ? <ExpandLess className="arrow" /> : <ExpandMore className="arrow" /> }
                        </ListItem>
                        <Divider variant="inset" component="li" className="line" /> 
                        <Collapse in={ this.state.openFriends } timeout="auto" unmountOnExit>
                            <List component="div" disablePadding className="friends">
                                <ListItem button >
                                    <ListItemIcon>
                                        <PersonIcon className="friends-icon" />
                                    </ListItemIcon>
                                    <ListItemText className="friends-list" primary="Ethan" />
                                </ListItem>
                            </List>
                        </Collapse>
                        <ListItem button onClick={ this.openGroupsList }>
                            <ListItemAvatar>
                                <Avatar>
                                    <EmojiPeopleIcon color="action" />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Groups list" />
                            { this.state.openGroups ? <ExpandLess className="arrow" /> : <ExpandMore className="arrow" /> }
                        </ListItem>
                        <Collapse in={ this.state.openGroups } timeout="auto" unmountOnExit>
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
                        </Collapse>        
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
        uid: store.user.uid,
        userName: store.user.name,
        userEmail: store.user.email,
        userPhoto: store.user.photo,
        userFriends: store.user.friends
    }
}


 
export default connect(mapStateToProps)(Member);