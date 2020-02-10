import React, { Component } from 'react';
import firebase from './common/firebase';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';


class Groups extends Component {
    constructor(props){
        super(props)
        this.state = {
            usersPhoto: ''
        }
    }

    componentDidMount(){
        const db = firebase.firestore();
        const usersPhoto = [];
        this.props.rooms.forEach(room => {
            db.collection("users").where("ID", "==", room.uid)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // console.log(doc.id, " => ", doc.data());
                    usersPhoto.push(doc.data().photo)
                });
                this.setState({
                    usersPhoto: usersPhoto
                })
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
        })
    }

    render() { 
        return ( 
            this.props.rooms.map(room => {
                console.log(room)
                return (
                    <Card className="group-container" key={ room.uid }>
                        <div className="col-left">
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                { room.name }
                                </Typography>
                                <Typography variant="h5" component="h2">
                                Need: { room.people } people
                                </Typography>
                                <Typography color="textSecondary">
                                Intensity: { room.intensity }
                                </Typography>
                                <Typography variant="body2" component="p">
                                We play at: { room.time }
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small" color="primary">Join Now!</Button>
                            </CardActions>
                        </div>
                        <div className="col-right">
                            {/* { this.state.usersPhoto ? this.state.usersPhoto.map(photo => <Avatar className="hoster" alt="Hoster" src={ photo } />) : null } */}
                            <Avatar className="hoster" alt="Hoster" src="#" />
                        </div>
                    </Card>
                )
            })
        );
    }
}
 
export default Groups;