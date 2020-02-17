import React, { Component } from 'react';
import { connect } from 'react-redux';
import firebase from '../common/firebase';

import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Divider from '@material-ui/core/Divider';
import PersonIcon from '@material-ui/icons/Person';
import EmailIcon from '@material-ui/icons/Email';
import WhatshotIcon from '@material-ui/icons/Whatshot';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import Badge from '@material-ui/core/Badge';
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import SportsBasketballIcon from '@material-ui/icons/SportsBasketball';


import NavBar from '../common/navbar';
import Friends from './friends';
import Groups from './groups';
import '../../styles/member.scss';

class Member extends Component {
    constructor(props){
        super(props)
        this.state = {
            isUser: false,
            isFriend: false,
            isModify: false,
            userPhoto: '',
            userName: '',
            userEmail: '',
            userQuate: '',
            openFriends: false,
            openGroups: false,
            pendingFriendQty: ''
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

    componentWillUnmount(){
        //refresh uid will be undefined 
        const db = firebase.firestore();
        const { userName, userQuate } = this.state;
        const { uid } = this.props;
        db.collection("users").doc(uid).update({
            name: userName,
            quate: userQuate
        })
        .then(() => {
            console.log("Document successfully written!");
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
    }

    fetchMemberData = async (uid) => {
        const db = firebase.firestore();
        const pendingFriend = [];

        //用戶基本資訊
        const user = await db.collection("users").doc(uid).get();
        if (user.exists) {
            if(user.data().quate){
                this.setState({
                    userQuate: user.data().quate
                })
            }
            this.setState({
                userPhoto: user.data().photo,
                userName: user.data().name,
                userEmail: user.data().email
            })
        }else{
            console.log("No such document!");
        }

        //待確認好友數
        const pendingSnapshot = await db.collection("networks").where("invitee", "==", uid).where("status", "==", "pending").get();
        for (let i in pendingSnapshot.docs) {
            const doc = pendingSnapshot.docs[i]
            pendingFriend.push(doc.data());
        }
        this.setState({
            pendingFriendQty: pendingFriend.length
        })
    }

    modify = () => {
        this.setState({
            isModify: !this.state.isModify
        })
    }

    handleInput = (e) => {
        const targetElement = e.target.parentElement.parentElement;
        if(targetElement.matches('.edit-quate')){
            this.setState({
                userQuate: e.target.value
            })
        }else if(targetElement.matches('.edit-name')){
            this.setState({
                userName: e.target.value
            })
        }
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
        //不能加自己為好友
        if(uid === person_ID){
            window.alert("You can't add yourself!")
            return
        }
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

    removeFriend = async () => {
        const db = firebase.firestore();
        const { uid, history } = this.props;
        const person_ID = this.props.location.search.slice(1);
        //朋友 被邀請者
        const inviteeSnapshot = await db.collection("networks").where("invitee", "==", uid).where("inviter", "==", person_ID).where("status", "==", "accept").get();
        
        for (let i in inviteeSnapshot.docs) {
            const doc = inviteeSnapshot.docs[i]
            await db.collection("networks").doc(doc.id).update({
                status: "remove"
            });
            
        }

        //朋友 邀請者
        const inviterSnapshot = await db.collection("networks").where("inviter", "==", uid).where("invitee", "==", person_ID).where("status", "==", "accept").get();
        
        for (let i in inviterSnapshot.docs) {
            const doc = inviterSnapshot.docs[i]
            await db.collection("networks").doc(doc.id).update({
                status: "remove"
            });
        }
        history.push('/people');
    }

    render() { 
        const { isUser, isFriend, isModify, userPhoto, userName, userEmail, userQuate, pendingFriendQty } = this.state;
        const { history } = this.props;
        return ( 
            <div className="member-container">
                <NavBar history={ history }/>
                <div className="user-info">
                    { 
                        isUser ? 
                        <IconButton className="modify-btn-wrapper" onClick={ this.modify }>
                            <SportsBasketballIcon className="modify-btn"/>
                        </IconButton> : 
                        null
                    }
                    <Avatar className="user-img" alt="Oh no!" src={ userPhoto } />
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
                        <ListItem button >
                            <ListItemAvatar>
                                <Avatar>
                                    <PersonIcon color="action" />
                                </Avatar>
                            </ListItemAvatar>
                            { 
                                isModify ? 
                                <TextField className="edit-name" value={ userName } label="Your Name" margin="normal" size="small" onChange={ (e) => this.handleInput(e) }></TextField> :
                                <ListItemText primary={ userName ? userName : "You don't have a name right now" } />
                            }
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
                            { 
                                isModify ? 
                                <TextField className="edit-quate" value={ userQuate } label="Your quate" margin="normal" size="small" onChange={ (e) => this.handleInput(e) }></TextField> :
                                <ListItemText primary={ userQuate } />
                            }
                        </ListItem>
                        <Divider variant="inset" component="li" className="line" />
                        <ListItem button onClick={ this.openFriendsList }>
                            <ListItemAvatar>
                            <Badge className="pending-friends-qty" color="error" badgeContent={ this.state.openFriends || !isUser ? 0 : pendingFriendQty }>
                                <Avatar>
                                    <PeopleAltIcon color="action" />
                                </Avatar>
                            </Badge>
                            </ListItemAvatar>
                            <ListItemText primary="Friends list" />
                            { this.state.openFriends ? <ExpandLess className="arrow" /> : <ExpandMore className="arrow" /> }
                        </ListItem>
                        <Divider variant="inset" component="li" className="line" /> 
                        <Collapse in={ this.state.openFriends } timeout="auto" unmountOnExit>
                            <Friends isUser={ isUser } />
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
                            <Groups />
                        </Collapse> 
                        { 
                            isFriend && !isUser ?  
                            <Button className="remove-friend-btn" onClick={ this.removeFriend } variant="contained" size="small">
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
        uid: store.user.uid
    }
}


 
export default connect(mapStateToProps)(Member);