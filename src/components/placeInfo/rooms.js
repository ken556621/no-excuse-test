import React, { Component } from 'react';
import firebase from '../common/firebase';
import { connect } from 'react-redux';
import moment from 'moment';
import { FacebookShareButton, LineShareButton } from 'react-share';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import CreateRoundedIcon from '@material-ui/icons/CreateRounded';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import Skeleton from '@material-ui/lab/Skeleton';
import FacebookIcon from '@material-ui/icons/Facebook';

import DefaultImage from '../../../img/default-img.png';
import LineIcon from '../../../img/line.png';
import './rooms.scss';

class Groups extends Component {
    constructor(props){ 
        super(props)
        this.state = {
            isLoading: true,
            place_ID: this.props.history.location.search.split("&")[0].slice(1),
            hostersPhoto: '',
            userPhoto: '',
            rooms: [],
            editRoom: '',
            toggleSortDate: false,
            toggleSortIntensity: false
        }
    }

    componentDidMount(){ 
        this.fetchRooms();
    }

    fetchRooms = async () => {
        const db = firebase.firestore();
        const { place_ID } = this.state;
        const rooms = [];
        //get rooms data & participants data
        const querySnapshot = await db.collection("rooms").where("place_ID", "==", place_ID).get();

        for (let i in querySnapshot.docs) {
            const doc = querySnapshot.docs[i];
            let roomsData = Object.assign({}, doc.data());
            roomsData.room_ID = doc.id;
            roomsData.participantsData = [];
            roomsData.hostPhoto = '';
            this.dateExpired(roomsData);
            const hostRef = await db.collection("users").doc(roomsData.host).get();
            if (hostRef.exists) {
                roomsData.hostPhoto = hostRef.data().photo;
            } else {
                console.log("No such document!");
            }

            for (let index = 0; index < roomsData.participants.length; index++) {
                let participant = roomsData.participants[index];
                const participantRef = await db.collection("users").doc(participant).get();
                if (participantRef.exists) {
                    roomsData.participantsData.push(participantRef.data());
                } else {
                    console.log("No such document!");
                }
            }
            rooms.push(roomsData);
            this.setState({
                rooms
            })
        }
        this.setState({
            isLoading: false
        })
    }
 
    joinGroup = async (room_ID) => {
        const db = firebase.firestore();
        const { authenticated, uid, history } = this.props;
        let isHost = false;
        let isParticipant = false;
        if (!authenticated) {
            history.push('/login');
            return 
        } 
        
        //不能參加自己開的房間 + 已經參加過的不能重複點選
        const docRef = await db.collection("rooms").doc(room_ID).get();
        if (docRef.exists) {
            if(docRef.data().host === uid){
                isHost = true
            }
            if(docRef.data().participants.find(participant => participant === uid)){
                isParticipant = true
            }
        } else {
            console.log("No such document!");
        }

        if(isHost){
            window.alert("Cna't join your own group")
            return
        }
        
        if(isParticipant){
            window.alert("You already join this group")
            return
        }
        this.storeUsersToRoom(room_ID);
    }

    quitGroup = (room_ID) => {
        const db = firebase.firestore();
        const { uid } = this.props;
        const docRef = db.collection("rooms").doc(room_ID);
        if (window.confirm("Do you really want to quit?")) { 
            docRef.update({
                participants: firebase.firestore.FieldValue.arrayRemove(uid)
            }); 
            this.fetchRooms();
        }
    }

    storeUsersToRoom = async (room_ID) => {
        const db = firebase.firestore();
        const { uid } = this.props;
        await db.collection("rooms").doc(room_ID).update({
            participants: firebase.firestore.FieldValue.arrayUnion(uid)
        });
        window.alert("join success")
        this.fetchRooms();
    }

    editRoom = (room_ID) => {
        const { history } = this.props;
        history.push(`/openGroup?${room_ID}`);
    }

    delete = async (room_ID) => {
        const db = firebase.firestore();
        await db.collection("rooms").doc(room_ID).delete();
        window.alert("delete success")
        this.fetchRooms();
    }

    dateExpired = (roomData) => {
        const db = firebase.firestore();
        if(moment(roomData.date).isBefore()){
            db.collection("rooms").doc(roomData.room_ID).delete().then(() => {
                console.log('delete success!')
                this.fetchRooms();
            }).catch((error) => {
                console.error("Error removing document: ", error);
            });
        }
    }

    displayParticipants = (participantsData) => {
        let morePeople = 0;
        return (
            <AvatarGroup className="participants-icons">
                { 
                    participantsData.length !== 0 ? participantsData.map((person, i) => {
                        if(i < 3){  
                            return (
                                <Avatar key={ person.ID } className="participater" alt="Participater" sizes="10px" src={ person.photo } />
                            )
                        }else{
                            morePeople++
                        }
                    }) : <Typography className="no-people-default">No people yet!</Typography>
                }
                { 
                    morePeople === 0 ? 
                    null : 
                    <Tooltip title="Foo • Bar • Baz">
                        <Avatar className="participater" alt="Participater" sizes="10px">+ { morePeople }</Avatar>
                    </Tooltip>
                }
            </AvatarGroup>
        )
    }

    toggleSortDate = () => {
        this.setState({
            toggleSortDate: !this.state.toggleSortDate
        }, this.sortDate)
    }


