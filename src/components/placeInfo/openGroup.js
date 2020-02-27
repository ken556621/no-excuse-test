import React, { Component } from 'react';
import { connect } from 'react-redux';
import firebase from '../common/firebase';
import NavBar from '../common/navbar';

import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';

import '../../styles/openGroup.scss';

class OpenGroup extends Component {
    constructor(props){
        super(props)
        this.state = { 
            isLoading: true,
            place_ID: '',
            room_ID: '',
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

    componentDidMount(){
        const urlParameter = this.props.location.search.slice(1);
        if(urlParameter.indexOf('local') !== -1){
            this.setState({
                place_ID: urlParameter
            })
        }else{
            this.setState({
                room_ID: urlParameter
            })
            this.getRoom(urlParameter)
        }
    }

    getRoom = async (room_ID) => {
        const db = firebase.firestore();
        if(room_ID){
            const roomData = await db.collection("rooms").doc(room_ID).get();
            this.setState({
                isLoading: false,
                place_ID: roomData.data().place_ID,
                name: roomData.data().placeName,
                people: roomData.data().peopleNeed,
                date: roomData.data().date,
                time: roomData.data().time,
                intensity: roomData.data().intensity
            })
        }
    }

    handleInput = (e) => {
        const targetElement = e.target.parentElement.parentElement;
        if(targetElement.matches('.name')){
            this.setState({
                name: e.target.value,
                nameIsValid: false
            })
        }else if(targetElement.matches('.people')){
            this.setState({
                people: e.target.value,
                peopleIsValid: false
            })
        }else if(targetElement.matches('.date')){
            this.setState({
                date: e.target.value
            })    
        }else if(targetElement.matches('.time')){
            this.setState({
                time: e.target.value,
                timeIsValid: false
            })    
        }else if(targetElement.matches('.intensity')){
            this.setState({
                intensity: e.target.value
            })
        }
    }

    handleSubmit = () => {
        const db = firebase.firestore();
        const uid = this.props.uid;
        const { place_ID, room_ID, name, people, date, time, intensity } = this.state;
        //Valid check
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
        //Edit
        if(room_ID){
            db.collection("rooms").doc(room_ID).update(
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
        }else{
            //Not edit
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
    }

    handleCheckBox = (e) => {
        this.setState({
            intensity: e.target.value
        })
    }

    render() { 
        const { name, people, date, time, intensity, nameIsValid, peopleIsValid, timeIsValid } = this.state;
        return ( 
            <div className="open-group-container">
                <NavBar history={ this.props.history }/>
                <div className="form-wrapper">
                    <div className="form">
                        <Typography className="form-title" gutterBottom>
                            開團
                        </Typography>
                        <TextField className="name" value={ name } label="名稱" helperText={ nameIsValid ? "Required" : null } margin="dense" onChange={ (e) => this.handleInput(e) } />
                        <TextField className="people" value={ people } type="number" label="人數" helperText={ peopleIsValid ? "Required" : null } margin="dense" onChange={ (e) => this.handleInput(e) } />
                        <TextField className="date" value={ date } type="date" helperText="時間" margin="dense" onChange={ (e) => this.handleInput(e) } />
                        <TextField className="time" value={ time } type="time" margin="dense" helperText={ timeIsValid ? "Required" : null } onChange={ (e) => this.handleInput(e) } />
                        <Typography className="intensity" color="textSecondary">
                            強度
                        </Typography>
                        <div className="checkbox-wrapper">
                            <Typography className="intensity" color="textSecondary" component="span">
                                輕鬆
                            </Typography>
                            <Radio
                                className="radio-btn"
                                checked={intensity === "0" }
                                onChange={this.handleCheckBox}
                                value="0"
                                color="default"
                                name="intensity"
                                inputProps={{ 'aria-label': 'Low' }}
                            />
                            <Typography className="intensity" color="textSecondary" component="span">
                                中等
                            </Typography>
                            <Radio
                                className="radio-btn"
                                checked={intensity === "1"}
                                onChange={this.handleCheckBox}
                                value="1"
                                color="default"
                                name="intensity"
                                inputProps={{ 'aria-label': 'Medium' }}
                            />
                            <Typography className="intensity" color="textSecondary" component="span">
                                激烈
                            </Typography>
                            <Radio
                                className="radio-btn"
                                checked={intensity === "2"}
                                onChange={this.handleCheckBox}
                                value="2"
                                color="default"
                                name="intensity"
                                inputProps={{ 'aria-label': 'High' }}
                            />
                        </div>
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

