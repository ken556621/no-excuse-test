import React, { Component } from 'react';
import { connect } from 'react-redux';

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


import NavBar from './common/navbar';
import '../styles/member.scss';

class Member extends Component {
    constructor(props){
        super(props)
        this.state = {
            open: false
        }
    }

    openList = () => {
        this.setState({
            open: !this.state.open
        })
    }


    render() { 
        return ( 
            <div className="member-container">
                <NavBar history={ this.props.history }/>
                <div className="user-info">
                    <Avatar className="user-img" alt="Ken Yu">
                        K
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
                            <ListItemText primary="Ken Yu" />
                        </ListItem>
                        <Divider variant="inset" component="li" className="line" />
                        <ListItem button>
                            <ListItemAvatar>
                                <Avatar>
                                    <EmailIcon color="action" />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="user1@example.com" />
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
                        <ListItem button onClick={ this.openList }>
                            <ListItemAvatar>
                                <Avatar>
                                    <PeopleAltIcon color="action" />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Friends list." />
                            {this.state.open ? <ExpandLess className="arrow" /> : <ExpandMore className="arrow" />}
                        </ListItem>
                        <Divider variant="inset" component="li" className="line" /> 
                        <Collapse in={this.state.open} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding className="friend">
                                <ListItem button >
                                    <ListItemIcon>
                                        <PersonIcon className="friend-icon" />
                                    </ListItemIcon>
                                    <ListItemText primary="Ethan" />
                                </ListItem>
                            </List>
                        </Collapse>     
                    </List>
                </div>
            </div>
        );
    }
}
 
function mapStateToProps(state){
    return {
        authenticated: state.authenticated,
        authenticating: state.authenticating
    }
}


 
export default connect(mapStateToProps)(Member);