import React from 'react';
import { Switch,Route } from "react-router-dom";
import Home from './home';
import Register from './register';
import Login from './login';
import FindPeople from './findPeople';
import FindPlace from './findPlace';

export default (
    <div>
        <Switch>
            <Route exact path="/login" component={ Login } />
            <Route exact path="/register" component={ Register } />
            <Route exact path="/people" component={ FindPeople } />
            <Route exact path="/place" component={ FindPlace } />
            <Route exact path="/" component={ Home } />
        </Switch>
    </div>
)