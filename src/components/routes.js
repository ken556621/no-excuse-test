import React from 'react';
import { Switch,Route } from "react-router-dom";
import Home from './home';
import Register from './register';
import Login from './login';
import FindPeople from './findPeople/findPeople';
import FindPlace from './findPlace/findPlace';
import PlaceInfo from './placeInfo/placeInfo';
import openGroup from './placeInfo/openGroup';
import Member from './member/member';

export default (
    <div>
        <Switch>
            <Route exact path="/login" component={ Login } />
            <Route exact path="/register" component={ Register } />
            <Route exact path="/people" component={ FindPeople } />
            <Route exact path="/place" component={ FindPlace } />
            <Route exact path="/placeInfo" component={ PlaceInfo } />
            <Route exact path="/openGroup" component={ openGroup } />
            <Route exact path="/member" component={ Member } />
            <Route exact path="/" component={ Home } />
        </Switch>
    </div>
)