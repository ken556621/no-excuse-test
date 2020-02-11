import userReducer from './user.reducer';
import locationReducer from './location.reducer';
import groupReducer from './group.reducer';
import { combineReducers } from 'redux';

const allReducers = combineReducers({
    user: userReducer,
    location: locationReducer,
    group: groupReducer
})

export default allReducers;