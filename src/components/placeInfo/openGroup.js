import React, { Component } from 'react';
import { connect } from 'react-redux';
import firebase from '../common/firebase';
import NavBar from '../common/navbar';

import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import '../../styles/openGroup.scss';

class OpenGroup extends Component {
    constructor(props){
        super(props)
        this.state = { 
            name: '',
            people: '',
            date: '',
            time: '',
            intensity: '',
            nameIsValid: false,
            peopleIsValid: false,
            dateIsValid: false,
            timeIsValid: false
        }
    }

    handleInput = (e) => {
        const targetElement = e.target.parentElement.parentElement;
        if(targetElement.matches('.standard-basic-name')){
            this.setState({
                name: e.target.value,
                nameIsValid: false
            })
        }else if(targetElement.matches('.standard-basic-people')){
            this.setState({
                people: e.target.value,
                peopleIsValid: false
            })
        }else if(targetElement.matches('.standard-basic-date')){
            this.setState({
                date: e.target.value
            })    
        }else if(targetElement.matches('.standard-basic-time')){
            this.setState({
                time: e.target.value,
                timeIsValid: false
            })    
        }else if(targetElement.matches('.standard-basic-intensity')){
            this.setState({
                intensity: e.target.value
            })
        }
    }

    handleSubmit = () => {
        const db = firebase.firestore();
        const place_ID = this.props.location.search.slice(1);
        const uid = this.props.uid;
        const { name, people, date, time, intensity } = this.state;

        if(!name){
            this.setState({
                nameIsValid: true
            })
            return
        }
        if(!people){
            this.setState({
                peopleIsValid: true
            })
            return
        }
        if(!date){
            this.setState({
                dateIsValid: true
            })
            return
        }
        if(!time){
            this.setState({
                timeIsValid: true
            })
            return
        }

        db.collection("rooms").doc().set(
           {
            host: uid,
            place_ID: place_ID,
            placeName: name,
            peopleNeed: people,
            date: date,
            time: time,
            intensity: intensity,
            participants: [],
            store_time: firebase.firestore.FieldValue.serverTimestamp()
           }
        )
        .then(() => {
            const { history } = this.props;
            console.log("Document successfully written!");
            history.push(`/placeInfo?${place_ID}`);
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
        
    }

    render() { 
        const { nameIsValid, peopleIsValid, timeIsValid } = this.state;
        return ( 
            <div className="open-group-container">
                <NavBar history={ this.props.history }/>
                <div className="form-wrapper">
                    <div className="form">
                        <Typography className="form-title" gutterBottom>
                            Open Group
                        </Typography>
                        <TextField className="standard-basic-name" label="Name" helperText={ nameIsValid ? "Incorrect" : null } margin="dense" onChange={ (e) => this.handleInput(e) } />
                        <TextField className="standard-basic-people" type="number" label="People Needed" helperText={ peopleIsValid ? "Incorrect" : null } margin="dense" onChange={ (e) => this.handleInput(e) } />
                        <TextField className="standard-basic-date" type="date" helperText="Time" margin="dense" onChange={ (e) => this.handleInput(e) } />
                        <TextField className="standard-basic-time" type="time" margin="dense" helperText={ timeIsValid ? "Incorrect" : null } onChange={ (e) => this.handleInput(e) } />
                        <TextField className="standard-basic-intensity" label="Intensity" margin="dense" onChange={ (e) => this.handleInput(e) } />
                        <Button className="submit-btn" variant="contained" color="primary" onClick={ this.handleSubmit }>
                            Submit
                        </Button>
                    </div>
                </div>
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


 
export default connect(mapStateToProps)(OpenGroup);

