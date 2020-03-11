import React, { Component } from "react";
import { connect } from "react-redux";
import { db } from "../common/firebase";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import PhoneIcon from "@material-ui/icons/Phone";
import PlaceIcon from "@material-ui/icons/Place";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import Rating from "@material-ui/lab/Rating";

import Ball from "../common/basketballImg";
import CustomDialog from "../common/customDialog";
import "./detail.scss";

class Detail extends Component {
    constructor(props){
        super(props)
        this.state = {
            isLoading: true,
            isEditing: false,
            editTarget: "",
            name: "",
            address: "",
            photo: "",
            phone: "",
            placeStatus: "",
            openState: "",
            rentState: "",
            dialogIsOpen: false,
            dialogMessage: ""
        }
    }

    componentDidMount(){
        const { place_ID } = this.props;
        db.collection("locations").where("id", "==", place_ID)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
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

    openGroup = async () => { 
        const { place_ID } = this.props;
        const { uid, history } = this.props;
        let isHost = false;
        
        //can"t open two group in same place
        const querySnapshot = await db.collection("rooms").where("host", "==", uid).where("place_ID", "==", place_ID).get();
        querySnapshot.forEach((doc) => {
            isHost = true;
        })
        if(isHost){
            this.setState({
                dialogIsOpen: true,
                dialogMessage: "You already have opened the group in this place!"
            })
        }else{
            history.push(`/openGroup?${ place_ID }`);
        }
    }

    dialogClose = () => {
        this.setState({
            dialogIsOpen: false
        })
    }

    render() { 
        const { name, address, photo, phone, placeStatus, openState, rentState, dialogIsOpen, dialogMessage } = this.state;
        return ( 
            <div className="detail-container">
                <CustomDialog dialogIsOpen={ dialogIsOpen } dialogMessage={ dialogMessage } dialogClose={ this.dialogClose }/>
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
                            <Rating className="rate" name="read-only" value={ 4 } readOnly />
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
                            </CardContent>
                        </div>
                        <div className="col-right">
        
                        </div>
                    </div>
                    <Button className="open-group-btn" variant="contained" color="primary" onClick={ this.openGroup }>
                        Open Group
                    </Button>
                </Card> 
            </div>
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


 
export default connect(mapStateToProps)(Detail);