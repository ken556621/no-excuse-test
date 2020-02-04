import React, { Component } from 'react';
import { connect } from 'react-redux';

import Navbar from './common/navbar';
import Card from './common/card';

class PlaceInfo extends Component {
    constructor(props){
        super(props)
    }
    render() { 
        return ( 
            <div>
                <Navbar history={ history }/>
                <Card />
            </div>
        );
    }
}
 
function mapStateToProps(state){
    return {
        authenticated: state.authenticated,
        authenticating: state.authenticating
    }
}


 
export default connect(mapStateToProps)(PlaceInfo);
