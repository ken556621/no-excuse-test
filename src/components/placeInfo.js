import React, { Component } from 'react';
import { connect } from 'react-redux';

import Navbar from './common/navbar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import SportsBasketballIcon from '@material-ui/icons/SportsBasketball';


import '../styles/placeInfo.scss';

class PlaceInfo extends Component {
    constructor(props){
        super(props)
    }
    render() { 
        return ( 
            <div className="place-info-container">
                <Navbar history={ this.props.history } />
                <Card className="card">
                    <CardHeader
                        className="card-header"
                        avatar={
                        <Avatar className="weather-img" aria-label="recipe">
                            R
                        </Avatar>
                        }
                        action={
                        <IconButton className="setting-btn" aria-label="settings">
                            <SportsBasketballIcon />
                        </IconButton>
                        }
                        title="台北和平籃球館"
                        subheader="106台灣台北市大安區敦南街76巷28號"
                    />
                    <div className="image">
                        <img src="https://images.unsplash.com/photo-1537835441678-0d136a68fe01?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=975&q=80"/>
                    </div>
                    <CardContent className="card-content">
                        <Typography className="card-words" variant="body2" color="textSecondary" component="p">
                        
                        </Typography>
                    </CardContent>
                </Card>
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


 
export default connect(mapStateToProps)(PlaceInfo);
