import React, { Component } from 'react';
import { connect } from 'react-redux';
import firebase from '../common/firebase';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CheckRoundedIcon from '@material-ui/icons/CheckRounded';
import ClearIcon from '@material-ui/icons/Clear';
import CreateRoundedIcon from '@material-ui/icons/CreateRounded';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import Navbar from '../common/navbar';
import Boards from './boards';
import Rooms from './rooms';
import Ball from '../common/basketballImg';
import '../../styles/placeInfo.scss';

class PlaceInfo extends Component {
    constructor(props){
        super(props)
        this.state = {
            isLoading: true,
            isEditing: false,
            editTarget: '',
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
                this.setState({
                    isLoading: false,
                    name: doc.data().name,
                    address: doc.data().address,
                    photo: doc.data().photo
                })
                if(doc.data().courtStatus){
                    this.setState({
                        courtStatus: doc.data().courtStatus,
                        light: doc.data().light,
                        toilet: doc.data().toilet
                    })
                }
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
    }

    componentWillUnmount(){
        //store user update detail before close the page
        const db = firebase.firestore();
        const place_ID = this.props.location.search.slice(1);
        const { courtStatus, light, toilet } = this.state;
        db.collection("locations").doc(place_ID).update({
            courtStatus,
            light,
            toilet
        })
        .then(function() {
            console.log("Document successfully written!");
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
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

    editInfo = (e) => {
        if(e){
            const targetID = e.target.parentElement.parentElement.id;
            this.setState({
                isEditing: !this.state.isEditing,
                editTarget: targetID
            })
        }else{
            this.setState({
                isEditing: !this.state.isEditing
            })
        }
    }

    handleInput = (e) => {
        const targetElement = e.target.parentElement.parentElement;
        if(targetElement.matches('.edit-place-name')){
            this.setState({
                courtStatus: e.target.value
            })
        }
    }

    toggleCheckBox = (e) => {
        if(e.target.value === "hasLight"){
            this.setState({
                light: !this.state.light
            })
        }else if(e.target.value === "hasToilet"){
            this.setState({
                toilet: !this.state.toilet
            })
        }
    }

    render() { 
        const place_ID = this.props.location.search.slice(1);
        const { name, address, photo, isEditing, editTarget, courtStatus, light, toilet} = this.state;
        return ( 
            <div className="place-info-container">
                <Navbar history={ this.props.history } />
                <div className="card-board-wrapper">
                    <Card className="card">
                        <CardHeader
                            className="card-header"
                            title={ name }
                            subheader={ address }
                        />
                        <div className="image">
                            { 
                                photo ? 
                                <img src={ `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo}&key=AIzaSyAOCD6zBK2oD6Lrz3gN5zNxM-GNDatpE-o` } alt="Please wait for second" /> : 
                                <Ball />
                            } 
                        </div>
                        <CardContent className="card-content">
                          <div className="info-wrapper">
                            { 
                                editTarget === "place-status" && isEditing ? 
                                <TextField className="edit-place edit-place-name" value={ courtStatus } label="Place Status" margin="normal" size="small" onChange={ (e) => this.handleInput(e) } /> :
                                <Typography className="card-words" variant="body2" color="textSecondary" component="span">
                                場地狀況: { courtStatus }
                                </Typography>
                            }
                            <IconButton id="place-status" onClick={ (e) => this.editInfo(e) } className="setting-btn" aria-label="settings">
                                <CreateRoundedIcon />
                            </IconButton>
                          </div>
                          <div className="info-wrapper">
                                <Typography className="card-words" variant="body2" color="textSecondary" component="span">
                                    <FormControlLabel
                                        value="hasLight"
                                        control={
                                            <Checkbox 
                                            checked={ light }
                                            onChange={ (e) => this.toggleCheckBox(e) }
                                            value="hasLight" />
                                        }
                                        label="夜間燈光照明: "
                                        labelPlacement="start"
                                        className="card-words-light"
                                    />
                                </Typography>
                           </div>
                           <div className="info-wrapper"> 
                                <Typography className="card-words" variant="body2" color="textSecondary" component="span">
                                    <FormControlLabel
                                        value="hasToilet"
                                        control={
                                            <Checkbox 
                                            checked={ toilet }
                                            onChange={ (e) => this.toggleCheckBox(e) }
                                            value="hasToilet" />
                                        }
                                        label="廁所: "
                                        labelPlacement="start"
                                        className="card-words-toilet"
                                    />
                                </Typography>
                           </div>
                            <Button className="open-group-btn" variant="contained" color="primary" onClick={ this.openGroup }>
                                Open Group
                            </Button>
                        </CardContent>
                    </Card> 
                    <Boards />
                </div>
                <div className="groups">
                    <Rooms place_ID={ place_ID } history={ this.props.history }/>   
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
