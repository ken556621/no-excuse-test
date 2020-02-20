import React, { Component } from 'react';
import { connect } from 'react-redux';
import firebase from '../common/firebase';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import PhoneIcon from '@material-ui/icons/Phone';
import PlaceIcon from '@material-ui/icons/Place';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import Rating from '@material-ui/lab/Rating';

import Ball from '../common/basketballImg';

class Detail extends Component {
    constructor(props){
        super(props)
        this.state = {
            isLoading: true,
            isEditing: false,
            editTarget: '',
            name: '',
            address: '',
            photo: '',
            phone: '',
            placeStatus: '',
            openState: '',
            rentState: '',
            courtStatus: '下雨天容易滑',
            light: true,
            toilet: false,
            isFlipped: false
        }
    }

    componentDidMount(){
        const db = firebase.firestore();
        const place_ID = this.props.location.search.slice(1);
        db.collection("locations").where("id", "==", place_ID)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                console.log(doc.data())
                this.setState({
                    isLoading: false,
                    name: doc.data().name,
                    address: doc.data().address,
                    photo: doc.data().photo,
                    phone: doc.data().phone,
                    placeStatus: doc.data().placeStatus,
                    openState: doc.data().openState,
                    rentState: doc.data().rentState
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

    handleClick = (e) => {
        e.preventDefault();
        this.setState(prevState => ({ isFlipped: !prevState.isFlipped }));
    }

    render() { 
        const place_ID = this.props.location.search.slice(1);
        const { name, address, photo, phone, placeStatus, openState, rentState } = this.state;
        return ( 
            <div className="detail-container">
                <Card className="card">
                    <div className="image">
                        { 
                            photo ? 
                            <img src={ photo } alt="court img" /> : 
                            <Ball />
                        } 
                    </div>
                    <div className="col-wrapper">
                        <div className="col-left">
                            <Typography className="card-header">
                                { name }
                            </Typography>
                            <Typography className="card-address">
                                { address }
                            </Typography>
                            <Rating className="rate" name="read-only" value={ 2 } readOnly />
                        </div>
                        <div className="col-right">
                            <CardContent className="card-content">
                                <div className="info-wrapper">
                                        <Typography className="static-info" color="textSecondary" component="span">
                                            <PhoneIcon /> { phone }
                                        </Typography>
                                </div>
                                <div className="info-wrapper">
                                        <Typography className="static-info" color="textSecondary" component="span">
                                            <PlaceIcon /> { placeStatus }
                                        </Typography>
                                </div>
                                <div className="info-wrapper">
                                        <Typography className="static-info" color="textSecondary" component="span">
                                            <AttachMoneyIcon /> { openState }
                                        </Typography>
                                </div>
                                <div className="info-wrapper rent-state">
                                        <Typography className="static-info" color="textSecondary" component="span">
                                            <AttachMoneyIcon /> { rentState }
                                        </Typography>
                                </div>  
                                <Button className="open-group-btn" variant="contained" color="primary" onClick={ this.openGroup }>
                                    Open Group
                                </Button>
                            </CardContent>
                        </div>
                    </div>
                </Card> 
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


 
export default connect(mapStateToProps)(Detail);