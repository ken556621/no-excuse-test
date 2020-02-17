import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';

class FindUsers extends Component {
    constructor(props){
        super(props);
        this.state = {
            
        }
    }

    clickRoom = (e) => {
        const { history } = this.props;
        history.push(`/placeInfo?${e.target.id}`);
    }

    render() { 
        const { allUsers } = this.props;
        return (
            allUsers.length !== 0 ? allUsers.map((user) => {
                return (
                    <ListItem key={ user.ID } button divider>
                        <ListItemAvatar>
                            <Link to={{
                                pathname: "/member",
                                search: `?${ user.ID }`,
                                key: `${ user.ID }`
                            }}>
                                <Avatar
                                    className="friend-img"
                                    alt={ `Avatar n°${user.name}` }
                                    src={ user.photo }
                                />
                            </Link>
                        </ListItemAvatar>
                        <ListItemText className="friend-name" primary={ user.name } secondary={ user.quate ? user.quate : "hi" } />
                        { 
                            user.hostRooms.length !== 0 ? 
                            user.hostRooms.map((room) => {
                                return(
                                    <ListItemSecondaryAction key={ room.place_ID } id={ room.place_ID } className="friend-groups" onClick={ (e) => this.clickRoom(e) }>
                                        { room.placeName }
                                    </ListItemSecondaryAction>
                                )
                            }) :
                            <div className="default-group">No room yet!</div>
                        }
                    </ListItem>
                )
            }) :
            null
        );
    }
}
 
export default FindUsers;