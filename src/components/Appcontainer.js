import React, { Component } from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import { createBrowserHistory } from 'history';

import Routes from './routes';

const history = createBrowserHistory();


class AppContainer extends Component {
    render() { 
        return ( 
            <Router history={ history }>
                { Routes }
            </Router>
        );
    }
}
 
export default AppContainer;