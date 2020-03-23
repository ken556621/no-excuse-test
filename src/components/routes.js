import React from "react";
import { Switch, Route } from "react-router-dom";

import Auth from "./common/Auth";
import Home from "./Home/Home";
import Login from "./Home/Login";
import ForgetPassword from "./Home/ForgetPassword";
import Findpeople from "./Friends/FindPeople";
import FindPlace from "./FindPlace/FindPlace";
import PlaceInfo from "./PlaceInfo/PlaceInfo";
import openGroup from "./PlaceInfo/OpenGroup";
import MyGroups from "./MyGroups/MyGroups";
import Member from "./Member/Member";

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