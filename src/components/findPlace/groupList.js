import React, { Component } from 'react';

import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

import Load from '../common/load';
import './groupList.scss'

class GroupList extends Component {
    constructor(props){
        super(props)
        this.state = {
            userLat: 25.0424536,
            userLng: 121.562731,
            groupLists: []
        }
    }

    clickRow = (place_ID) => {
        const { history } = this.props;
        history.push(`/placeInfo?${place_ID}`);
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
        const { isLoading, groupLists, sortList } = this.props;
        if(isLoading){
            return <Load />
        }
        return ( 
            <div className="groups-lists-container">
                <TableContainer component={Paper}>
                    <Table className="table" aria-label="simple table" stickyHeader>
                        <TableHead>
                        <TableRow>
                            <TableCell>開團名稱</TableCell>
                            <TableCell align="right">地點</TableCell>
                            <TableCell align="right">
                                <Button className="word-icon-wrapper" onClick={ () => sortList("distance") }>
                                    <Typography className="sort-word">
                                        距離
                                    </Typography>
                                </Button>
                            </TableCell>
                            <TableCell align="right">
                                <Button className="word-icon-wrapper">
                                    <Typography className="sort-word" onClick={ () => sortList("date") }>
                                        時間
                                    </Typography>
                                </Button>
                            </TableCell>
                            <TableCell align="right">
                                <Button className="word-icon-wrapper">
                                    <Typography className="sort-word" onClick={ () => sortList("intensity") }>
                                        強度
                                    </Typography>
                                </Button>
                            </TableCell>
                            <TableCell align="right">開團者</TableCell>
                            <TableCell align="right">聯絡資訊</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody className="table-body">
                        {
                            groupLists.length !== 0 ? groupLists.map(group => (
                                <TableRow className="content-row" key={ group.room_ID } id={ group.place_ID } onClick={ () => this.clickRow(group.place_ID) } hover>
                                <TableCell component="th" scope="row">
                                    {group.placeName}
                                </TableCell>
                                <TableCell align="right">{group.placeData.name}</TableCell>
                                <TableCell align="right">{group.distance} km</TableCell>
                                <TableCell align="right">{group.date}</TableCell>
                                <TableCell align="right">{this.displayIntensity(group.intensity)}</TableCell>
                                <TableCell align="right">{group.hostData.name}</TableCell>
                                <TableCell align="right">{group.hostData.email}</TableCell>
                                </TableRow>
                            )):
                            null    
                        }
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        );
    }
}
 
export default GroupList;