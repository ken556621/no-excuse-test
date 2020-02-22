import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

class FindUsers extends Component {
    constructor(props){
        super(props);
        this.state = {
            
        }
    }

    clickRoom = (room_ID) => {
        const { history } = this.props;
        history.push(`/placeInfo?${room_ID}`);
    }

    render() { 
        const { allUsers } = this.props;
        return (
            allUsers.length !== 0 ? allUsers.map((user) => {
                return (
                    <ListItem className="all-users-container" key={ user.ID } button divider>
                        <ListItemAvatar className="user-img-wrapper">
                            <Link to={{
                                pathname: "/member",
                                search: `?${ user.ID }`,
                                key: `${ user.ID }`
                            }}>
                                <Avatar
                                    className="user-img"
                                    alt={ `Avatar n°${user.name}` }
                                    src={ user.photo }
                                />
                            </Link>
                        </ListItemAvatar>
                        <ListItemText className="user-name" primary={ user.name } secondary={ user.quate ? user.quate : "hi" } />
                        { 
                            user.hostRooms.length !== 0 ? 
                            user.hostRooms.map((room) => {
                                return(
                                    <Button className="user-groups" key={ room.place_ID } id={ room.place_ID }  onClick={ () => this.clickRoom(room.place_ID) }>
                                        <Typography className="user-group-name">
                                            { room.placeName }
                                        </Typography>
                                    </Button>
                                )
                            }) :
                            null
                        }
                    </ListItem>
                )
            }) :
            null
        );
    }
}
 
export default FindUsers;