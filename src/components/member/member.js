import React, { Component } from 'react';
import { connect } from 'react-redux';
import firebase from '../common/firebase';

import Avatar from '@material-ui/core/Avatar';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ListSubheader from '@material-ui/core/ListSubheader';

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


import NavBar from '../common/navbar';
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
        const db = firebase.firestore();
        const { uid } = this.props;
        const groups = [];
        if(!uid){
            const user = firebase.auth().currentUser;
            console.log(user)
            return
        }
        db.collection("users").doc(uid).collection("rooms").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                groups.push(doc.data());
            });
            this.setState({
                groups
            })
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
        return ( 
            <div className="member-container">
                <NavBar history={ this.props.history }/>
                <div className="user-info">
                    <Avatar className="user-img" alt="Oh no!" src={ this.props.userPhoto }>
                        
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
                            <ListItemText primary={ this.props.userName ? this.props.userName : "You don't have a name right now" } />
                        </ListItem>
                        <Divider variant="inset" component="li" className="line" />
                        <ListItem button>
                            <ListItemAvatar>
                                <Avatar>
                                    <EmailIcon color="action" />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={ this.props.userEmail } />
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
                            <ListItemText primary="Friends list." />
                            { this.state.openFriends ? <ExpandLess className="arrow" /> : <ExpandMore className="arrow" /> }
                        </ListItem>
                        <Divider variant="inset" component="li" className="line" /> 
                        <Collapse in={ this.state.openFriends } timeout="auto" unmountOnExit>
                            <List component="div" disablePadding className="friend">
                                <ListItem button >
                                    <ListItemIcon>
                                        <PersonIcon className="friend-icon" />
                                    </ListItemIcon>
                                    <ListItemText className="friend-list" primary="Ethan" />
                                </ListItem>
                            </List>
                        </Collapse>
                        <ListItem button onClick={ this.openGroupsList }>
                            <ListItemAvatar>
                                <Avatar>
                                    <PeopleAltIcon color="action" />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Groups list." />
                            { this.state.openGroups ? <ExpandLess className="arrow" /> : <ExpandMore className="arrow" /> }
                        </ListItem>
                        <Collapse in={ this.state.openGroups } timeout="auto" unmountOnExit>
                            <List component="div" disablePadding className="friend">
                                <ListItem button >
                                    <ListItemIcon>
                                        <PersonIcon className="friend-icon" />
                                    </ListItemIcon>
                                    { this.state.groups ? this.state.groups.map(group => {
                                        return (
                                            <ListItemText className="group-list" primary={ group.groupName } />
                                        )
                                    }) : <ListItemText className="group-list" primary="You should go and give some bucket!" /> }
                                </ListItem>
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