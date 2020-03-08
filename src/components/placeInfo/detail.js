import React, { Component } from 'react';
import { connect } from 'react-redux';
import { db } from '../common/firebase';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import PhoneIcon from '@material-ui/icons/Phone';
import PlaceIcon from '@material-ui/icons/Place';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import Rating from '@material-ui/lab/Rating';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Ball from '../common/basketballImg';
import AlertImage from '../../../img/alertImage.png';
import './detail.scss';

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
            alertIsOpen: false,
            alertMessage: ''
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
        
        //can't open two group in same place
        const querySnapshot = await db.collection("rooms").where("host", "==", uid).where("place_ID", "==", place_ID).get();
        querySnapshot.forEach((doc) => {
            isHost = true;
        })
        if(isHost){
            this.setState({
                alertIsOpen: true,
                alertMessage: "You already have opened the group in this place!"
            })
        }else{
            history.push(`/openGroup?${ place_ID }`);
        }
    }

    alertClose = () => {
        this.setState({
            alertIsOpen: false
        })
    }

    render() { 
        const { name, address, photo, phone, placeStatus, openState, rentState, alertIsOpen, alertMessage } = this.state;
        return ( 
            <div className="detail-container">
                <Dialog
                    open={ alertIsOpen }
                    onClose={ this.alertClose }
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title" className="alert-title">
                        <img src={ AlertImage } />
                    </DialogTitle>
                    <DialogContent>
                    <DialogContentText id="alert-dialog-description" className="alert-content">
                        <Typography>
                            { alertMessage }
                        </Typography>
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions className="alert-btn-wrapper">
                        <Button className="alert-btn" onClick={ this.alertClose } autoFocus>
                            確認
                        </Button>
                    </DialogActions>
                </Dialog>
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