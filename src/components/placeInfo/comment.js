import React, { Component } from 'react';
import { connect } from 'react-redux';
import firebase from '../common/firebase';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
 
import '../../styles/comment.scss';

class Comment extends Component {
  constructor(props){
    super(props)
    this.state = {

    }
  }



  render() { 
    const { handleClick } = this.props;
    return (
      <List className="boards-container">
        <ListItem alignItems="flex-start">
          <ListItemAvatar>
            <Avatar alt="Remy Sharp" src='#' />
          </ListItemAvatar>
          <ListItemText
            primary="Brunch this weekend?"
            secondary={
              <React.Fragment>
                <Typography
                  component="span"
                  variant="body2"
                  color="textPrimary"
                >
                  Ali Connors
                </Typography>
                {" — I'll be in your neighborhood doing errands this…"}
              </React.Fragment>
            }
          />
        </ListItem>
        <Button onClick={ handleClick }>Click to flip</Button>
        <Divider variant="inset" component="li" />
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



export default connect(mapStateToProps)(Comment);
