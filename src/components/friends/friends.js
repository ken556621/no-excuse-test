import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';


import './findPeople.scss';

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
                    return (
                    <ListItem className="friends-list-container" key={ person.ID } button divider>
                        <ListItemAvatar className="friends-img-wrapper">
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
                        <ListItemText className="friend-name" id={person.ID} primary={ person.name } secondary={ person.quate ? person.quate : "hi" } />
                        { 
                            person.hostRooms.length !== 0 ? 
                            person.hostRooms.map((room) => {
                                return(
                                    <Button className="friend-groups" key={ room.place_ID } id={ room.place_ID } onClick={ (e) => this.clickRoom(e) }>
                                        <Typography className="friend-groups-name">
                                            { room.placeName }
                                        </Typography>
                                    </Button>
                                )
                            }) :
                            <Typography className="norooms-default">
                                No any room yet!
                            </Typography>
                        }
                    </ListItem>
                    );
                }) :
                <div className="nofriends-default">
                    <Typography className="nofriends-default-words" component="p">
                        No any friend yet!
                    </Typography>
                    <img src="https://img.icons8.com/ios/100/000000/crying.png"></img>
                </div>
        );
    }
}
 

export default Friends;