import React, { Component } from 'react';
import { connect } from 'react-redux';
import firebase from '../common/firebase';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import SportsBasketballIcon from '@material-ui/icons/SportsBasketball';
import CheckRoundedIcon from '@material-ui/icons/CheckRounded';
import ClearIcon from '@material-ui/icons/Clear';
import CreateRoundedIcon from '@material-ui/icons/CreateRounded';
import Button from '@material-ui/core/Button';

import Navbar from '../common/navbar';
import Load from '../common/load';
import Boards from './boards';
import Rooms from './rooms';
import '../../styles/placeInfo.scss';

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
        //if redux have data, load from redux, otherwise load from firebase
        if(this.props.place_ID !== ''){
            this.setState({
                isLoading: false,
                name: this.props.name,
                address: this.props.address,
                photo: this.props.photo
            })
            return
        }
        db.collection("locations").where("id", "==", place_ID)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                this.setState({
                    isLoading: false,
                    name: doc.data().name,
                    address: doc.data().address,
                    photo: doc.data().photo
                })
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
    }

    openGroup = async () => { 
        const db = firebase.firestore();
        const place_ID = this.props.location.search.slice(1);
        const { uid, history } = this.props;
        let isHost = false;
        
        //can't open two group in same place
        const querySnapshot = await db.collection("rooms").where("host", "==", uid).get();
        querySnapshot.forEach((doc) => {
            isHost = true;
        })
        if(isHost){
            window.alert("You already have opened the group in this place!");
        }else{
            history.push(`/openGroup?${ place_ID }`);
        }
    }

    render() { 
        const place_ID = this.props.location.search.slice(1);
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
                            <img src={ `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${this.state.photo}&key=AIzaSyAOCD6zBK2oD6Lrz3gN5zNxM-GNDatpE-o` } alt="Please wait for second" />
                        </div>
                        <CardContent className="card-content">
                            <Typography className="card-words" variant="body2" color="textSecondary" component="span">
                                場地狀況: 下雨天容易滑 
                                <IconButton className="setting-btn" aria-label="settings">
                                    <CreateRoundedIcon />
                                </IconButton>
                            </Typography>
                            <Typography className="card-words" variant="body2" color="textSecondary" component="span">
                                <Typography className="card-words-light">
                                    夜間照明: 
                                    { this.state.light ? <CheckRoundedIcon className="check-icon"/> : <ClearIcon className="check-icon" /> }
                                </Typography>
                                <IconButton className="setting-btn" aria-label="settings">
                                    <CreateRoundedIcon />
                                </IconButton>
                            </Typography>
                            <Typography className="card-words" variant="body2" color="textSecondary" component="span">
                                <Typography className="card-words-light">
                                廁所: 
                                    { this.state.light ? <CheckRoundedIcon className="check-icon"/> : <ClearIcon className="check-icon" /> }
                                </Typography>
                                <IconButton className="setting-btn" aria-label="settings">
                                    <CreateRoundedIcon />
                                </IconButton>
                            </Typography>
                            <Button className="open-group-btn" variant="contained" color="primary" onClick={ this.openGroup }>
                                Open Group
                            </Button>
                        </CardContent>
                    </Card> 
                    <Boards />
                </div>
                <div className="groups">
                    <Rooms place_ID={ place_ID }/>   
                </div>
            </div>
        );
    }
} 
 
function mapStateToProps(store){
    return {
        authenticated: store.user.authenticated,
        authenticating: store.user.authenticating,
        uid: store.user.uid,
        place_ID: store.location.id
    }
}


 
export default connect(mapStateToProps)(PlaceInfo);
