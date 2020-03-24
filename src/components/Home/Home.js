import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import NavBar from "../common/Navbar";
import "./Home.scss";




class HomePage extends Component {
    constructor(props){
        super(props);
    }

    render() { 
        return ( 
            <div className="homepage-container">
                <NavBar history={ this.props.history }/>
                <main>
                    <div className="banner">
                        <div className="about">
                            <Typography className="about-words">
                                Winning takes precedence over all.
                            </Typography>
                            <Typography className="about-words">
                                There"s no gray area.
                            </Typography>
                            <Typography className="about-words">
                                No almosts.
                            </Typography>
                            <Typography variant="subtitle1" className="author">
                                Kobe Bryant
                            </Typography>
                            <div className="btn-wrapper">
                                <Link to="/place">
                                    <Button>
                                        <Typography className="find-group">
                                            找團！
                                        </Typography>
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }
}
 
function mapStateToProps(store) {
    return {
        authenticated: store.user.authenticated,
        authenticating: store.user.authenticating
    };
}


export { HomePage };
export default connect(mapStateToProps)(HomePage);