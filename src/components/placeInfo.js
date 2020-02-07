import React, { Component } from 'react';
import { connect } from 'react-redux';

import Navbar from './common/navbar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import SportsBasketballIcon from '@material-ui/icons/SportsBasketball';
import CheckRoundedIcon from '@material-ui/icons/CheckRounded';
import CreateRoundedIcon from '@material-ui/icons/CreateRounded';

import Boards from './boards';
import '../styles/placeInfo.scss';

class PlaceInfo extends Component {
    constructor(props){
        super(props)
    }
    render() { 
        return ( 
            <div className="place-info-container">
                <Navbar history={ this.props.history } />
                <div className="card-board-wrapper">
                    <Card className="card">
                        <CardHeader
                            className="card-header"
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
                            <Typography className="card-words" variant="body2" color="textSecondary" component="span">
                                場地狀況: 下雨天容易滑 
                                <CreateRoundedIcon />
                            </Typography>
                            <Typography className="card-words" variant="body2" color="textSecondary" component="span">
                                <Typography className="card-words-light">
                                    夜間照明: 
                                    <CheckRoundedIcon className="check-icon"/>
                                </Typography>
                                <CreateRoundedIcon />
                            </Typography>
                            <Typography className="card-words" variant="body2" color="textSecondary" component="span">
                                廁所: 無
                                <CreateRoundedIcon />
                            </Typography>
                        </CardContent>
                    </Card>
                    <Boards />
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


 
export default connect(mapStateToProps)(PlaceInfo);
