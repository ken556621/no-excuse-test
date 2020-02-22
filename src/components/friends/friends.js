import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';


import '../../styles/findpeople.scss';

class Friends extends Component {
    constructor(props){
        super(props)
        this.state = {
            
        }
    }

    clickRoom = (e) => {
        const { history } = this.props;
        history.push(`/placeInfo?${e.target.id}`);
    }

    render() { 
        const { friends } = this.props;
        return (  
                friends.length !== 0 ?
                friends.map(person => {
                    console.log(person)
                    const labelId = `checkbox-list-secondary-label-${person}`;
                    return (
                    <ListItem key={person.ID} button divider>
                        <ListItemAvatar>
                            <Link to={{
                                pathname: "/member",
                                search: `?${ person.ID }`,
                                key: `${person.ID}`
                            }}>
                                <Avatar
                                    className="friend-img"
                                    alt={`Avatar n°${person.name}`}
                                    src={ person.photo }
                                />
                            </Link>
                        </ListItemAvatar>
                        <ListItemText id={labelId} className="friend-name" primary={ person.name } secondary={ person.quate ? person.quate : "hi" } />
                        { 
                            person.hostRooms.length !== 0 ? 
                            person.hostRooms.map((room) => {
                                return(
                                    <ListItemSecondaryAction key={ room.place_ID } id={ room.place_ID } className="friend-groups" onClick={ (e) => this.clickRoom(e) }>
                                        { room.placeName }
                                    </ListItemSecondaryAction>
                                )
                            }) :
                            <div className="default-group">No room yet!</div>
                        }
                    </ListItem>
                    );
                }) :
                null
        );
    }
}
 

export default Friends;