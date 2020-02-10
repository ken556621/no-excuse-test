import React, { Component } from 'react';
import NavBar from './common/navbar';

import TextField from '@material-ui/core/TextField';

import '../styles/openGroup.scss';

class OpenGroup extends Component {
    constructor(props){
        super(props)
    }
    render() { 
        return ( 
            <div className="open-group-container">
                <NavBar history={ this.props.history }/>
                <div className="form">
                    <TextField className="standard-basic" label="Name (Required)" margin="normal" />
                    <TextField className="standard-basic" label="People Needed (Required)" margin="normal" />
                    <TextField className="standard-basic" label="Time (Required)" margin="normal" />
                    <TextField className="standard-basic" label="Intensity" margin="normal" />
                </div>
            </div>
        );
    }
}
 
export default OpenGroup;