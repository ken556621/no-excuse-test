import React, { Component } from 'react';

import Ball from './basketballImg';


class Load extends Component {
    constructor(props){
        super(props)
    }

    mystyle = {
        position: 'fixed',
        top: '50%',
        left: '50%',
        zIndex: 100
    };

    render() { 
        return ( 
            <div style={this.mystyle}>
                <Ball />
            </div>
        );
    }
}
 
export default Load;