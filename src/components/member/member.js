import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import firebase from '../common/firebase';

import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
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
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import SportsBasketballIcon from '@material-ui/icons/SportsBasketball';


import NavBar from '../common/navbar';
import Ball from '../common/ballImg';
import '../../styles/member.scss';

class Member extends Component {
    constructor(props){
        super(props)
        this.state = {
            isUser: false,
            isFriend: false,
            userPhoto: '',
            userName: '',
            userEmail: '',
            openFriends: false,
            openGroups: false,
            friends: '',
            groups: ''
        }
    }

    componentDidMount(){
        const db = firebase.firestore();
        const { uid, history } = this.props;
        const person_ID = this.props.location.search.slice(1);
        if(!uid){
            console.log('Not log in yet!');
            history.push('/');
            return
        }
        //Loading friend's data & check user and friend status
        if(person_ID){

            db.collection("networks").where("inviter", "==", uid).where("invitee", "==", person_ID).where("status", "==", "accept")
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    console.log("we are friend!");
                    this.setState({
                        isFriend: true
                    })
                });
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });

            db.collection("networks").where("inviter", "==", person_ID).where("invitee", "==", uid).where("status", "==", "accept")
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    console.log("we are friend!");
                    this.setState({
                        isFriend: true
                    })
                });
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });

            this.fetchMemberData(person_ID);
        }else{
            this.setState({
                isUser: true
            })
            this.fetchMemberData(uid);
        }   
    }

    fetchMemberData = (uid) => {
        const db = firebase.firestore();
        const friends = [];
        const groups = [];

        //用戶基本資訊
        db.collection("users").doc(uid)
        .get().then((doc) => {
            if (doc.exists) {
                this.setState({
                    userPhoto: doc.data().photo,
                    userName: doc.data().name,
                    userEmail: doc.data().email
                })
            }else{
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });

        //待確認的朋友
        db.collection("networks").where("invitee", "==", uid).where("status", "==", "pending")
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                
            });
            this.setState({
                
            })
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });

        //朋友 被邀請者
        db.collection("networks").where("invitee", "==", uid).where("status", "==", "accept")
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                
            });
            this.setState({
                
            })
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });

        //朋友 邀請者
        db.collection("networks").where("inviter", "==", uid).where("status", "==", "accept")
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                
            });
            this.setState({
                
            })
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });

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

    addFriend = () => {
        const db = firebase.firestore();
        const { uid, history } = this.props;
        const person_ID = this.props.location.search.slice(1);
        db.collection("networks").doc().set({
            inviter: uid,
            invitee: person_ID,
            status: "pending"
        }).then(() => {
            window.alert('Waitting for comfirm')
            history.push('/people');
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
        
    }

    render() { 
        const { isUser, isFriend, userPhoto, userName, userEmail, groups } = this.state;
        const { history } = this.props;
        return ( 
            <div className="member-container">
                <NavBar history={ history }/>
                <div className="user-info">
                    { 
                        isUser ? 
                        <IconButton className="modify-btn-wrapper">
                            <SportsBasketballIcon className="modify-btn"/>
                        </IconButton> : 
                        null
                    }
                    <Avatar className="user-img" alt="Oh no!" src={ userPhoto }>
                        
                    </Avatar>
                    <List className="list-container"
                        aria-labelledby="nested-list-subheader" subheader={
                        <ListSubheader className="subheader-wrapper" component="div" id="nested-list-subheader">
                            <Typography>
                                Personal Information
                            </Typography>
                            { 
                                !isFriend && !isUser ?  
                                <Button className="add-friend-btn" variant="contained" size="small" onClick={ this.addFriend }>
                                    Add Friend
                                </Button> : 
                                null
                            } 
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
                        { 
                            isFriend && !isUser ?  
                            <Button className="remove-friend-btn" variant="contained" size="small">
                                Remove Friend
                            </Button> : 
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
        uid: store.user.uid,
        userName: store.user.name,
        userEmail: store.user.email,
        userPhoto: store.user.photo,
        userFriends: store.user.friends
    }
}


 
export default connect(mapStateToProps)(Member);