    sortDate = () => {
        const { rooms, toggleSortDate } = this.state;
        if(!toggleSortDate){
            const sortingRooms = rooms.sort((a, b) => {
                return Number(moment(b.date).format("YYYYMMDD") - Number(moment(a.date).format("YYYYMMDD")));
            })
            this.setState({
                rooms: sortingRooms
            })
        }else{
            const sortingRooms = rooms.sort((a, b) => {
                return Number(moment(a.date).format("YYYYMMDD")) - Number(moment(b.date).format("YYYYMMDD"));
            })
            this.setState({
                rooms: sortingRooms
            })
        }
    }

    toogleSortIntensity = () => {
        this.setState({
            toggleSortIntensity: !this.state.toggleSortIntensity
        }, this.sortIntensity)
    }

    sortIntensity = () => {
        const { rooms, toggleSortIntensity } = this.state;
        if(!toggleSortIntensity){
            const sortingRooms = rooms.sort((a, b) => {
                return (a.intensity - b.intensity);
            })
            this.setState({
                rooms: sortingRooms
            })
        }else{
            const sortingRooms = rooms.sort((a, b) => {
                return (b.intensity - a.intensity);
            })
            this.setState({
                rooms: sortingRooms
            })
        }
    }

    displayIntensity = (intensity) => {
        switch (intensity) {
            case '0':
                return '輕鬆'
                break
            case '1':
                return '中等'
                break
            case '2':
                return '挑戰'
                break
            default:
                return '無'
        }
    }

    render() { 
        const { isLoading, rooms, toggleSortDate, toggleSortIntensity } = this.state;
        const { uid } = this.props;
        if(isLoading){
            return (
                <div>
                    <Skeleton variant="text" />
                    <Skeleton variant="circle" width={40} height={40} />
                    <Skeleton variant="rect" width={210} height={118} />
                </div>
            )
        }
        return ( 
            <div className="group-container">
                <div className="group-search-bar">
                    <Button className="search-btn date-btn" onClick={ this.toggleSortDate }>
                        <Typography className="date-word">
                            日期
                        </Typography>
                        { toggleSortDate ? <ArrowUpwardIcon className="sort-icon" /> :  <ArrowDownwardIcon className="sort-icon" /> }
                    </Button>
                    <Button className="search-btn intensity-btn" onClick={ this.toogleSortIntensity }>
                        <Typography className="intensity-word">
                             強度
                        </Typography>
                        { toggleSortIntensity ? <ArrowDownwardIcon className="sort-icon" /> :  <ArrowUpwardIcon className="sort-icon" /> }
                    </Button>
                </div>
                { rooms.length !== 0 ? rooms.map(room => {
                    return (
                        <Card key={ room.host } className="card-container">
                            <div className="col-left">
                                <CardContent className="card-content">
                                    <div className="host-img-name-wrapper">
                                        <Typography className="place-name" component="p">
                                            { room.placeName }
                                        </Typography>
                                        <div className="host-img">
                                            <Avatar alt="Remy Sharp" src={ room.hostPhoto } />
                                        </div>
                                    </div>
                                    <Typography className="people-need" color="textSecondary" component="p">
                                    缺: 
                                        <Typography className="people-need-qty"component="span">
                                            { room.peopleNeed - room.participantsData.length }
                                        </Typography>
                                    </Typography>
                                    <Typography className="place-intensity place-detail" color="textSecondary">
                                        強度: { this.displayIntensity(room.intensity) }
                                    </Typography>
                                    <Typography className="place-date place-detail" color="textSecondary" component="p">
                                        日期: { room.date } 
                                    </Typography>
                                    <Typography className="place-time place-detail" color="textSecondary" component="p">
                                        時間: { room.time } 
                                    </Typography>
                                </CardContent>
                                <CardActions className="card-action">
                                    { 
                                        room.participants.length >= room.peopleNeed || room.participants.find(person => person === uid) ? 
                                        <Button className="disable-btn" size="small" color="primary" disabled>Join Now!</Button> : 
                                        <Button className="join-btn" onClick={ () => this.joinGroup(room.room_ID) } size="small" color="primary">Join Now!
                                        </Button>
                                    }
                                    { 
                                        room.participants.find(participant => participant === uid) ? 
                                        <Button className="quite-btn" onClick={ () => this.quitGroup(room.room_ID) } size="small" color="primary">Quit!</Button> :
                                        null 
                                    }
                                </CardActions>
                            </div> 
                            <div className="col-right">
                                { 
                                    room.host === uid ?
                                    <div className="modify-btn-wrapper">
                                        <IconButton className="modify-btn" size="small" onClick={ () => this.editRoom(room.room_ID) }>
                                            <CreateRoundedIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton className="delete-btn" size="small" onClick={ () => this.delete(room.room_ID) }>
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                        <FacebookShareButton
                                            url={ window.location.href }
                                            quote={ room.placeName }
                                            className="facebook-btn"
                                        >
                                            <FacebookIcon size={32} />
                                        </FacebookShareButton>
                                        <LineShareButton
                                            url={window.location.href}
                                            title={ "我的團: " + room.placeName }
                                            className="line-btn"
                                        >
                                            <img src={ LineIcon }/>
                                        </LineShareButton>
                                    </div> : 
                                    <div className="fake"></div>
                                }
                                { this.displayParticipants(room.participantsData) }
                            </div>
                        </Card>
                    )
                    }) :
                    <div className="default-display">
                        <img src={ DefaultImage } />
                        <Typography className="default-display-words">
                            There is no group yet. Try to open one?
                        </Typography>
                    </div>
                }
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


 
export default connect(mapStateToProps)(Groups);
 
