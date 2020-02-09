import React, { Component } from 'react';
import { connect } from 'react-redux';
import firebase from './common/firebase';

import Navbar from './common/navbar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import SportsBasketballIcon from '@material-ui/icons/SportsBasketball';
import CheckRoundedIcon from '@material-ui/icons/CheckRounded';
import ClearIcon from '@material-ui/icons/Clear';
import CreateRoundedIcon from '@material-ui/icons/CreateRounded';

import Boards from './boards';
import '../styles/placeInfo.scss';

class PlaceInfo extends Component {
    constructor(props){
        super(props)
        this.state = {
            isLoading: true,
            name: '',
            address: '',
            photo: '',
            courtStatus: '下雨天容易滑',
            light: true,
            toilet: false
        }
    }

    componentDidMount(){
        const db = firebase.firestore();
        const place_ID = this.props.location.search.slice(1);
        db.collection("locations").where("id", "==", place_ID)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                console.log(doc.id, " => ", doc.data());
                this.setState({
                    isLoading: false,
                    name: doc.data().name,
                    address: doc.data().address,
                    photo: doc.data().photo,
                })
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
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
                            title={ this.state.name }
                            subheader={ this.state.address }
                        />
                        <div className="image">
                            <img src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${this.state.photo}&key=AIzaSyAOCD6zBK2oD6Lrz3gN5zNxM-GNDatpE-o`} />
                        </div>
                        <CardContent className="card-content">
                            <Typography className="card-words" variant="body2" color="textSecondary" component="span">
                                場地狀況: 下雨天容易滑 
                                <CreateRoundedIcon />
                            </Typography>
                            <Typography className="card-words" variant="body2" color="textSecondary" component="span">
                                <Typography className="card-words-light">
                                    夜間照明: 
                                    { this.state.light ? <CheckRoundedIcon className="check-icon"/> : <ClearIcon className="check-icon" /> }
                                </Typography>
                                <CreateRoundedIcon />
                            </Typography>
                            <Typography className="card-words" variant="body2" color="textSecondary" component="span">
                                <Typography className="card-words-light">
                                廁所: 
                                    { this.state.light ? <CheckRoundedIcon className="check-icon"/> : <ClearIcon className="check-icon" /> }
                                </Typography>
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
