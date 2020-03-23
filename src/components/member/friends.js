import React, { Component } from "react";
import { db } from "../common/firebase";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Collapse from "@material-ui/core/Collapse";
import PeopleAltIcon from "@material-ui/icons/PeopleAlt";
import Badge from "@material-ui/core/Badge";
import Divider from "@material-ui/core/Divider";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import PersonIcon from "@material-ui/icons/Person";
import Button from "@material-ui/core/Button";

import CustomDialog from "../common/CustomDialog";

class Friends extends Component {
    constructor(props){
        super(props);
        this.state = {
            openFriends: false,
            friends: "",
            pendingFriends: "",
            dialogIsOpen: false,
            dialogMessage: ""
        }
    }

    componentDidMount(){
        this.getFriends();
    }

    getFriends = async () => {
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
        const { uid } = this.props;
        const target_ID = e.target.parentElement.parentElement.id;
        const inviterSnapshot = await db.collection("networks").where("inviter", "==", target_ID).where("invitee", "==", uid).where("status", "==", "pending").get();
        for (let i in inviterSnapshot.docs) {
            const doc = inviterSnapshot.docs[i]
            await db.collection("networks").doc(doc.id).update({
                status: "accept"
            });
            this.getFriends();
            this.setState({
                dialogIsOpen: true,
                dialogMessage: "成功接受！"
            })
        }
    }

    decline = async (e) => {
        const { uid } = this.props;
        const target_ID = e.target.parentElement.parentElement.id;
        const inviterSnapshot = await db.collection("networks").where("inviter", "==", target_ID).where("invitee", "==", uid).where("status", "==", "pending").get();
        for (let i in inviterSnapshot.docs) {
            const doc = inviterSnapshot.docs[i]
            await db.collection("networks").doc(doc.id).update({
                status: "decline"
            });
            this.getFriends();
            this.setState({
                dialogIsOpen: true,
                dialogMessage: "成功刪除！"
            })
        }
    }

    openFriendsList = () => {
        this.setState({
            openFriends: !this.state.openFriends
        })
    }

    dialogClose = () => {
        this.setState({
            dialogIsOpen: false
        })
    }

    render() { 
        const { openFriends, friends, pendingFriends, dialogIsOpen, dialogMessage } = this.state;
        const { pendingFriendQty } = this.props;
        return (
            <div>
                <CustomDialog dialogIsOpen={ dialogIsOpen } dialogMessage={ dialogMessage } dialogClose={ this.dialogClose } />
                <ListItem button onClick={ this.openFriendsList }>
                    <ListItemAvatar>
                    <Badge className="pending-friends-qty" color="error" badgeContent={ openFriends ? 0 : pendingFriendQty }>
                        <Avatar>
                            <PeopleAltIcon color="action" />
                        </Avatar>
                    </Badge>
                    </ListItemAvatar>
                    <ListItemText primary="Friends list" />
                    { openFriends ? <ExpandLess className="arrow" /> : <ExpandMore className="arrow" /> }
                </ListItem>
                <Divider variant="inset" component="li" className="line" /> 
                <Collapse in={ openFriends } timeout="auto" unmountOnExit>
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
                            pendingFriends ? 
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
                </Collapse>
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


 
export default connect(mapStateToProps)(Friends);
