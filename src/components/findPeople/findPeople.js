import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Checkbox from '@material-ui/core/Checkbox';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

import NavBar from '../common/navbar';

import '../../styles/findpeople.scss';

class FindPeople extends Component {
    constructor(props){
        super(props)
        this.state = {

        }
    }
    render() { 
        const { history } = this.props;
        return ( 
            <div className="find-people-container">
                <NavBar history={ history }/>
                <div className="friends-list-wrapper">
                    <List className="friends-list" dense>
                        {[0, 1, 2, 3].map(value => {
                            const labelId = `checkbox-list-secondary-label-${value}`;
                            return (
                            <ListItem key={value} button divider>
                                <ListItemAvatar>
                                <Link to={ `/member?lBLWRbtQAcVHMVITDODWHeFfovk1` }>
                                    <Avatar
                                        alt={`Avatar n°${value + 1}`}
                                        src="#"
                                    />
                                </Link>
                                </ListItemAvatar>
                                <ListItemText id={labelId} className="friend-name" primary={ 'Ethan' } />
                                <ListItemSecondaryAction>
                                </ListItemSecondaryAction>
                            </ListItem>
                            );
                        })}
                    </List>
                </div>
            </div>
        );
    }
}
 
export default FindPeople;