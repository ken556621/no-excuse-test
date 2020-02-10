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
import Button from '@material-ui/core/Button';

import Load from './common/load';
import Boards from './boards';
import Groups from './groups';
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
            toilet: false,
            rooms: ''
        }
    }

    componentDidMount(){
        const db = firebase.firestore();
        const place_ID = this.props.location.search.slice(1);
        //if redux have data, load from redux, otherwise load from firebase
        if(this.props.id !== ''){
            this.setState({
                isLoading: false,
                name: this.props.name,
                address: this.props.address,
                photo: this.props.photo,
                rooms: this.props.rooms
            })
            return
        }
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
                    rooms: doc.data().rooms
                })
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
    }

    openGroup = () => {
        const { history } = this.props;
        const place_ID = this.props.location.search.slice(1);
        if(!this.props.authenticated){
            //若沒有註冊，不能開
            window.alert('Please login first!');
            return
        }
        if(this.state.rooms.find(room => room.uid === this.props.uid)){
            //若開場過，不能再開
            window.alert('You already open it!');
            return
        }
        history.push(`/openGroup?${place_ID}`)
    }

    render() { 
        return ( 
            <div className={ this.state.isLoading ? 'load' : "place-info-container" }>
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
                            <img src={ `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${this.state.photo}&key=AIzaSyAOCD6zBK2oD6Lrz3gN5zNxM-GNDatpE-o` } />
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
                    { this.state.rooms ? <Groups rooms={ this.state.rooms }/>: null }        
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
        id: store.location.id,
        name: store.location.name,
        address: store.location.address,
        photo: store.location.photo,
        rooms: store.location.rooms
    }
}


 
export default connect(mapStateToProps)(PlaceInfo);
