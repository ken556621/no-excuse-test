import React from 'react';
import { Switch,Route } from "react-router-dom";

import Auth from './common/auth';
import Home from './home/home';
import Login from './home/login';
import ForgetPassword from './home/forgetPassword';
import Findpeople from './friends/findPeople';
import FindPlace from './findPlace/findPlace';
import PlaceInfo from './placeInfo/placeInfo';
import openGroup from './placeInfo/openGroup';
import MyGroups from './myGroups/myGroups';
import Member from './member/member';

export default (
    <div>
        <Switch>
            <Route path="/login" component={ Login } />
            <Route path="/forgetPassword" component={ ForgetPassword } />
            <Route path="/friends" component={ Auth(Findpeople) } />
            <Route path="/place" component={ FindPlace } />
            <Route path="/placeInfo" component={ PlaceInfo } />
            <Route path="/openGroup" component={ Auth(openGroup) } />
            <Route path="/myGroups" component={ Auth(MyGroups) } />
            <Route exact path="/member" render={ (props)=>{
                return <Member {...props} key={ props.location.key } />
            } } />
            <Route exact path="/" component={ Home } />
        </Switch>
    </div> 
)