import React, { Component } from 'react';
import firebase from '../common/firebase';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

class EditRoom extends Component {
    constructor(props){
        super(props);
        this.state = { 
            name: props.room.placeName,
            people: props.room.peopleNeed,
            date: props.room.date,
            time: props.room.time,
            intensity: props.room.intensity
        }
    }

    handleInput = (e) => {
        const targetElement = e.target.parentElement.parentElement;
        if(targetElement.matches('.edit-room-name')){
            this.setState({
                name: e.target.value
            })
        }else if(targetElement.matches('.edit-room-people')){
            this.setState({
                people: e.target.value
            })
        }else if(targetElement.matches('.edit-room-date')){
            this.setState({
                date: e.target.value
            })    
        }else if(targetElement.matches('.edit-room-time')){
            this.setState({
                time: e.target.value
            })    
        }else if(targetElement.matches('.edit-room-intensity')){
            this.setState({
                intensity: e.target.value
            })
        }
    }

    handleSubmit = (e) => {
        const db = firebase.firestore();
        let targetID = e.target.parentElement.id;
        const { name, people, date, time, intensity } = this.state;
        //fix: button click not presize

        db.collection("rooms").doc(targetID).update(
            {
             placeName: name,
             peopleNeed: people,
             date: date,
             time: time,
             intensity: intensity,
             store_time: new Date() 
            }
         )
         .then(() => {
             console.log("Document successfully written!");
             this.props.editRoom();
         })
         .catch((error) => {
             console.error("Error writing document: ", error);
         });
    }

    render() { 
        const { room } = this.props; 
        return ( 
            <div className="col-left">
                <div className="edit-room-container">
                    <TextField className="edit-room edit-room-name" value={ this.state.name } label="Name (Required)" margin="dense" size="small" onChange={ (e) => this.handleInput(e) } />
                    <TextField className="edit-room edit-room-people" type="number" value={ this.state.people } label="People Needed (Required)" margin="dense" size="small" onChange={ (e) => this.handleInput(e) } />
                    <TextField className="edit-room edit-room-date" value={ this.state.date } type="date" margin="dense" size="small" onChange={ (e) => this.handleInput(e) } />
                    <TextField className="edit-room edit-room-time" type="string" value={ this.state.time } label="Time (Required)" margin="dense" size="small" onChange={ (e) => this.handleInput(e) } />
                    <TextField className="edit-room edit-room-intensity" value={ this.state.intensity } label="Intensity" margin="dense" size="small" onChange={ (e) => this.handleInput(e) } />
                    <Button id={ room.room_ID } className="submit-btn" variant="contained" color="primary" onClick={ (e)=>this.handleSubmit(e) }>
                        Submit
                    </Button>
                </div>
            </div>
        );
    }
}
 
export default EditRoom;