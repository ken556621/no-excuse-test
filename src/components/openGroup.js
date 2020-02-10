import React, { Component } from 'react';
import { connect } from 'react-redux';
import firebase from './common/firebase';
import NavBar from './common/navbar';
import { storeGroups } from '../actions/group.action';

import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import '../styles/openGroup.scss';

class OpenGroup extends Component {
    constructor(props){
        super(props)
        this.state = {
            name: '',
            people: '',
            time: '',
            intensity: '',
            prevRooms: ''
        }
    }

    componentDidMount(){
        const db = firebase.firestore();
        const place_ID = this.props.location.search.slice(1);
        //先拿之前的資料，避免覆蓋以前
        const docRef = db.collection("locations").doc(place_ID);
        docRef.get().then((doc) => {
            if (doc.exists) {
                console.log("Document data:", doc.data());
                this.setState({
                    prevRooms: doc.data().rooms
                })
            } else {
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    }

    handleInput = (e) => {
        const targetElement = e.target.parentElement.parentElement;
        if(targetElement.matches('.standard-basic-name')){
            this.setState({
                name: e.target.value
            })
        }else if(targetElement.matches('.standard-basic-people')){
            this.setState({
                people: e.target.value
            })
        }else if(targetElement.matches('.standard-basic-time')){
            this.setState({
                time: e.target.value
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
        const { name, people, time, intensity } = this.state;

        db.collection("locations").doc(place_ID).update(
            {
                rooms:[
                     ...this.state.prevRooms,
                    {
                        uid: uid,
                        place_id: place_ID,
                        name: name,
                        people: people,
                        time: time,
                        intensity: intensity,
                        store_time: new Date()
                    }
                ]
            }
        )
        .then(() => {
            const { history, dispatch } = this.props;
            console.log("Document successfully written!");
            dispatch(storeGroups(name, people, time, intensity));
            history.push(`/placeInfo?${place_ID}`);
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
        
    }

    render() { 
        return ( 
            <div className="open-group-container">
                <NavBar history={ this.props.history }/>
                <div className="form">
                    <Typography variant="h3" gutterBottom>
                        Open Group
                    </Typography>
                    <TextField className="standard-basic-name" label="Name (Required)" margin="normal" onChange={ (e) => this.handleInput(e) } />
                    <TextField className="standard-basic-people" label="People Needed (Required)" margin="normal" onChange={ (e) => this.handleInput(e) } />
                    <TextField className="standard-basic-time" label="Time (Required)" margin="normal" onChange={ (e) => this.handleInput(e) } />
                    <TextField className="standard-basic-intensity" label="Intensity" margin="normal" onChange={ (e) => this.handleInput(e) } />
                    <Button className="submit-btn" variant="contained" color="primary" onClick={ this.handleSubmit }>
                        Submit
                    </Button>
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

