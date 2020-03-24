import React, { Component } from "react";
import { db } from "../common/firebase";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import EmojiPeopleIcon from "@material-ui/icons/EmojiPeople";
import Badge from "@material-ui/core/Badge";

import Ball from "../common/BallImg";

class Groups extends Component {
    constructor(props){
        super(props)
        this.state = {
            openGroups: false,
            groups: ""
        }
    }

    async componentDidMount(){
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

    openGroupsList = () => {
        this.setState({
            openGroups: !this.state.openGroups
        })
    }

    render() { 
        const { groups } = this.state;
        return ( 
            <div>
                <ListItem onClick={ this.openGroupsList }>
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
                                <ListItem key={ group.room_ID }>
                                    <ListItemIcon>
                                        <Badge badgeContent={ group.participants.length } color="secondary" anchorOrigin={{ vertical: "top",horizontal: "left" }}>
                                            <Ball className="groups-icon" />
                                        </Badge>
                                    </ListItemIcon>
                                    <Link to={ `/placeInfo?${group.place_ID}` }>
                                        <ListItemText className="group-list" primary={ group.placeName + " " + "date:" + group.date + " " +  group.hoster } />
                                    </Link>
                                </ListItem>
                            )
                            }) :  <ListItem>
                                    <ListItemIcon>
                                        <Badge badgeContent={ 0 } color="secondary" anchorOrigin={{ vertical: "top",horizontal: "left" }}>
                                            <Ball className="groups-icon" />
                                        </Badge>
                                    </ListItemIcon>
                                    <ListItemText className="group-list" primary="You should go and give some bucket!" />
                                </ListItem>
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


 
export default connect(mapStateToProps)(Groups);
 
