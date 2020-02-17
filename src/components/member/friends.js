import React, { Component } from 'react';
import firebase from '../common/firebase';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PersonIcon from '@material-ui/icons/Person';
import Button from '@material-ui/core/Button';

class Friends extends Component {
    constructor(props){
        super(props);
        this.state = {
            friends: '',
            pendingFriends: ''
        }
    }

    componentDidMount(){
        this.getFriend();
    }

    getFriend = async () => {
        const db = firebase.firestore();
        const { uid } = this.props;
        const friends = [];
        const pendingFriends = [];

        //待確認的朋友
        const pendingSnapshot = await db.collection("networks").where("invitee", "==", uid).where("status", "==", "pending").get();

        for (let i in pendingSnapshot.docs) {
            const doc = pendingSnapshot.docs[i]
            const user = await db.collection("users").doc(doc.data().inviter).get();
            pendingFriends.push(user.data());
        }

        //朋友 被邀請者
        const inviteeSnapshot = await db.collection("networks").where("invitee", "==", uid).where("status", "==", "accept").get();
        
        for (let i in inviteeSnapshot.docs) {
            const doc = inviteeSnapshot.docs[i]
            const user = await db.collection("users").doc(doc.data().inviter).get();
            friends.push(user.data());
        }

        //朋友 邀請者
        const inviterSnapshot = await db.collection("networks").where("inviter", "==", uid).where("status", "==", "accept").get();

        for (let i in inviterSnapshot.docs) {
            const doc = inviterSnapshot.docs[i]
            const user = await db.collection("users").doc(doc.data().invitee).get();
            friends.push(user.data());
        }
        this.setState({
            friends,
            pendingFriends
        })
    }

    accept = async (e) => {
        const db = firebase.firestore();
        const { uid } = this.props;
        const target_ID = e.target.parentElement.parentElement.id;
        const inviterSnapshot = await db.collection("networks").where("inviter", "==", target_ID).where("invitee", "==", uid).where("status", "==", "pending").get();
        for (let i in inviterSnapshot.docs) {
            const doc = inviterSnapshot.docs[i]
            await db.collection("networks").doc(doc.id).update({
                status: "accept"
            });
            this.getFriend();
            window.alert('Accept Success!')
        }
    }

    decline = async (e) => {
        const db = firebase.firestore();
        const { uid } = this.props;
        const target_ID = e.target.parentElement.parentElement.id;
        const inviterSnapshot = await db.collection("networks").where("inviter", "==", target_ID).where("invitee", "==", uid).where("status", "==", "pending").get();
        for (let i in inviterSnapshot.docs) {
            const doc = inviterSnapshot.docs[i]
            await db.collection("networks").doc(doc.id).update({
                status: "decline"
            });
            this.getFriend();
            window.alert('Decline Success!')
        }
    }

    render() { 
        const { friends, pendingFriends } = this.state;
        const { isUser } = this.props;
        return (
            <List component="div" disablePadding className="friends">
                { 
                    friends ? 
                    friends.map(friend => 
                    <Link to={ `/member?${friend.ID}` } key={ friend.ID }>
                        <ListItem button >
                                <ListItemIcon>
                                    <PersonIcon className="friends-icon" />
                                </ListItemIcon>
                                <ListItemText className="friends-list" primary={ friend.name } />
                        </ListItem>
                    </Link>) :
                    null
                }
                { 
                    pendingFriends && isUser ? 
                    pendingFriends.map(friend => 
                    <ListItem key={ friend.ID } id={ friend.ID } button >
                        <ListItemIcon>
                            <PersonIcon className="friends-icon" />
                        </ListItemIcon>
                        <ListItemText className="friends-list" primary={ friend.name } />
                        <Button className="accept-btn" onClick={ (e) => this.accept(e) } variant="contained" size="small">
                            accept
                        </Button>
                        <Button className="decline-btn" onClick={ (e) => this.decline(e) } variant="contained" size="small">
                            decline
                        </Button>
                    </ListItem>) :
                    null
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


 
export default connect(mapStateToProps)(Friends);
