import React, { Component } from 'react';
import { connect } from 'react-redux';

class Member extends Component {
    constructor(props){
        super(props)
    }
    render() { 
        return ( 
            <div className="member-container">
                <div className="user-img">

                </div>
                <div className="user-name">

                </div>
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


 
export default connect(mapStateToProps)(Member);